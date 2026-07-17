"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInviteFlow, setIsInviteFlow] = useState(false);
  const [checkingFlow, setCheckingFlow] = useState(true);

  useEffect(() => {
    async function checkFlowType() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setName(user.user_metadata?.full_name || "");
        console.log(user)
          if (user.email) {
            const { data: invite } = await supabase
              .from("invitations")
              .select("id")
              .eq("email", user.email.trim())
              .eq("status", "pending")
              .maybeSingle();

              console.log(invite)
            if (invite) {
              setIsInviteFlow(true);
              document.title = "ARKN • Create workspace"; // Matches sign up / workspace set up title
            } else {
              document.title = "ARKN • Reset password";
            }
          }
        } else {
          document.title = "ARKN • Reset password";
        }
      } catch (err) {
        console.error("Failed to check flow type:", err);
      } finally {
        setCheckingFlow(false);
      }
    }

    checkFlowType();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInviteFlow && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Update password and optional metadata name
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: isInviteFlow ? { full_name: name.trim() } : undefined,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      if (isInviteFlow) {
        // Resolve membership and accept invite immediately
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const { data: invite } = await supabase
            .from("invitations")
            .select("id, organization_id, role")
            .eq("email", user.email.trim())
            .eq("status", "pending")
            .maybeSingle();

          if (invite) {
            // Check if membership already exists for this user
            const { data: existingMembership } = await supabase
              .from("memberships")
              .select("id")
              .eq("user_id", user.id)
              .maybeSingle();

            if (!existingMembership) {
              // Insert membership
              const { error: memError } = await supabase
                .from("memberships")
                .insert({
                  user_id: user.id,
                  organization_id: invite.organization_id,
                  role: invite.role || "member",
                });

              if (memError) {
                console.error("Membership insert failed:", memError.message);
                setError("Failed to set up your workspace membership. Please contact your admin.");
                setLoading(false);
                return;
              }
            }

            // Mark invitation accepted
            await supabase
              .from("invitations")
              .update({ status: "accepted" })
              .eq("id", invite.id);
          }
        }

        setMessage("Account setup complete! Redirecting...");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        // Normal reset flow: sign out of recovery session and redirect to login
        await supabase.auth.signOut();
        localStorage.clear();

        setMessage("Password updated successfully! Redirecting to login...");
        setLoading(false);
        setTimeout(() => {
          router.push("/login?message=Your password has been updated. Please sign in with your new password.");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (checkingFlow) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-6 lg:px-8 font-sans">
        <svg className="animate-spin h-5 w-5 text-[#1A5C38]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-5">
        {/* Brand wordmark logo */}
        <div className="flex justify-center">
          <span className="text-[10px] font-bold tracking-widest text-[#1A5C38] uppercase bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-sm">ARKN</span>
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {isInviteFlow ? "Set up your account" : "Create new password"}
          </h1>
          <p className="text-xs text-gray-400">
            {isInviteFlow 
              ? "Confirm your details to finish setting up your account." 
              : "Please choose a secure new password for your account."}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[340px]">
        {error && (
          <div className="mb-4 p-3 bg-red-50/50 border border-red-100 text-red-700 text-xs rounded-md flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50/50 border border-green-100 text-green-800 text-xs rounded-md flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-normal">{message}</span>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isInviteFlow && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jay Jay"
                  className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 block">
                {isInviteFlow ? "Choose Password" : "New Password"}
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 pl-3 pr-10 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-900 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112  19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 block">Confirm Password</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 pl-3 pr-10 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-900 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112  19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-9 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-md transition-colors shadow-none cursor-pointer flex items-center justify-center gap-1.5"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading 
                ? (isInviteFlow ? "Setting up account..." : "Updating password...") 
                : (isInviteFlow ? "Complete setup" : "Reset password")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
