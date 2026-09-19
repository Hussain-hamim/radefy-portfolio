import { ImageResponse } from "next/og";

export const alt =
  "Radefy Systems — Software and AI development company in Khost, Afghanistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 78px",
          background:
            "linear-gradient(145deg, #ffffff 0%, #eeeaff 52%, #6a4ef4 100%)",
          color: "#23214b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
          Radefy Systems
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 940,
            gap: 26,
          }}
        >
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Software that moves your business forward.
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35 }}>
            Custom systems. Web platforms. Mobile and desktop applications.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 600 }}>
          radefysystems.com · Khost, Afghanistan
        </div>
      </div>
    ),
    size,
  );
}
