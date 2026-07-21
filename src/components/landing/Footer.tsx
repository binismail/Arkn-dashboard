"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import ArknLogo from "@/components/ui/ArknLogo";
import { useUserSession } from "@/hooks/useUserSession";

export default function Footer() {
  const { isLoggedIn } = useUserSession();

  return (
    <footer className="bg-white border-t border-gray-100 font-sans text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 space-y-16">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          
          {/* Brand Identity Column */}
          <div className="col-span-2 space-y-4 pr-4">
            <ArknLogo size={24} textSize="text-sm tracking-widest uppercase text-[#1A5C38]" />
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-gray-950">Enterprise AI security for modern teams.</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-normal max-w-sm">
                ARKN protects sensitive company information before it reaches AI models—without storing prompts or collecting raw data.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                Zero raw prompt storage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                Browser-first protection
              </span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#why-arkn" className="hover:text-gray-950 transition-colors">Why ARKN</a></li>
              <li><a href="#onboarding" className="hover:text-gray-950 transition-colors">How it works</a></li>
              <li><a href="#policies" className="hover:text-gray-950 transition-colors">Protection Rules</a></li>
              <li><a href="#trust" className="hover:text-gray-950 transition-colors">Security Boundary</a></li>
            </ul>
          </div>

          {/* Column 2: Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-gray-950 transition-colors text-gray-700 font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li><span className="text-gray-500">GDPR Compliance</span></li>
              <li><span className="text-gray-500">SOC2 Type II Ready</span></li>
              <li><span className="text-gray-500">UK Data Protection</span></li>
              <li><span className="text-gray-500">Zero Raw PII Storage</span></li>
            </ul>
          </div>

          {/* Column 3: Auth-Aware Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Links</h4>
            <ul className="space-y-2 text-xs">
              {isLoggedIn ? (
                <li>
                  <Link href="/dashboard" className="hover:text-gray-950 transition-colors inline-flex items-center gap-1 font-semibold text-[#1A5C38]">
                    <span>Go to Dashboard</span>
                    <ArrowUpRight size={10} />
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-gray-950 transition-colors inline-flex items-center gap-1">
                      <span>Sign In</span>
                      <ArrowUpRight size={10} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-gray-950 transition-colors inline-flex items-center gap-1">
                      <span>Create Workspace</span>
                      <ArrowUpRight size={10} />
                    </Link>
                  </li>
                </>
              )}
              <li><a href="#onboarding" className="hover:text-gray-950 transition-colors">Installation Guide</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-gray-400">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} MYARKN LTD. All rights reserved.</p>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="text-right space-y-0.5 text-[11px] text-gray-500 font-medium leading-tight">
            <p>Only anonymized protection metadata is stored.</p>
            <p className="text-gray-400">Never your prompts. Never your raw data.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
