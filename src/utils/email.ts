/**
 * ARKN — Email Sending Utility (via Resend)
 * Designs premium HTML email templates matching ARKN branding guidelines.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured. Email to", to, "will be logged to console instead.");
    console.log(`[EMAIL SEND SIMULATION]\nTo: ${to}\nSubject: ${subject}\nBody:\n${html}\n[END SIMULATION]`);
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "ARKN <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email via Resend.");
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("Failed to send email via Resend API:", err);
    throw err;
  }
}

// ── Email Templates ──────────────────────────────────────────────────────────

const BASE_TEMPLATE = (title: string, contentHtml: string, ctaText?: string, ctaUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafbfa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #fafbfa; padding: 48px 24px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #f1f5f1; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.01), 0 1px 2px rgba(0,0,0,0.02);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 32px 8px 32px;">
              <span style="font-size: 10px; font-weight: bold; letter-spacing: 0.2em; color: #1A5C38; text-transform: uppercase; background-color: #f3f9f5; border: 1px solid #e2efe7; padding: 4px 8px; border-radius: 3px;">ARKN</span>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              ${contentHtml}
              
              ${ctaText && ctaUrl ? `
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; margin-bottom: 24px;">
                  <tr>
                    <td align="left">
                      <a href="${ctaUrl}" target="_blank" style="display: inline-block; background-color: #1A5C38; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; padding: 10px 18px; border-radius: 6px; transition: background-color 0.15s ease;">
                        ${ctaText}
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
              
              ${ctaUrl ? `
                <p style="margin-top: 24px; margin-bottom: 0; font-size: 11px; color: #6b7280; line-height: 1.5;">
                  If you're having trouble, copy and paste the link below into your browser:<br>
                  <a href="${ctaUrl}" target="_blank" style="color: #1A5C38; text-decoration: underline; word-break: break-all; display: inline-block; margin-top: 4px;">${ctaUrl}</a>
                </p>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafbfa; padding: 24px 32px; border-top: 1px solid #f1f5f1; text-align: left;">
              <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.6;">
                ARKN helps organisations protect sensitive information while using AI.<br>
                &copy; 2026 ARKN. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export function getInviteEmailHtml(orgName: string, inviteLink: string) {
  return BASE_TEMPLATE(
    `You've been invited to join ${orgName} on ARKN`,
    `
    <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">Accept your invitation</h2>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
      You've been invited to join <strong>${orgName}</strong> on ARKN.
    </p>
    <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
      Accept your invitation to access your workspace and start protecting AI conversations.
    </p>
    `,
    "Accept invitation",
    inviteLink
  );
}

export function getResetPasswordEmailHtml(resetLink: string) {
  return BASE_TEMPLATE(
    "Reset your password",
    `
    <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">Reset your password</h2>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
      We received a request to reset your password. If that was you, use the button below.
    </p>
    `,
    "Reset password",
    resetLink
  );
}

export function getSignupVerificationEmailHtml(verificationLink: string) {
  return BASE_TEMPLATE(
    "Confirm your email",
    `
    <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">Confirm your email</h2>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
      Welcome to ARKN.
    </p>
    <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
      Confirm your email address to finish setting up your workspace and start protecting AI conversations.
    </p>
    `,
    "Confirm email",
    verificationLink
  );
}
