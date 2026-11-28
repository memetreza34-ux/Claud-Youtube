import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { EXPO, klemm, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { ANTON_SCHRIFT, TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";

// Bausteine für lange Videos (16:9, 1920×1080) im Motion-Standard 2.0
export const W = 1920;
export const H = 1080;
export const MITTE_Y = 450; // Mitte der Bildfläche über den Untertiteln
export const BLAU = "#5ab4ff";
export const GRUEN = "#22c55e";

export const Grund16: React.FC<{ children?: React.ReactNode; ton?: "kalt" | "warm" | "rot" }> = ({ children, ton = "kalt" }) => {
  const mitte = ton === "warm" ? "#1a120b" : ton === "rot" ? "#1d0b0c" : "#11141b";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${mitte} 0%, #050506 72%)`, overflow: "hidden", fontFamily: TEXT_SCHRIFT, color: "#f5f5f5" }}>
      {children}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 76%, rgba(5,5,6,0.9) 86%)" }} />
    </AbsoluteFill>
  );
};

export const ruck = (s: number, t0: number, staerke = 12) => {
  const d = s - t0;
  if (d < 0 || d > 0.35) return 0;
  return Math.sin(d * 70) * staerke * (1 - d / 0.35);
};

// Ploppt auf dem Wort herein (Skalierung mit Schwung)
export const Plopp: React.FC<{ s: number; ab: number; x: number; y: number; children: React.ReactNode; weg?: number }> = ({ s, ab, x, y, children, weg }) => {
  const k = Math.min(1.15, schwung(s, ab));
  const aus = weg !== undefined ? 1 - rein(s, weg, 0.3) : 1;
  if (s < ab) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k})`, opacity: Math.min(1, k * 2) * aus }}>{children}</div>
  );
};

// Kleine Beschriftung (Großbuchstaben, ~28 px)
export const Label: React.FC<{ children: React.ReactNode; farbe?: string; groesse?: number }> = ({ children, farbe = "rgba(255,255,255,0.6)", groesse = 28 }) => (
  <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: groesse, letterSpacing: 3, color: farbe, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

// Icon-Kachel mit Licht und Tiefe (keine flache Kachel)
export const IconKugel: React.FC<{ children: React.ReactNode; farbe?: string; groesse?: number; aus?: boolean }> = ({ children, farbe = NOIR_ORANGE, groesse = 150, aus = false }) => (
  <div
    style={{
      width: groesse,
      height: groesse,
      borderRadius: groesse / 2,
      background: `radial-gradient(circle at 35% 30%, ${aus ? "#2a2a30" : farbe + "55"} 0%, #0d0e12 75%)`,
      border: `4px solid ${aus ? "#3a3c46" : farbe}`,
      boxShadow: aus ? "0 20px 40px rgba(0,0,0,0.6)" : `0 0 40px ${farbe}66, 0 20px 40px rgba(0,0,0,0.6)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: aus ? "#555a66" : farbe,
      position: "relative",
    }}
  >
    {children}
  </div>
);

// Durchstreichen auf dem Wort
export const Streich: React.FC<{ s: number; ab: number; breite: number }> = ({ s, ab, breite }) => {
  const k = interpolate(s, [ab, ab + 0.3], [0, 1], { ...klemm, easing: EXPO });
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: "50%", top: "50%", width: breite * k, height: 10, marginLeft: -breite / 2, background: NOIR_ROT, borderRadius: 5, transform: "rotate(-20deg)", boxShadow: `0 0 16px ${NOIR_ROT}` }} />;
};

// Zahl, die hochrollt
export const RollZahl: React.FC<{ s: number; ab: number; dauer?: number; von?: number; bis: number; format?: (n: number) => string; groesse?: number; farbe?: string }> = ({ s, ab, dauer = 1.2, von = 0, bis, format = (n) => Math.round(n).toLocaleString("de-DE"), groesse = 200, farbe = NOIR_ORANGE }) => {
  const k = interpolate(s, [ab, ab + dauer], [0, 1], { ...klemm, easing: SANFT });
  return (
    <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: groesse, lineHeight: 1, color: farbe, textShadow: `0 0 50px ${farbe}66`, opacity: rein(s, ab - 0.1, 0.3) }}>
      {format(von + (bis - von) * k)}
    </div>
  );
};

// Kapitel-Titel: 2 s am Kapitelanfang, dann weg (nur lange Videos)
export const KapitelTitel: React.FC<{ s: number; ab: number; nr: string; text: string }> = ({ s, ab, nr, text }) => {
  const an = rein(s, ab, 0.4);
  const aus = rein(s, ab + 2.0, 0.4);
  if (s < ab || s > ab + 2.5) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 70, opacity: an * (1 - aus), transform: `translateX(${(1 - an) * -40}px)` }}>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: NOIR_ORANGE }}>KAPITEL {nr}</div>
      <div style={{ fontFamily: ANTON_SCHRIFT, fontSize: 64, color: "#f5f5f5", lineHeight: 1.05 }}>{text}</div>
      <div style={{ marginTop: 10, height: 5, width: 260 * an, background: NOIR_ORANGE, borderRadius: 3 }} />
    </div>
  );
};

// Flow-Bild mit langsamer Kamerafahrt (Ken Burns) und Stoß zu Beginn
export const FlowBild: React.FC<{ s: number; ab: number; bis: number; bild: string; ursprung?: string; zoomVon?: number; zoomBis?: number }> = ({ s, ab, bis, bild, ursprung = "50% 45%", zoomVon = 1.12, zoomBis = 1.0 }) => {
  const d = s - ab;
  const zoom = interpolate(s, [ab, bis], [zoomVon, zoomBis], klemm) + 0.04 * Math.exp(-8 * Math.max(0, d));
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ursprung, opacity: rein(s, ab, 0.25) }}>
        <Img src={staticFile(bild)} style={{ width: W, height: H, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 70%, rgba(5,5,6,0.85) 88%)" }} />
    </AbsoluteFill>
  );
};

// Beleg im Querformat: Screenshot 1920×1080, Kamera fährt sanft zur Stelle (Zoom ≤ 1,1, nie seitlich angeschnitten).
// Eine Markierung reicht: Wenn der Screenshot schon gelb markiert ist (shot.py --text), keine `marken` übergeben.
type Kamera = [t: number, x: number, y: number, zoom: number];
type Marke = { ab: number; box: [number, number, number, number]; farbe?: string };
export const Beleg16: React.FC<{ s: number; ab: number; bild: string; kamera: Kamera[]; marken?: Marke[]; quelle: string; maxZoom?: number }> = ({ s, ab, bild, kamera, marken = [], quelle, maxZoom = 1.1 }) => {
  const ts = kamera.map((k) => k[0]);
  const opt = { ...klemm, easing: SANFT };
  // Regel (Arman, 28.11.2026): Belege kaum zoomen und nie seitlich anschneiden
  const zoom = Math.min(maxZoom, interpolate(s, ts, kamera.map((k) => k[3]), opt));
  const halb = W / 2 / zoom;
  const x = Math.max(halb, Math.min(W - halb, interpolate(s, ts, kamera.map((k) => k[1]), opt)));
  const y = interpolate(s, ts, kamera.map((k) => k[2]), opt);
  const auftritt = rein(s, ab, 0.5);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden", perspective: 2400 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${W / 2 - x * zoom}px, ${MITTE_Y - y * zoom}px) scale(${zoom}) rotateX(${(1 - auftritt) * 8}deg)`, opacity: auftritt }}>
        <Img src={staticFile(bild)} style={{ width: W, height: H, borderRadius: 14, boxShadow: "0 40px 120px rgba(0,0,0,0.9)" }} />
        {marken.map((m, i) => {
          const k = interpolate(s, [m.ab, m.ab + 0.4], [0, 1], { ...klemm, easing: EXPO });
          if (k <= 0) return null;
          const [x1, y1, x2, y2] = m.box;
          const f = m.farbe ?? NOIR_ORANGE;
          return <div key={i} style={{ position: "absolute", left: x1 - 8, top: y1 - 6, width: (x2 - x1 + 16) * k, height: y2 - y1 + 12, border: `4px solid ${f}`, borderRadius: 8, background: `${f}1a`, boxShadow: `0 0 ${20 * k}px ${f}` }} />;
        })}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 74%, rgba(5,5,6,0.95) 84%)" }} />
      <div style={{ position: "absolute", left: 28, top: 20, fontFamily: TEXT_SCHRIFT, fontSize: 20, color: "rgba(255,255,255,0.5)" }}>Quelle: {quelle}</div>
    </AbsoluteFill>
  );
};

