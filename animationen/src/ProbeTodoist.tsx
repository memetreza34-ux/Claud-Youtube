import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NoirBegruessung } from "./intro-noir";
import { MarkenLogo } from "./noir-kit";
import { EXPO, klemm, lauf, NOIR_GRUEN, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung, sfx } from "./noir-buehne";
import { TEXT_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";
import { AltlastSzene, OffenSzene, SchlussSzene, SucheSzene, T2 } from "./probe-todoist-teil2";

// Probe Reel 08 (0–35 s) nach den neuen Regeln:
// sofort Bewegung, EIN Held pro Abschnitt, Belege groß mit Kamerafahrt, Zustand über Farbe statt Text.
export const PROBE_TODOIST_SEK = 65.5;
const R = "reel-todoist";
const f = (s: number) => Math.round(s * 30);

const T = {
  brechen: 0.28,
  beliebt: 1.14,
  durchsuchen: 3.32,
  passwoerter: 5.56,
  wie: 6.68,
  willkommen: 8.02,
  name: 8.66,
  fakten: 9.74,
  server: 13.44,
  todoist: 14.2,
  laut: 15.08,
  sechs: 16.64,
  mail: 18.64,
  passwort: 19.74,
  taeter: 20.62,
  weg: 21.4,
  hinein: 22.34,
  gestohlen: 23.56,
  manipuliert: 24.98,
  automatisch: 26.3,
  drei: 27.92,
  hintergrund: 29.34,
  admin: 32.1,
  schaltet: 33.68,
  cloud: 34.46,
  ende: 35.04,
};

const ZONE_MITTE = 760; // Mitte der Bildfläche über den Untertiteln

// Schütteln bei Einschlag
const ruck = (s: number, t0: number, staerke = 14) => {
  const d = s - t0;
  if (d < 0 || d > 0.35) return 0;
  return Math.sin(d * 70) * staerke * (1 - d / 0.35);
};

/* ───────────────────────── 1. HOOK: das Handy als Held ───────────────────────── */

const AUFGABEN = [
  { text: "Milch und Brot kaufen", geheim: false },
  { text: "Zahnarzt Do 14:00", geheim: false },
  { text: "Server-Passwort: S0mmer!24", geheim: true },
  { text: "Geschenk für Mama", geheim: false },
  { text: "API-Key: sk-8f3kQ…", geheim: true },
  { text: "Steuererklärung abgeben", geheim: false },
];
const ZEILE_H = 150;
const LISTE_TOP = 262;

const Haken: React.FC<{ farbe: string }> = ({ farbe }) => (
  <div style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${farbe}`, flexShrink: 0 }} />
);

const SchluesselIcon: React.FC<{ size: number; farbe: string }> = ({ size, farbe }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="20" cy="32" r="12" fill="none" stroke={farbe} strokeWidth="6" />
    <path d="M32 32 H58 M48 32 V42 M56 32 V40" stroke={farbe} strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);

const Riss: React.FC<{ k: number }> = ({ k }) => {
  const punkte = "720,0 560,180 620,250 430,450 490,510 300,740 360,800 140,1060";
  const ast = "560,180 700,320 690,410";
  return (
    <svg width={720} height={1230} style={{ position: "absolute", inset: 0 }}>
      <polyline points={punkte} fill="none" stroke={NOIR_ROT} strokeWidth={5} strokeDasharray={1600} strokeDashoffset={1600 * (1 - k)} style={{ filter: `drop-shadow(0 0 10px ${NOIR_ROT})` }} />
      <polyline points={ast} fill="none" stroke={NOIR_ROT} strokeWidth={3} strokeDasharray={300} strokeDashoffset={300 * (1 - Math.max(0, k * 2 - 1))} />
    </svg>
  );
};

// Nutzerpunkte im Hintergrund: Welle von innen nach außen = „beliebt auf der ganzen Welt“
const NutzerWelt: React.FC<{ s: number }> = ({ s }) => {
  const punkte: React.ReactNode[] = [];
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 17; x++) {
      const px = 30 + x * 64 + (y % 2) * 32;
      const py = 40 + y * 64;
      const dist = Math.hypot(px - 540, py - ZONE_MITTE) / 900;
      const an = interpolate(s, [T.beliebt + dist * 1.2, T.beliebt + dist * 1.2 + 0.25], [0, 1], klemm);
      const flacker = 0.55 + 0.45 * Math.sin(s * 3 + random(`p${x}-${y}`) * 6);
      punkte.push(<circle key={`${x}-${y}`} cx={px} cy={py} r={4 + an * 2} fill={NOIR_ORANGE} opacity={0.06 + an * 0.5 * flacker} />);
    }
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {punkte}
    </svg>
  );
};

export const HookHandy: React.FC<{ s: number }> = ({ s }) => {
  const riss = interpolate(s, [T.brechen, T.brechen + 0.35], [0, 1], { ...klemm, easing: EXPO });
  const glitch = s > T.brechen && s < T.brechen + 0.3 ? Math.sin(s * 90) * 10 : 0;
  // Scanner läuft Zeile für Zeile, bleibt bei „Passwörtern“ auf den Geheimnissen stehen
  const scanY = interpolate(s, [T.durchsuchen, T.passwoerter], [0, ZEILE_H * 6], klemm);
  const scanAn = s >= T.durchsuchen && s < T.passwoerter + 0.15;
  const fund = rein(s, T.passwoerter, 0.35);
  const fundSchwung = schwung(s, T.passwoerter);

  const kipp = lauf(s, 0, T.wie, -16, -4, Easing.out(Easing.cubic));
  const zoom = lauf(s, 0, T.wie, 0.98, 1.08, Easing.linear);
  const verkleinern = interpolate(s, [T.beliebt, T.beliebt + 0.6, T.durchsuchen - 0.3, T.durchsuchen + 0.2], [1, 0.9, 0.9, 1], { ...klemm, easing: SANFT });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #17110c 0%, #050506 70%)" }}>
      <NutzerWelt s={s} />
      <AbsoluteFill style={{ perspective: 1800, alignItems: "center", justifyContent: "flex-start" }}>
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 180 + ruck(s, T.brechen) + ruck(s, T.passwoerter, 8),
            width: 720,
            height: 1230,
            borderRadius: 84,
            background: "linear-gradient(160deg, #2a2a30 0%, #0c0c0f 40%, #050506 100%)",
            padding: 18,
            transform: `rotateY(${kipp}deg) rotateX(5deg) scale(${zoom * verkleinern})`,
            boxShadow: `0 60px 120px rgba(0,0,0,0.8), -18px 0 50px rgba(255,138,31,0.28), inset 0 0 0 2px rgba(255,255,255,0.08)`,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 68, overflow: "hidden", background: "#1e1e1e", fontFamily: TEXT_SCHRIFT }}>
            {/* App-Kopf */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 220, background: "#dc4c3e", display: "flex", alignItems: "flex-end", padding: "0 44px 34px", gap: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MarkenLogo name="todoist-icon" size={52} />
              </div>
              <div style={{ color: "#fff", fontSize: 52, fontWeight: 800 }}>Heute</div>
            </div>
            {/* Aufgaben */}
            {AUFGABEN.map((a, i) => {
              const y = LISTE_TOP + i * ZEILE_H;
              const getroffen = scanAn && Math.abs(scanY - (i + 0.5) * ZEILE_H) < ZEILE_H * 0.6;
              const istFund = a.geheim && fund > 0;
              const dimmen = !a.geheim ? 1 - fund * 0.7 : 1;
              return (
                <div
                  key={a.text}
                  style={{
                    position: "absolute",
                    top: y,
                    left: 30,
                    right: 30,
                    height: ZEILE_H - 14,
                    borderRadius: 22,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "0 26px",
                    background: istFund ? `rgba(239,68,68,${0.18 + 0.1 * fund})` : getroffen ? "rgba(239,68,68,0.1)" : "transparent",
                    border: istFund ? `3px solid ${NOIR_ROT}` : "3px solid transparent",
                    opacity: dimmen,
                    transform: istFund ? `scale(${1 + 0.08 * fundSchwung}) translateX(${-6 * fundSchwung}px)` : undefined,
                    boxShadow: istFund ? `0 0 40px rgba(239,68,68,${0.5 * fund})` : undefined,
                    zIndex: istFund ? 2 : 1,
                  }}
                >
                  {istFund ? <SchluesselIcon size={44} farbe={NOIR_ROT} /> : <Haken farbe={i === 0 ? "#dc4c3e" : "#777"} />}
                  <div style={{ color: istFund ? "#fff" : "#e8e8e8", fontSize: 38, fontWeight: istFund ? 800 : 500, whiteSpace: "nowrap" }}>{a.text}</div>
                </div>
              );
            })}
            {/* Scanner-Strahl */}
            {scanAn ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: LISTE_TOP + scanY - 60,
                  height: 120,
                  background: `linear-gradient(180deg, transparent 0%, rgba(239,68,68,0.35) 50%, transparent 100%)`,
                  borderBottom: `4px solid ${NOIR_ROT}`,
                  boxShadow: `0 6px 30px ${NOIR_ROT}`,
                }}
              />
            ) : null}
            {/* Glitch beim Einbruch */}
            {glitch !== 0 ? <AbsoluteFill style={{ background: "rgba(239,68,68,0.18)", transform: `translateX(${glitch}px)`, mixBlendMode: "screen" }} /> : null}
            <Riss k={riss} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// „Wie konnte das passieren?“ – Figur reagiert, Kamera stößt hinein
const HookReaktion: React.FC<{ s: number }> = ({ s }) => {
  const d = s - T.wie;
  const zoom = 1.18 - 0.1 * Math.min(1, d / 1.3) + 0.04 * Math.exp(-8 * d);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${ruck(s, T.wie, 10)}px)`, transformOrigin: "50% 40%" }}>
        <Img src={staticFile(`${R}/pose-handy.jpg`)} style={{ position: "absolute", top: 140, left: -150, width: 1380, height: 1380, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 55%, #050506 78%)" }} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── 2. BELEGE: groß, Kamera fährt zur Stelle ───────────────────────── */

type Kamera = [t: number, x: number, y: number, zoom: number];
type Markierung = { ab: number; box: [number, number, number, number]; farbe?: string };

const kameraBei = (s: number, k: Kamera[]) => {
  const ts = k.map((p) => p[0]);
  const opt = { ...klemm, easing: SANFT };
  return {
    x: interpolate(s, ts, k.map((p) => p[1]), opt),
    y: interpolate(s, ts, k.map((p) => p[2]), opt),
    zoom: interpolate(s, ts, k.map((p) => p[3]), opt),
  };
};

const BelegFahrt: React.FC<{ s: number; start: number; bild: string; kamera: Kamera[]; marken: Markierung[]; dimmenAb?: number }> = ({ s, start, bild, kamera, marken, dimmenAb }) => {
  const { x, y, zoom } = kameraBei(s, kamera);
  const auftritt = rein(s, start, 0.5);
  const kipp = (1 - auftritt) * 10;
  const dimmen = dimmenAb !== undefined ? rein(s, dimmenAb, 0.4) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden", perspective: 2000 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${540 - x * zoom}px, ${ZONE_MITTE - y * zoom}px) scale(${zoom}) rotateX(${kipp}deg)`,
          opacity: auftritt,
        }}
      >
        <Img src={staticFile(bild)} style={{ width: 1080, height: 1920, borderRadius: 18, boxShadow: "0 40px 120px rgba(0,0,0,0.9)" }} />
        {dimmen > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(5,5,6,${0.72 * dimmen})` }} /> : null}
        {marken.map((m, i) => {
          const k = interpolate(s, [m.ab, m.ab + 0.4], [0, 1], { ...klemm, easing: EXPO });
          if (k <= 0) return null;
          const [x1, y1, x2, y2] = m.box;
          const farbe = m.farbe ?? NOIR_ORANGE;
          return (
            <div key={i} style={{ position: "absolute", left: x1 - 10, top: y1 - 8, width: (x2 - x1 + 20) * k, height: y2 - y1 + 16, border: `5px solid ${farbe}`, borderRadius: 10, background: dimmen > 0 ? "transparent" : `${farbe}1f`, boxShadow: `0 0 ${24 * k}px ${farbe}` }}>
              {dimmen > 0 ? (
                <div style={{ position: "absolute", inset: 3, overflow: "hidden", borderRadius: 6 }}>
                  <Img src={staticFile(bild)} style={{ position: "absolute", left: -(x1 - 10 + 8), top: -(y1 - 8 + 8), width: 1080, height: 1920 }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {/* weicher Abschluss über den Untertiteln */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0.0) 62%, rgba(5,5,6,0.96) 74%, #050506 100%)" }} />
      <div style={{ position: "absolute", left: 28, bottom: 40, fontFamily: TEXT_SCHRIFT, fontSize: 22, color: "rgba(255,255,255,0.45)" }}>
        {bild.includes("gbhackers") ? "Quelle: GBHackers, 26.11.2026" : "Quelle: Todoist Security Advisory, Nov. 2026"}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 3. DER WEG HINEIN: ein Schlüssel reist durchs Bild ───────────────────────── */

// Welt-Koordinaten (1080 breit, 3200 hoch). Unten das Entwickler-Gerät, oben die Cloud.
const P = {
  laptop: { x: 540, y: 2760 },
  zahnrad: [
    { x: 250, y: 1900 },
    { x: 540, y: 1860 },
    { x: 830, y: 1900 },
  ],
  admin: { x: 540, y: 1160 },
  cloud: { x: 540, y: 420 },
};

const zahnradPfad = (r: number, zaehne: number) => {
  const pkt: string[] = [];
  const innen = r * 0.8;
  for (let i = 0; i < zaehne * 2; i++) {
    const a1 = (i / (zaehne * 2)) * Math.PI * 2;
    const a2 = ((i + 1) / (zaehne * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : innen;
    pkt.push(`${Math.cos(a1) * rr},${Math.sin(a1) * rr}`, `${Math.cos(a2) * rr},${Math.sin(a2) * rr}`);
  }
  return `M${pkt.join(" L")} Z`;
};

const Zahnrad: React.FC<{ x: number; y: number; dreh: number; rot: number }> = ({ x, y, dreh, rot }) => {
  const farbe = rot > 0.5 ? NOIR_ROT : "#9aa0ad";
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh})`}>
      <path d={zahnradPfad(92, 10)} fill={`url(#zahnGrad${rot > 0.5 ? "Rot" : ""})`} stroke={farbe} strokeWidth={3} style={{ filter: rot > 0.5 ? `drop-shadow(0 0 ${18 * rot}px ${NOIR_ROT})` : undefined }} />
      <circle r={34} fill="#050506" stroke={farbe} strokeWidth={4} />
      <text y={14} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={36} fill={farbe}>
        {"</>"}
      </text>
    </g>
  );
};

