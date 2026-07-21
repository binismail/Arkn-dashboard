"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircleIcon, CheckIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import ArknLogo from "@/components/ui/ArknLogo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyRequired, setVerifyRequired] = useState(false);

  useEffect(() => {
    if (verifyRequired) {
      document.title = "ARKN • Verify email";
    } else {
      document.title = "ARKN • Create workspace";
    }
  }, [verifyRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Your password should contain at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred during signup.");
        setLoading(false);
        return;
      }

      setVerifyRequired(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (verifyRequired) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <Link href="/">
              <ArknLogo size={32} />
            </Link>
          </div>

          <div className="inline-flex w-10 h-10 rounded-full bg-green-50 border border-green-100 items-center justify-center text-[#1A5C38]">
            <CheckIcon size={16} />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Verify your email</h1>
          <p className="text-xs text-gray-400 mt-1 max-w-[280px] mx-auto leading-normal">
            We've sent a verification link to <span className="font-semibold text-gray-750">{email}</span>. Please click the link to confirm your account.
          </p>

          <div className="pt-4 border-t border-gray-100 max-w-[280px] mx-auto">
            <Link href="/login" className="text-xs text-[#1A5C38] hover:underline font-semibold">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-5">
        {/* Brand wordmark logo */}
        <div className="flex justify-center">
          <Link href="/">
            <ArknLogo size={32} />
          </Link>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create your workspace</h1>
          <p className="text-xs text-gray-400">Protect your organisation's AI conversations in minutes.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[340px]">
        {error && (
          <div className="mb-4 p-3 bg-red-50/50 border border-red-100 text-red-700 text-xs rounded-md flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Jenkins"
              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 block">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@company.com"
              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 block">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
            {loading ? "Creating workspace..." : "Continue"}
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-normal pt-1">
            By creating a workspace, you agree to our{" "}
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 underline font-medium">
              Privacy Policy
            </Link>.
          </p>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1A5C38] hover:underline font-semibold font-sans">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
