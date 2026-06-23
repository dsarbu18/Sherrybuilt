/**
 * sync-portfolio-images
 * =====================
 * Supabase Edge Function that scans the "portfolio" Storage bucket,
 * finds image files not yet in portfolio_images, and inserts them.
 *
 * Safe to call repeatedly — duplicate rows are prevented by the
 * unique constraint on storage_path. The function only inserts;
 * it never deletes or modifies existing rows.
 *
 * Environment variables (automatically available in Edge Functions):
 *   SUPABASE_URL              — injected by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — injected by Supabase (never exposed to frontend)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Config ────────────────────────────────────────────────────────────────────

const BUCKET = "portfolio";

// Folder names inside the bucket to scan (case-sensitive, must match Storage)
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanTitle(filename: string): string {
  // Remove extension, replace hyphens/underscores with spaces, trim
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").trim();
}

function hasImageExtension(name: string): boolean {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return false;
  return IMAGE_EXTENSIONS.has(name.slice(dot));
}

function publicUrl(supabaseUrl: string, storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Service-role client — stays server-side only, never returned to the browser
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ── 1. Fetch existing storage_paths so we can skip duplicates ────────────
  const { data: existing, error: existingErr } = await supabase
    .from("portfolio_images")
    .select("storage_path");

  if (existingErr) {
    return new Response(JSON.stringify({ error: existingErr.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const existingPaths = new Set(
    (existing ?? []).map((r: { storage_path: string | null }) => r.storage_path).filter(Boolean)
  );

  // ── 2. Scan each folder ───────────────────────────────────────────────────
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
    const { data: files, error: listErr } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (listErr || !files) continue;

    for (const file of files) {
      // Skip placeholder/folder objects
      if (!file.name || file.name === ".emptyFolderPlaceholder") continue;
      if (!hasImageExtension(file.name)) continue;

      totalFound++;
      const storagePath = `${folder}/${file.name}`;

      if (existingPaths.has(storagePath)) continue;

      toInsert.push({
        title: cleanTitle(file.name),
        category: folder,              // folder name IS the category label
        image_url: publicUrl(supabaseUrl, storagePath),
        storage_path: storagePath,
        description: null,
        sort_order: 0,
        is_featured: false,
        visible: true,
      });
    }
  }

  // ── 3. Insert missing rows ────────────────────────────────────────────────
  let inserted = 0;

  if (toInsert.length > 0) {
    const { data: insertedRows, error: insertErr } = await supabase
      .from("portfolio_images")
      .insert(toInsert)
      .select("id");

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    inserted = insertedRows?.length ?? 0;
  }

  const skipped = totalFound - inserted;

  return new Response(
    JSON.stringify({ found: totalFound, inserted, skipped }),
    { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
});
