import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitation ID." }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SECRET_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server accept-invite engine is not configured." }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabaseAdmin
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitationId);

    if (error) {
      console.error("Accept-invite update failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Accept-invite handler crash:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
