"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { createPortal } from "react-dom";
import Select from "@/components/ui/Select";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  isInvite?: boolean;
}

export default function MembersPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("member");
  
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modalError, setModalError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  useEffect(() => {
    document.title = "ARKN • Members";
    setMounted(true);
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("arkn_user_role") || "member");
    }
  }, []);

  useEffect(() => {
    async function loadTeam() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setCurrentUser(user);

        // Fetch memberships (includes role check)
        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("organization_id, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (memError || !membership) {
          setPageLoading(false);
          return;
        }

        // Route guard: members cannot access this page
        if (membership.role === "member") {
          window.location.href = "/dashboard";
          return;
        }

        setOrgId(membership.organization_id);

        // Fetch memberships list
        const { data: dbMembers, error: dbMemError } = await supabase
          .from("memberships")
          .select("id, user_id, role, created_at")
          .eq("organization_id", membership.organization_id);

        // Fetch invitations list
        const { data: dbInvites, error: dbInvError } = await supabase
          .from("invitations")
          .select("id, email, role, created_at, status")
          .eq("organization_id", membership.organization_id)
          .eq("status", "pending");

        // Fetch profiles for all member user_ids to resolve real names
        let profileMap: Record<string, { full_name: string; email: string }> = {};
        if (!dbMemError && dbMembers) {
          const memberIds = dbMembers.map((m) => m.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", memberIds);

          if (profiles) {
            profiles.forEach((p: any) => {
              profileMap[p.id] = { full_name: p.full_name || "Unknown", email: p.email || "" };
            });
          }
        }

        const loadedTeam: TeamMember[] = [];

        if (!dbMemError && dbMembers) {
          dbMembers.forEach((m) => {
            const isSelf = m.user_id === user.id;
            const profile = profileMap[m.user_id];
            const displayName = isSelf
              ? (user.user_metadata?.full_name || profile?.full_name || "You")
              : (profile?.full_name || `User (${m.user_id.slice(0, 5)})`);
            const displayEmail = isSelf
              ? (user.email || profile?.email || "")
              : (profile?.email || "Enterprise Member");
            loadedTeam.push({
              id: m.id,
              name: displayName,
              email: displayEmail,
              role: m.role,
              status: "active",
              joined: new Date(m.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            });
          });
        }

        if (!dbInvError && dbInvites) {
          dbInvites.forEach((i) => {
            loadedTeam.push({
              id: i.id,
              name: i.email.split("@")[0],
              email: i.email,
              role: i.role,
              status: "pending",
              joined: "Invited " + new Date(i.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              isInvite: true,
            });
          });
        }

        setTeam(loadedTeam);
        setPageLoading(false);
      } catch (err) {
        console.error("Error loading team members:", err);
        setPageLoading(false);
      }
    }
    loadTeam();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

const handleInvite = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!orgId || !inviteEmail || !currentUser) return;

  setLoading(true);
  setModalError("");

  try {
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: [inviteEmail.trim()],
        orgId,
        role: inviteRole,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setModalError(data.error || "Failed to send invitation.");
      return;
    }

    const shortName = inviteEmail.split("@")[0];

    triggerToast(
      `Invitation sent. An email has been sent to ${shortName}.`
    );

    setTeam([
      ...team,
      {
        id: String(Date.now()),
        name: shortName,
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "pending",
        joined: "Invited Just now",
        isInvite: true,
      },
    ]);

    setInviteEmail("");
    setShowInviteModal(false);
    setLoading(false);
  } catch (err: any) {
    setModalError(err.message || "An unexpected error occurred.");
    setLoading(false);
  }
};

  const handleRemove = async (member: TeamMember) => {
    if (userRole === "member") return;

    try {
      const supabase = createClient();
      if (member.isInvite) {
        const { error } = await supabase
          .from("invitations")
          .update({ status: "expired" })
          .eq("id", member.id);

        if (error) {
          triggerToast(`Failed to revoke invitation: ${error.message}`);
        } else {
          setTeam(team.filter((t) => t.id !== member.id));
          triggerToast(`Invitation for ${member.name} revoked.`);
        }
      } else {
        const { error } = await supabase
          .from("memberships")
          .delete()
          .eq("id", member.id);

        if (error) {
          triggerToast(`Failed to remove member: ${error.message}`);
        } else {
          setTeam(team.filter((t) => t.id !== member.id));
          triggerToast(`Removed member ${member.name}.`);
        }
      }
    } catch (err: any) {
      triggerToast(err.message || "An error occurred.");
    }
  };

  const isAdmin = userRole !== "member";

  return (
    <>
      <div className="space-y-8 animate-fade-in max-w-6xl font-sans">
        {/* Title */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Members</h1>
            <p className="text-xs text-gray-500">Manage team roles and workspace access permissions</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setModalError("");
                setShowInviteModal(true);
              }}
              className="btn-primary bg-[#1A5C38] hover:bg-[#113f25] border-none"
              disabled={!orgId}
            >
              <PlusIcon size={14} /> Invite team member
            </button>
          )}
        </div>

        {/* Success toast notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#1A5C38] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Member Table */}
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white min-h-[250px] flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-5 w-1/3">Name</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Joined</th>
                <th className="py-3 px-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700 flex-1">
              {pageLoading ? (
                /* Skeleton rows */
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 shrink-0" />
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-gray-150 rounded" />
                          <div className="h-2 w-32 bg-gray-50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3 w-12 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-4 w-16 bg-gray-100 rounded-full" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="h-3 w-10 bg-gray-100 rounded inline-block" />
                    </td>
                  </tr>
                ))
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No team members loaded.
                  </td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 text-[10px] font-bold shrink-0 shadow-none">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-semibold text-gray-900 block leading-tight truncate">{member.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 truncate">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-[10px] font-semibold uppercase text-gray-500 bg-gray-100 border border-gray-100/50 px-1.5 py-0.5 rounded-sm">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          member.status === "active"
                            ? "bg-green-50/50 border-green-150 text-green-700"
                            : "bg-amber-50/50 border-amber-150 text-amber-700"
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${member.status === "active" ? "bg-green-600" : "bg-amber-500"}`} />
                        {member.status === "active" ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-400 font-medium">{member.joined}</td>
                    <td className="py-4 px-5 text-right">
                      {member.role !== "owner" && isAdmin && (
                        <button
                          onClick={() => setMemberToRemove(member)}
                          className="text-red-650 hover:text-red-700 font-semibold cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Privilege Info Box */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-3 shadow-none text-xs">
          <h3 className="font-semibold text-gray-900">Workspace Member Privilege Hierarchy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-500 mt-2">
            <div className="space-y-1">
              <span className="font-bold text-[#1A5C38] uppercase text-[10px] tracking-wider block">Owner</span>
              <p className="leading-normal">Full administrative access. Can invite admins, manage subscription billing, adjust safety rules, and delete workspace ledgers.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-gray-700 uppercase text-[10px] tracking-wider block">Admin</span>
              <p className="leading-normal">Can configure real-time protection rules, add/remove workspace colleagues, register devices, and export csv ledgers.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider block">Member</span>
              <p className="leading-normal">Standard protected browser client. Has read-only visibility into rules and workspace settings, with local backup controls.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Portal Modal */}
      {showInviteModal && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 w-full max-w-[400px] rounded-lg p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Invite team member</h3>
              <p className="text-[11px] text-gray-400">Invite a colleague to share this workspace protection engine.</p>
            </div>

            {modalError && (
              <div className="bg-red-50 text-red-700 border border-red-155 text-[11px] p-3 rounded-md leading-normal">
                {modalError}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Colleague's Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full input-base h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Role</label>
                <Select
                  value={inviteRole}
                  onChange={setInviteRole}
                  options={[
                    { value: "member", label: "Member (Read-only client)" },
                    { value: "admin", label: "Admin (Write permissions)" },
                  ]}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 btn-secondary h-9 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary h-9 text-xs bg-[#1A5C38] hover:bg-[#113f25] border-none"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send invitation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Confirmation Dialog Portal */}
      {memberToRemove && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 w-full max-w-[400px] rounded-lg p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Remove member</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Are you sure you want to remove <strong>{memberToRemove.name}</strong> from this workspace? They will immediately lose access to the protection dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMemberToRemove(null)}
                className="flex-1 btn-secondary h-9 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRemove(memberToRemove);
                  setMemberToRemove(null);
                }}
                className="flex-1 btn-primary h-9 text-xs bg-red-600 hover:bg-red-700 border-none text-white font-semibold cursor-pointer"
              >
                Remove member
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
