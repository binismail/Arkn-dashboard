import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A5C38",
          borderRadius: "8px",
        }}
      >
        <svg viewBox="0 0 512 512" width="24" height="24">
          <path
            d="M136 396V232C136 165.7 189.7 112 256 112C322.3 112 376 165.7 376 232V396H320V232C320 196.7 291.3 168 256 168C220.7 168 192 196.7 192 232V396H136Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
