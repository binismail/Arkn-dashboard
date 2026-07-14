"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircleIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "ARKN • Reset password";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your work email.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to trigger reset email.");
        setLoading(false);
        return;
      }

      setMessage("We've sent a password reset link to your work email. Please check your inbox.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-5">
        {/* Brand wordmark logo */}
        <div className="flex justify-center">
          <span className="text-[10px] font-bold tracking-widest text-[#1A5C38] uppercase bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-sm">ARKN</span>
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Reset your password</h1>
          <p className="text-xs text-gray-400">Enter your email and we'll send you a recovery link.</p>
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
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 block">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-gray-900 transition-colors"
                disabled={loading}
                required
              />
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
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          Back to{" "}
          <Link href="/login" className="text-[#1A5C38] hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
