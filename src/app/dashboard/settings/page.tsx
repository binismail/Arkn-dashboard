"use client";

import React, { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("member");
  const [saving, setSaving] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check URL query parameters for tab targeting
  useEffect(() => {
    document.title = "ARKN • Settings";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["account", "workspace", "integration", "compliance", "danger"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      setUserRole(localStorage.getItem("arkn_user_role") || "member");
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");

        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("organization_id, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (memError || !membership) {
          setLoading(false);
          return;
        }
        setOrgId(membership.organization_id);
        setUserRole(membership.role || "member");

        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .select("name")
          .eq("id", membership.organization_id)
          .maybeSingle();

        if (orgError) {
          setLoading(false);
          return;
        }
        if (org) {
          setOrgName(org.name);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading settings:", err);
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !orgName || userRole === "member") return;
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("organizations")
        .update({ name: orgName, updated_at: new Date().toISOString() })
        .eq("id", orgId);

      setSaving(false);
      if (error) {
        triggerToast(`Failed to update workspace: ${error.message}`);
      } else {
        localStorage.setItem("arkn_org_name", orgName);
        triggerToast("Workspace profile settings updated successfully.");
      }
    } catch (err: any) {
      triggerToast(err.message || "An unexpected error occurred.");
      setSaving(false);
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    setSavingAccount(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      });

      setSavingAccount(false);
      if (error) {
        triggerToast(`Failed to update account: ${error.message}`);
      } else {
        localStorage.setItem("arkn_user_name", fullName.trim());
        const initials = fullName.trim().split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        localStorage.setItem("arkn_user_initials", initials || "U");
        triggerToast("Account profile updated successfully.");
        // Refresh page to sync changes across layout shell
        window.location.reload();
      }
    } catch (err: any) {
      triggerToast(err.message || "An error occurred.");
      setSavingAccount(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userEmail) return;
    setSavingPassword(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        triggerToast(data.error || `Reset failed: ${res.statusText}`);
      } else {
        triggerToast(`Password reset link sent to ${userEmail}.`);
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to trigger reset.");
    } finally {
      setSavingPassword(false);
    }
  };

  const integrationKey = orgId ? `arkn_live_${orgId.replace(/-/g, "")}` : "Loading API credentials...";
  const isAdmin = userRole !== "member";

  const tabs = [
    { id: "account", label: "Account settings" },
    { id: "workspace", label: "Workspace Profile" },
    { id: "integration", label: "Browser Integration" },
    { id: "compliance", label: "Compliance & Security" },
    { id: "danger", label: "Danger Zone" },
  ];

  return (
    <Shell>
      <div className="space-y-8 animate-fade-in max-w-6xl font-sans">
        {/* Title */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs text-gray-500">Configure personal account preferences and workspace settings</p>
          </div>
        </div>

        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#1A5C38] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg z-[99999] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Controls Bar */}
        <div className="flex border-b border-gray-150 gap-6 text-sm font-medium text-gray-400">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-all relative cursor-pointer outline-none ${
                activeTab === tab.id
                  ? "text-[#1A5C38] font-semibold border-b-2 border-[#1A5C38]"
                  : "hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panel Content Box */}
        <div className="bg-white border border-gray-100 rounded-lg p-6 min-h-[300px] flex flex-col justify-start">
          {loading ? (
            <div className="space-y-6 max-w-md animate-pulse">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-150 rounded" />
                <div className="h-3 w-64 bg-gray-100 rounded" />
              </div>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-9 w-full bg-gray-50 rounded-md border border-gray-100" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-9 w-full bg-gray-50 rounded-md border border-gray-100" />
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="h-9 w-24 bg-gray-150 rounded-md" />
                  <div className="h-9 w-28 bg-gray-100 rounded-md" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* TAB: ACCOUNT SETTINGS */}
              {activeTab === "account" && (
                <div className="space-y-6 max-w-md animate-fade-in duration-100">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-gray-900">Personal Details</h2>
                    <p className="text-xs text-gray-455 leading-normal">
                      Update your display name and manage your user account security parameters.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAccount} className="space-y-4 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        value={userEmail}
                        className="w-full input-base h-9 text-xs border border-gray-200 bg-gray-50/70 text-gray-400 font-medium cursor-not-allowed"
                        disabled
                      />
                      <span className="text-[10px] text-gray-400 block mt-1 leading-normal">
                        Email address is managed by your SSO authentication provider.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full input-base h-9 text-xs"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="btn-primary h-9 text-xs px-4 bg-[#1A5C38] hover:bg-[#113f25] border-none flex items-center justify-center gap-1.5"
                        disabled={savingAccount}
                      >
                        {savingAccount && (
                          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        Save changes
                      </button>
                      
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="btn-secondary h-9 text-xs px-4"
                      >
                        {savingPassword && (
                          <svg className="animate-spin h-3 w-3 text-[#1A5C38]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}

                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: WORKSPACE PROFILE */}
              {activeTab === "workspace" && (
                <div className="space-y-6 max-w-md animate-fade-in duration-100">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-gray-900">Workspace Profile</h2>
                    <p className="text-xs text-gray-455 leading-normal">
                      Update the registration name of your workspace on the platform.
                    </p>
                  </div>

                  {!isAdmin && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3.5 text-[11px] text-amber-800 leading-normal mb-1">
                      You do not have write access to edit workspace settings.
                    </div>
                  )}

                  <form onSubmit={handleSaveOrg} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Workspace Name</label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full input-base h-9 text-xs disabled:bg-gray-50/70 disabled:text-gray-400"
                        disabled={saving || !orgId || !isAdmin}
                        required
                      />
                    </div>
                    {isAdmin && (
                      <button
                        type="submit"
                        className="btn-primary h-9 text-xs px-4 bg-[#1A5C38] hover:bg-[#113f25] border-none flex items-center justify-center gap-1.5"
                        disabled={saving || !orgId}
                      >
                        {saving && (
                          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {saving ? "Updating workspace..." : "Update profile"}
                      </button>
                    )}
                  </form>
                </div>
              )}

              {/* TAB: BROWSER INTEGRATION */}
              {activeTab === "integration" && (
                <div className="space-y-6 max-w-md animate-fade-in duration-100">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-gray-900">Browser Integration</h2>
                    <p className="text-xs text-gray-455 leading-normal">
                      ARKN browser extensions automatically synchronise settings in real-time via SSO session verification. Manual key authorization is provided for standalone configurations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type={showKey ? "text" : "password"}
                        value={integrationKey}
                        className="flex-1 input-base font-mono text-[11px] h-9 border border-gray-150/60 bg-gray-50/50"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="btn-secondary h-9 text-xs px-3.5 cursor-pointer font-semibold"
                        disabled={!orgId}
                      >
                        {showKey ? "Hide" : "Reveal"}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Copy and paste this token into standalone browser configurations only. Keep this credential confidential.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: COMPLIANCE & SECURITY */}
              {activeTab === "compliance" && (
                <div className="space-y-6 max-w-xl animate-fade-in duration-100">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-gray-900">Compliance & Security</h2>
                    <p className="text-xs text-gray-455 leading-normal">
                      Global data protection policies, text validation caching, and compliance retention logs.
                    </p>
                  </div>

                  <div className="space-y-4 divide-y divide-gray-50 border-t border-b border-gray-50 py-1">
                    <div className="flex justify-between items-center py-4 text-xs">
                      <div>
                        <span className="font-semibold text-gray-800 block">Activity Log Retention</span>
                        <span className="text-[11px] text-gray-455 block mt-0.5">Logs are automatically and permanently deleted.</span>
                      </div>
                      <span className="font-semibold text-gray-850 bg-gray-50 border border-gray-100 px-3 py-1 rounded-sm text-[11px] font-mono">
                        30 Days
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 text-xs">
                      <div>
                        <span className="font-semibold text-gray-800 block">Zero-Data Caching Retention</span>
                        <span className="text-[11px] text-gray-455 block mt-0.5">Prompt inputs and output values are never saved to disk.</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50/50 border border-green-100 px-2.5 py-0.5 rounded-sm uppercase tracking-wide">
                        Strictly Disabled
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DANGER ZONE */}
              {activeTab === "danger" && (
                <div className="space-y-6 max-w-md animate-fade-in duration-100">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-gray-900 text-red-650">Danger Zone</h2>
                    <p className="text-xs text-gray-455 leading-normal">
                      Irreversible administrative tasks. Proceed with caution.
                </p>
                  </div>

                  <div className="p-4 border border-red-100 bg-red-50/10 rounded-lg space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-red-750">Archive workspace protection ledger</h4>
                      <p className="text-[11px] text-red-600 leading-normal">
                        This permanently clears the volume history logs of all protected prompts across your organisation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerToast("Clearing protected ledger has been disabled for safety.")}
                      className="btn-primary bg-red-600 hover:bg-red-700 border-none h-8 text-xs font-semibold px-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={!isAdmin}
                    >
                      Clear historical records
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
