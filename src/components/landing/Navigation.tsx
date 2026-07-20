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
          ? "bg-white/90 backdrop-blur-xl"
          : "bg-white/50 backdrop-blur-md md:bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <ArknLogo size={26} />
        </Link>

        {/* Navigation Links (Desktop) */}
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

        {/* Auth-Aware Action Buttons (Mobile Optimized) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="h-9 px-3.5 sm:px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg flex items-center justify-center transition-colors whitespace-nowrap"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[12px] sm:text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-1.5 whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="h-9 px-3 sm:px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg flex items-center justify-center transition-colors whitespace-nowrap"
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
