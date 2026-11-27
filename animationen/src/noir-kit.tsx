import React from "react";
import { icons as logos } from "@iconify-json/logos";
import { getIconData, iconToSVG } from "@iconify/utils";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { NOIR_ORANGE, NOIR_ROT, rein, schwung, zweier } from "./noir-buehne";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";

// Wiederverwendbarer Pro-Motion-Baukasten für Der Strichermittler:
// 1) MarkenLogo: echte Firmen- & Tech-Logos aus @iconify-json/logos
// 2) RoughMarkierung: handgezeichneter animierter Kreis/Unterstrich
// 3) KinetikTitel: federndes Einblenden (schwung) für Hook- & Kapitel-Überschriften
// 4) Noir3DBuehne: @remotion/three Canvas mit Noir-Licht für echte 3D-Erklärszenen

export const MarkenLogo: React.FC<{
  name: string;
  size?: number;
  fallbackColor?: string;
}> = ({ name, size = 84, fallbackColor = NOIR_ORANGE }) => {
  const data = getIconData(logos, name);
  if (!data) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: "#141824",
          border: `2px solid ${fallbackColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: ZAHLEN_SCHRIFT,
          fontSize: Math.round(size * 0.28),
          color: "#fff",
        }}
      >
        {name.slice(0, 4).toUpperCase()}
      </div>
    );
  }
  const render = iconToSVG(data, { height: `${size}px` });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${data.width ?? 256} ${data.height ?? 256}`}
      dangerouslySetInnerHTML={{ __html: render.body }}
    />
  );
};

// Handgezeichneter Highlight-Rahmen oder Unterstrich (wirkt lebendiger als ein starres Rechteck)
export const RoughUnterstrich: React.FC<{
  width: number;
  ab?: number;
  farbe?: string;
}> = ({ width, ab = 0.2, farbe = NOIR_ORANGE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = rein(frame / fps, ab, 0.45);
  const d = `M 4 14 Q ${width * 0.35} 4, ${width * 0.68} 12 T ${width - 4} 10`;
  return (
    <svg width={width} height={24} style={{ display: "block", margin: "4px auto 0" }}>
      <path
        d={d}
        fill="none"
        stroke={farbe}
        strokeWidth={7}
        strokeLinecap="round"
        pathLength={1}
        strokeDashoffset={1 - p}
        strokeDasharray={1}
      />
    </svg>
  );
};

// Federnde Überschrift für Hook oder Kapitel
export const KinetikTitel: React.FC<{
  titel: string;
  untertitel?: string;
  ab?: number;
  farbe?: string;
  size?: number;
}> = ({ titel, untertitel, ab = 0, farbe = NOIR_ORANGE, size = 70 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const k = schwung(zweier(s), ab);
  const u = rein(s, ab + 0.15, 0.35);
  return (
    <div style={{ textAlign: "center", transform: `scale(${0.86 + 0.14 * k})`, opacity: k }}>
      <div
        style={{
          fontFamily: ZAHLEN_SCHRIFT,
          fontSize: size,
          fontWeight: 900,
          color: farbe,
          lineHeight: 1.05,
          letterSpacing: 1.5,
          textShadow: "0 6px 24px rgba(0,0,0,0.9)",
        }}
      >
        {titel}
      </div>
      {untertitel ? (
        <div
          style={{
            fontFamily: TEXT_SCHRIFT,
            fontSize: 32,
            fontWeight: 700,
            color: "#f8fafc",
            marginTop: 10,
            opacity: u,
            textShadow: "0 4px 16px rgba(0,0,0,0.9)",
          }}
        >
          {untertitel}
        </div>
      ) : null}
    </div>
  );
};

// @remotion/three 3D-Bühne mit filmischem Noir-Rim-Light für zukünftige 3D-Erklärszenen
export const Noir3DBuehne: React.FC<{
  width?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ width = 992, height = 1085, children }) => (
  <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.4, 5.2], fov: 42 }}>
    <color attach="background" args={["#0b0d14"]} />
    <ambientLight intensity={0.35} />
    <directionalLight position={[4, 5, 3]} intensity={2.2} color={NOIR_ORANGE} />
    <directionalLight position={[-4, 2, -2]} intensity={1.1} color={NOIR_ROT} />
    {children}
  </ThreeCanvas>
);
