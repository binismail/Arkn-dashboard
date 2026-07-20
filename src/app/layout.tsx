import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1A5C38",
  width: "device-width",
  initialScale: 1,
};

const defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://arkn.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(defaultAppUrl),
  title: {
    default: "ARKN • Your team's security layer for AI",
    template: "%s • ARKN",
  },
  description:
    "Browser-first AI security layer. Automatically redact sensitive PII and secrets before prompts reach ChatGPT, Claude, or Gemini.",
  applicationName: "ARKN",
  authors: [{ name: "MYARKN LTD", url: "https://myarkn.ai" }],
  generator: "Next.js",
  keywords: [
    "AI Security",
    "PII Redaction",
    "Enterprise AI Protection",
    "ChatGPT Security",
    "Claude Privacy",
    "Gemini Data Shield",
    "Zero Trust AI",
    "DLP for AI",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultAppUrl,
    title: "ARKN • Your team's security layer for AI",
    description:
      "Browser-first AI security layer. Automatically redact PII & secrets before prompts reach ChatGPT, Claude, or Gemini.",
    siteName: "ARKN",
    images: [
      {
        url: `${defaultAppUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ARKN • Your team's security layer for AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKN • Your team's security layer for AI",
    description:
      "Browser-first AI security layer. Automatically redact PII & secrets before prompts reach ChatGPT, Claude, or Gemini.",
    images: [`${defaultAppUrl}/og-image.png`],
    creator: "@myarkn_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ARKN",
    "operatingSystem": "Browser, macOS, Windows",
    "applicationCategory": "SecurityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description":
      "ARKN is a browser-first AI security layer that automatically redacts and tokenizes sensitive PII, credentials, financial data, and healthcare records locally before prompts reach ChatGPT, Claude, or Gemini.",
    "publisher": {
      "@type": "Organization",
      "name": "MYARKN LTD",
      "url": "https://myarkn.ai",
      "logo": "https://myarkn.ai/favicon.svg",
    },
    "featureList": [
      "Real-time local PII redaction",
      "Zero raw prompt storage",
      "Deterministic tokenization & local restoration",
      "Cross-platform protection for ChatGPT, Claude, and Gemini",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
