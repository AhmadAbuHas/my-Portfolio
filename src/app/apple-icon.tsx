import { ImageResponse } from "next/og";

// Home-screen icon for iPhone/iPad: the same "AH" mark as icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c3f53c",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 64 64">
          <g fill="none" stroke="#0a0e15" strokeWidth="6" strokeLinejoin="round">
            <path d="M9 50 20 14h1l11 36M13.5 38h14" />
            <path d="M38 14v36M55 14v36M38 32h17" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
