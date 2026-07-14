"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";

export default function InvitePage() {
  const router = useRouter();
  const [emails, setEmails] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "ARKN • Create workspace";
  }, []);

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index: number, val: string) => {
    const next = [...emails];
    next[index] = val;
    setEmails(next);
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch user's organization
      const { data: membership, error: memError } = await supabase
        .from("memberships")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (memError || !membership) {
        router.push("/onboarding/create-org");
        return;
      }

      const filteredEmails = emails.filter((em) => em.trim() !== "");
      if (filteredEmails.length > 0) {
        const res = await fetch("/api/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails: filteredEmails,
            orgId: membership.organization_id,
            role: "member",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(`Failed to save invitations: ${data.error || "Unknown error."}`);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Brand wordmark logo */}
        <div className="flex justify-center">
          <span className="text-xs font-semibold tracking-widest text-[#1A5C38] uppercase">ARKN</span>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 tracking-tight">Invite your team</h1>
          <p className="text-xs text-gray-400 mt-1">Provide work emails to send team onboarding invites.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[340px] space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            <label className="text-[11px] font-semibold text-gray-500 block">Email Addresses</label>
            {emails.map((email, idx) => (
              <input
                key={idx}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                placeholder={`colleague-${idx + 1}@company.com`}
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addEmailField}
            className="text-[11px] text-brand-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            disabled={loading}
          >
            <PlusIcon size={12} /> Add another email
          </button>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 btn-secondary h-9 text-xs"
              disabled={loading}
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary h-9 text-xs"
              disabled={loading}
            >
              {loading ? "Inviting..." : "Send invites"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
