"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import ArknLogo from "@/components/ui/ArknLogo";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(searchParams);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(resolvedParams.error || "");
  const [infoMessage, setInfoMessage] = useState(resolvedParams.message || "");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "ARKN • Sign in";
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          setError("We couldn't sign you in. Please check your email and password and try again.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("organization_id")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (memError) {
          setError("We couldn't resolve your membership details. Please try again.");
          setLoading(false);
          return;
        }

        if (membership) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding/create-org");
        }
      }
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
          <Link href="/">
            <ArknLogo size={32} />
          </Link>
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-gray-400">Continue where you left off.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[340px]">
        {error && (
          <div className="mb-4 p-3 bg-red-50/50 border border-red-100 text-red-700 text-xs rounded-md flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertCircleIcon size={14} className="shrink-0 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-green-50/50 border border-green-100 text-green-800 text-xs rounded-md flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-normal">{infoMessage}</span>
          </div>
        )}

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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-gray-500">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-gray-400 hover:text-gray-900 font-semibold transition-colors">Forgot password?</Link>
            </div>
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
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          New to ARKN?{" "}
          <Link href="/register" className="text-[#1A5C38] hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
