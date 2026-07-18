"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { createClient } from "@/utils/supabase/client";
import { createPortal } from "react-dom";
import Select from "@/components/ui/Select";

export default function PoliciesPage() {
  const [threshold, setThreshold] = useState(0.7);
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("member");
  const [customRules, setCustomRules] = useState<any[]>([]);
  const [hasCustomRulesCol, setHasCustomRulesCol] = useState(false);

  const [piiTypes, setPiiTypes] = useState([
    { type: "EMAIL", label: "Email Addresses", desc: "Redacts standard work & personal email patterns", enabled: true },
    { type: "PHONE", label: "Phone Numbers", desc: "Redacts UK mobile & landline numbers", enabled: true },
    { type: "POSTCODE", label: "UK Postcodes", desc: "Redacts postal codes e.g. SW1A 1AA", enabled: true },
    { type: "NINO", label: "National Insurance Numbers", desc: "Redacts UK NINO identifiers", enabled: true },
    { type: "DRIVELIC", label: "Driving Licenses", desc: "Redacts UK driving license strings", enabled: true },
    { type: "NHS", label: "NHS Numbers", desc: "Redacts 10-digit NHS numbers with modulo-11 validation", enabled: true },
    { type: "BANK", label: "UK Bank Details", desc: "Redacts sort codes and bank accounts", enabled: true },
    { type: "CLAIM", label: "Court Claim Numbers", desc: "Redacts civil/family court references", enabled: true },
    { type: "NAME", label: "Personal Names", desc: "Redacts first/last names via context engine", enabled: true },
    { type: "ORG", label: "Organizations / Firms", desc: "Redacts corporate names and entities", enabled: true },
  ]);

  useEffect(() => {
    document.title = "ARKN • Protection Rules";
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("arkn_user_role") || "member");
    }
  }, []);

  useEffect(() => {
    async function loadPolicy() {
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
          setPageLoading(false);
          return;
        }
        setOrgId(membership.organization_id);

        const { data: policy, error: polError } = await supabase
          .from("policies")
          .select("*")
          .eq("organization_id", membership.organization_id)
          .maybeSingle();

        if (polError) {
          setPageLoading(false);
          return;
        }

        if (policy) {
          setThreshold(Number(policy.confidence_threshold));
          if (policy.enabled_types) {
            setPiiTypes((types) =>
              types.map((t) => ({
                ...t,
                enabled: policy.enabled_types[t.type] !== false,
              }))
            );
          }
          if ("custom_rules" in policy) {
            setHasCustomRulesCol(true);
            if (Array.isArray(policy.custom_rules)) {
              setCustomRules(policy.custom_rules);
            }
          }
        }
        setPageLoading(false);
      } catch (err) {
        console.error("Error loading policy:", err);
        setPageLoading(false);
      }
    }
    loadPolicy();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleToggle = (type: string) => {
    if (userRole === "member") return;
    setPiiTypes(
      piiTypes.map((item) =>
        item.type === type ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = async () => {
    if (!orgId || userRole === "member") return;
    setSaving(true);

    try {
      const enabledMap = piiTypes.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.type]: curr.enabled,
        }),
        {}
      );

      const updatePayload: any = {
        confidence_threshold: threshold,
        enabled_types: enabledMap,
      };
      if (hasCustomRulesCol) {
        updatePayload.custom_rules = customRules;
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("policies")
        .update(updatePayload)
        .eq("organization_id", orgId);

      setSaving(false);
      if (error) {
        triggerToast(`Failed to save rules: ${error.message}`);
      } else {
        triggerToast("Protection rules updated. Your team will automatically receive the latest configuration.");
        // Trigger instant extension synchronization
        if (typeof window !== "undefined") {
          window.postMessage({ type: "ARKN_POLICY_UPDATED_SYNC" }, "*");
        }
      }
    } catch (err: any) {
      triggerToast(err.message || "An unexpected error occurred.");
      setSaving(false);
    }
  };

  const isAdmin = userRole !== "member";

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl font-sans">
        {/* Header Block */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Protection Rules</h1>
            <p className="text-xs text-gray-500">Configure real-time redaction rules for your organisation</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="btn-primary bg-[#1A5C38] hover:bg-[#113f25] border-none flex items-center justify-center gap-1.5"
              disabled={saving || !orgId || !isAdmin}
            >
              {saving && (
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {saving ? "Updating protection rules..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* Floating Success Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#1A5C38] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Read-only Alert Banner */}
        {!isAdmin && !pageLoading && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-xs text-amber-800 leading-normal flex items-start gap-2.5 mb-6 animate-in fade-in slide-in-from-top-1 duration-150 shadow-none">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-semibold block text-amber-900">Read-only permissions</span>
              <span className="text-amber-700 block mt-0.5 leading-normal">You are viewing protection rules in read-only mode. Only workspace administrators can save changes.</span>
            </div>
          </div>
        )}

        {/* Database Migration Recommendation Banner */}
        {!hasCustomRulesCol && !pageLoading && isAdmin && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800 leading-normal flex items-start gap-2.5 mb-6 animate-in fade-in slide-in-from-top-1 duration-150 shadow-none">
            <svg className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold block text-blue-900">Custom rules database column pending</span>
              <span className="text-blue-700 block mt-0.5 leading-normal">
                To enable custom keyword or regex protection, run this SQL migration in your Supabase Dashboard SQL Editor:
                <code className="block mt-2 bg-blue-100/70 text-blue-900 px-3 py-2 rounded font-mono text-[10px] select-all border border-blue-200">
                  ALTER TABLE public.policies ADD COLUMN IF NOT EXISTS custom_rules jsonb NOT NULL DEFAULT '[]'::jsonb;
                </code>
              </span>
            </div>
          </div>
        )}

        {/* Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Standard Rules (10 toggles) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Standard Rules</h2>
              <p className="text-xs text-gray-400 mt-1 leading-normal">
                Core redaction modules processed locally in the browser.
              </p>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-100 bg-white px-5 py-1 rounded-lg">
              {pageLoading ? (
                /* Skeleton rule lines */
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="py-4 flex justify-between items-center animate-pulse">
                    <div className="space-y-1.5 flex-1 pr-6">
                      <div className="flex gap-2">
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                        <div className="h-2.5 w-12 bg-gray-50 rounded" />
                      </div>
                      <div className="h-2 w-44 bg-gray-50 rounded" />
                    </div>
                    <div className="h-5 w-9 bg-gray-100 rounded-full" />
                  </div>
                ))
              ) : (
                piiTypes.map((item) => (
                  <div key={item.type} className="py-3.5 flex items-center justify-between gap-6">
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">{item.label}</span>
                        <span className="text-[9px] font-mono text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-sm">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal">{item.desc}</p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(item.type)}
                      disabled={!isAdmin}
                      className={`w-9 h-5 rounded-full transition-colors relative outline-none shrink-0 ${
                        !isAdmin ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        item.enabled ? "bg-[#1A5C38]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          item.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Sensitivity Slider & Custom Rules */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            {/* Sensitivity Section */}
            <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-4 shadow-none">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Sensitivity Threshold</h2>
                <p className="text-xs text-gray-400 mt-1 leading-normal">
                  Confidence score threshold required for dynamic name matching.
                </p>
              </div>

              {pageLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="flex justify-between">
                    <div className="h-2.5 w-12 bg-gray-50 rounded" />
                    <div className="h-2.5 w-12 bg-gray-50 rounded" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.4"
                      max="0.95"
                      step="0.05"
                      value={threshold}
                      disabled={!isAdmin}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className={`flex-1 accent-[#1A5C38] h-[3px] bg-gray-250 rounded-lg appearance-none ${
                        !isAdmin ? "opacity-65 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    />
                    <span className="text-xs font-mono font-semibold text-gray-800 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm">
                      {threshold.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>Recall (high)</span>
                    <span>Balanced</span>
                    <span>Precision (strict)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Rules Section */}
            <CustomRulesSection
              orgId={orgId}
              pageLoading={pageLoading}
              userRole={userRole}
              rules={customRules}
              setRules={setCustomRules}
              hasCustomRulesCol={hasCustomRulesCol}
              triggerToast={triggerToast}
            />
          </div>
        </div>
      </div>
  );
}

interface CustomRulesSectionProps {
  orgId: string | null;
  pageLoading: boolean;
  userRole: string;
  rules: any[];
  setRules: React.Dispatch<React.SetStateAction<any[]>>;
  hasCustomRulesCol: boolean;
  triggerToast: (msg: string) => void;
}

function CustomRulesSection({ orgId, pageLoading, userRole, rules, setRules, hasCustomRulesCol, triggerToast }: CustomRulesSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("literal");
  const [pattern, setPattern] = useState("");
  const [desc, setDesc] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !pattern) return;

    const newRule = {
      id: Date.now(),
      name: ruleName.toUpperCase().replace(/\s+/g, "_"),
      type: ruleType,
      pattern,
      desc: desc || `Custom ${ruleType} matching rule`
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);

    // Auto-save if we have database column access
    if (orgId && userRole !== "member") {
      if (hasCustomRulesCol) {
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from("policies")
            .update({ custom_rules: updatedRules })
            .eq("organization_id", orgId);
            
          if (error) {
            triggerToast(`Failed to persist custom rule: ${error.message}`);
          } else {
            triggerToast(`Custom rule "${newRule.name}" added and synced successfully!`);
            // Trigger instant extension synchronization
            if (typeof window !== "undefined") {
              window.postMessage({ type: "ARKN_POLICY_UPDATED_SYNC" }, "*");
            }
          }
        } catch (err: any) {
          triggerToast(`Error saving rule: ${err.message}`);
        }
      } else {
        triggerToast(`Rule "${newRule.name}" added locally. Run database migration to sync.`);
      }
    }

    setRuleName("");
    setPattern("");
    setDesc("");
    setShowAdd(false);
  };

  const handleDelete = async (id: number) => {
    if (userRole === "member") return;
    const deletedRule = rules.find((r) => r.id === id);
    const updatedRules = rules.filter((r) => r.id !== id);
    setRules(updatedRules);

    // Auto-save if we have database column access
    if (orgId) {
      if (hasCustomRulesCol) {
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from("policies")
            .update({ custom_rules: updatedRules })
            .eq("organization_id", orgId);
            
          if (error) {
            triggerToast(`Failed to delete custom rule: ${error.message}`);
          } else {
            triggerToast(`Custom rule "${deletedRule?.name}" deleted successfully.`);
            // Trigger instant extension synchronization
            if (typeof window !== "undefined") {
              window.postMessage({ type: "ARKN_POLICY_UPDATED_SYNC" }, "*");
            }
          }
        } catch (err: any) {
          triggerToast(`Error deleting rule: ${err.message}`);
        }
      } else {
        triggerToast("Custom rule deleted locally. Run database migration to sync.");
      }
    }
  };

  const isAdmin = userRole !== "member";

  return (
    <div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Custom Protection Rules</h2>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-normal">Define proprietary keywords or matching regex patterns.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-secondary h-8 text-xs font-semibold px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!orgId || pageLoading || !isAdmin}
        >
          <PlusIcon size={12} /> Add rule
        </button>
      </div>

      <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
        {pageLoading ? (
          <div className="p-5 space-y-4 animate-pulse">
            <div className="flex justify-between border-b border-gray-50 pb-3">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-gray-150 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-3 w-12 bg-gray-150 rounded" />
            </div>
          </div>
        ) : rules.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 font-medium">
            No custom rules configured.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-1/2">Rule</th>
                <th className="py-2.5 px-4">Pattern</th>
                <th className="py-2.5 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 font-mono">{rule.name}</span>
                      <span className="text-[9px] font-semibold text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded-sm">
                        {rule.type}
                      </span>
                    </div>
                    {rule.desc && <span className="text-[10px] text-gray-400 block mt-0.5 truncate max-w-[180px] font-medium">{rule.desc}</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100 break-all text-[11px] font-medium">
                      {rule.pattern}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="text-xs text-red-650 hover:text-red-700 font-semibold cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Full-Page Portal Backdrop Modal Dialog */}
      {showAdd && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 w-full max-w-[400px] rounded-lg p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">New Protection Rule</h3>
              <p className="text-[11px] text-gray-400">Configure target phrases or regular expressions.</p>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Rule Token Name</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. PROJECT_ATHENA"
                  className="w-full input-base h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Pattern Type</label>
                <Select
                  value={ruleType}
                  onChange={setRuleType}
                  options={[
                    { value: "literal", label: "Literal (Exact match)" },
                    { value: "regex", label: "Regex (Pattern match)" }
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Matching Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder={ruleType === "literal" ? "e.g. Project Athena" : "e.g. REF-[0-9]{5}"}
                  className="w-full input-base font-mono text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 block">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Secret internal project code name"
                  className="w-full input-base h-9 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 btn-secondary h-9 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary h-9 text-xs bg-[#1A5C38] hover:bg-[#113f25] border-none"
                >
                  Add rule
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
    </div>
  );
}
