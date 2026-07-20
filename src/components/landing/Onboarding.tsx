"use client";

import { motion } from "framer-motion";
import { LaptopIcon } from "@/components/ui/icons";
import { PlatformIcon } from "@/components/ui/ModelLogos";
import ArknLogo from "@/components/ui/ArknLogo";

const DEPLOYMENT_CARDS = [
  {
    step: "01",
    title: "Create Workspace",
    badge: "< 60 seconds",
    targetY: 20,
    childCard: (
      <div className="bg-white rounded-t-2xl rounded-b-xl p-6 max-w-[320px] w-full h-fit space-y-3.5 text-center font-sans transform translate-y-5">
        <div className="flex justify-center">
          <ArknLogo size={20} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-900 tracking-tight">Create your organization</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Seed the compliance root for your team.</p>
        </div>
        <div className="space-y-1 text-left pt-1">
          <label className="text-[10px] font-semibold text-gray-500 block">Organization / Company Name</label>
          <input
            type="text"
            readOnly
            value="Alpha Chambers LLP"
            className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-900 outline-none"
          />
          <span className="text-[8px] text-gray-400 block pt-0.5">
            You will automatically become the Owner of this organization.
          </span>
        </div>
        <button className="w-full h-8 bg-[#1A5C38] text-white font-medium text-xs rounded-md flex items-center justify-center cursor-default">
          Continue
        </button>
      </div>
    ),
  },
  {
    step: "02",
    title: "Invite Team",
    badge: "Unlimited members",
    targetY: 20,
    childCard: (
      <div className="bg-white rounded-t-2xl rounded-b-xl p-6 max-w-[320px] w-full h-fit space-y-3.5 text-center font-sans transform translate-y-5">
        <div className="flex justify-center">
          <ArknLogo size={20} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-900 tracking-tight">Invite your team</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Provide work emails to send team onboarding invites.</p>
        </div>
        <div className="space-y-1.5 text-left pt-1">
          <label className="text-[10px] font-semibold text-gray-500 block">Email Addresses</label>
          <input
            type="text"
            readOnly
            value="sarah@alphachambers.co.uk"
            className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-md text-[10px] font-mono text-gray-800 outline-none"
          />
        </div>
        <div className="text-[10px] text-[#1A5C38] font-semibold text-left">+ Add another email</div>
        <div className="flex gap-2 pt-1">
          <button className="flex-1 h-8 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-md cursor-default">
            Skip
          </button>
          <button className="flex-1 h-8 bg-[#1A5C38] text-white text-xs font-medium rounded-md cursor-default">
            Send invites
          </button>
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "Install Extension",
    badge: "Ready",
    targetY: 34,
    childCard: (
      <div className="bg-white rounded-t-2xl rounded-b-xl p-6 max-w-[320px] w-full h-fit space-y-3 font-sans transform translate-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">PROTECTED DEVICES</span>
          <span className="text-[9px] font-mono text-[#1A5C38] font-semibold">2 Active</span>
        </div>

        {/* Device 1 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <LaptopIcon size={13} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-900 block leading-tight">MacBook Pro (Chrome)</span>
              <span className="text-[9px] text-gray-400 block mt-0.5">Jay Jay</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-green-50/60 border border-green-100 text-[#1A5C38]">
            <span className="w-1 h-1 rounded-full bg-[#1A5C38]" />
            Online
          </span>
        </div>

        {/* Device 2 */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
              <LaptopIcon size={13} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-900 block leading-tight">Dell XPS (Chrome)</span>
              <span className="text-[9px] text-gray-400 block mt-0.5">Sarah Jenkins</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-green-50/60 border border-green-100 text-[#1A5C38]">
            <span className="w-1 h-1 rounded-full bg-[#1A5C38]" />
            Online
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[9px] text-gray-400 font-mono">
          <span>Policy Engine: Synced</span>
          <span>v1.4.2</span>
        </div>
      </div>
    ),
  },
  {
    step: "04",
    title: "Protection Starts Immediately",
    badge: "Live",
    targetY: 34,
    childCard: (
      <div className="bg-white rounded-t-2xl rounded-b-xl p-6 max-w-[320px] w-full h-fit space-y-3 font-sans transform translate-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">RECENT INTERCEPTIONS</span>
          <span className="text-[9px] font-mono text-[#1A5C38] font-semibold">Live Redact</span>
        </div>

        {/* Interception 1 */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 text-[11px]">Jay Jay</span>
              <span className="inline-flex items-center">
                <PlatformIcon platform="chatgpt" size={12} className="mr-1" />
                <span className="text-[8px] font-mono text-gray-400 uppercase bg-gray-50 border border-gray-100 px-1 py-0.2 rounded-sm">
                  CHATGPT
                </span>
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Just now</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="text-[10px]">Redacted:</span>
            <span className="font-mono text-[9px] font-semibold text-[#1A5C38] bg-green-50/60 border border-green-100 px-1.5 py-0.2 rounded-sm">
              2 ENTITIES
            </span>
          </div>
        </div>

        {/* Interception 2 */}
        <div className="space-y-2 text-xs pt-2 border-t border-gray-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 text-[11px]">Sarah J</span>
              <span className="inline-flex items-center">
                <PlatformIcon platform="claude" size={12} className="mr-1" />
                <span className="text-[8px] font-mono text-gray-400 uppercase bg-gray-50 border border-gray-100 px-1 py-0.2 rounded-sm">
                  CLAUDE
                </span>
              </span>
            </div>
            <span className="text-[10px] text-gray-400">2m ago</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="text-[10px]">Redacted:</span>
            <span className="font-mono text-[9px] font-semibold text-[#1A5C38] bg-green-50/60 border border-green-100 px-1.5 py-0.2 rounded-sm">
              1 API KEY
            </span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Onboarding() {
  return (
    <section className="py-28 px-4 sm:px-6 bg-white font-sans" id="onboarding">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 max-w-2xl mx-auto space-y-3"
        >
          <h2 className="text-[32px] sm:text-[38px] md:text-[42px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.08]">
            Deploy across your team in minutes.
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
            Create your workspace, invite your team, install the extension, and every AI prompt is protected automatically.
          </p>
        </motion.div>

        {/* 2x2 DEPLOYMENT JOURNEY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {DEPLOYMENT_CARDS.map((card, i) => (
            <div key={card.title} className="flex flex-col">
              
              {/* PARENT PALE GREEN CONTAINER (#F2F8F4) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F2F8F4] rounded-[24px] p-6 sm:p-7 h-[310px] overflow-hidden relative flex flex-col justify-between"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-[#1A5C38] uppercase font-bold">
                      STEP {card.step}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-950 tracking-tight">
                      {card.title}
                    </h3>
                  </div>

                  <span className="bg-white text-[#1A5C38] text-[10px] font-mono font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    {card.badge === "Live" && <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38] animate-pulse" />}
                    <span>{card.badge}</span>
                  </span>
                </div>

                {/* CHILD INNER WHITE CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: card.targetY }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex justify-center"
                >
                  {card.childCard}
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
