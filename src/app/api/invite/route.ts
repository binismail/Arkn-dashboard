import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendEmail, getInviteEmailHtml } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const { emails, orgId, role = "member" } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Missing or invalid emails array." }, { status: 400 });
    }
    if (!orgId) {
      return NextResponse.json({ error: "Missing organization ID." }, { status: 400 });
    }

    // 1. Verify current user session (authentication check)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Handled on page components
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Verify current user is part of this organization and retrieve org name
    const { data: membership, error: memError } = await supabase
      .from("memberships")
      .select("role, organizations(name)")
      .eq("user_id", user.id)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (memError || !membership) {
      return NextResponse.json({ error: "Unauthorized access to this organization." }, { status: 403 });
    }

    const orgName = (membership?.organizations as any)?.name || "ARKN Workspace";

    // Check if service role key is present
    const serviceKey = process.env.SUPABASE_SECRET_KEY;
    if (!serviceKey) {
      console.error("SUPABASE_SECRET_KEY environment variable is not configured.");
      return NextResponse.json({ error: "Server invitation engine is not configured." }, { status: 500 });
    }

    // 2. Initialize Supabase Admin Client
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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { origin } = new URL(request.url);

    // 3. Process invitations sequentially
    const results = [];
    for (const email of emails) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) continue;

      // Check if there is already a pending invitation for this email
      const { data: existingInvite } = await supabaseAdmin
        .from("invitations")
        .select("id")
        .eq("email", trimmedEmail)
        .eq("organization_id", orgId)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvite) {
        results.push({ email: trimmedEmail, status: "already_invited" });
        continue;
      }

      // Generate an invite link. Two auth types depending on whether the
      // user already has an account:
      //   - `type=signup`   for new users (creates the account on verify)
      //   - `type=recovery` for existing users (signs them in, no duplicate)
      // We try signup first, and fall back to recovery if the user already
      // exists. Both redirect to /reset-password which handles the invite
      // acceptance.
      const tempPassword = crypto.randomUUID();
      let inviteType: "signup" | "recovery" = "signup";
      let { data: inviteLinkData, error: inviteLinkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email: trimmedEmail,
        password: tempPassword,
      });

      // If user already exists, Supabase rejects `type=signup` — fall back to `type=recovery`
      if (inviteLinkError?.message?.toLowerCase().includes("already been registered")) {
        console.log(`User ${trimmedEmail} already registered, falling back to recovery link.`);
        const recovery = await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email: trimmedEmail,
        });
        inviteLinkData = recovery.data;
        inviteLinkError = recovery.error;
        inviteType = "recovery";
      }

      if (inviteLinkError || !inviteLinkData?.properties?.hashed_token) {
        console.error(`Supabase Auth Admin link generation failed for ${trimmedEmail}:`, inviteLinkError?.message);
        results.push({ email: trimmedEmail, status: "error", error: inviteLinkError?.message || "Failed to generate invite link." });
        continue;
      }

      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?token_hash=${inviteLinkData.properties.hashed_token}&type=${inviteType}&next=/reset-password`;

      // Send the beautifully designed custom HTML email via Resend
      try {
        await sendEmail({
          to: trimmedEmail,
          subject: `You've been invited to join ${orgName} on ARKN`,
          html: getInviteEmailHtml(orgName, inviteLink),
        });
      } catch (emailErr: any) {
        console.error(`Resend email delivery failed for ${trimmedEmail}:`, emailErr.message);
        results.push({ email: trimmedEmail, status: "error", error: "Failed to send email invite: " + emailErr.message });
        continue;
      }

      // Insert invitation row in database table
      const { error: dbError } = await supabaseAdmin
        .from("invitations")
        .insert({
          organization_id: orgId,
          email: trimmedEmail,
          role: role,
          invited_by: user.id,
          status: "pending",
          expires_at: expiresAt,
        });

      if (dbError) {
        console.error(`Database invitation insertion failed for ${trimmedEmail}:`, dbError.message);
        results.push({ email: trimmedEmail, status: "error", error: dbError.message });
      } else {
        results.push({ email: trimmedEmail, status: "success" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Invite handler crash error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
