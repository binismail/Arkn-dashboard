import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function ChatGPTLogo({ className = "", size = 16 }: LogoProps) {
  return (
    <img
      src="/openai-com-logo.png"
      width={size}
      height={size}
      alt="ChatGPT"
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function ClaudeLogo({ className = "", size = 16 }: LogoProps) {
  return (
    <img
      src="/claude-ai-logo.png"
      width={size}
      height={size}
      alt="Claude AI"
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function GeminiLogo({ className = "", size = 16 }: LogoProps) {
  return (
    <img
      src="/Google_Gemini_icon_2025.svg.webp"
      width={size}
      height={size}
      alt="Google Gemini"
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function PlatformIcon({ platform, size = 16, className = "" }: { platform: string; size?: number; className?: string }) {
  const norm = String(platform || "").toLowerCase();
  if (norm.includes("chatgpt")) return <ChatGPTLogo size={size} className={className} />;
  if (norm.includes("claude")) return <ClaudeLogo size={size} className={className} />;
  if (norm.includes("gemini")) return <GeminiLogo size={size} className={className} />;
  
  // Fallback generic shield icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`text-gray-400 shrink-0 ${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
