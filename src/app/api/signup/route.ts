import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getSignupVerificationEmailHtml } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if service role key is present
    const serviceKey = process.env.SUPABASE_SECRET_KEY;
    if (!serviceKey) {
      console.error("SUPABASE_SECRET_KEY environment variable is not configured.");
      return NextResponse.json({ error: "Server registration engine is not configured." }, { status: 500 });
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

    // Create the user securely via Supabase Admin API
    const { data: userRecord, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: false, // Force verification
      user_metadata: {
        full_name: name,
      },
    });

    if (createError || !userRecord?.user) {
      console.error("Supabase Auth Admin createUser failed:", createError?.message);
      return NextResponse.json({ error: createError?.message || "Failed to create user account." }, { status: 400 });
    }

    const { origin } = new URL(request.url);

    // Generate custom signup verification link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email: trimmedEmail,
      password: password,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error("Supabase Auth Admin generateLink failed for signup:", linkError?.message);
      return NextResponse.json({ error: linkError?.message || "Failed to generate verification link." }, { status: 400 });
    }

    const verificationLink = `${origin}/auth/callback?token_hash=${linkData.properties.hashed_token}&type=signup&next=/onboarding/create-org`;

    // Send the custom verification email via Resend
    try {
      await sendEmail({
        to: trimmedEmail,
        subject: "Verify your ARKN email address",
        html: getSignupVerificationEmailHtml(verificationLink),
      });
    } catch (emailErr: any) {
      console.error(`Resend email delivery failed for signup email to ${trimmedEmail}:`, emailErr.message);
      return NextResponse.json({ error: "Failed to send verification email: " + emailErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: userRecord?.user });
  } catch (err: any) {
    console.error("Signup handler crash error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
