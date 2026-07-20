"use client";

import { motion } from "framer-motion";
import { PlatformIcon } from "@/components/ui/ModelLogos";

export default function Pipeline() {
  return (
    <section className="py-28 px-4 sm:px-6 bg-white font-sans" id="pipeline">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-xl mx-auto space-y-3"
        >
          <h2 className="text-[32px] md:text-[42px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.08]">
            What ARKN protects.
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
            Protect customer data, credentials, financial information, healthcare records, internal projects, and more before they reach AI.
          </p>
        </motion.div>

        {/* 5-CARD BENTO GRID OF HIGH-FIDELITY PRODUCT DEMONSTRATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* CARD 1: CUSTOMER INFORMATION (7 COLUMNS - LARGE HERO DEMO) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 bg-[#1A5C38] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between h-[360px] overflow-hidden relative shadow-md"
          >
            <div className="space-y-1 z-10">
              <span className="text-[11px] font-mono tracking-wider text-emerald-200/90 uppercase font-medium block">
                CUSTOMER & PERSONAL INFORMATION
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Real-time PII & Contact Interception
              </h3>
            </div>

            {/* Inner White Demo Window (Staggered Entrance & 20% Bottom Overflow Clipping) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-t-2xl rounded-b-xl p-5 sm:p-6 w-full max-w-[540px] mx-auto shadow-sm space-y-3 font-sans"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform="chatgpt" size={18} />
                  <span className="text-xs font-semibold text-gray-900">Live Extension Redact</span>
                </div>
                <span className="bg-emerald-100 text-[#1A5C38] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38] animate-pulse" />
                  3 PII Redacted
                </span>
              </div>

              {/* Intercepted Prompt Box */}
              <div className="bg-gray-50 rounded-xl p-3 text-[12px] text-gray-700 leading-relaxed font-sans space-y-1">
                <div className="text-[10px] text-gray-400 font-mono">PROMPT SENT TO AI:</div>
                <div>
                  "Draft proposal for{" "}
                  <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[11px]">
                    &#123;NAME_1&#125;
                  </span>{" "}
                  at{" "}
                  <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[11px]">
                    &#123;EMAIL_1&#125;
                  </span>{" "}
                  (Phone:{" "}
                  <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[11px]">
                    &#123;PHONE_1&#125;
                  </span>
                  )"
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400 font-mono">
                <span>LATENCY: 0.4ms</span>
                <span className="text-emerald-700 font-semibold">100% Client-Side</span>
              </div>
            </motion.div>
          </motion.div>

          {/* CARD 2: API KEYS & CREDENTIALS (5 COLUMNS - MEDIUM DEMO) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 bg-[#f4f5f6] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between h-[360px] overflow-hidden relative"
          >
            <div className="space-y-1 z-10">
              <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-medium block">
                API KEYS & CREDENTIALS
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-950 tracking-tight">
                Secrets & Key Safeguard
              </h3>
            </div>

            {/* Inner White Demo Window */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-t-2xl rounded-b-xl p-5 w-full shadow-2xs space-y-3 font-sans"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform="gemini" size={16} />
                  <span className="text-xs font-semibold text-gray-900">Credential Interceptor</span>
                </div>
                <span className="bg-emerald-100 text-[#1A5C38] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                  Secret Blocked
                </span>
              </div>

              {/* Code Snippet */}
              <div className="bg-[#1e1e1e] text-gray-200 rounded-xl p-3 text-[11px] font-mono leading-relaxed space-y-1">
                <div><span className="text-purple-400">const</span> apiKey = <span className="text-emerald-400">"&#123;API_KEY_1&#125;"</span>;</div>
                <div><span className="text-purple-400">const</span> awsSecret = <span className="text-emerald-400">"&#123;AWS_SECRET_1&#125;"</span>;</div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-[10px] font-mono text-gray-400">
                <span>0 RAW KEYS SENT TO AI</span>
                <span className="text-emerald-700 font-semibold">Tokenized</span>
              </div>
            </motion.div>
          </motion.div>

          {/* CARD 3: FINANCIAL INFORMATION (4 COLUMNS) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 bg-[#f4f5f6] rounded-[28px] p-6 flex flex-col justify-between h-[270px] overflow-hidden relative"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-medium block">
                FINANCIAL INFORMATION
              </span>
              <h4 className="text-base font-semibold text-gray-950 tracking-tight">
                Sort codes & IBANs
              </h4>
            </div>

            {/* Inner White Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-t-2xl rounded-b-xl p-4 shadow-2xs space-y-2 font-sans"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">Bank Transfer</span>
                <span className="font-mono text-[#1A5C38] bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  Tokenized
                </span>
              </div>
              <p className="text-[12px] text-gray-700 font-sans">
                "Process payment via sort code{" "}
                <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">
                  &#123;SORT_CODE_1&#125;
                </span>"
              </p>
            </motion.div>
          </motion.div>

          {/* CARD 4: HEALTHCARE RECORDS (4 COLUMNS) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 bg-[#f4f5f6] rounded-[28px] p-6 flex flex-col justify-between h-[270px] overflow-hidden relative"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-medium block">
                HEALTHCARE & NHS
              </span>
              <h4 className="text-base font-semibold text-gray-950 tracking-tight">
                Patient & Clinical Data
              </h4>
            </div>

            {/* Inner White Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-t-2xl rounded-b-xl p-4 shadow-2xs space-y-2 font-sans"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">Clinical Note</span>
                <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  PHI Shielded
                </span>
              </div>
              <p className="text-[12px] text-gray-700 font-sans">
                "Review oncology summary for patient{" "}
                <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">
                  &#123;PATIENT_ID_1&#125;
                </span>"
              </p>
            </motion.div>
          </motion.div>

          {/* CARD 5: CONFIDENTIAL PROJECTS (4 COLUMNS) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 bg-[#f4f5f6] rounded-[28px] p-6 flex flex-col justify-between h-[270px] overflow-hidden relative"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-medium block">
                CONFIDENTIAL PROJECTS
              </span>
              <h4 className="text-base font-semibold text-gray-950 tracking-tight">
                Internal Project Codenames
              </h4>
            </div>

            {/* Inner White Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-t-2xl rounded-b-xl p-4 shadow-2xs space-y-2 font-sans"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">M&A Agreement</span>
                <span className="font-mono text-[#1A5C38] bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  Org Rule Active
                </span>
              </div>
              <p className="text-[12px] text-gray-700 font-sans">
                "Draft NDA for acquisition project{" "}
                <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200/80 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">
                  &#123;PROJECT_REF_1&#125;
                </span>"
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
