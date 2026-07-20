"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";

const PLATFORMS = [
  { name: "Claude", logo: "/claude-ai-logo.png" },
  { name: "ChatGPT", logo: "/openai-com-logo.png" },
  { name: "Gemini", logo: "/Google_Gemini_icon_2025.svg.webp" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isLoggedIn } = useUserSession();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PLATFORMS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const currentPlatform = PLATFORMS[currentIndex];

  return (
    <section className="pt-32 sm:pt-38 pb-20 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-white font-sans">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Works with Platform Switcher Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-100 mb-6"
        >
          <span className="text-[13px] font-medium text-gray-500">Works with</span>
          <div className="h-4 w-px bg-gray-200" />
          <div className="relative h-5 flex items-center min-w-[90px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlatform.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 absolute left-0"
              >
                <div className="w-4 h-4 relative shrink-0">
                  <Image
                    src={currentPlatform.logo}
                    alt={currentPlatform.name}
                    fill
                    sizes="16px"
                    className="object-contain"
                  />
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {currentPlatform.name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[34px] sm:text-[42px] md:text-[48px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.1]"
        >
          Your team's security layer for AI.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 sm:mt-5 text-[15px] md:text-[17px] text-gray-500 leading-relaxed max-w-2xl mx-auto"
        >
          ARKN sits between your team and ChatGPT, Claude, and Gemini, automatically detecting and replacing sensitive information before it leaves the browser—without storing your prompts or interrupting how your team works.
        </motion.p>

        {/* Auth-Aware CTA Buttons (Mobile Responsive Stack) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
        >
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="h-11 px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <Link
              href="/register"
              className="h-11 px-5 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              Create workspace
            </Link>
          )}
          <a
            href="#onboarding"
            className="h-11 px-5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            Download extension
          </a>
        </motion.div>
      </div>

      {/* Browser Window Preview (Clean Bottom Overflow - No Squishing) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 max-w-6xl mx-auto h-[380px] sm:h-[440px] overflow-hidden rounded-2xl bg-white"
      >
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-[520px]">
          {/* Top Browser Chrome Bar */}
          <div className="h-11 bg-[#f4f5f6] border-b border-gray-200 px-4 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex-1 max-w-md h-6 bg-white border border-gray-200/80 rounded-md px-3 flex items-center text-[11px] text-gray-400 font-mono">
              <span>https://myarkn.ai</span>
            </div>
          </div>

          {/* Viewport Content Area with Centered Play Button */}
          <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center relative p-8">
            <div className="group relative flex items-center justify-center cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1A5C38] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#113f25] shadow-md">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
