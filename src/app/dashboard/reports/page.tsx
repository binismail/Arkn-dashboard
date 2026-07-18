"use client";

import React, { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { DownloadIcon, ShieldIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import Select from "@/components/ui/Select";
import { PlatformIcon } from "@/components/ui/ModelLogos";

interface TelemetryRecord {
  id: string;
  date: string;
  user: string;
  platform: string;
  emails: number;
  names: number;
  phones: number;
  total: number;
}

export default function ReportsPage() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [records, setRecords] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "ARKN • Reports";

    async function loadReports() {
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
        const userRole = membership.role || "member";

        // Scope: members see only their own reports, admins/owners see all
        let telQuery = supabase
          .from("telemetry")
          .select(`
            id,
            platform,
            event_at,
            pii_counts,
            devices(
              device_name,
              user_id
            )
          `)
          .eq("organization_id", membership.organization_id)
          .order("event_at", { ascending: false });

        if (userRole === "member") {
          const { data: myDevices } = await supabase
            .from("devices")
            .select("id")
            .eq("user_id", user.id)
            .eq("organization_id", membership.organization_id);

          const deviceIds = (myDevices || []).map((d) => d.id);
          if (deviceIds.length > 0) {
            telQuery = telQuery.in("device_id", deviceIds);
          } else {
            // No devices — force empty result instead of showing org-wide data
            telQuery = telQuery.is("device_id", null);
          }
        }

        const { data: telemetry, error: telError } = await telQuery;

        if (telError) {
          console.error("Error fetching telemetry:", telError);
          setLoading(false);
          return;
        }

        if (telemetry) {
          // Resolve user names from profiles for all unique user_ids
          const userIds = [...new Set(telemetry.map((t: any) => t.devices?.user_id).filter(Boolean))];
          const { data: userProfiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);
          const nameMap: Record<string, string> = {};
          if (userProfiles) {
            userProfiles.forEach((p: any) => { nameMap[p.id] = p.full_name; });
          }

          const mapped = telemetry.map((t: any) => {
            const device = t.devices || {};
            const uid = device.user_id;
            const deviceOwner = uid === user.id
              ? (user.user_metadata?.full_name || "You")
              : (nameMap[uid] || `User (${String(uid || "Unregistered").slice(0, 5)})`);
            
            const counts = t.pii_counts || {};
            const emailCount = Number(counts.EMAIL || 0);
            const nameCount = Number(counts.NAME || 0) + Number(counts.ORG || 0);
            const phoneCount = Number(counts.PHONE || 0) + Number(counts.POSTCODE || 0) + Number(counts.NINO || 0);
            const totalCount = Object.values(counts).reduce((a: number, b: any) => a + Number(b || 0), 0);

            const userStr = device.device_name ? `${deviceOwner} (${device.device_name})` : deviceOwner;

            return {
              id: t.id,
              date: new Date(t.event_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              user: userStr,
              platform: t.platform,
              emails: emailCount,
              names: nameCount,
              phones: phoneCount,
              total: totalCount,
            };
          });

          setRecords(mapped);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading telemetry logs:", err);
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleExport = () => {
    if (records.length === 0) return;
    setExporting(true);

    try {
      // Convert records to simple CSV content
      const headers = ["Event Date", "Member", "AI Platform", "Names Blocked", "Emails Blocked", "Phones Blocked", "Total PII Items"];
      const rows = records.map(r => [
        r.date,
        r.user,
        r.platform,
        r.names,
        r.emails,
        r.phones,
        r.total
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `arkn_protection_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      triggerToast("CSV Ledger exported successfully.");
      setExporting(false);
    } catch (e: any) {
      triggerToast(`Export failed: ${e.message}`);
      setExporting(false);
    }
  };

  const filtered = platformFilter === "all" 
    ? records 
    : records.filter(r => String(r.platform).toLowerCase() === platformFilter);

  return (
      <div className="space-y-8 animate-fade-in max-w-6xl font-sans">
        {/* Title */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Protection Reports</h1>
            <p className="text-xs text-gray-500">Generate exportable ledgers proving protection activity</p>
          </div>

          <button
            onClick={handleExport}
            className="btn-primary bg-[#1A5C38] hover:bg-[#113f25] border-none flex items-center gap-1.5"
            disabled={records.length === 0 || exporting}
          >
            {exporting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <DownloadIcon size={14} />
                <span>Export CSV Ledger</span>
              </>
            )}
          </button>
        </div>

        {/* Floating Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#1A5C38] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filters Inline */}
        <div className="flex items-center justify-between gap-4 text-xs bg-gray-50/50 border border-gray-100 rounded-lg p-3 px-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Filter Platform:</span>
            <Select
              value={platformFilter}
              onChange={setPlatformFilter}
              options={[
                { value: "all", label: "All Platforms" },
                { value: "chatgpt", label: "ChatGPT" },
                { value: "claude", label: "Claude AI" },
                { value: "gemini", label: "Google Gemini" },
              ]}
              className="w-40"
            />
          </div>

          <div className="text-gray-400 font-medium">
            Retention: 30 days
          </div>
        </div>

        {/* Reports Table */}
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white min-h-[250px] flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-5">Event Date</th>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-5">Platform</th>
                <th className="py-3 px-5 text-center">Names</th>
                <th className="py-3 px-5 text-center">Emails</th>
                <th className="py-3 px-5 text-center">Phones</th>
                <th className="py-3 px-5 text-right">Sensitive Info Blocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700 flex-1">
              {loading ? (
                /* Skeleton Loader rows */
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="h-3 w-28 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3.5 w-16 bg-gray-100 rounded-sm" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="h-3 w-6 bg-gray-50 rounded inline-block" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="h-3 w-6 bg-gray-50 rounded inline-block" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="h-3 w-6 bg-gray-50 rounded inline-block" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="h-3.5 w-14 bg-gray-100 rounded inline-block" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No protection logs recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="py-4 px-5 text-gray-400 font-medium">{record.date}</td>
                    <td className="py-4 px-5 font-semibold text-gray-900">{record.user}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1">
                        <PlatformIcon platform={record.platform} size={14} />
                        <span className="text-[9px] font-semibold text-gray-500 uppercase bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-sm">
                          {record.platform}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center font-mono text-gray-600 font-medium">{record.names}</td>
                    <td className="py-4 px-5 text-center font-mono text-gray-600 font-medium">{record.emails}</td>
                    <td className="py-4 px-5 text-center font-mono text-gray-600 font-medium">{record.phones}</td>
                    <td className="py-4 px-5 text-right font-semibold text-gray-950 font-mono">
                      {record.total} items
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Warning Note */}
        <div className="flex items-start gap-3 text-xs border-t border-gray-100 pt-5 leading-normal">
          <ShieldIcon size={15} className="text-[#1A5C38] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-900">Zero-data retention guarantee</h4>
            <p className="text-gray-400">
              We do not store, view, or transit prompt contents or sensitive text. This ledger contains only aggregated volume metrics to confirm organisation-wide compliance.
            </p>
          </div>
        </div>
      </div>
  );
}
