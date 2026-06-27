import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-50e10fae/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug
app.all("/make-server-50e10fae/debug", (c) => {
  return c.json({
    method: c.req.method,
    path: c.req.path,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    timestamp: new Date().toISOString(),
  });
});

// Legacy quote endpoint (KV store only — kept for backwards compatibility)
// New quote submissions go directly from the frontend to Supabase + Web3Forms.
app.post("/make-server-50e10fae/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !phone || !projectType || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(quoteId, JSON.stringify({
      id: quoteId, name, email, phone, projectType, message,
      submittedAt: new Date().toISOString(), status: "pending",
    }));

    return c.json({ success: true, message: "Quote request submitted successfully", quoteId });
  } catch (error) {
    console.error("Error submitting quote:", error);
    return c.json({ error: "Failed to submit quote request. Please try again." }, 500);
  }
});

// Legacy quote list
app.get("/make-server-50e10fae/quotes", async (c) => {
  try {
    const quotes = await kv.getByPrefix("quote-");
    return c.json({ quotes: quotes.map((q) => JSON.parse(q)) });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return c.json({ error: "Failed to fetch quotes" }, 500);
  }
});

Deno.serve(app.fetch);
