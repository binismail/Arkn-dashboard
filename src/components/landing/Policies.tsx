"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Key, FileText, Lock, Plus, Globe, ArrowUp } from "@phosphor-icons/react";
import { PlatformIcon } from "@/components/ui/ModelLogos";

const POLICY_FEATURES = [
  {
    id: 0,
    icon: Shield,
    title: "Real-Time PII Redaction",
    desc: "Automatically replaces names, emails, and contact details with safe deterministic tokens.",
    prompt: "Can you review this contract for Sarah Jenkins at sarah@jenkinslaw.co.uk?",
    response: (
      <>
        Reviewing contract for{" "}
        <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;NAME_1&#125;
        </span>{" "}
        at{" "}
        <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;EMAIL_1&#125;
        </span>
        .
      </>
    ),
  },
  {
    id: 1,
    icon: Key,
    title: "Credential & Key Safeguard",
    desc: "Intercepts API keys, OAuth tokens, and secrets before they reach public LLMs.",
    prompt: "Deploy script using OPENAI_API_KEY=sk_live_98231498149814 for production",
    response: (
      <>
        Deploy script using OPENAI_API_KEY=
        <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;API_KEY_1&#125;
        </span>{" "}
        for production.
      </>
    ),
  },
  {
    id: 2,
    icon: FileText,
    title: "Custom Enterprise Rules",
    desc: "Define custom regex and internal project keyphrases for workspace-wide enforcement.",
    prompt: "Summarize strategic roadmap for Project ATHENA-2024",
    response: (
      <>
        Summarize strategic roadmap for{" "}
        <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;CUSTOM_PROJECT_1&#125;
        </span>
        .
      </>
    ),
  },
  {
    id: 3,
    icon: Lock,
    title: "Local Edge Boundary",
    desc: "Zero raw prompt text ever leaves your computer or gets logged on remote servers.",
    prompt: "Send invoice to sort code 40-22-11 account 88492019 ref INV-2024",
    response: (
      <>
        Send invoice to sort code{" "}
        <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;SORT_CODE_1&#125;
        </span>{" "}
        account{" "}
        <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-[12px] font-semibold">
          &#123;ACCOUNT_1&#125;
        </span>
        .
      </>
    ),
  },
];

const STEP_DURATION = 3500; // 3.5 seconds per step

export default function Policies() {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  // Auto-advance loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveFeature((prev) => (prev + 1) % POLICY_FEATURES.length);
    }, STEP_DURATION);

    return () => clearTimeout(timer);
  }, [activeFeature]);

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-white" id="policies">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 max-w-xl mx-auto space-y-3"
        >
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.1]">
            Security rules your entire team
            <br className="hidden sm:inline" />
            {" "}follows automatically.
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
            Workspace-wide PII policies enforced seamlessly at the browser edge.
          </p>
        </motion.div>

        {/* 2-COLUMN CONTAINER WITH FOREST GREEN LEFT CANVAS & REFINED RIGHT PANE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[520px] sm:min-h-[560px]"
        >
          
          {/* Left Side: Forest Green Container with Dynamic Physical Card Shuffle Stack */}
          <div className="md:w-7/12 bg-[#1A5C38] p-5 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Card Deck Viewport */}
            <div className="w-full max-w-md h-[390px] sm:h-[430px] relative flex items-center justify-center pt-6 sm:pt-8">
              
              {POLICY_FEATURES.map((item, index) => {
                const order = (index - activeFeature + POLICY_FEATURES.length) % POLICY_FEATURES.length;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={false}
                    animate={{
                      y: order === 0 ? 0 : order === 1 ? -12 : order === 2 ? -24 : -34,
                      scale: order === 0 ? 1 : order === 1 ? 0.94 : order === 2 ? 0.88 : 0.82,
                      zIndex: 10 - order,
                      opacity: order === 3 ? 0 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                      mass: 0.85,
                    }}
                    className="absolute inset-x-0 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-200 shadow-2xs flex flex-col justify-between h-[370px] sm:h-[400px] pointer-events-auto overflow-hidden"
                    style={{ originY: 0 }}
                  >
                    {/* Top Row - ChatGPT Icon */}
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform="chatgpt" size={20} />
                    </div>

                    {/* Prompt Text (Break long strings cleanly on mobile) */}
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-gray-950 tracking-tight leading-snug font-sans break-all sm:break-words overflow-hidden">
                      {item.prompt}
                    </p>

                    {/* AI Protected Response Bubble */}
                    <div className="bg-[#f0f2f5] text-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-[12px] sm:text-[13px] leading-relaxed font-sans max-w-[95%] sm:max-w-[90%] ml-auto break-all sm:break-words">
                      {item.response}
                    </div>

                    {/* Bottom ChatGPT Chat Input Bar */}
                    <div className="bg-[#f4f4f5] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between h-[74px] sm:h-[80px]">
                      <span className="text-[11px] sm:text-[12px] text-gray-400 font-normal">Ask AI Assistant...</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                            <Plus size={12} weight="bold" />
                          </div>
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                            <Globe size={12} weight="regular" />
                          </div>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#343541] text-white flex items-center justify-center">
                          <ArrowUp size={14} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </div>

          </div>

          {/* Right Side: Progressive Filling Auto-Looping Right Items */}
          <div className="md:w-5/12 bg-white divide-y divide-gray-100 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 relative">
            {POLICY_FEATURES.map((item, i) => {
              const Icon = item.icon;
              const isSelected = activeFeature === i;
              return (
                <div
                  key={item.title}
                  onClick={() => setActiveFeature(i)}
                  onMouseEnter={() => setActiveFeature(i)}
                  className="p-5 sm:p-6 md:p-7 flex flex-col justify-center cursor-pointer flex-1 relative overflow-hidden group"
                >
                  {/* Faint Green Animated Progress Bar Fill Background */}
                  {isSelected && (
                    <motion.div
                      key={`progress-${activeFeature}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                      className="absolute inset-0 bg-emerald-50/80 origin-left pointer-events-none z-0"
                    />
                  )}

                  {/* Content Container (Layered above progress fill) */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-1">
                      <Icon
                        size={18}
                        weight={isSelected ? "bold" : "regular"}
                        className={`shrink-0 transition-colors ${isSelected ? "text-[#1A5C38]" : "text-gray-600 group-hover:text-gray-900"}`}
                      />
                      <h4 className={`text-[13px] sm:text-[14px] font-semibold tracking-tight transition-colors ${
                        isSelected ? "text-[#1A5C38]" : "text-gray-950"
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed font-normal pl-[26px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