// Funkelnder Dampf / Hitzeflimmern über einem Objekt
export const Dampf: React.FC<{ s: number; x: number; y: number; breite: number; staerke: number }> = ({ s, x, y, breite, staerke }) => {
  if (staerke <= 0) return null;
  const teile: React.ReactNode[] = [];
  for (let i = 0; i < 22; i++) {
    const phase = (s * (0.35 + random(`dv${i}`) * 0.3) + random(`dp${i}`)) % 1;
    const xx = x + (random(`dx${i}`) - 0.5) * breite + Math.sin(s * 2 + i) * 20;
    const yy = y - phase * 260;
    teile.push(<circle key={i} cx={xx} cy={yy} r={18 + phase * 40} fill="#ffffff" opacity={0.09 * (1 - phase) * staerke} />);
  }
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: "blur(6px)" }}>{teile}</svg>;
};

// Flammen (stilisiert, flackernd)
export const Flammen: React.FC<{ s: number; x: number; y: number; breite: number; k: number }> = ({ s, x, y, breite, k }) => {
  if (k <= 0) return null;
  const teile: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const fx = x - breite / 2 + (i + 0.5) * (breite / 7);
    const h = (60 + random(`fh${i}`) * 70) * k * (0.8 + 0.25 * Math.sin(s * 14 + i * 2));
    teile.push(
      <path key={i} d={`M${fx - 22} ${y} Q${fx - 18} ${y - h * 0.6} ${fx} ${y - h} Q${fx + 18} ${y - h * 0.6} ${fx + 22} ${y} Z`} fill={i % 2 ? "#ffb020" : NOIR_ROT} opacity={0.9} />,
    );
  }
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 20px ${NOIR_ORANGE})` }}>{teile}</svg>;
};
