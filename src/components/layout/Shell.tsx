"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UsersIcon,
  LaptopIcon,
  ToggleLeftIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon,
  LayoutDashboardIcon,
} from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { createPortal } from "react-dom";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Default state matches server rendering (avoiding hydration mismatches)
  const [orgName, setOrgName] = useState("...");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [userRole, setUserRole] = useState<string | null>(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage on client only to keep HTML hydrated correctly
    if (typeof window !== "undefined") {
      setOrgName(localStorage.getItem("arkn_org_name") || "...");
      setUserName(localStorage.getItem("arkn_user_name") || "User");
      setUserEmail(localStorage.getItem("arkn_user_email") || "");
      setUserInitials(localStorage.getItem("arkn_user_initials") || "U");
    }
  }, []);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push("/login");
          return;
        }

        const email = user.email || "";
        setUserEmail(email);
        localStorage.setItem("arkn_user_email", email);
        
        // Resolve user initials
        const fullName = user.user_metadata?.full_name || user.email || "User";
        setUserName(fullName);
        localStorage.setItem("arkn_user_name", fullName);
        
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials || "U");
        localStorage.setItem("arkn_user_initials", initials || "U");

        // Resolve organization details
        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("role, organization_id, organizations(name)")
          .eq("user_id", user.id)
          .maybeSingle();


        if (!memError && membership) {
          const role = membership.role || "member";
          setUserRole(role);
          localStorage.setItem("arkn_user_role", role);

          const org = (membership as any).organizations;
          if (org && org.name) {
            setOrgName(org.name);
            localStorage.setItem("arkn_org_name", org.name);
          }
        } else if (memError) {
          // No membership found — likely a member who hasn't been set up yet
          setUserRole(localStorage.getItem("arkn_user_role") || "member");
        }
      } catch (err) {
        console.error("Error loading shell session:", err);
      }
    }
    loadUserSession();
  }, [router]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const isAdmin = userRole && ["owner", "admin"].includes(userRole);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboardIcon },
    ...(isAdmin ? [{ name: "Members", href: "/dashboard/members", icon: UsersIcon }] : []),
    { name: "Devices", href: "/dashboard/devices", icon: LaptopIcon },
    ...(isAdmin ? [{ name: "Policies", href: "/dashboard/policies", icon: ToggleLeftIcon }] : []),
    { name: "Reports", href: "/dashboard/reports", icon: FileTextIcon },
    { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      localStorage.clear();
      router.push("/login");
    } catch (err) {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-60 border-r border-gray-100 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Organization Selector as main header */}
          <div className="h-16 px-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1A5C38] flex items-center justify-center text-white font-bold text-sm tracking-wide shrink-0">
              {orgName.charAt(0)}
            </div>
            <div className="overflow-hidden leading-tight">
              <span className="font-semibold text-gray-900 block text-sm tracking-tight truncate" title={orgName}>
                {orgName}
              </span>
              <span className="text-xs text-gray-400 block font-medium mt-0.5">Enterprise Suite</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-50 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-[#1A5C38]" : "text-gray-400"}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with user profile switcher dropdown trigger */}
        <div className="p-3 border-t border-gray-100 bg-white relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200/50 flex items-center justify-center text-gray-600 text-xs font-semibold shrink-0">
                {userInitials}
              </div>
              <div className="overflow-hidden leading-tight">
                <span className="text-sm font-semibold text-gray-800 block truncate">{userName}</span>
                <span className="text-xs text-gray-400 block truncate">{userEmail}</span>
              </div>
            </div>
            <svg
              className="w-3.5 h-3.5 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Sidebar profile dropdown */}
          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute left-3 bottom-16 bg-white border border-gray-100 rounded-lg shadow-lg w-52 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-100">
                <div className="px-4 py-2 border-b border-gray-50">
                  <span className="font-semibold text-gray-900 block text-xs truncate">{userName}</span>
                  <span className="text-[10px] text-gray-400 block truncate">{userEmail}</span>
                </div>
                <button
                  onClick={() => {
                    router.push("/dashboard/settings?tab=account");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard/settings?tab=workspace");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  Workspace Settings
                </button>
                <hr className="border-gray-50 my-1" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Header Bar */}
        <header className="h-16 border-b border-gray-100 bg-white px-8 flex items-center justify-between shrink-0">
          {/* Left: Global Search Input */}
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search reports, members, policies..."
              className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-100 rounded-md text-sm outline-none focus:border-gray-900 focus:bg-white transition-all font-medium placeholder-gray-400"
            />
          </div>

          {/* Right: Actions and User Avatar Dropdown trigger */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowFeedback(true)}
              className="text-gray-450 hover:text-gray-950 text-sm font-semibold cursor-pointer transition-colors"
            >
              Feedback
            </button>
            
            <button className="text-gray-400 hover:text-gray-900 relative cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-[#1A5C38] ring-1 ring-white" />
            </button>

            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-7 h-7 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-[#1A5C38] text-xs font-bold cursor-pointer hover:bg-brand-100 transition-colors"
            >
              {userInitials}
            </div>
          </div>
        </header>

        {/* Floating Shell Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#1A5C38] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg z-[99999] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Feedback Modal Portal */}
      {showFeedback && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 w-full max-w-[400px] rounded-lg p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">Send feedback</h3>
              <p className="text-[11px] text-gray-400">Help us improve ARKN. Your feedback is sent directly to our team.</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowFeedback(false);
              triggerToast("Feedback sent. Thank you for helping us improve ARKN.");
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you think..."
                  className="w-full py-2.5 text-xs outline-none focus:border-gray-900 border border-gray-200 rounded-md px-3 resize-none font-sans font-medium"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 btn-secondary h-9 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary h-9 text-xs bg-[#1A5C38] hover:bg-[#113f25] border-none"
                >
                  Submit feedback
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
