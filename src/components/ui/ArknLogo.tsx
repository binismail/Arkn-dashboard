"use client";

import Image from "next/image";

interface ArknLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
  textColor?: string;
}

export function ArknLogo({
  size = 28,
  className = "",
  showText = true,
  textSize = "text-[13px]",
  textColor = "text-gray-900",
}: ArknLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center overflow-hidden rounded-md"
      >
        <Image
          src="/arkn-logo.png"
          alt="ARKN Logo"
          width={size * 2}
          height={size * 2}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <span className={`font-semibold tracking-tight ${textColor} ${textSize}`}>
          ARKN
        </span>
      )}
    </div>
  );
}

export default ArknLogo;
