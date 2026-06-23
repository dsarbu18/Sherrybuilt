/**
 * sync-portfolio-images — SECURED
 * ================================
 * Requires a valid Supabase Auth session JWT in the Authorization header.
 * The authenticated user must also exist in the admin_users table.
 *
 * Security model:
 *   1. Extract JWT from Authorization: Bearer <token>
 *   2. Validate the JWT via supabase.auth.getUser() — rejects expired/forged tokens
 *   3. Check admin_users table (service role) — rejects non-admins
 *   4. Only then scan Storage and insert missing rows
 *
 * Environment variables (auto-injected by Supabase, never sent to browser):
 *   SUPABASE_URL              — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — full server-side access, used only here
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUCKET = "portfolio";
const FOLDERS = ["Exterior", "Interior", "Basements", "Kitchens", "Bathrooms", "Decks"];
const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function cleanTitle(filename: string): string {
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function hasImageExtension(name: string): boolean {
  const dot = name.lastIndexOf(".");
  return dot !== -1 && IMAGE_EXTENSIONS.has(name.slice(dot));
}

function publicUrl(supabaseUrl: string, storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server configuration error" }, 500);
  }

  // ── Step 1: Extract JWT from Authorization header ─────────────────────────
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!jwt) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  // ── Step 2: Validate JWT — creates a user-scoped client ──────────────────
  // The anon client validates the token against Supabase Auth.
  // An expired, tampered, or anon key itself will be rejected here.
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const userClient = createClient(supabaseUrl, anonKey ?? serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false },
  });

  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return json({ error: "Unauthorized — invalid or expired session" }, 401);
  }

  // ── Step 3: Check admin_users table using service role ───────────────────
  // The service role client bypasses RLS, so it can read admin_users.
  // The frontend never holds the service role key.
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: adminRow, error: adminErr } = await adminClient
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (adminErr || !adminRow) {
    return json({ error: "Forbidden — not an admin user" }, 403);
  }

  // ── Step 4: Authenticated admin — run the sync ────────────────────────────

  const { data: existing, error: existingErr } = await adminClient
    .from("portfolio_images")
    .select("storage_path");

  if (existingErr) {
    return json({ error: existingErr.message }, 500);
  }

  const existingPaths = new Set(
    (existing ?? [])
      .map((r: { storage_path: string | null }) => r.storage_path)
      .filter(Boolean)
  );

  const toInsert: {
    title: string;
    category: string;
    image_url: string;
    storage_path: string;
    description: null;
    sort_order: number;
    is_featured: boolean;
    visible: boolean;
  }[] = [];

  let totalFound = 0;

  for (const folder of FOLDERS) {
    const { data: files, error: listErr } = await adminClient.storage
      .from(BUCKET)
      .list(folder, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (listErr || !files) continue;

    for (const file of files) {
      if (!file.name || file.name === ".emptyFolderPlaceholder") continue;
      if (!hasImageExtension(file.name)) continue;

      totalFound++;
      const storagePath = `${folder}/${file.name}`;
      if (existingPaths.has(storagePath)) continue;

      toInsert.push({
        title: cleanTitle(file.name),
        category: folder,
        image_url: publicUrl(supabaseUrl, storagePath),
        storage_path: storagePath,
        description: null,
        sort_order: 0,
        is_featured: false,
        visible: true,
      });
    }
  }

  let inserted = 0;

  if (toInsert.length > 0) {
    const { data: insertedRows, error: insertErr } = await adminClient
      .from("portfolio_images")
      .insert(toInsert)
      .select("id");

    if (insertErr) {
      return json({ error: insertErr.message }, 500);
    }

    inserted = insertedRows?.length ?? 0;
  }

  const skipped = totalFound - inserted;
  return json({ found: totalFound, inserted, skipped });
});