const Schluessel: React.FC<{ x: number; y: number; groesse: number; farbe: string; glanz: number; krone: number; winkel: number }> = ({ x, y, groesse, farbe, glanz, krone, winkel }) => (
  <g transform={`translate(${x} ${y}) rotate(${winkel}) scale(${groesse})`} style={{ filter: `drop-shadow(0 0 ${16 + 24 * glanz}px ${farbe})` }}>
    <circle cx={-46} cy={0} r={34} fill="none" stroke={farbe} strokeWidth={16} />
    <rect x={-14} y={-8} width={110} height={16} rx={6} fill={farbe} />
    <rect x={62} y={4} width={14} height={30} rx={4} fill={farbe} />
    <rect x={84} y={4} width={12} height={22} rx={4} fill={farbe} />
    {krone > 0 ? (
      <path d="M-76 -54 L-66 -86 L-52 -64 L-46 -94 L-40 -64 L-26 -86 L-16 -54 Z" fill="#ffd400" transform={`translate(0 ${(1 - krone) * 30}) scale(1)`} opacity={krone} />
    ) : null}
  </g>
);

const Laptop: React.FC<{ x: number; y: number; infiziert: number }> = ({ x, y, infiziert }) => {
  const bild = infiziert > 0 ? `rgba(239,68,68,${0.25 + 0.35 * infiziert})` : "rgba(80,140,255,0.22)";
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-210} y={-270} width={420} height={270} rx={18} fill="#0d0e12" stroke="#3a3c46" strokeWidth={4} />
      <rect x={-188} y={-248} width={376} height={226} rx={8} fill={bild} />
      {new Array(6).fill(0).map((_, i) => (
        <rect key={i} x={-168} y={-226 + i * 34} width={120 + random(`code${i}`) * 200} height={12} rx={6} fill={infiziert > 0.5 ? "rgba(255,190,190,0.7)" : "rgba(200,220,255,0.6)"} />
      ))}
      <path d="M-260 0 L260 0 L230 34 L-230 34 Z" fill="#1a1b22" stroke="#3a3c46" strokeWidth={3} />
    </g>
  );
};

