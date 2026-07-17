"use client";

import React, { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { LaptopIcon, HelpCircleIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { createPortal } from "react-dom";

interface Device {
  id: string;
  name: string;
  user: string;
  browser: string;
  os: string;
  version: string;
  status: string;
  lastSeen: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [deviceToRevoke, setDeviceToRevoke] = useState<Device | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "ARKN • Protected Devices";
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadDevices() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: membership, error: memError } = await supabase
          .from("memberships")
          .select("organization_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (memError || !membership) {
          setLoading(false);
          return;
        }
        setOrgId(membership.organization_id);

        const { data: dbDevices, error: devError } = await supabase
          .from("devices")
          .select("id, device_name, browser, os, extension_version, last_seen_at, user_id")
          .eq("organization_id", membership.organization_id);

        if (devError) {
          console.error("Error fetching devices:", devError);
          setLoading(false);
          return;
        }

        if (dbDevices) {
          // Resolve user names from profiles
          const deviceUserIds = [...new Set(dbDevices.map((d) => d.user_id).filter(Boolean))];
          const { data: deviceProfiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", deviceUserIds);
          const nameMap: Record<string, string> = {};
          if (deviceProfiles) {
            deviceProfiles.forEach((p: any) => { nameMap[p.id] = p.full_name; });
          }

          const mappedDevices: Device[] = dbDevices.map((d) => {
            const lastSeenDate = new Date(d.last_seen_at);
            const diffMs = Date.now() - lastSeenDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            
            let lastSeenStr = "Just now";
            let isOnline = true;
            
            if (diffMins >= 10) {
              isOnline = false;
              if (diffMins < 60) {
                lastSeenStr = `${diffMins}m ago`;
              } else if (diffMins < 1440) {
                lastSeenStr = `${Math.floor(diffMins / 60)}h ago`;
              } else {
                lastSeenStr = `${Math.floor(diffMins / 1440)}d ago`;
              }
            }

            const uid = d.user_id;
            return {
              id: d.id,
              name: d.device_name || "Unknown Browser Install",
              user: uid === user.id ? (user.user_metadata?.full_name || "You") : (nameMap[uid] || `User (${d.user_id.slice(0, 5)})`),
              browser: d.browser || "Unknown Browser",
              os: d.os || "Unknown OS",
              version: d.extension_version || "0.1.0",
              status: isOnline ? "online" : "offline",
              lastSeen: lastSeenStr,
            };
          });

          setDevices(mappedDevices);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading devices:", err);
        setLoading(false);
      }
    }
    loadDevices();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleRevoke = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("devices")
        .delete()
        .eq("id", id);

      if (error) {
        triggerToast(`Failed to revoke connection: ${error.message}`);
      } else {
        setDevices(devices.filter((dev) => dev.id !== id));
        triggerToast("Connection revoked. Device disabled.");
      }
    } catch (err: any) {
      triggerToast(err.message || "An error occurred.");
    }
  };

  return (
    <Shell>
      <div className="space-y-8 animate-fade-in max-w-6xl font-sans">
        {/* Title */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Protected Devices</h1>
            <p className="text-xs text-gray-500">Manage active extension installations and secure connections</p>
          </div>
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

        {/* Device table */}
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white min-h-[250px] flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-5 w-1/3">Device Name</th>
                <th className="py-3 px-5">Active User</th>
                <th className="py-3 px-5">Environment</th>
                <th className="py-3 px-5">Version</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700 flex-1">
              {loading ? (
                /* Skeleton rows */
                [1, 2].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-gray-100 rounded-sm shrink-0" />
                        <div className="space-y-1">
                          <div className="h-3 w-28 bg-gray-100 rounded" />
                          <div className="h-2 w-20 bg-gray-50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="h-3 w-12 bg-gray-100 rounded" />
                        <div className="h-2 w-10 bg-gray-50 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-2.5 w-10 bg-gray-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="h-4 w-14 bg-gray-100 rounded-full" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="h-3 w-12 bg-gray-100 rounded inline-block" />
                    </td>
                  </tr>
                ))
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No active browser extension devices registered.
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50/20 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0 shadow-none">
                          <LaptopIcon size={13} />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block leading-tight">{device.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-medium">Last active: {device.lastSeen}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-800">{device.user}</td>
                    <td className="py-4 px-5 text-gray-600">
                      <div className="space-y-0.5">
                        <span className="block leading-tight text-xs font-medium">{device.browser}</span>
                        <span className="text-[10px] text-gray-400 block font-medium">{device.os}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-400 font-mono text-[11px]">v{device.version}</td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          device.status === "online"
                            ? "bg-green-50/50 border-green-155 text-green-755"
                            : "bg-gray-50/50 border-gray-155 text-gray-500"
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${device.status === "online" ? "bg-green-600" : "bg-gray-400"}`} />
                        {device.status === "online" ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setDeviceToRevoke(device)}
                        className="text-red-650 hover:text-red-700 font-semibold cursor-pointer transition-colors animate-fade-in"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tip section */}
        <div className="flex items-start gap-3 text-xs border-t border-gray-100 pt-5">
          <HelpCircleIcon size={15} className="text-gray-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-normal">
            <h4 className="font-semibold text-gray-900">How protected devices connect</h4>
            <p className="text-gray-400">
              Each user registers their browser extension automatically when connecting to the workspace. Revoking a connection immediately stops policy updates and data synchronization.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Dialog Portal */}
      {deviceToRevoke && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 w-full max-w-[400px] rounded-lg p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Revoke connection</h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Are you sure you want to revoke this connection? The extension on <strong>{deviceToRevoke.name}</strong> will immediately stop receiving policy updates and data synchronisation.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeviceToRevoke(null)}
                className="flex-1 btn-secondary h-9 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRevoke(deviceToRevoke.id);
                  setDeviceToRevoke(null);
                }}
                className="flex-1 btn-primary h-9 text-xs bg-red-600 hover:bg-red-700 border-none text-white font-semibold cursor-pointer"
              >
                Revoke connection
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Shell>
  );
}
