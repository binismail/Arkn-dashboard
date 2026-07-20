"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import ArknLogo from "@/components/ui/ArknLogo";

export default function CreateOrgPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(true);

  useEffect(() => {
    document.title = "ARKN • Create workspace";

    async function checkPendingInvitation() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) {
          setCheckingInvite(false);
          return;
        }

        // Query pending invitation for this email
        const { data: invite, error: inviteError } = await supabase
          .from("invitations")
          .select("id, organization_id, role")
          .eq("email", user.email.trim())
          .eq("status", "pending")
          .maybeSingle();

        if (inviteError || !invite) {
          // No invitation found, render org creation screen normally
          setCheckingInvite(false);
          return;
        }

        // Invitation found: check if membership already exists
        const { data: existingMembership } = await supabase
          .from("memberships")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!existingMembership) {
          const { error: memError } = await supabase
            .from("memberships")
            .insert({
              user_id: user.id,
              organization_id: invite.organization_id,
              role: invite.role || "member",
            });

          if (memError) {
            console.error("Auto-membership creation failed:", memError.message);
            setCheckingInvite(false);
            return;
          }
        }

        // Mark the invitation as accepted
        await fetch("/api/accept-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invitationId: invite.id }),
        });

        // Redirect directly to dashboard
        router.push("/dashboard");
      } catch (err) {
        console.error("Error auto-accepting invitation:", err);
        setCheckingInvite(false);
      }
    }
    checkPendingInvitation();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) {
      setError("Please enter your organization name.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Get current logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("You must be logged in to create an organization.");
        setLoading(false);
        return;
      }

      // Generate unique slug
      const baseSlug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

      // Call transactional RPC function to create organization, membership, and policy
      const { data: orgId, error: rpcError } = await supabase.rpc(
        "create_organization_and_membership",
        {
          org_name: orgName,
          org_slug: slug,
        }
      );

      if (rpcError) {
        // Fallback: if RPC function is not created yet, try direct insert
        console.warn("RPC failed or missing, trying direct insert:", rpcError);
        
        // Insert organization
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name: orgName, slug })
          .select("id")
          .single();

        if (orgError) {
          setError(orgError.message);
          setLoading(false);
          return;
        }

        // Insert membership
        const { error: memError } = await supabase
          .from("memberships")
          .insert({
            user_id: user.id,
            organization_id: org.id,
            role: "owner",
          });

        if (memError) {
          setError(memError.message);
          setLoading(false);
          return;
        }

        // Seed default policy for organization
        const { error: polError } = await supabase
          .from("policies")
          .insert({
            organization_id: org.id,
          });

        if (polError) {
          setError(polError.message);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      router.push("/onboarding/invite");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (checkingInvite) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-6 lg:px-8 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <ArknLogo size={32} />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="animate-spin h-3.5 w-3.5 text-[#1A5C38]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Verifying workspace invitations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Brand wordmark logo */}
        <div className="flex justify-center">
          <ArknLogo size={32} />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 tracking-tight">Create your organization</h1>
          <p className="text-xs text-gray-400 mt-1">Seed the compliance root for your team.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[340px]">
        {error && (
          <div className="mb-4 p-3 bg-red-50/50 border border-red-100 text-red-700 text-xs rounded-md flex items-start gap-2">
            <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 block">Organization / Company Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Alpha Chambers LLP"
              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
              disabled={loading}
              required
              autoFocus
            />
            <span className="text-[10px] text-gray-400 block pt-1 leading-normal">
              You will automatically become the Owner of this organization.
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-9 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-md transition-colors shadow-none cursor-pointer flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
