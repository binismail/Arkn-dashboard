"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Globe, ArrowUp, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { PlatformIcon } from "@/components/ui/ModelLogos";

export default function PrivacyCore() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const columns = 12;
  const rows = 6;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6 bg-white font-sans relative overflow-hidden w-full" id="privacy">
      {/* Full-Screen Edge-to-Edge Grid of Thin Block Threads */}
      <div className="absolute inset-0 w-full h-full grid grid-cols-6 md:grid-cols-12 grid-rows-6 pointer-events-none z-0">
        {Array.from({ length: columns * rows }).map((_, i) => (
          <div
            key={i}
            className="border-r border-b border-gray-200/40 relative flex items-start justify-start"
          >
            {/* Intersection Dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300/50 -translate-x-[3px] -translate-y-[3px]" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto space-y-2 sm:space-y-3"
        >
          <h2 className="text-[26px] sm:text-[36px] md:text-[44px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.1]">
            Your data never becomes our data.
          </h2>
          <p className="text-[14px] sm:text-[16px] md:text-[17px] text-gray-500 leading-relaxed font-normal">
            Sensitive information is protected locally before it reaches AI.
            <br className="hidden sm:inline" /> ARKN only allows the protected version of your prompt to leave the browser.
          </p>
        </motion.div>

        {/* 3-COLUMN COMPOSITION: STAGGERED PARENT-THEN-CHILD ENTRANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SUPPORTING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 bg-[#f4f5f6] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="text-[20px] md:text-[22px] font-semibold text-gray-950 tracking-tight leading-snug">
                Protection happens locally
              </h3>
              <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
                Every prompt is inspected inside your browser before it reaches ChatGPT, Claude, or Gemini.
              </p>
              <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
                Sensitive information is automatically detected and replaced in real time, so your team keeps working exactly as they do today.
              </p>
            </div>

            <div className="pt-6">
              <hr className="border-gray-200/80 mb-4" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-medium block">
                  PROTECTION LATENCY
                </span>
                <span className="text-[18px] font-semibold text-gray-950 tracking-tight block mt-1">
                  &lt; 1 ms
                </span>
              </div>
            </div>
          </motion.div>

          {/* CENTER FOREST GREEN HERO DEMO - PARENT CARD ANIMATES FIRST */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-[#1A5C38] rounded-2xl sm:rounded-[32px] p-4 sm:p-8 md:p-10 relative overflow-hidden flex flex-col items-center justify-center shadow-lg"
          >
            {/* INNER CHATGPT SLIDER WINDOW - ANIMATES SECOND INSIDE PARENT */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              ref={containerRef}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden select-none cursor-ew-resize max-w-[460px] w-full min-h-[420px] sm:min-h-[450px] shadow-xl border border-gray-100/80"
            >
              {/* FLOATING CORNER BADGES INSIDE THE CHAT WINDOW */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-30 bg-[#4a4d52] text-white text-[9px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm pointer-events-none">
                Visible to you
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 bg-[#4a4d52] text-white text-[9px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm pointer-events-none">
                Invisible to others
              </div>

              {/* LAYER 1: PROTECTED AI VIEW (RIGHT SIDE - BASE LAYER) */}
              <div className="p-4 sm:p-6 space-y-4 bg-white min-h-[420px] sm:min-h-[450px] flex flex-col justify-between pt-12 sm:pt-14 w-full text-left">
                
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <PlatformIcon platform="chatgpt" size={20} />
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-900">ChatGPT 4o</span>
                </div>

                {/* Legal & Enterprise Scenarios */}
                <div className="space-y-3">
                  
                  {/* User Prompt 1 (Right Aligned) */}
                  <div className="flex justify-end">
                    <div className="bg-[#f4f4f5] text-gray-900 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium max-w-[88%] leading-relaxed font-sans">
                      Draft NDA for Latham & Watkins LLP on project ATHENA acquisition.
                    </div>
                  </div>

                  {/* AI Protected Response 1 */}
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                      <PlatformIcon platform="chatgpt" size={12} />
                    </div>
                    <div className="bg-white border border-gray-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-[12px] sm:text-[13px] text-gray-800 leading-relaxed max-w-[88%] font-sans">
                      Drafted mutual NDA for{" "}
                      <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-semibold text-[12px] sm:text-[13px] font-sans inline-block">
                        &#123;LAW_FIRM_1&#125;
                      </span>{" "}
                      covering confidential terms for project{" "}
                      <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-semibold text-[12px] sm:text-[13px] font-sans inline-block">
                        &#123;PROJECT_REF_1&#125;
                      </span>
                      .
                    </div>
                  </div>

                  {/* User Prompt 2 (Right Aligned) */}
                  <div className="flex justify-end pt-0.5">
                    <div className="bg-[#f4f4f5] text-gray-900 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium max-w-[88%] leading-relaxed font-sans">
                      Send retainer agreement to partner sarah.j@cliffordchance.com.
                    </div>
                  </div>

                  {/* AI Protected Response 2 */}
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                      <PlatformIcon platform="chatgpt" size={12} />
                    </div>
                    <div className="bg-white border border-gray-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-[12px] sm:text-[13px] text-gray-800 leading-relaxed max-w-[88%] font-sans">
                      Prepared retainer email for counsel{" "}
                      <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-semibold text-[12px] sm:text-[13px] font-sans inline-block">
                        &#123;PARTNER_EMAIL_1&#125;
                      </span>{" "}
                      under client matter{" "}
                      <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-semibold text-[12px] sm:text-[13px] font-sans inline-block">
                        &#123;MATTER_NO_1&#125;
                      </span>
                      .
                    </div>
                  </div>

                </div>

                {/* Bottom ChatGPT Input Bar */}
                <div className="bg-[#f4f4f5] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-between mt-1">
                  <span className="text-[11px] sm:text-[12px] text-gray-400 font-normal">Ask AI Assistant...</span>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                      <Plus size={12} weight="bold" />
                    </div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                      <Globe size={12} weight="regular" />
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#343541] text-white flex items-center justify-center">
                      <ArrowUp size={14} weight="bold" />
                    </div>
                  </div>
                </div>

              </div>

              {/* LAYER 2: ORIGINAL UNPROTECTED VIEW (LEFT SIDE OVERLAY CLIPPED WITH GPU CSS CLIP-PATH) */}
              <div
                className="absolute inset-0 bg-white z-10 pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                }}
              >
                <div className="p-4 sm:p-6 space-y-4 bg-white min-h-[420px] sm:min-h-[450px] flex flex-col justify-between pt-12 sm:pt-14 w-full text-left">
                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                    <PlatformIcon platform="chatgpt" size={20} />
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-900">ChatGPT 4o</span>
                  </div>

                  {/* Legal & Enterprise Scenarios */}
                  <div className="space-y-3">
                    
                    {/* User Prompt 1 (Right Aligned) */}
                    <div className="flex justify-end">
                      <div className="bg-[#f4f4f5] text-gray-900 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium max-w-[88%] leading-relaxed font-sans">
                        Draft NDA for Latham & Watkins LLP on project ATHENA acquisition.
                      </div>
                    </div>

                    {/* AI Original Response 1 */}
                    <div className="flex gap-2 items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                        <PlatformIcon platform="chatgpt" size={12} />
                      </div>
                      <div className="bg-white border border-gray-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-[12px] sm:text-[13px] text-gray-800 leading-relaxed max-w-[88%] font-sans">
                        Drafted mutual NDA for{" "}
                        <span className="font-semibold text-gray-950 px-1 inline-block">
                          Latham & Watkins LLP
                        </span>{" "}
                        covering confidential terms for project{" "}
                        <span className="font-semibold text-gray-950 px-1 inline-block">
                          ATHENA
                        </span>
                        .
                      </div>
                    </div>

                    {/* User Prompt 2 (Right Aligned) */}
                    <div className="flex justify-end pt-0.5">
                      <div className="bg-[#f4f4f5] text-gray-900 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium max-w-[88%] leading-relaxed font-sans">
                        Send retainer agreement to partner sarah.j@cliffordchance.com.
                      </div>
                    </div>

                    {/* AI Original Response 2 */}
                    <div className="flex gap-2 items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                        <PlatformIcon platform="chatgpt" size={12} />
                      </div>
                      <div className="bg-white border border-gray-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-[12px] sm:text-[13px] text-gray-800 leading-relaxed max-w-[88%] font-sans">
                        Prepared retainer email for counsel{" "}
                        <span className="font-semibold text-gray-950 px-1 inline-block">
                          sarah.j@cliffordchance.com
                        </span>{" "}
                        under client matter{" "}
                        <span className="font-semibold text-gray-950 px-1 inline-block">
                          MATTER-90412
                        </span>
                        .
                      </div>
                    </div>

                  </div>

                  {/* Bottom ChatGPT Input Bar */}
                  <div className="bg-[#f4f4f5] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-between mt-1">
                    <span className="text-[11px] sm:text-[12px] text-gray-400 font-normal">Ask AI Assistant...</span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                        <Plus size={12} weight="bold" />
                      </div>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                        <Globe size={12} weight="regular" />
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#343541] text-white flex items-center justify-center">
                        <ArrowUp size={14} weight="bold" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* DRAGGER KNOB HANDLE WITH 1.5PX THIN LINE */}
              <div
                className="absolute top-0 bottom-0 w-[1.5px] bg-black z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#202225] text-white shadow-md flex items-center justify-center pointer-events-auto border border-white/20">
                  <div className="flex items-center gap-0.5">
                    <CaretLeft size={8} weight="bold" />
                    <CaretRight size={8} weight="bold" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SUPPORTING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 bg-[#f4f5f6] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="text-[20px] md:text-[22px] font-semibold text-gray-950 tracking-tight leading-snug">
                Nothing sensitive is stored
              </h3>
              <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
                ARKN never receives your original prompts, customer information, or business context.
              </p>
              <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
                Only anonymous protection metadata is synchronized so administrators can understand protection activity across the workspace.
              </p>
            </div>

            <div className="pt-6">
              <hr className="border-gray-200/80 mb-4" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-medium block">
                  RAW PROMPTS STORED
                </span>
                <span className="text-[18px] font-semibold text-gray-950 tracking-tight block mt-1">
                  0
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Supporting Caption Below */}
        <p className="mt-8 text-center text-[12px] sm:text-[13px] text-gray-400 font-medium">
          Original prompts never leave your browser. Only protected placeholders are sent to AI.
        </p>

      </div>
    </section>
  );
}
