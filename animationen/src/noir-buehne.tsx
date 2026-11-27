import React from "react";
import { AbsoluteFill, Easing, interpolate, random, staticFile } from "remotion";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";

// Wiederverwendbare Noir-Motion-Engine (inspiriert von FinanzNeo „Mix 2D“, angepasst an Der Strichermittler)
// Feste Zonen: Zahl 280–560 · Bühne 600–1340 (BODEN = 1340) · Untertitel 1400+
export const BODEN = 1340;
export const NOIR_SCHWARZ = "#050506";
export const NOIR_ORANGE = "#ff8a1f";
export const NOIR_ROT = "#ef4444";
export const NOIR_GRUEN = "#22c55e";
export const NOIR_WEISS = "#f8fafc";

export const sfx = (name: "ding" | "minus" | "pop" | "schnipp" | "stempel" | "tick" | "whoosh") =>
  staticFile(`klang/${name}.wav`);

export const klemm = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const SANFT = Easing.bezier(0.65, 0, 0.35, 1);

export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export const rein = (s: number, t0: number, d = 0.45) =>
  interpolate(s, [t0, t0 + d], [0, 1], { ...klemm, easing: EXPO });

export const weg = (s: number, t0: number, d = 0.25) =>
  interpolate(s, [t0, t0 + d], [0, 1], { ...klemm, easing: Easing.in(Easing.cubic) });

export const lauf = (s: number, t0: number, t1: number, a: number, b: number, easing = SANFT) =>
  interpolate(s, [t0, t1], [a, b], { ...klemm, easing });

// Zeichentrick-Schwung: kurz übers Ziel hinausfedern, dann ruhig stehen
export const schwung = (s: number, t0: number) => {
  const d = s - t0;
  if (d <= 0) return 0;
  return 1 - Math.exp(-9 * d) * Math.cos(15 * d);
};

// Motive bewegen sich „auf Zweiern“ (15 fps) wie von Hand animiert, Kamera bleibt flüssig bei 30 fps
export const zweier = (s: number) => Math.floor(s * 15) / 15;

// Durchgehender Noir-Hintergrund mit subtiler Parallax-Skyline und Sternen/Staub
export const NoirGrund: React.FC<{ s: number; camX: number; rot?: number }> = ({
  s,
  camX,
  rot = 0,
}) => {
  const gebaeude = (seed: string, breite: number, farbe: string, hoch: number) => {
    const teile: React.ReactNode[] = [];
    let x = 0;
    let i = 0;
    while (x < breite) {
      const w = 65 + Math.round(random(`${seed}w${i}`) * 95);
      const h = Math.round(hoch * (0.38 + random(`${seed}h${i}`) * 0.62));
      teile.push(
        <rect key={i} x={x} y={-h} width={w + 2} height={h} fill={farbe} rx={4} />,
      );
      x += w + 12;
      i++;
    }
    return teile;
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #040406 0%, #090a0f 45%, #121014 69.8%, #070709 70%, #030304 100%)`,
        overflow: "hidden",
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {new Array(24).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={random(`nx${i}`) * 1080}
            cy={240 + random(`ny${i}`) * 680}
            r={1.4 + random(`nr${i}`) * 2}
            fill={NOIR_ORANGE}
            opacity={0.08 + 0.18 * (0.5 + 0.5 * Math.sin(s * 2.2 + i * 1.9))}
          />
        ))}
        <g transform={`translate(${-300 - camX * 0.12} ${BODEN})`}>
          {gebaeude("fern", 4200, "#0c0d13", 380)}
        </g>
        <g transform={`translate(${-200 - camX * 0.25} ${BODEN})`}>
          {gebaeude("nah", 5200, "#12141d", 220)}
        </g>
      </svg>
      {rot > 0 ? (
        <AbsoluteFill
          style={{
            opacity: rot,
            background:
              "linear-gradient(180deg, transparent 38%, rgba(239,68,68,0.22) 69.8%, rgba(40,4,8,0.5) 70%, transparent 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// Leuchtende durchgehende Bodenlinie (kann beim Hook als Puls ausschlagen)
export const NoirLinie: React.FC<{
  s: number;
  farbe?: string;
  pulsAb?: number;
}> = ({ s, farbe = NOIR_ORANGE, pulsAb = -10 }) => {
  const zeig = lauf(s, 0, 0.5, 0, 1, EXPO);
  const mitte = mix(-120, 1220, c01((s - pulsAb) / 0.9));
  const aktiv = pulsAb >= 0 && s >= pulsAb && s < pulsAb + 1.1;
  const pts: string[] = [];
  for (let x = -10; x <= 1090 * zeig; x += 6) {
    const d = (x - mitte) / 36;
    const y = aktiv && Math.abs(d) < 3 ? -Math.sin(d * 1.1) * Math.exp(-d * d * 0.5) * 84 : 0;
    pts.push(`${x},${(BODEN + y).toFixed(1)}`);
  }
  const path = "M" + pts.join("L");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", pointerEvents: "none" }}>
      <path d={path} fill="none" stroke={farbe} strokeWidth={24} opacity={0.18} style={{ filter: "blur(9px)" }} />
      <path d={path} fill="none" stroke={farbe} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Große, allein stehende Zahl-/Schlagwort-Zone oben (keine Text-Box-Wände!)
export const ZahlZone: React.FC<{
  s: number;
  ab: number;
  bis: number;
  text: string;
  unter?: string;
  farbe?: string;
  groesse?: number;
}> = ({ s, ab, bis, text, unter, farbe = NOIR_WEISS, groesse = 190 }) => {
  if (s < ab || s >= bis + 0.15) return null;
  const k = rein(s, ab, 0.28);
  const r = weg(s, bis, 0.14);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 290,
        textAlign: "center",
        fontFamily: ZAHLEN_SCHRIFT,
        opacity: k * (1 - r),
        transform: `translateY(${(1 - k) * 55 - r * 36}px)`,
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: groesse,
          lineHeight: 1.02,
          letterSpacing: "-0.04em",
          color: farbe,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {unter ? (
        <div
          style={{
            fontFamily: TEXT_SCHRIFT,
            fontWeight: 700,
            fontSize: 38,
            lineHeight: 1.25,
            marginTop: 20,
            color: "rgba(248,250,252,0.78)",
          }}
        >
          {unter}
        </div>
      ) : null}
    </div>
  );
};
