"use client";

import { motion } from "framer-motion";
import { ShieldCheck, EyeClosed, Database, LockKey } from "@phosphor-icons/react";

const STATEMENTS = [
  {
    icon: ShieldCheck,
    title: "Protection happens locally",
    desc: "Every prompt is inspected and protected inside your browser. Raw sensitive data never leaves your device.",
  },
  {
    icon: EyeClosed,
    title: "We never store prompts",
    desc: "ARKN doesn't collect conversations, customer information, or business documents. Only anonymous protection metadata is synchronized.",
  },
  {
    icon: Database,
    title: "We never train on your data",
    desc: "Your prompts are never used to train ARKN, third-party models, or anyone else's AI systems.",
  },
  {
    icon: LockKey,
    title: "Only protected prompts leave",
    desc: "Sensitive entities are replaced with deterministic tokens before requests reach ChatGPT, Claude, or Gemini.",
  },
];

export default function Trust() {
  return (
    <section className="py-24 bg-white font-sans overflow-hidden" id="trust">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center max-w-lg mx-auto space-y-2"
        >
          <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.1]">
            Private by design.
          </h2>
          <p className="text-[14px] text-gray-500 font-normal">
            Zero-trust architecture guaranteeing end-to-end data sovereignty.
          </p>
        </motion.div>

        {/* FULL-BLEED GRID ROW WITH THREAD LINES */}
        <div className="border-t border-b border-gray-200/80 bg-gray-50/40">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200/80">
            {STATEMENTS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 md:p-10 space-y-3 bg-white/60 hover:bg-white transition-colors duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} weight="bold" className="text-gray-900 shrink-0" />
                    <h3 className="text-[14px] font-semibold text-gray-950 tracking-tight leading-tight">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-[13px] text-gray-500 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
