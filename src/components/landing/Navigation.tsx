"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ArknLogo from "@/components/ui/ArknLogo";
import { useUserSession } from "@/hooks/useUserSession";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn } = useUserSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all border-b border-gray-100 duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <ArknLogo size={28} />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#why-arkn" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Why ARKN
          </a>
          <a href="#onboarding" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            How it works
          </a>
          <a href="#policies" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Protection Rules
          </a>
          <a href="#trust" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Security
          </a>
        </div>

        {/* Auth Aware Action Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="h-9 px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[13px] font-semibold rounded-lg flex items-center justify-center transition-colors"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="h-9 px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[13px] font-semibold rounded-lg flex items-center justify-center transition-colors"
              >
                Create workspace
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
