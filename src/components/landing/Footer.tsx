"use client";

import Link from "next/link";
import ArknLogo from "@/components/ui/ArknLogo";
import { useUserSession } from "@/hooks/useUserSession";

export default function Footer() {
  const { isLoggedIn } = useUserSession();

  return (
    <footer className="bg-white border-t border-gray-100 font-sans text-gray-600">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-16">
        
        {/* Main Grid: Brand Column + 3 Clean Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          
          {/* Brand Identity Column (Spans 2) */}
          <div className="col-span-2 space-y-4 pr-4">
            <ArknLogo size={24} textSize="text-sm tracking-widest uppercase text-[#1A5C38]" />
            
            <p className="text-[13px] text-gray-500 leading-relaxed font-normal max-w-sm">
              Browser-first security layer for AI. Protecting sensitive company information before prompts reach ChatGPT, Claude, or Gemini.
            </p>

            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
              <span>Zero raw prompt storage</span>
            </div>
          </div>

          {/* Column 1: PRODUCT */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><Link href="/#why-arkn" className="hover:text-gray-950 transition-colors">Why ARKN</Link></li>
              <li><Link href="/#onboarding" className="hover:text-gray-950 transition-colors">How it works</Link></li>
              <li><Link href="/#policies" className="hover:text-gray-950 transition-colors">Protection Rules</Link></li>
              <li><Link href="/#trust" className="hover:text-gray-950 transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Column 2: RESOURCES */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Resources</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><Link href="/blog" className="hover:text-gray-950 transition-colors">Blog &amp; Insights</Link></li>
              <li><Link href="/#onboarding" className="hover:text-gray-950 transition-colors">Installation Guide</Link></li>
              {isLoggedIn ? (
                <li>
                  <Link href="/dashboard" className="hover:text-gray-950 transition-colors font-medium text-[#1A5C38]">
                    Workspace Dashboard →
                  </Link>
                </li>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-gray-950 transition-colors">Sign In</Link></li>
                  <li><Link href="/register" className="hover:text-gray-950 transition-colors">Create Workspace</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-950 uppercase tracking-wider font-mono">Company</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-gray-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:hello@myarkn.ai" className="hover:text-gray-950 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-gray-400">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} MYARKN LTD. All rights reserved.</p>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
          </div>

          <p className="text-[11px] text-gray-400 font-normal">
            Only anonymized operational metadata is processed. Never your raw prompts.
          </p>
        </div>

      </div>
    </footer>
  );
}
