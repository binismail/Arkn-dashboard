import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getResetPasswordEmailHtml } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if service role key is present
    const serviceKey = process.env.SUPABASE_SECRET_KEY;
    if (!serviceKey) {
      console.error("SUPABASE_SECRET_KEY environment variable is not configured.");
      return NextResponse.json({ error: "Server password reset engine is not configured." }, { status: 500 });
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { origin } = new URL(request.url);

    // Generate secure password recovery link
    const { data: recoveryData, error: recoveryError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: trimmedEmail,
    });

    if (recoveryError || !recoveryData?.properties?.hashed_token) {
      console.error(`Supabase Auth Admin recovery link failed for ${trimmedEmail}:`, recoveryError?.message);
      return NextResponse.json({ error: recoveryError?.message || "Failed to generate recovery link." }, { status: 400 });
    }

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?token_hash=${recoveryData.properties.hashed_token}&type=recovery&next=/reset-password`;

    // Send the beautifully designed recovery email via Resend
    try {
      await sendEmail({
        to: trimmedEmail,
        subject: "Reset your ARKN password",
        html: getResetPasswordEmailHtml(resetLink),
      });
    } catch (emailErr: any) {
      console.error(`Resend email delivery failed for ${trimmedEmail}:`, emailErr.message);
      return NextResponse.json({ error: "Failed to send reset email: " + emailErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Forgot password handler crash error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