const Cloud: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id="cloudClip">
        <path d="M-230 90 a110 110 0 0 1 40-212 a150 150 0 0 1 280-30 a120 120 0 0 1 140 242 Z" />
      </clipPath>
    </defs>
    <path d="M-230 90 a110 110 0 0 1 40-212 a150 150 0 0 1 280-30 a120 120 0 0 1 140 242 Z" fill="#14161d" stroke={rot > 0 ? NOIR_ROT : "#5a5f6e"} strokeWidth={5} />
    <g clipPath="url(#cloudClip)">
      <rect x={-300} y={90 - 320 * rot} width={640} height={320} fill="rgba(239,68,68,0.55)" />
    </g>
    {/* Server-Schränke unter der Wolke */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-150 + i * 110} 120)`}>
        <rect width={80} height={150} rx={8} fill="#0d0e12" stroke={rot > (2 - i) / 3 ? NOIR_ROT : "#3a3c46"} strokeWidth={3} />
        {[0, 1, 2, 3].map((j) => (
          <circle key={j} cx={18} cy={26 + j * 32} r={6} fill={rot > (2 - i) / 3 ? NOIR_ROT : "#2fd27a"} />
        ))}
      </g>
    ))}
  </g>
);

const WegHinein: React.FC<{ s: number }> = ({ s }) => {
  // Kamera: [Zeit, Welt-y, Zoom]
  const kam: [number, number, number][] = [
    [T.weg, 1650, 0.52],
    [T.gestohlen - 0.2, 1650, 0.55],
    [T.gestohlen + 0.5, 2620, 1.0],
    [T.manipuliert + 0.2, 2620, 1.0],
    [T.automatisch, 1900, 0.95],
    [T.hintergrund + 0.8, 1800, 0.82],
    [T.admin - 0.1, 1650, 0.8],
    [T.admin + 0.7, 1250, 0.95],
    [T.schaltet, 1250, 0.95],
    [T.cloud + 0.1, 560, 0.95],
    [T.ende + 0.3, 600, 0.8],
  ];
  const opt = { ...klemm, easing: SANFT };
  const camY = interpolate(s, kam.map((k) => k[0]), kam.map((k) => k[1]), opt);
  const zoom = interpolate(s, kam.map((k) => k[0]), kam.map((k) => k[2]), opt);

  // Schlüssel-Reise
  const reise: [number, number, number][] = [
    [T.weg, P.laptop.x + 260, P.laptop.y - 120],
    [T.manipuliert, P.laptop.x + 260, P.laptop.y - 180],
    [T.automatisch - 0.2, P.zahnrad[0].x, P.zahnrad[0].y + 190],
    [T.drei, P.zahnrad[0].x, P.zahnrad[0].y + 120],
    [T.drei + 0.12, P.zahnrad[1].x, P.zahnrad[1].y + 120],
    [T.drei + 0.24, P.zahnrad[2].x, P.zahnrad[2].y + 120],
    [T.admin, P.zahnrad[2].x - 120, P.zahnrad[2].y - 200],
    [T.admin + 0.6, P.admin.x + 170, P.admin.y],
    [T.schaltet, P.admin.x + 170, P.admin.y],
    [T.cloud, P.cloud.x, P.cloud.y + 40],
  ];
  const kx = interpolate(s, reise.map((r) => r[0]), reise.map((r) => r[1]), opt);
  const ky = interpolate(s, reise.map((r) => r[0]), reise.map((r) => r[2]), opt);

  const gestohlen = rein(s, T.gestohlen, 0.4);
  const pfad = interpolate(s, [T.weg + 0.2, T.hinein + 0.6], [0, 1], { ...klemm, easing: SANFT });
  const rotZahn = (i: number) => (s >= T.drei + i * 0.12 ? 1 : 0);
  const dreh = (i: number) => (s - T.automatisch) * (rotZahn(i) ? 140 : 40) * (i % 2 === 0 ? 1 : -1) + i * 18;
  const adminK = rein(s, T.admin, 0.35);
  const adminGezogen = interpolate(s, [T.admin + 0.3, T.admin + 0.8], [0, 1], { ...klemm, easing: EXPO });
  const cloudRot = interpolate(s, [T.cloud - 0.1, T.cloud + 0.5], [0, 1], { ...klemm, easing: EXPO });
  const schluesselFarbe = s >= T.gestohlen ? NOIR_ROT : "#f5f5f5";

  // Datenpakete laufen automatisch durch die Zahnräder („im Hintergrund“)
  const pakete: React.ReactNode[] = [];
  if (s > T.hintergrund - 0.3) {
    for (let i = 0; i < 9; i++) {
      const phase = ((s - T.hintergrund) * 0.9 + i / 9) % 1;
      const xx = 120 + phase * 840;
      pakete.push(<rect key={i} x={xx - 14} y={2040 - 14} width={28} height={28} rx={6} fill={NOIR_ROT} opacity={0.85 * rein(s, T.hintergrund - 0.3, 0.4)} />);
    }
  }

  const label = (x: number, y: number, t: string, an: number) => (
    <text x={x} y={y} textAnchor="middle" fontFamily={TEXT_SCHRIFT} fontWeight={700} fontSize={30} letterSpacing={3} fill="rgba(255,255,255,0.55)" opacity={an}>
      {t}
    </text>
  );

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #121318 0%, #050506 75%)", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="zahnGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#3a3d47" />
            <stop offset="100%" stopColor="#14151b" />
          </radialGradient>
          <radialGradient id="zahnGradRot" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#7a1f1f" />
            <stop offset="100%" stopColor="#2a0a0c" />
          </radialGradient>
        </defs>
        <g transform={`translate(540 ${ZONE_MITTE}) scale(${zoom}) translate(-540 ${-camY})`}>
          {/* Raster als Boden für Tiefe */}
          {new Array(40).fill(0).map((_, i) => (
            <line key={i} x1={-400} x2={1480} y1={i * 90} y2={i * 90} stroke="rgba(255,255,255,0.035)" strokeWidth={2} />
          ))}
          {/* Der Weg (zeichnet sich bei „Weg hinein“) */}
          <path
            d={`M ${P.laptop.x + 260} ${P.laptop.y - 120} C 700 2350, 250 2250, ${P.zahnrad[0].x} ${P.zahnrad[0].y + 120} L ${P.zahnrad[2].x} ${P.zahnrad[2].y + 120} C 900 1500, 700 1300, ${P.admin.x + 170} ${P.admin.y} C 800 800, 560 700, ${P.cloud.x} ${P.cloud.y + 40}`}
            fill="none"
            stroke={NOIR_ORANGE}
            strokeOpacity={0.45}
            strokeWidth={6}
            strokeDasharray="4 22"
            strokeLinecap="round"
            pathLength={1}
            style={{ strokeDashoffset: 0 }}
            clipPath="none"
            opacity={pfad}
          />
          <Laptop x={P.laptop.x - 80} y={P.laptop.y} infiziert={gestohlen} />
          {label(P.laptop.x - 80, P.laptop.y + 90, "ENTWICKLER-GERÄT", 1)}
          {/* Förderband der Code-Abläufe */}
          <line x1={110} x2={970} y1={2040} y2={2040} stroke="#2a2c34" strokeWidth={10} strokeLinecap="round" />
          {pakete}
          {P.zahnrad.map((z, i) => (
            <Zahnrad key={i} x={z.x} y={z.y} dreh={dreh(i)} rot={rotZahn(i)} />
          ))}
          {label(540, 2110, "AUTOMATISCHE CODE-ABLÄUFE", 1)}
          {/* Admin-Zugang */}
          <g transform={`translate(${P.admin.x - 80 + adminGezogen * 60} ${P.admin.y}) scale(${0.9 + 0.1 * schwung(s, T.admin)})`} opacity={0.35 + 0.65 * adminK}>
            <rect x={-150} y={-95} width={300} height={190} rx={22} fill="#15171e" stroke={adminK > 0.5 ? "#ffd400" : "#3a3c46"} strokeWidth={5} />
            <circle cx={-70} cy={-10} r={42} fill="#262933" />
            <path d="M-100 40 a30 30 0 0 1 60 0 Z" fill="#262933" />
            <rect x={-10} y={-40} width={130} height={18} rx={9} fill="#ffd400" opacity={0.8} />
            <rect x={-10} y={0} width={100} height={14} rx={7} fill="#3a3c46" />
          </g>
          {label(P.admin.x - 80, P.admin.y + 150, "ADMIN-ZUGANG", adminK)}
          <Cloud x={P.cloud.x} y={P.cloud.y} rot={cloudRot} />
          <foreignObject x={P.cloud.x - 50} y={P.cloud.y - 110} width={100} height={100}>
            <div style={{ width: 100, height: 100, borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MarkenLogo name="todoist-icon" size={72} />
            </div>
          </foreignObject>
          {label(P.cloud.x, P.cloud.y + 330, "TODOIST-CLOUD", 1)}
          <Schluessel
            x={kx}
            y={ky}
            groesse={1 + 0.35 * adminGezogen}
            farbe={adminGezogen > 0.5 ? "#ffb020" : schluesselFarbe}
            glanz={gestohlen}
            krone={adminGezogen}
            winkel={interpolate(s, [T.manipuliert, T.automatisch, T.schaltet, T.cloud], [0, -70, -70, -90], opt)}
          />
        </g>
      </svg>
      {/* Rotes Aufblitzen beim Eindringen in die Cloud */}
      <AbsoluteFill style={{ background: NOIR_ROT, opacity: 0.25 * Math.max(0, 1 - Math.abs(s - T.cloud) * 4), mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 66%, #050506 78%)" }} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── Zusammenbau ───────────────────────── */

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.fakten * 1000 - 50]];

export const ProbeTodoist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  let szene: React.ReactNode = null;
  if (s < T.wie) szene = <HookHandy s={s} />;
  else if (s < T.willkommen) szene = <HookReaktion s={s} />;
  else if (s < T.fakten) szene = null;
  else if (s < T.laut)
    szene = (
      <BelegFahrt
        s={s}
        start={T.fakten}
        bild={`${R}/beleg-gbhackers.png`}
        kamera={[
          [T.fakten, 540, 520, 1.05],
          [T.server - 0.4, 540, 560, 1.2],
          [T.server + 0.4, 525, 1000, 1.1],
          [T.laut, 525, 1005, 1.14],
        ]}
        marken={[{ ab: T.todoist, box: [50, 905, 1000, 1105] }]}
      />
    );
  else if (s < T.weg)
    szene = (
      <BelegFahrt
        s={s}
        start={T.laut}
        bild={`${R}/beleg-todoist-6pct.png`}
        kamera={[
          [T.laut, 540, 760, 1.0],
          [T.sechs - 0.4, 450, 920, 1.45],
          [T.mail - 0.5, 450, 940, 1.45],
          [T.mail + 0.3, 400, 1250, 1.55],
          [T.weg, 420, 1200, 1.4],
        ]}
        marken={[
          { ab: T.sechs, box: [111, 942, 783, 980], farbe: NOIR_ORANGE },
          { ab: T.mail, box: [168, 1245, 520, 1282], farbe: NOIR_ROT },
          { ab: T.passwort, box: [168, 1320, 520, 1357], farbe: NOIR_ROT },
        ]}
        dimmenAb={T.taeter}
      />
    );
  else if (s < T.ende) szene = <WegHinein s={s} />;
  else if (s < T2.brisant) szene = <AltlastSzene s={s} />;
  else if (s < T2.aufgaben - 0.28)
    szene = (
      <BelegFahrt
        s={s}
        start={T2.brisant}
        bild={`${R}/beleg-todoist-suche.png`}
        kamera={[
          [T2.brisant, 500, 800, 1.2],
          [T2.brisant + 0.9, 480, 900, 1.3],
          [T2.durchforstet - 0.2, 480, 920, 1.3],
          [T2.durchforstet + 0.5, 600, 1560, 1.35],
          [T2.aufgaben, 600, 1580, 1.4],
        ]}
        marken={[
          { ab: T2.brisant + 1.0, box: [100, 900, 850, 1015], farbe: NOIR_ROT },
          { ab: T2.durchforstet + 0.4, box: [415, 1535, 975, 1650], farbe: NOIR_ROT },
        ]}
      />
    );
  else if (s < T2.stand) szene = <SucheSzene s={s} />;
  else if (s < T2.offen)
    szene = (
      <BelegFahrt
        s={s}
        start={T2.stand}
        bild={`${R}/beleg-todoist-top.png`}
        kamera={[
          [T2.stand, 420, 780, 1.35],
          [T2.blockiert + 0.2, 420, 800, 1.35],
          [T2.blockiert + 0.8, 540, 1180, 1.2],
          [T2.warnt - 0.4, 540, 1200, 1.2],
          [T2.warnt + 0.3, 540, 1370, 1.25],
          [T2.offen, 540, 1380, 1.27],
        ]}
        marken={[
          { ab: T2.stand + 0.1, box: [100, 695, 720, 860] },
          { ab: T2.blockiert + 0.7, box: [100, 1150, 1010, 1205], farbe: NOIR_GRUEN },
          { ab: T2.warnt, box: [100, 1300, 1010, 1420], farbe: NOIR_GRUEN },
        ]}
      />
    );
  else if (s < T2.schluss) szene = <OffenSzene s={s} />;
  else szene = <SchlussSzene s={s} />;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050506" }}>
      <Audio src={staticFile(`${R}/audio.wav`)} />
      <Sequence from={f(T.brechen)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
      <Sequence from={f(T.durchsuchen)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.3} /></Sequence>
      <Sequence from={f(T.passwoerter)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.4} /></Sequence>
      <Sequence from={f(T.wie)} durationInFrames={30}><Audio src={sfx("schnipp")} volume={0.35} /></Sequence>
      <Sequence from={f(T.todoist)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T.sechs)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T.mail)} durationInFrames={30}><Audio src={sfx("tick")} volume={0.35} /></Sequence>
      <Sequence from={f(T.passwort)} durationInFrames={30}><Audio src={sfx("tick")} volume={0.35} /></Sequence>
      <Sequence from={f(T.gestohlen)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
      <Sequence from={f(T.drei)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>
      <Sequence from={f(T.admin)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.35} /></Sequence>
      <Sequence from={f(T.cloud)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.konten)} durationInFrames={30}><Audio src={sfx("schnipp")} volume={0.3} /></Sequence>
      <Sequence from={f(T2.zehn)} durationInFrames={30}><Audio src={sfx("tick")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.sha1)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
      <Sequence from={f(T2.brisant + 1.0)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.aufgaben)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.3} /></Sequence>
      <Sequence from={f(T2.kommentare)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.outlook)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.schluessel)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.blockiert + 0.7)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>
      <Sequence from={f(T2.warnt)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.bleibt)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.35} /></Sequence>
      <Sequence from={f(T2.todo)} durationInFrames={30}><Audio src={sfx("schnipp")} volume={0.35} /></Sequence>

      {szene}

      <Sequence from={f(T.willkommen)} durationInFrames={f(T.fakten) - f(T.willkommen)} layout="none">
        <NoirBegruessung nameAb={T.name - T.willkommen} ende={T.fakten - T.willkommen} bild="figur/intro-noir.jpg" />
      </Sequence>

      <Untertitel datei={`${R}/untertitel.json`} top={1420} wechselMs={1080} groesse={60} saetze ohne={OHNE_UNTERTITEL} />
    </AbsoluteFill>
  );
};

// Cover: Flow-Bild der Figur mit gehacktem Handy + erklärender Text (wer, was, wie viele)
export const CoverTodoist: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Img src={staticFile(`${R}/cover-flow.jpg`)} style={{ position: "absolute", left: 0, top: -15, width: 1080, height: 1935 }} />
    <div style={{ position: "absolute", left: 70, right: 60, top: 150, fontFamily: TEXT_SCHRIFT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 30 }}>
        <div style={{ width: 92, height: 92, borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MarkenLogo name="todoist-icon" size={70} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 84, color: NOIR_ROT, letterSpacing: -1 }}>TODOIST GEHACKT</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 82, lineHeight: 1.08, color: "#f5f5f5", letterSpacing: -1 }}>
        Hacker durchsuchen deine <span style={{ color: NOIR_ORANGE }}>Aufgaben</span> nach <span style={{ color: NOIR_ORANGE }}>Passwörtern</span>
      </div>
      <div style={{ marginTop: 34, display: "inline-block", padding: "12px 24px", borderRadius: 14, background: "rgba(239,68,68,0.16)", border: `3px solid ${NOIR_ROT}`, fontWeight: 700, fontSize: 40, color: "#fff" }}>
        Rund 6 % aller Konten betroffen
      </div>
    </div>
  </AbsoluteFill>
);
