import { ImageResponse } from "next/og";
import { capitals, paths, viewBox } from "@/lib/map";

export const alt = "Provincias y Capitales: mapa de Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [, , w, h] = viewBox.split(" ").map(Number);
const dot = capitals["Córdoba"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 96px",
          background: "#0e1c29",
          color: "#e8f1f8",
        }}
      >
        <svg viewBox={viewBox} width={(560 * w) / h} height={560}>
          {Object.entries(paths).map(([name, d]) => (
            <path
              key={name}
              d={d}
              fill={name === "Córdoba" ? "#f6b40e" : "#74acdf"}
              stroke="#0e1c29"
              strokeWidth={1}
            />
          ))}
          <circle cx={dot[0]} cy={dot[1]} r={6} fill="#0e1c29" stroke="#fff" strokeWidth={2} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 800, lineHeight: 1 }}>
            <span>Provincias</span>
            <span style={{ color: "#74acdf" }}>y Capitales</span>
          </div>
          <div style={{ fontSize: 36, color: "#9bb0c3", maxWidth: 640 }}>
            ¿Te sabés las capitales de Argentina? Jugá contra reloj.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
