"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Key,
  Users,
  FileText,
  LockKey,
  Pulse,
  SquaresFour,
  Desktop,
  Gear,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { PlatformIcon } from "@/components/ui/ModelLogos";

export default function DashboardPreview() {
  const recentItems = [
    { id: "1", user: "Jay Jay", platform: "gemini", tag: "GEMINI", redaction: "1 NAME", time: "2d ago" },
    { id: "2", user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "1 NAME", time: "2d ago" },
    { id: "3", user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "2 NAME", time: "3d ago" },
    { id: "4", user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "2 NAME", time: "3d ago" },
    { id: "5", user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "3 NAME", time: "3d ago" },
  ];

  const platformShareList = [
    { name: "ChatGPT", share: "74%", barColor: "bg-[#1A5C38]", sharePct: 74, url: "chatgpt.com" },
    { name: "Claude AI", share: "16%", barColor: "bg-[#45A373]", sharePct: 16, url: "claude.com" },
    { name: "Google Gemini", share: "11%", barColor: "bg-[#7ECBA1]", sharePct: 11, url: "gemini.com" },
  ];

  const protectedFeaturePills = [
    { icon: ShieldCheck, label: "PII Redaction" },
    { icon: Key, label: "API Credentials" },
    { icon: Users, label: "Customer Data" },
    { icon: FileText, label: "Sensitive Contracts" },
    { icon: Pulse, label: "Device Telemetry" },
    { icon: LockKey, label: "Edge Boundaries" },
  ];

  return (
    <section className="py-32 px-6 bg-white font-sans" id="dashboard">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-xl mx-auto space-y-3"
        >
          <h2 className="text-[32px] md:text-[40px] font-semibold text-gray-950 tracking-[-0.03em] leading-[1.08]">
            Visibility without surveillance.
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed font-normal">
            See protection metadata, never prompts. The dashboard shows counts, not content.
          </p>
        </motion.div>

        {/* HORIZONTALLY OVERFLOWING MOBILE CONTAINER FOR DASHBOARD PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200"
        >
          <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden min-h-[680px] flex flex-col min-w-[800px] md:min-w-full">
            {/* Top Window Chrome Bar */}
            <div className="bg-[#e8e8e8] px-4 py-2.5 flex items-center justify-between border-b border-gray-200/80">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="bg-white/90 px-4 py-1 rounded-md border border-gray-300/60 text-[11px] font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                https://myarkn.ai/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Inner Dashboard Layout */}
            <div className="flex flex-1 bg-white text-gray-900 font-sans text-left">
              
              {/* Left Sidebar */}
              <div className="w-56 border-r border-gray-100 p-4 flex flex-col justify-between shrink-0 bg-white">
                <div className="space-y-6">
                  {/* Org Identity Block */}
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="w-6 h-6 rounded bg-[#1A5C38] flex items-center justify-center text-white font-bold text-[11px]">
                      A
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">Arkn Enterprise</h4>
                    </div>
                  </div>

                  {/* Sidebar Navigation */}
                  <nav className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-gray-100/70 text-gray-900 font-semibold text-xs">
                      <SquaresFour size={16} className="text-gray-700" weight="bold" />
                      <span>Overview</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                      <Users size={16} className="text-gray-400" />
                      <span>Members</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                      <Desktop size={16} className="text-gray-400" />
                      <span>Devices</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                      <ShieldCheck size={16} className="text-gray-400" />
                      <span>Policies</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                      <FileText size={16} className="text-gray-400" />
                      <span>Reports</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                      <Gear size={16} className="text-gray-400" />
                      <span>Settings</span>
                    </div>
                  </nav>
                </div>

                {/* Sidebar Footer User Info */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 px-1">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    JS
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-900 truncate">John Smith</p>
                    <p className="text-[10px] text-gray-400 truncate">john@myarkn.ai</p>
                  </div>
                </div>
              </div>

              {/* Main Content Workspace Canvas */}
              <div className="flex-1 p-8 space-y-10 bg-white overflow-hidden">
                
                {/* Header Title Block */}
                <div className="flex justify-between items-end border-b border-gray-100 pb-5">
                  <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                      Your workspace's AI protection activity
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">
                      Real-time protection stats for Arkn Enterprise
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-0.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-semibold text-gray-550">
                    <span className="px-3 py-1 rounded-md text-gray-500 cursor-pointer">Today</span>
                    <span className="px-3 py-1 rounded-md bg-white text-gray-900 border border-gray-100 font-semibold cursor-pointer">7d</span>
                    <span className="px-3 py-1 rounded-md text-gray-500 cursor-pointer">30d</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">PROTECTION ACTIVITY</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">19</span>
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">prompts</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">SENSITIVE INFO PROTECTED</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">27</span>
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">entities</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">ACTIVE MEMBERS</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">2</span>
                      <span className="text-xs text-gray-400 font-medium">seats</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">PROTECTED DEVICES</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">2</span>
                      <span className="text-xs text-gray-400 font-medium">clients</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Core Layout Split */}
                <div className="grid grid-cols-3 gap-10">
                  
                  {/* Left Column: Recent Activity Logs */}
                  <div className="col-span-2 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-450">Recent Interceptions</h2>
                    
                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100 min-h-[240px] flex flex-col justify-start">
                      {recentItems.map((activity) => (
                        <div key={activity.id} className="py-3 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{activity.user}</span>
                              <span className="inline-flex items-center">
                                <PlatformIcon platform={activity.platform} size={13} className="mr-1" />
                                <span className="text-[9px] font-mono text-gray-400 uppercase bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">
                                  {activity.tag}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <span>Redacted:</span>
                              <div className="flex flex-wrap gap-1">
                                <span className="font-mono text-[9px] font-semibold text-green-750 bg-green-50/50 border border-green-100 px-1.5 py-0.2 rounded-sm">
                                  {activity.redaction}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-[11px]">{activity.time}</span>
                            <span className="text-gray-400 p-1 cursor-pointer">
                              <ArrowUpRight size={13} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: AI Platforms Share Of Voice */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-450">AI Search Share Of Voice</h2>
                    
                    <div className="min-h-[240px] flex flex-col justify-center items-center w-full bg-white border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-around items-end gap-3 w-full pt-1">
                        {platformShareList.map((platform) => (
                          <div key={platform.name} className="flex flex-col items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-800">
                              {platform.share}
                            </span>

                            <div className="w-12 h-32 bg-gray-100/60 rounded-xl overflow-hidden relative flex flex-col justify-end">
                              <div
                                className={`w-full rounded-b-xl transition-all duration-500 ease-out ${platform.barColor}`}
                                style={{ height: platform.share }}
                              />
                            </div>

                            <div className="flex flex-col items-center gap-1 mt-1">
                              <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                <PlatformIcon platform={platform.name} size={13} />
                              </div>
                              <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[65px] text-center">
                                {platform.url}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </motion.div>

        {/* Bottom Horizontal Feature Pills Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {protectedFeaturePills.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[12px] font-medium text-gray-800 flex items-center gap-2.5 cursor-default"
              >
                <Icon size={13} weight="bold" className="text-[#1A5C38]" />
                <span>{pill.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom Helper Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-[13px] text-gray-400"
        >
          Counts and protection types only. Zero raw text. Zero PII stored.
        </motion.p>

      </div>
    </section>
  );
}
