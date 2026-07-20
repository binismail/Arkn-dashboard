"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PlatformIcon } from "@/components/ui/ModelLogos";

export default function SensitiveData() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="py-32 px-6 bg-white font-sans" id="why-arkn">
      <motion.div style={{ opacity }} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-xl mx-auto"
        >
          <h2 className="text-[32px] md:text-[40px] font-semibold text-gray-950 tracking-[-0.02em] leading-[1.1]">
            Your employees already use AI.
          </h2>
          <p className="mt-3 text-[15px] md:text-[16px] text-gray-500 leading-relaxed">
            The question is: what are they sending?
          </p>
        </motion.div>

        {/* 3 Asymmetric Stage Cards with ~30% Bottom Overflow Clipping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1: Customer Data (Deep Bottom Clipping & Shifted Right) */}
          <div className="flex flex-col">
            {/* PARENT SWATCH CONTAINER (COMPACT 280PX HEIGHT WITH OVERFLOW CLIPPING) */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FFECEC] rounded-2xl h-[280px] overflow-hidden flex flex-col justify-end pt-6 px-4 sm:px-5 relative"
              style={{ perspective: "1000px" }}
            >
              {/* INNER MOTION WRAPPER - PUSHED DOWN FOR DEEP 30% CLIPPING */}
              <motion.div
                initial={{ opacity: 0, y: 60, x: 16 }}
                whileInView={{ opacity: 1, y: 42, x: 16 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-end"
              >
                {/* CHILD WHITE CARD */}
                <div
                  className="bg-white rounded-[20px] p-5 max-w-[320px] w-full h-fit space-y-3.5 shadow-2xs transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    transform: "rotateX(8deg) rotateY(6deg) rotateZ(-2deg)",
                    transformOrigin: "bottom right",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform="chatgpt" size={16} />
                      <span className="text-xs font-semibold text-gray-900">ChatGPT 4o</span>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                      2 Entities
                    </span>
                  </div>

                  {/* User Prompt */}
                  <div className="bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-700 leading-relaxed font-sans">
                    "Draft executive outreach for client{" "}
                    <span className="bg-[#fee2e2] text-[#991b1b] font-semibold px-1 rounded">
                      Sarah Jenkins
                    </span>{" "}
                    at{" "}
                    <span className="bg-[#fee2e2] text-[#991b1b] font-semibold px-1 rounded">
                      sarah@acme.co.uk
                    </span>..."
                  </div>

                  {/* AI Response Preview */}
                  <div className="text-[11px] text-gray-600 leading-relaxed font-sans pl-1">
                    Drafted renewal email for{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-mono font-semibold text-[10px]">
                      &#123;NAME_1&#125;
                    </span>{" "}
                    at{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-mono font-semibold text-[10px]">
                      &#123;EMAIL_1&#125;
                    </span>.
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-mono">EDGE PROTECTION</span>
                    <span className="text-[10px] font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                      PII Redacted
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Caption */}
            <div className="mt-4 px-1">
              <p className="text-[13px] text-gray-600 leading-normal">
                <strong className="font-semibold text-gray-950">Customer Data</strong> Raw PII like full names, email addresses, and client contact details.
              </p>
            </div>
          </div>

          {/* Card 2: Medical & Clinical (Deep Bottom Clipping & Centered) */}
          <div className="flex flex-col">
            {/* PARENT SWATCH CONTAINER (COMPACT 280PX HEIGHT WITH OVERFLOW CLIPPING) */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#E0F2FE] rounded-2xl h-[280px] overflow-hidden flex flex-col justify-end pt-6 px-4 sm:px-5 relative"
              style={{ perspective: "1000px" }}
            >
              {/* INNER MOTION WRAPPER - PUSHED DOWN FOR DEEP 30% CLIPPING */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 42 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center"
              >
                {/* CHILD WHITE CARD */}
                <div
                  className="bg-white rounded-[20px] p-5 max-w-[320px] w-full h-fit space-y-3.5 shadow-2xs transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    transform: "rotateX(8deg) rotateY(0deg) rotateZ(0deg)",
                    transformOrigin: "bottom center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform="claude" size={16} />
                      <span className="text-xs font-semibold text-gray-900">Claude AI</span>
                    </div>
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                      PHI Found
                    </span>
                  </div>

                  {/* User Prompt */}
                  <div className="bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-700 leading-relaxed font-sans">
                    "Review clinical history for patient{" "}
                    <span className="bg-[#e0f2fe] text-[#075985] font-semibold px-1 rounded">
                      NHS #940-204
                    </span>{" "}
                    under Dr. Aris (Oncology treatment)..."
                  </div>

                  {/* AI Response Preview */}
                  <div className="text-[11px] text-gray-600 leading-relaxed font-sans pl-1">
                    Summarized clinical record for{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-mono font-semibold text-[10px]">
                      &#123;PATIENT_ID_1&#125;
                    </span>.
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-mono">EDGE PROTECTION</span>
                    <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      PHI Shielded
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Caption */}
            <div className="mt-4 px-1">
              <p className="text-[13px] text-gray-600 leading-normal">
                <strong className="font-semibold text-gray-950">Medical & Clinical</strong> Patient references, NHS identifiers, and sensitive health records.
              </p>
            </div>
          </div>

          {/* Card 3: Financials & Credentials (Deep Bottom Clipping & Shifted Left) */}
          <div className="flex flex-col">
            {/* PARENT SWATCH CONTAINER (COMPACT 280PX HEIGHT WITH OVERFLOW CLIPPING) */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#7BC6A1]/20 rounded-2xl h-[280px] overflow-hidden flex flex-col justify-end pt-6 px-4 sm:px-5 relative"
              style={{ perspective: "1000px" }}
            >
              {/* INNER MOTION WRAPPER - PUSHED DOWN FOR DEEP 30% CLIPPING */}
              <motion.div
                initial={{ opacity: 0, y: 60, x: -16 }}
                whileInView={{ opacity: 1, y: 42, x: -16 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-start"
              >
                {/* CHILD WHITE CARD */}
                <div
                  className="bg-white rounded-[20px] p-5 max-w-[320px] w-full h-fit space-y-3.5 shadow-2xs transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    transform: "rotateX(8deg) rotateY(-6deg) rotateZ(2deg)",
                    transformOrigin: "bottom left",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform="gemini" size={16} />
                      <span className="text-xs font-semibold text-gray-900">Gemini Assistant</span>
                    </div>
                    <span className="bg-emerald-100 text-[#1A5C38] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                      Secret Blocked
                    </span>
                  </div>

                  {/* User Prompt */}
                  <div className="bg-gray-50 rounded-xl p-2.5 text-[11px] text-gray-700 leading-relaxed font-sans">
                    "Deploy script with{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] font-mono font-semibold px-1 py-0.5 rounded">
                      sk_live_982314...
                    </span>{" "}
                    Bank:{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] font-mono font-semibold px-1 py-0.5 rounded">
                      20-39-48
                    </span>"
                  </div>

                  {/* AI Response Preview */}
                  <div className="text-[11px] text-gray-600 leading-relaxed font-sans pl-1">
                    Prepared deployment with tokenized credentials for{" "}
                    <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1 rounded font-mono font-semibold text-[10px]">
                      &#123;API_KEY_1&#125;
                    </span>.
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-mono">EDGE PROTECTION</span>
                    <span className="text-[10px] font-mono font-semibold text-[#1A5C38] bg-emerald-50 px-2 py-0.5 rounded-full">
                      Tokenized
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Caption */}
            <div className="mt-4 px-1">
              <p className="text-[13px] text-gray-600 leading-normal">
                <strong className="font-semibold text-gray-950">Financials & Credentials</strong> Bank sort codes, account numbers, and internal reference codes.
              </p>
            </div>
          </div>

        </div>

        {/* Aside-Style 2-Column Copy Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 pt-16 border-t border-gray-200/60 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          {/* Left Tag Link */}
          <div className="md:col-span-4">
            <span className="text-[14px] font-medium text-[#1A5C38] flex items-center gap-1 cursor-pointer">
              Introducing ARKN &rarr;
            </span>
          </div>

          {/* Right Copy Paragraphs */}
          <div className="md:col-span-8 space-y-6">
            <p className="text-[16px] md:text-[18px] text-gray-500 leading-relaxed font-normal">
              <strong className="text-gray-950 font-semibold">The problem isn't AI. It's what reaches AI.</strong>{" "}
              Your employees are already using ChatGPT, Claude, and Gemini to do real work. Every day, sensitive names, emails, financial information, customer records, internal identifiers, and confidential documents are copied into prompts.
            </p>

            <p className="text-[16px] md:text-[18px] text-gray-500 leading-relaxed font-normal">
              <strong className="text-gray-950 font-semibold">ARKN intercepts every request locally, detects sensitive information, replaces it with secure tokens, and only then allows the prompt to continue.</strong>{" "}
              Your original data never leaves the browser.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
