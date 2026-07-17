"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Shell from "@/components/layout/Shell";
import { createClient } from "@/utils/supabase/client";
import { PlatformIcon } from "@/components/ui/ModelLogos";

interface RecentActivity {
  id: string;
  user: string;
  platform: string;
  redactions: Record<string, number>;
  time: string;
}

interface PlatformShare {
  name: string;
  count: number;
  share: string;
}

export default function DashboardOverviewPage() {
  const [timeframe, setTimeframe] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("your organisation");
  const [stats, setStats] = useState({
    messagesCount: 0,
    piiCount: 0,
    membersCount: 0,
    devicesCount: 0,
  });
  const [platforms, setPlatforms] = useState<PlatformShare[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    document.title = "ARKN • Dashboard";

    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("organization_id, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (memError || !membership) {
          setLoading(false);
          return;
        }
        const orgId = membership.organization_id;
        const userRole = membership.role || "member";

        // Fetch org profile
        const { data: orgData } = await supabase
          .from("organizations")
          .select("name")
          .eq("id", orgId)
          .maybeSingle();

        if (orgData) {
          setOrgName(orgData.name);
        }

        // Calculate time filter boundaries based on timeframe state
        const now = new Date();
        let startDateStr = "";
        if (timeframe === "24h") {
          startDateStr = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        } else if (timeframe === "7d") {
          startDateStr = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (timeframe === "30d") {
          startDateStr = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        }

        // Scope: members see only their own telemetry, owners/admins see all
        let telQuery = supabase.from("telemetry").select("pii_counts, platform, event_at, devices(device_name, user_id)").eq("organization_id", orgId);
        let countQuery = supabase.from("telemetry").select("*", { count: "exact", head: true }).eq("organization_id", orgId);

        if (userRole === "member") {
          const { data: myDevices } = await supabase
            .from("devices")
            .select("id")
            .eq("user_id", user.id)
            .eq("organization_id", orgId);

          const deviceIds = (myDevices || []).map((d) => d.id);
          if (deviceIds.length > 0) {
            telQuery = telQuery.in("device_id", deviceIds);
            countQuery = countQuery.in("device_id", deviceIds);
          }
        }

        if (startDateStr) {
          telQuery = telQuery.gte("event_at", startDateStr);
          countQuery = countQuery.gte("event_at", startDateStr);
        }

        // Fetch totals
        let membersQuery = supabase
          .from("memberships")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId);

        let devicesQuery = supabase
          .from("devices")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", orgId);

        // Members see their own device count, not org-wide
        if (userRole === "member") {
          devicesQuery = devicesQuery.eq("user_id", user.id);
        }

        const [
          { count: messagesCount },
          { count: membersCount },
          { count: devicesCount },
          { data: telData }
        ] = await Promise.all([
          countQuery,
          membersQuery,
          devicesQuery,
          telQuery
        ]);

        // Calculate total redacted entities sum
        let totalRedacted = 0;
        const platformCounts: Record<string, number> = { chatgpt: 0, claude: 0, gemini: 0 };
        let totalMessages = telData ? telData.length : 0;

        if (telData) {
          telData.forEach((row: any) => {
            const cMap = row.pii_counts || {};
            Object.values(cMap).forEach((cnt: any) => {
              totalRedacted += Number(cnt || 0);
            });

            const pKey = String(row.platform || "").toLowerCase();
            if (pKey in platformCounts) {
              platformCounts[pKey] += 1;
            }
          });
        }

        setStats({
          messagesCount: messagesCount || 0,
          piiCount: totalRedacted,
          membersCount: membersCount || 0,
          devicesCount: devicesCount || 0,
        });

        // Platform Breakdown (ChatGPT, Claude, Gemini ordered consistently)
        const mappedPlatforms = [
          {
            name: "ChatGPT",
            count: platformCounts.chatgpt,
            share: totalMessages > 0 ? `${Math.round((platformCounts.chatgpt / totalMessages) * 100)}%` : "0%",
          },
          {
            name: "Claude AI",
            count: platformCounts.claude,
            share: totalMessages > 0 ? `${Math.round((platformCounts.claude / totalMessages) * 100)}%` : "0%",
          },
          {
            name: "Google Gemini",
            count: platformCounts.gemini,
            share: totalMessages > 0 ? `${Math.round((platformCounts.gemini / totalMessages) * 100)}%` : "0%",
          },
        ];

        setPlatforms(mappedPlatforms);

        // Fetch recent activities
        if (telData) {
          // Collect unique user_ids from telemetry to resolve names
          const userIds = [...new Set(telData.map((t: any) => t.devices?.user_id).filter(Boolean))];
          const { data: userProfiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);
          const nameMap: Record<string, string> = {};
          if (userProfiles) {
            userProfiles.forEach((p: any) => { nameMap[p.id] = p.full_name; });
          }

          const sorted = [...telData]
            .sort((a, b) => new Date(b.event_at).getTime() - new Date(a.event_at).getTime())
            .slice(0, 5);

          const mappedActivity: RecentActivity[] = sorted.map((activity: any, index: number) => {
            const lastSeenDate = new Date(activity.event_at);
            const diffMs = Date.now() - lastSeenDate.getTime();
            const diffMins = Math.max(1, Math.floor(diffMs / 60000));
            
            let timeStr = "1m ago";
            if (diffMins < 60) {
              timeStr = `${diffMins}m ago`;
            } else if (diffMins < 1440) {
              timeStr = `${Math.floor(diffMins / 60)}h ago`;
            } else {
              timeStr = `${Math.floor(diffMins / 1440)}d ago`;
            }

            const device = activity.devices || {};
            const uid = device.user_id;
            const userStr = uid === user.id
              ? "You"
              : (nameMap[uid] || `User (${String(uid || "Unregistered").slice(0, 5)})`);

            return {
              id: String(index),
              user: userStr,
              platform: activity.platform,
              redactions: activity.pii_counts || {},
              time: timeStr,
            };
          });

          setRecentActivity(mappedActivity);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard overview:", err);
        setLoading(false);
      }
    }
    loadData();
  }, [timeframe]);

  const defaultPlatforms = [
    { name: "ChatGPT", share: "0%" },
    { name: "Claude AI", share: "0%" },
    { name: "Google Gemini", share: "0%" }
  ];

  const platformList = platforms.length > 0 ? platforms : defaultPlatforms;

  return (
    <Shell>
      <div className="space-y-12 animate-fade-in max-w-6xl font-sans">
        {/* Header Block */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Your workspace's AI protection activity</h1>
            <p className="text-xs text-gray-500 font-medium">Real-time protection stats for {orgName}</p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-semibold text-gray-550">
            <button
              onClick={() => setTimeframe("24h")}
              className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                timeframe === "24h" ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-100/50"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                timeframe === "7d" ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-100/50"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeframe("30d")}
              className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                timeframe === "30d" ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-100/50"
              }`}
            >
              30d
            </button>
          </div>
        </div>

        {/* Stats Grid - Flat Clean borderless style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {/* Stat 1 */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Protection Activity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                {loading ? (
                  <div className="h-7 w-12 bg-gray-100 animate-pulse rounded mt-1" />
                ) : (
                  stats.messagesCount
                )}
              </span>
              {!loading && <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">prompts</span>}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sensitive Info Protected</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                {loading ? (
                  <div className="h-7 w-12 bg-gray-100 animate-pulse rounded mt-1" />
                ) : (
                  stats.piiCount
                )}
              </span>
              {!loading && <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">entities</span>}
            </div>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Members</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                {loading ? (
                  <div className="h-7 w-12 bg-gray-100 animate-pulse rounded mt-1" />
                ) : (
                  stats.membersCount
                )}
              </span>
              <span className="text-xs text-gray-400 font-medium">seats</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Protected Devices</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                {loading ? (
                  <div className="h-7 w-12 bg-gray-100 animate-pulse rounded mt-1" />
                ) : (
                  stats.devicesCount
                )}
              </span>
              <span className="text-xs text-gray-400 font-medium">clients</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Core Layout Split - Borderless */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Recent Activity Logs */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-450">Recent Interceptions</h2>
            <div className="divide-y divide-gray-100 border-t border-b border-gray-100 min-h-[250px] flex flex-col justify-start">
              {loading ? (
                <div className="space-y-4 w-full flex-1">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex justify-between py-3 border-b border-gray-50 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-3 w-28 bg-gray-100 rounded" />
                        <div className="h-2.5 w-40 bg-gray-50 rounded" />
                      </div>
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 my-auto space-y-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="space-y-1 max-w-[280px]">
                    <h3 className="text-xs font-semibold text-gray-900">All conversations secured</h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      When members of your workspace chat with generative AI models, real-time protection logs will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{activity.user}</span>
                        <span className="inline-flex items-center">
                          <PlatformIcon platform={activity.platform} size={13} className="mr-1" />
                          <span className="text-[9px] font-mono text-gray-400 uppercase bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">
                            {activity.platform}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span>Redacted:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(activity.redactions).map(([type, count]) => (
                            <span
                              key={type}
                              className="font-mono text-[9px] font-semibold text-green-750 bg-green-50/50 border border-green-100 px-1.5 py-0.2 rounded-sm"
                            >
                              {count} {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{activity.time}</span>
                      <Link
                        href="/dashboard/reports"
                        className="text-gray-400 hover:text-[#1A5C38] transition-colors p-1"
                        title="View full report"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: AI Platforms Share Of Voice (Visual vertical columns) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-450">AI Search Share Of Voice</h2>
            <div className="min-h-[250px] flex flex-col justify-center items-center w-full bg-white border border-gray-100 rounded-lg p-5">
              {loading ? (
                <div className="flex gap-6 animate-pulse items-end h-40">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex flex-col items-center gap-2">
                      <div className="h-4 w-8 bg-gray-100 rounded" />
                      <div className="w-12 h-28 bg-gray-50 rounded-xl" />
                      <div className="w-7 h-7 bg-gray-100 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-around items-end gap-4 w-full pt-2">
                  {platformList.map((platform) => {
                    const sharePct = parseInt(platform.share) || 0;
                    
                    // Specific brand bar color matching with custom forest-green based palette
                    let barColor = "bg-slate-200"; // default grey bar for 0%
                    if (sharePct > 0) {
                      if (platform.name.includes("ChatGPT")) barColor = "bg-[#1A5C38]"; // signature forest green
                      else if (platform.name.includes("Claude")) barColor = "bg-[#45A373]"; // bright sage green
                      else if (platform.name.includes("Gemini")) barColor = "bg-[#7ECBA1]"; // soft mint green
                    }

                    return (
                      <div key={platform.name} className="flex flex-col items-center gap-2.5">
                        {/* 1. Value above column */}
                        <span className="font-mono text-xs font-bold text-gray-800">
                          {platform.share}
                        </span>

                        {/* 2. Vertical bar column track */}
                        <div className="w-14 h-36 bg-gray-100/60 rounded-xl overflow-hidden relative flex flex-col justify-end">
                          <div
                            className={`w-full rounded-b-xl transition-all duration-500 ease-out ${barColor}`}
                            style={{ height: `${sharePct}%` }}
                          />
                        </div>

                        {/* 3. Logo and Label below */}
                        <div className="flex flex-col items-center gap-1.5 mt-1">
                          <div className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                            <PlatformIcon platform={platform.name} size={14} />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[70px] text-center">
                            {platform.name.replace(" AI", "").replace("Google ", "").toLowerCase() + ".com"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
