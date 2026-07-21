"use client";

import { useRef } from "react";
import ArknLogo from "@/components/ui/ArknLogo";
import { PlatformIcon } from "@/components/ui/ModelLogos";
import {
  SquaresFour,
  Users,
  Desktop,
  ShieldCheck,
  FileText,
  Gear,
  Plus,
  Globe,
  ArrowUp,
  ArrowUpRight,
} from "@phosphor-icons/react";

export default function StoreAssetsPage() {
  const iconRef = useRef<HTMLDivElement>(null);
  const smallPromoRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ss1Ref = useRef<HTMLDivElement>(null);
  const ss2Ref = useRef<HTMLDivElement>(null);
  const ss3Ref = useRef<HTMLDivElement>(null);
  const ss4Ref = useRef<HTMLDivElement>(null);
  const ss5Ref = useRef<HTMLDivElement>(null);

  // 128x128 Icon Export (PNG format with solid #1A5C38 background)
  const downloadStoreIcon = async () => {
    if (!iconRef.current) return;
    try {
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(iconRef.current, {
        quality: 1.0,
        pixelRatio: 1,
        width: 128,
        height: 128,
        canvasWidth: 128,
        canvasHeight: 128,
        backgroundColor: "#1A5C38",
      });

      const link = document.createElement("a");
      link.download = "arkn_store_icon_128x128.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Icon render error:", err);
      alert("Icon download failed. Please screenshot the 128x128 square directly.");
    }
  };

  // Generic Graphic Asset Export (Exact 1:1 dimensions, JPEG, No Alpha)
  const downloadAsset = async (
    elementRef: React.RefObject<HTMLDivElement | null>,
    filename: string,
    width: number,
    height: number,
    bgColor: string = "#ffffff"
  ) => {
    if (!elementRef.current) return;
    try {
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toJpeg(elementRef.current, {
        quality: 0.98,
        pixelRatio: 1,
        width,
        height,
        canvasWidth: width,
        canvasHeight: height,
        backgroundColor: bgColor,
      });

      const link = document.createElement("a");
      link.download = `${filename}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Asset render error:", err);
      alert("Asset download failed. Please screenshot directly.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-950 p-8 space-y-12 select-none">
      
      {/* Studio Header */}
      <div className="max-w-6xl mx-auto border-b border-gray-200 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-semibold text-[#1A5C38] uppercase tracking-wider">ARKN Design Studio</span>
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">Chrome Web Store Graphic Assets</h1>
          <p className="text-xs text-gray-500 mt-1">
            Exports exact 1:1 pixel dimensions (Store Icon PNG / Promos &amp; Screenshots JPEG) required by Chrome Web Store.
          </p>
        </div>
        <div className="bg-[#1A5C38] text-white px-3 py-1.5 rounded-full text-xs font-mono font-semibold">
          noindex • store-assets
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* 1. STORE ICON (128x128 PNG) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950">1. Store Icon (128 x 128 px PNG)</h2>
              <p className="text-xs text-gray-500">Solid Forest Green (#1A5C38) background with white ARKN arch icon.</p>
            </div>
            <button
              onClick={downloadStoreIcon}
              className="px-4 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Download 128x128 Icon (PNG)
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 inline-block">
            <div
              ref={iconRef}
              style={{ width: "128px", height: "128px", backgroundColor: "#1A5C38" }}
              className="rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
            >
              <svg viewBox="0 0 512 512" width="76" height="76" style={{ display: "block" }}>
                <path
                  d="M136 396V232C136 165.7 189.7 112 256 112C322.3 112 376 165.7 376 232V396H320V232C320 196.7 291.3 168 256 168C220.7 168 192 196.7 192 232V396H136Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* 2. SMALL PROMO TILE (440x280) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950">2. Small Promo Tile (440 x 280 px)</h2>
              <p className="text-xs text-gray-500">Pure Flat UI swatch card for Web Store search results.</p>
            </div>
            <button
              onClick={() => downloadAsset(smallPromoRef, "arkn_small_promo_440x280", 440, 280, "#F2F8F4")}
              className="px-4 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Download Small Promo (440x280 JPG)
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 inline-block overflow-x-auto">
            <div
              ref={smallPromoRef}
              style={{ width: "440px", height: "280px", backgroundColor: "#F2F8F4" }}
              className="p-7 flex flex-col justify-between rounded-2xl relative overflow-hidden select-none shrink-0"
            >
              <div className="flex items-center justify-between">
                <ArknLogo size={22} textSize="text-xs tracking-widest text-[#1A5C38]" />
                <span className="bg-[#1A5C38] text-white text-[10px] font-semibold font-mono px-2.5 py-1 rounded-full">
                  Zero Raw Prompt Storage
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-950 tracking-tight leading-snug">
                  Your team&apos;s security layer for AI.
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  Automatically redact sensitive PII, API keys &amp; credentials before prompts reach ChatGPT, Claude, or Gemini.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 text-[11px] font-semibold text-[#1A5C38] border-t border-emerald-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <PlatformIcon platform="chatgpt" size={14} />
                    <span>ChatGPT</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlatformIcon platform="claude" size={14} />
                    <span>Claude</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlatformIcon platform="gemini" size={14} />
                    <span>Gemini</span>
                  </div>
                </div>
                <span>MYARKN LTD</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MARQUEE PROMO TILE (1400x560) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-950">3. Marquee Promo Tile (1400 x 560 px)</h2>
              <p className="text-xs text-gray-500">Core value propositions &amp; live redacted UI snippet preview.</p>
            </div>
            <button
              onClick={() => downloadAsset(marqueeRef, "arkn_marquee_promo_1400x560", 1400, 560, "#F2F8F4")}
              className="px-4 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Download Marquee (1400x560 JPG)
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 overflow-x-auto">
            <div
              ref={marqueeRef}
              style={{ width: "1400px", height: "560px", backgroundColor: "#F2F8F4" }}
              className="p-16 flex flex-row items-center justify-between rounded-3xl relative overflow-hidden select-none shrink-0"
            >
              <div className="max-w-xl space-y-6">
                <ArknLogo size={36} textSize="text-xl tracking-widest text-[#1A5C38]" />

                <h3 className="text-4xl font-bold text-gray-950 tracking-tight leading-tight">
                  Your team&apos;s security layer for AI.
                </h3>

                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  ARKN sits between your team and ChatGPT, Claude, and Gemini, automatically detecting and replacing sensitive PII, credentials, and business records before prompts leave the browser.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-semibold text-[#1A5C38]">
                  <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#1A5C38]" />
                    <span>Zero Raw Prompt Storage</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#1A5C38]" />
                    <span>100% In-Browser Execution</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#1A5C38]" />
                    <span>ChatGPT • Claude • Gemini</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-[#1A5C38]" />
                    <span>Instant Workspace Sync</span>
                  </div>
                </div>
              </div>

              <div className="w-[480px] bg-white rounded-3xl p-8 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform="chatgpt" size={24} />
                    <span className="text-sm font-semibold text-gray-950">ChatGPT 4o Interceptor</span>
                  </div>
                  <span className="bg-emerald-100 text-[#1A5C38] text-xs font-mono font-semibold px-2.5 py-1 rounded-full">
                    3 Entities Redacted
                  </span>
                </div>

                <div className="text-xs text-gray-700 leading-relaxed space-y-3 font-sans">
                  <p className="text-gray-950 font-semibold text-sm">&quot;Review contract for Sarah Jenkins at sarah@jenkinslaw.co.uk&quot;</p>
                  
                  <div className="bg-[#f0f2f5] p-4 rounded-2xl space-y-1.5 text-xs">
                    <p className="text-gray-900">
                      Reviewing contract for{" "}
                      <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-1.5 py-0.5 rounded font-mono font-semibold">
                        &#123;NAME_1&#125;
                      </span>{" "}
                      at{" "}
                      <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                        &#123;EMAIL_1&#125;
                      </span>.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>LATENCY: 0.4ms</span>
                  <span className="text-[#1A5C38] font-semibold">Local Device Boundary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. STORE SCREENSHOTS (1280x800) */}
        <section className="space-y-10">
          <div>
            <h2 className="text-base font-semibold text-gray-950">4. Store Screenshots (1280 x 800 px)</h2>
            <p className="text-xs text-gray-500">5 high-resolution screenshots created directly from ARKN authentic UI components.</p>
          </div>

          {/* Screenshot 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Screenshot 1: Real-Time PII Protection on ChatGPT (1280 x 800 px)</span>
              <button
                onClick={() => downloadAsset(ss1Ref, "arkn_screenshot_1_1280x800", 1280, 800, "#F2F8F4")}
                className="px-3.5 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Download Screenshot 1 (1280x800 JPG)
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <div
                ref={ss1Ref}
                style={{ width: "1280px", height: "800px", backgroundColor: "#F2F8F4" }}
                className="p-10 flex flex-col justify-between rounded-3xl relative overflow-hidden select-none shrink-0 font-sans"
              >
                <div className="bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-gray-200/80">
                  <div className="bg-[#e8e8e8] px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="bg-white px-4 py-1 rounded-md border border-gray-300/60 text-xs font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                      https://chatgpt.com/c/019283-legal-review
                    </div>
                    <div className="w-12" />
                  </div>

                  <div className="flex-1 bg-white p-10 flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <PlatformIcon platform="chatgpt" size={26} />
                        <span className="font-semibold text-base text-gray-950">ChatGPT 4o Session</span>
                      </div>
                      <span className="bg-emerald-100 text-[#1A5C38] px-3.5 py-1 rounded-full text-xs font-semibold font-mono">
                        🛡️ ARKN Active Protection
                      </span>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto w-full my-auto">
                      <div className="bg-[#f0f2f5] p-5 rounded-2xl text-sm font-semibold text-gray-950 max-w-[85%] ml-auto">
                        Can you review this contract for Sarah Jenkins at sarah@jenkinslaw.co.uk regarding Project ATHENA?
                      </div>

                      <div className="bg-[#F2F8F4] text-gray-900 rounded-2xl p-5 text-sm leading-relaxed max-w-[90%] mr-auto space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon platform="chatgpt" size={18} />
                          <span className="text-xs font-semibold text-[#1A5C38]">AI Assistant</span>
                        </div>
                        <p>
                          Reviewing consultancy agreement for{" "}
                          <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2 py-0.5 rounded font-mono font-semibold">
                            &#123;NAME_1&#125;
                          </span>{" "}
                          at{" "}
                          <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                            &#123;EMAIL_1&#125;
                          </span>{" "}
                          regarding{" "}
                          <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2 py-0.5 rounded font-mono font-semibold">
                            &#123;PROJECT_1&#125;
                          </span>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f4f4f5] rounded-2xl p-4 flex flex-col justify-between h-[90px] max-w-2xl mx-auto w-full">
                      <span className="text-xs text-gray-400 font-normal">Ask AI Assistant...</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400">
                            <Plus size={14} weight="bold" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400">
                            <Globe size={14} weight="regular" />
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#343541] text-white flex items-center justify-center">
                          <ArrowUp size={16} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Screenshot 2: Credential &amp; API Key Protection on Claude (1280 x 800 px)</span>
              <button
                onClick={() => downloadAsset(ss2Ref, "arkn_screenshot_2_1280x800", 1280, 800, "#F2F8F4")}
                className="px-3.5 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Download Screenshot 2 (1280x800 JPG)
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <div
                ref={ss2Ref}
                style={{ width: "1280px", height: "800px", backgroundColor: "#F2F8F4" }}
                className="p-10 flex flex-col justify-between rounded-3xl relative overflow-hidden select-none shrink-0 font-sans"
              >
                <div className="bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-gray-200/80">
                  <div className="bg-[#e8e8e8] px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="bg-white px-4 py-1 rounded-md border border-gray-300/60 text-xs font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                      https://claude.ai/chat/0912-developer-session
                    </div>
                    <div className="w-12" />
                  </div>

                  <div className="flex-1 bg-white p-10 flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <PlatformIcon platform="claude" size={26} />
                        <span className="font-semibold text-base text-gray-950">Claude 3.5 Sonnet Session</span>
                      </div>
                      <span className="bg-emerald-100 text-[#1A5C38] px-3.5 py-1 rounded-full text-xs font-semibold font-mono">
                        🛡️ Secrets Intercepted
                      </span>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto w-full my-auto">
                      <div className="bg-[#f0f2f5] p-5 rounded-2xl text-sm font-semibold text-gray-950 font-mono max-w-[85%] ml-auto">
                        Deploy backend service using OPENAI_API_KEY=sk_live_98231498149814 for production.
                      </div>

                      <div className="bg-[#F2F8F4] text-gray-900 rounded-2xl p-5 text-sm leading-relaxed max-w-[90%] mr-auto space-y-2 font-mono">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon platform="claude" size={18} />
                          <span className="text-xs font-semibold text-[#1A5C38]">Claude Assistant</span>
                        </div>
                        <p>
                          Deploy script using OPENAI_API_KEY=
                          <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            &#123;API_KEY_1&#125;
                          </span>{" "}
                          for production.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f4f4f5] rounded-2xl p-4 flex flex-col justify-between h-[90px] max-w-2xl mx-auto w-full">
                      <span className="text-xs text-gray-400 font-normal">Ask Claude...</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400">
                            <Plus size={14} weight="bold" />
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#da7756] text-white flex items-center justify-center">
                          <ArrowUp size={16} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Screenshot 3: Google Gemini Financial PII Interceptor (1280 x 800 px)</span>
              <button
                onClick={() => downloadAsset(ss3Ref, "arkn_screenshot_3_1280x800", 1280, 800, "#F2F8F4")}
                className="px-3.5 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Download Screenshot 3 (1280x800 JPG)
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <div
                ref={ss3Ref}
                style={{ width: "1280px", height: "800px", backgroundColor: "#F2F8F4" }}
                className="p-10 flex flex-col justify-between rounded-3xl relative overflow-hidden select-none shrink-0 font-sans"
              >
                <div className="bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-gray-200/80">
                  <div className="bg-[#e8e8e8] px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="bg-white px-4 py-1 rounded-md border border-gray-300/60 text-xs font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                      https://gemini.google.com/app/0182-finance
                    </div>
                    <div className="w-12" />
                  </div>

                  <div className="flex-1 bg-white p-10 flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <PlatformIcon platform="gemini" size={26} />
                        <span className="font-semibold text-base text-gray-950">Google Gemini Session</span>
                      </div>
                      <span className="bg-emerald-100 text-[#1A5C38] px-3.5 py-1 rounded-full text-xs font-semibold font-mono">
                        🛡️ RPC Stream Masked
                      </span>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto w-full my-auto">
                      <div className="bg-[#f0f2f5] p-5 rounded-2xl text-sm font-semibold text-gray-950 max-w-[85%] ml-auto">
                        Send invoice to sort code 40-22-11 account 88492019 ref INV-2024.
                      </div>

                      <div className="bg-[#F2F8F4] text-gray-900 rounded-2xl p-5 text-sm leading-relaxed max-w-[90%] mr-auto space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon platform="gemini" size={18} />
                          <span className="text-xs font-semibold text-[#1A5C38]">Gemini Assistant</span>
                        </div>
                        <p>
                          Send invoice to sort code{" "}
                          <span className="bg-emerald-100 text-[#1A5C38] border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                            &#123;SORT_CODE_1&#125;
                          </span>{" "}
                          account{" "}
                          <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2 py-0.5 rounded font-mono font-semibold">
                            &#123;ACCOUNT_1&#125;
                          </span>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f4f4f5] rounded-2xl p-4 flex flex-col justify-between h-[90px] max-w-2xl mx-auto w-full">
                      <span className="text-xs text-gray-400 font-normal">Enter a prompt here...</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400">
                            <Plus size={14} weight="bold" />
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1A5C38] text-white flex items-center justify-center">
                          <ArrowUp size={16} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 4 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Screenshot 4: ARKN Enterprise Dashboard Overview (1280 x 800 px)</span>
              <button
                onClick={() => downloadAsset(ss4Ref, "arkn_screenshot_4_1280x800", 1280, 800, "#ffffff")}
                className="px-3.5 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Download Screenshot 4 (1280x800 JPG)
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <div
                ref={ss4Ref}
                style={{ width: "1280px", height: "800px", backgroundColor: "#ffffff" }}
                className="p-6 flex flex-col justify-between rounded-3xl relative overflow-hidden select-none shrink-0 font-sans"
              >
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200">
                  <div className="bg-[#e8e8e8] px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="bg-white px-4 py-1 rounded-md border border-gray-300/60 text-[11px] font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                      https://myarkn.ai/dashboard
                    </div>
                    <div className="w-12" />
                  </div>

                  <div className="flex flex-1 bg-white text-gray-900 font-sans">
                    <div className="w-56 border-r border-gray-100 p-4 flex flex-col justify-between shrink-0 bg-white">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2.5 px-1">
                          <div className="w-6 h-6 rounded bg-[#1A5C38] flex items-center justify-center text-white font-bold text-[11px]">
                            A
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900">Arkn Enterprise</h4>
                          </div>
                        </div>

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

                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs shrink-0">
                          JS
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-gray-900 truncate">John Smith</p>
                          <p className="text-[10px] text-gray-400 truncate">john@myarkn.ai</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6 space-y-6 bg-white overflow-y-auto">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-xl font-bold text-gray-950 tracking-tight">Your workspace&apos;s AI protection activity</h1>
                          <p className="text-xs text-gray-500 mt-0.5 font-normal">Real-time protection stats for Arkn Enterprise</p>
                        </div>
                        <div className="flex items-center bg-gray-100/80 p-0.5 rounded-md text-[11px] font-medium text-gray-500">
                          <span className="px-2.5 py-1 rounded">Today</span>
                          <span className="px-2.5 py-1 rounded bg-white text-gray-900 font-semibold shadow-2xs">7d</span>
                          <span className="px-2.5 py-1 rounded">30d</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 border-b border-gray-100 pb-5">
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono">PROTECTION ACTIVITY</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">19</span>
                            <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">prompts</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono">SENSITIVE INFO PROTECTED</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">27</span>
                            <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">entities</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono">ACTIVE MEMBERS</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">2</span>
                            <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">seats</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono">PROTECTED DEVICES</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">2</span>
                            <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">clients</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-7 space-y-3">
                          <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider font-mono">RECENT INTERCEPTIONS</h3>
                          <div className="divide-y divide-gray-100 text-xs border-t border-b border-gray-100">
                            {[
                              { user: "Jay Jay", platform: "gemini", tag: "GEMINI", redaction: "1 NAME", time: "2d ago" },
                              { user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "1 NAME", time: "2d ago" },
                              { user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "2 NAME", time: "3d ago" },
                              { user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "2 NAME", time: "3d ago" },
                              { user: "You", platform: "chatgpt", tag: "CHATGPT", redaction: "3 NAME", time: "3d ago" },
                            ].map((row, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between text-gray-700">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-gray-900">{row.user}</span>
                                    <PlatformIcon platform={row.platform} size={13} />
                                    <span className="text-[9px] text-gray-400 font-mono uppercase bg-gray-50 border border-gray-100 px-1.5 py-0.2 rounded-sm">{row.tag}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-400">
                                    Redacted: <span className="bg-emerald-50 text-[#1A5C38] px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">{row.redaction}</span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 text-[11px] font-mono">
                                  <span>{row.time}</span>
                                  <ArrowUpRight size={12} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-5 space-y-3">
                          <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider font-mono">AI SEARCH SHARE OF VOICE</h3>
                          <div className="bg-white border border-gray-100 rounded-xl p-5 flex justify-around items-end gap-3 h-[240px]">
                            <div className="flex flex-col items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-800">74%</span>
                              <div className="w-12 h-32 bg-gray-100/60 rounded-xl overflow-hidden relative flex flex-col justify-end">
                                <div className="w-full bg-[#1A5C38] rounded-b-xl h-[74%]" />
                              </div>
                              <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                  <PlatformIcon platform="chatgpt" size={13} />
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 truncate text-center">chatgpt.com</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-800">16%</span>
                              <div className="w-12 h-32 bg-gray-100/60 rounded-xl overflow-hidden relative flex flex-col justify-end">
                                <div className="w-full bg-[#45A373] rounded-b-xl h-[16%]" />
                              </div>
                              <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                  <PlatformIcon platform="claude" size={13} />
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 truncate text-center">claude.com</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-800">11%</span>
                              <div className="w-12 h-32 bg-gray-100/60 rounded-xl overflow-hidden relative flex flex-col justify-end">
                                <div className="w-full bg-[#7ECBA1] rounded-b-xl h-[11%]" />
                              </div>
                              <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                  <PlatformIcon platform="gemini" size={13} />
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 truncate text-center">gemini.com</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 5 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Screenshot 5: ARKN Protection Rules &amp; Custom Engine (1280 x 800 px)</span>
              <button
                onClick={() => downloadAsset(ss5Ref, "arkn_screenshot_5_1280x800", 1280, 800, "#ffffff")}
                className="px-3.5 py-2 bg-[#1A5C38] hover:bg-[#113f25] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Download Screenshot 5 (1280x800 JPG)
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 overflow-x-auto">
              <div
                ref={ss5Ref}
                style={{ width: "1280px", height: "800px", backgroundColor: "#ffffff" }}
                className="p-6 flex flex-col justify-between rounded-3xl relative overflow-hidden select-none shrink-0 font-sans"
              >
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200">
                  <div className="bg-[#e8e8e8] px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="bg-white px-4 py-1 rounded-md border border-gray-300/60 text-[11px] font-mono text-gray-500 flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]" />
                      https://myarkn.ai/dashboard/policies
                    </div>
                    <div className="w-12" />
                  </div>

                  <div className="flex flex-1 bg-white text-gray-900 font-sans">
                    <div className="w-56 border-r border-gray-100 p-4 flex flex-col justify-between shrink-0 bg-white">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2.5 px-1">
                          <div className="w-6 h-6 rounded bg-[#1A5C38] flex items-center justify-center text-white font-bold text-[11px]">
                            C
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900">Canon Ideas</h4>
                            <p className="text-[10px] text-gray-400">Enterprise Suite</p>
                          </div>
                        </div>

                        <nav className="space-y-1">
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 font-medium text-xs">
                            <SquaresFour size={16} className="text-gray-400" />
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
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-gray-100/70 text-gray-900 font-semibold text-xs">
                            <ShieldCheck size={16} className="text-[#1A5C38]" weight="bold" />
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

                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-xs shrink-0">
                          N
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-gray-900 truncate">Khalid Ismail</p>
                          <p className="text-[10px] text-gray-400 truncate">k@starterslab.co</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-7 space-y-6 bg-white overflow-y-auto">
                      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                        <div>
                          <h1 className="text-xl font-bold text-gray-950 tracking-tight">Protection Rules</h1>
                          <p className="text-xs text-gray-500 mt-0.5 font-normal">Configure real-time redaction rules for your organisation</p>
                        </div>
                        <button className="bg-[#1A5C38] text-white px-4 py-2 rounded-lg text-xs font-semibold">
                          Save changes
                        </button>
                      </div>

                      <div className="grid grid-cols-12 gap-8 items-start">
                        <div className="col-span-7 space-y-4">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900">Standard Rules</h3>
                            <p className="text-[11px] text-gray-400">Core redaction modules processed locally in the browser.</p>
                          </div>

                          <div className="divide-y divide-gray-100 text-xs border border-gray-100 rounded-xl p-4 space-y-3 bg-white">
                            {[
                              { name: "Email Addresses", tag: "EMAIL", desc: "Redacts standard work & personal email patterns" },
                              { name: "Phone Numbers", tag: "PHONE", desc: "Redacts UK mobile & landline numbers" },
                              { name: "UK Postcodes", tag: "POSTCODE", desc: "Redacts postal codes e.g. SW1A 1AA" },
                              { name: "National Insurance Numbers", tag: "NINO", desc: "Redacts UK NINO identifiers" },
                              { name: "Driving Licenses", tag: "DRIVELIC", desc: "Redacts UK driving license strings" },
                              { name: "NHS Numbers", tag: "NHS", desc: "Redacts 10-digit NHS numbers with modulo-11 validation" },
                              { name: "UK Bank Details", tag: "BANK", desc: "Redacts sort codes and bank accounts" },
                              { name: "Court Claim Numbers", tag: "CLAIM", desc: "Redacts civil/family court references" },
                              { name: "Personal Names", tag: "NAME", desc: "Redacts first/last names via context engine" },
                              { name: "Organizations / Firms", tag: "ORG", desc: "Redacts corporate names and entities" },
                            ].map((rule, idx) => (
                              <div key={idx} className="pt-2 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-gray-900">{rule.name}</span>
                                    <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded font-mono uppercase">{rule.tag}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-400">{rule.desc}</p>
                                </div>
                                <div className="w-8 h-4.5 bg-[#1A5C38] rounded-full p-0.5 flex justify-end">
                                  <div className="w-3.5 h-3.5 bg-white rounded-full" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-5 space-y-6">
                          <div className="border border-gray-100 rounded-xl p-5 space-y-3 bg-white">
                            <h3 className="text-[11px] font-semibold text-gray-900 font-mono uppercase tracking-wider">SENSITIVITY THRESHOLD</h3>
                            <p className="text-[11px] text-gray-400">Confidence score threshold required for dynamic name matching.</p>
                            
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] text-gray-400">Recall (high)</span>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-[#1A5C38] h-3 rounded-full bg-[#1A5C38]" />
                                <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">0.70</span>
                              </div>
                              <span className="text-[10px] text-gray-400">Precision (strict)</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xs font-semibold text-gray-900">Custom Protection Rules</h3>
                                <p className="text-[11px] text-gray-400">Define proprietary keywords or matching regex patterns.</p>
                              </div>
                              <button className="border border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                + Add rule
                              </button>
                            </div>

                            <div className="border border-gray-100 rounded-xl p-4 bg-white text-xs space-y-2">
                              <div className="flex items-center justify-between font-mono text-[10px] text-gray-400 pb-1 border-b border-gray-100">
                                <span>RULE</span>
                                <span>PATTERN</span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <div>
                                  <span className="font-bold text-gray-900">NON_ME</span>{" "}
                                  <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">LITERAL</span>
                                </div>
                                <span className="text-gray-700">Project-Me</span>
                                <span className="text-red-500 font-sans cursor-pointer">Delete</span>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
