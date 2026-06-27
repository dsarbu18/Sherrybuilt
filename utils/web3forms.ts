/**
 * Web3Forms configuration
 * =======================
 * The access key is safe for frontend use — it is designed to be public.
 * Get your key at https://web3forms.com
 *
 * To change the key: update WEB3FORMS_ACCESS_KEY below.
 */

export const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';

export interface QuotePayload {
  fullName: string;
  email: string;
  phone: string;
  projectLocation: string;
  serviceNeeded: string;
  preferredContactMethod: string;
  message: string;
}

/**
 * Send a quote notification email via Web3Forms.
 * Returns { success: true } or throws with a descriptive message.
 *
 * The replyto field is set to the customer's email so the contractor
 * can reply directly from their inbox.
 */
export async function sendQuoteEmail(quote: QuotePayload): Promise<void> {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New Quote Request from ${quote.fullName}`,
    from_name: 'Sheridan Built Website',
    replyto: quote.email,
    // Customer details
    name: quote.fullName,
    email: quote.email,
    phone: quote.phone || 'Not provided',
    project_location: quote.projectLocation || 'Not provided',
    service_needed: quote.serviceNeeded || 'Not specified',
    preferred_contact_method: quote.preferredContactMethod || 'Not specified',
    message: quote.message,
    // Honeypot — always empty from a real user; spam bots tend to fill this in
    botcheck: '',
  };

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? `Web3Forms error ${res.status}`);
  }
}
