import { Resend } from "resend";

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async ({ req, res, log, error }) => {
  const origin = req.headers?.origin || "";
  const allowedOrigins = [
    "http://localhost:3000",
    "https://www.wrianzz.dev"
  ];

  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : "https://www.wrianzz.dev";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };

  try {
    // Appwrite community guidance: set headers before returning response
    res.set(corsHeaders);

    if (req.method === "OPTIONS") {
      return res.json({ ok: true }, 200);
    }

    const body = req.bodyJson || {};

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim(); // honeypot

    if (website) {
      return res.json({ ok: true }, 200);
    }

    if (!name || !email || !message) {
      return res.json(
        {
          ok: false,
          error: "Name, email, and message are required."
        },
        400
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactTo = process.env.CONTACT_TO_EMAIL;
    const contactFrom = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !contactTo || !contactFrom) {
      error("Missing required environment variables.");
      return res.json(
        {
          ok: false,
          error: "Server configuration is incomplete."
        },
        500
      );
    }

    const resend = new Resend(resendApiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "(No subject)");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

    const { data, error: resendError } = await resend.emails.send({
      from: contactFrom,
      to: [contactTo],
      subject: `Portfolio Contact — ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `
    });

    if (resendError) {
      error(JSON.stringify(resendError));
      return res.json(
        {
          ok: false,
          error: "Failed to send email."
        },
        500
      );
    }

    log(`Email sent successfully: ${data?.id || "unknown-id"}`);

    return res.json(
      {
        ok: true,
        message: "Message sent successfully."
      },
      200
    );
  } catch (err) {
    error(err?.message || String(err));
    return res.json(
      {
        ok: false,
        error: "Unexpected server error."
      },
      500
    );
  }
};