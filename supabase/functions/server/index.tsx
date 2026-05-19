import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
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

// Health check endpoint
app.get("/make-server-50e10fae/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint
app.all("/make-server-50e10fae/debug", (c) => {
  return c.json({
    method: c.req.method,
    path: c.req.path,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    timestamp: new Date().toISOString()
  });
});

// Quote submission endpoint
app.post("/make-server-50e10fae/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !phone || !projectType || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const quoteData = {
      id: quoteId,
      name,
      email,
      phone,
      projectType,
      message,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    await kv.set(quoteId, JSON.stringify(quoteData));

    console.log(`Quote request submitted: ${quoteId} from ${name} (${email})`);

    // TODO: Send email notification using configured email service
    // For now, we're just storing in the database

    return c.json({
      success: true,
      message: "Quote request submitted successfully",
      quoteId
    });
  } catch (error) {
    console.error("Error submitting quote request:", error);
    return c.json({
      error: "Failed to submit quote request. Please try again."
    }, 500);
  }
});

// Get all quotes (for admin purposes)
app.get("/make-server-50e10fae/quotes", async (c) => {
  try {
    const quotes = await kv.getByPrefix("quote-");
    const parsedQuotes = quotes.map(q => JSON.parse(q));
    return c.json({ quotes: parsedQuotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return c.json({ error: "Failed to fetch quotes" }, 500);
  }
});

// Quote requests endpoint (new structured format)
app.post("/make-server-50e10fae/quote-requests", async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, phone, project_location, service_needed, preferred_contact_method, message } = body;

    // Validate required fields
    if (!full_name || !email || !message) {
      return c.json({ error: "Full name, email, and message are required" }, 400);
    }

    // Generate unique ID
    const requestId = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    // Create quote request data
    const quoteRequestData = {
      id: requestId,
      full_name,
      email,
      phone: phone || '',
      project_location: project_location || '',
      service_needed: service_needed || '',
      preferred_contact_method: preferred_contact_method || '',
      message,
      created_at: new Date().toISOString()
    };

    // Store in KV database
    await kv.set(requestId, JSON.stringify(quoteRequestData));

    console.log(`Quote request submitted: ${requestId} from ${full_name} (${email})`);

    // Send email notification
    try {
      await sendEmailNotification(quoteRequestData);
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails - the data is still saved
    }

    return c.json({
      success: true,
      message: "Quote request submitted successfully",
      requestId
    });
  } catch (error) {
    console.error("Error submitting quote request:", error);
    return c.json({
      error: "Failed to submit quote request. Please try again."
    }, 500);
  }
});

// Get all quote requests (for admin purposes)
app.get("/make-server-50e10fae/quote-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("qr-");
    const parsedRequests = requests.map(q => JSON.parse(q));
    // Sort by created_at descending
    parsedRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json({ requests: parsedRequests });
  } catch (error) {
    console.error("Error fetching quote requests:", error);
    return c.json({ error: "Failed to fetch quote requests" }, 500);
  }
});

// Email notification function
async function sendEmailNotification(quoteData: any) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  // Temporary: using verified email until sheridanbuilt25.com domain is verified in Resend
  const contractorEmail = Deno.env.get("CONTRACTOR_EMAIL") || "4dennis2go@gmail.com";

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured - skipping email notification");
    return;
  }

  const emailBody = `
New Quote Request Received

Client Information:
-------------------
Name: ${quoteData.full_name}
Email: ${quoteData.email}
Phone: ${quoteData.phone || 'Not provided'}
Project Location: ${quoteData.project_location || 'Not provided'}
Service Needed: ${quoteData.service_needed || 'Not specified'}
Preferred Contact: ${quoteData.preferred_contact_method || 'Not specified'}

Project Description:
--------------------
${quoteData.message}

Request ID: ${quoteData.id}
Submitted: ${new Date(quoteData.created_at).toLocaleString()}

---
This is an automated message from Sheridan Built quote request system.
  `.trim();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: "Sheridan Built <onboarding@resend.dev>",
      to: contractorEmail,
      subject: `New Quote Request from ${quoteData.full_name}`,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">New Quote Request Received</h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Client Information</h3>
            <p><strong>Name:</strong> ${quoteData.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
            <p><strong>Phone:</strong> ${quoteData.phone || 'Not provided'}</p>
            <p><strong>Project Location:</strong> ${quoteData.project_location || 'Not provided'}</p>
            <p><strong>Service Needed:</strong> ${quoteData.service_needed || 'Not specified'}</p>
            <p><strong>Preferred Contact:</strong> ${quoteData.preferred_contact_method || 'Not specified'}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Project Description</h3>
            <p style="white-space: pre-wrap;">${quoteData.message}</p>
          </div>

          <div style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>Request ID:</strong> ${quoteData.id}</p>
            <p><strong>Submitted:</strong> ${new Date(quoteData.created_at).toLocaleString()}</p>
            <p style="margin-top: 20px;"><em>This is an automated message from Sheridan Built quote request system.</em></p>
          </div>
        </div>
      `
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email API error: ${error}`);
  }

  console.log(`Email notification sent for quote request ${quoteData.id}`);
}

Deno.serve(app.fetch);