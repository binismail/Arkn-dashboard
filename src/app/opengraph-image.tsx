import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ARKN • Your team's security layer for AI";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "48px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Main Pale Mint Swatch Container (Pure Flat UI, No Shadows, No Borders) */}
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F2F8F4",
            borderRadius: "32px",
            padding: "56px 64px",
          }}
        >
          {/* Left Column: Brand & Copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              maxWidth: "560px",
            }}
          >
            {/* Logo Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "#1A5C38",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 512 512" width="28" height="28">
                  <path
                    d="M136 396V232C136 165.7 189.7 112 256 112C322.3 112 376 165.7 376 232V396H320V232C320 196.7 291.3 168 256 168C220.7 168 192 196.7 192 232V396H136Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1A5C38",
                  letterSpacing: "-0.02em",
                }}
              >
                ARKN
              </span>
            </div>

            {/* Headline & Subhead */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#09090b",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Your team's security layer for AI.
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  color: "#71717a",
                  lineHeight: 1.4,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Browser-first protection for ChatGPT, Claude, and Gemini.
              </p>
            </div>

            {/* Tagline Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1A5C38",
                  backgroundColor: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "999px",
                }}
              >
                ● 100% Local Edge Protection
              </span>
            </div>
          </div>

          {/* Right Column: UI Snippet Card Preview (Pure Flat UI) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "420px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              gap: "20px",
            }}
          >
            {/* Snippet Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "14px",
                borderBottom: "1px solid #f4f4f5",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#09090b",
                }}
              >
                ChatGPT 4o Interceptor
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1A5C38",
                  backgroundColor: "#ecfdf5",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontFamily: "monospace",
                }}
              >
                3 Entities Redacted
              </span>
            </div>

            {/* Snippet Content */}
            <div
              style={{
                fontSize: "14px",
                color: "#3f3f46",
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <span>"Draft executive summary for client"</span>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    backgroundColor: "#d1fae5",
                    color: "#1A5C38",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  &#123;NAME_1&#125;
                </span>
                <span style={{ color: "#71717a" }}>at</span>
                <span
                  style={{
                    backgroundColor: "#d1fae5",
                    color: "#1A5C38",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  &#123;EMAIL_1&#125;
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#71717a" }}>Key:</span>
                <span
                  style={{
                    backgroundColor: "#d1fae5",
                    color: "#1A5C38",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  &#123;API_KEY_1&#125;
                </span>
              </div>
            </div>

            {/* Status Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid #f4f4f5",
                fontSize: "12px",
                color: "#a1a1aa",
                fontFamily: "monospace",
              }}
            >
              <span>LATENCY: 0.4ms</span>
              <span style={{ color: "#1A5C38", fontWeight: 600 }}>Zero Data Sent</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
