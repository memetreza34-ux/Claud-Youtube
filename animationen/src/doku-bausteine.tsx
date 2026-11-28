import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { EXPO, klemm, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { TEXT_SCHRIFT } from "./stil";
import { useFlaeche } from "./format";

// Doku-Bausteine (16:9) aus der Analyse in planung/visuelle-techniken.md:
// FilmLook · ArtikelSchraeg · Bauplan (Grund, Box, GluehLinie, DatenPaket) · Pinnwand
// Alle Zeiten in Sekunden (s = aktuelle Zeit, ab = Startzeit).


/* ───────── 1. Film-Look: Korn, Vignette, Lichtschein, rauer Grund ───────── */

export const RauerGrund: React.FC<{ ton?: string }> = ({ ton = "#0d0d10" }) => {
  const { W, H } = useFlaeche();
  return (
  <AbsoluteFill style={{ backgroundColor: ton }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
      <filter id="rauerGrund">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={7} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.10  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#rauerGrund)" />
    </svg>
  </AbsoluteFill>
  );
};

export const FilmLook: React.FC<{ children: React.ReactNode; lichtschein?: number[]; s: number; korn?: number }> = ({ children, lichtschein = [], s, korn = 0.22 }) => {
  const frame = useCurrentFrame();
  const { W, H } = useFlaeche();
  const seed = Math.floor(frame / 2) % 50;
  const schein = lichtschein.reduce((m, t) => Math.max(m, interpolate(s, [t - 0.25, t, t + 0.6], [0, 1, 0], klemm)), 0);
  const flacker = 1 + 0.015 * Math.sin(frame * 1.7) * Math.sin(frame * 0.37);
  return (
    <AbsoluteFill style={{ filter: `brightness(${flacker})` }}>
      {children}
      {/* Lichtschein beim Szenenwechsel */}
      {schein > 0 ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 90% at ${20 + 60 * schein}% 40%, rgba(255,150,60,${0.45 * schein}) 0%, rgba(255,90,20,${0.18 * schein}) 40%, transparent 70%)`, mixBlendMode: "screen" }} />
      ) : null}
      {/* Vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      {/* Filmkorn */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: korn, pointerEvents: "none" }}>
        <filter id={`korn${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#korn${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ───────── 2. Artikel als schräge Seite mit Tiefenunschärfe ───────── */
// Seite liegt gekippt im Raum und bleibt IMMER ganz im Bild (kein Anschneiden).
// fokusY = Höhe der wichtigen Zeile im Screenshot (0 oben … 1 unten): dort ist es scharf, zum Rand hin unscharf.
export const ArtikelSchraeg: React.FC<{
  s: number;
  ab: number;
  bis: number;
  bild: string;
  quelle: string;
  fokusY?: number;
  breite?: number;
  seitenVerhaeltnis?: number;
  richtung?: 1 | -1;
}> = ({ s, ab, bis, bild, quelle, fokusY = 0.45, breite: breiteVorgabe, seitenVerhaeltnis = 16 / 9, richtung = 1 }) => {
  const { hoch } = useFlaeche();
  const breite = breiteVorgabe ?? (seitenVerhaeltnis < 1 ? (hoch ? 900 : 720) : hoch ? 1020 : 1680);
  const hoehe = breite / seitenVerhaeltnis;
  const auftritt = interpolate(s, [ab, ab + 0.7], [0, 1], { ...klemm, easing: EXPO });
  const fahrt = interpolate(s, [ab, bis], [0, 1], klemm);
  const rotX = 16 - 4 * fahrt;
  const rotY = richtung * (-14 + 6 * fahrt);
  const rotZ = richtung * 2.5;
  const skala = 0.92 + 0.06 * fahrt;
  const schaerfeOben = Math.max(0, fokusY - 0.12) * 100;
  const schaerfeUnten = Math.min(1, fokusY + 0.12) * 100;
  const maske = `linear-gradient(180deg, transparent ${schaerfeOben - 8}%, #000 ${schaerfeOben}%, #000 ${schaerfeUnten}%, transparent ${schaerfeUnten + 8}%)`;
  const seite: React.CSSProperties = { position: "absolute", inset: 0, width: breite, height: hoehe, objectFit: "cover", borderRadius: 6 };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <RauerGrund />
      <AbsoluteFill style={{ perspective: 2200, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: breite,
            height: hoehe,
            transform: `translateY(${(1 - auftritt) * 120 + 30}px) scale(${skala}) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
            opacity: auftritt,
            boxShadow: "0 60px 120px rgba(0,0,0,0.85), 0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          {/* unscharfe Seite */}
          <Img src={staticFile(bild)} style={{ ...seite, filter: "blur(5px) brightness(0.75)" }} />
          {/* scharfer Streifen um die wichtige Zeile */}
          <Img src={staticFile(bild)} style={{ ...seite, WebkitMaskImage: maske, maskImage: maske }} />
          {/* leichtes Papierlicht */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)", borderRadius: 6 }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: TEXT_SCHRIFT, fontSize: 22, color: "rgba(255,255,255,0.55)", opacity: auftritt }}>Quelle: {quelle}</div>
    </AbsoluteFill>
  );
};

/* ───────── 3. Noir-Bauplan: einheitlicher Technik-Stil aus leuchtenden Strichen ───────── */
export const BAUPLAN = NOIR_ORANGE;

export const BauplanGrund: React.FC<{ s: number; ab: number; titel?: string }> = ({ s, ab, titel }) => {
  const { W, H } = useFlaeche();
  const k = rein(s, ab, 0.8);
  const linien: React.ReactNode[] = [];
  for (let x = 0; x <= W; x += 80) linien.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={H} stroke={BAUPLAN} strokeOpacity={x % 400 === 0 ? 0.12 : 0.05} strokeWidth={1} />);
  for (let y = 0; y <= H; y += 80) linien.push(<line key={`y${y}`} x1={0} y1={y} x2={W} y2={y} stroke={BAUPLAN} strokeOpacity={y % 400 === 0 ? 0.12 : 0.05} strokeWidth={1} />);
  const ecke = (x: number, y: number, dx: number, dy: number) => <path d={`M${x} ${y + dy * 50} L${x} ${y} L${x + dx * 50} ${y}`} stroke={BAUPLAN} strokeWidth={3} fill="none" opacity={0.8} />;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #140d06 0%, #050506 75%)" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: k }}>
        {linien}
        {ecke(40, 40, 1, 1)}
        {ecke(W - 40, 40, -1, 1)}
        {ecke(40, H - 40, 1, -1)}
        {ecke(W - 40, H - 40, -1, -1)}
        {/* Skala unten */}
        {new Array(Math.floor((W - 400) / 38)).fill(0).map((_, i) => (
          <line key={i} x1={200 + i * 38} y1={H - 52} x2={200 + i * 38} y2={H - (i % 5 === 0 ? 70 : 60)} stroke={BAUPLAN} strokeOpacity={0.5} strokeWidth={2} />
        ))}
      </svg>
      {titel ? (
        <div style={{ position: "absolute", left: 70, top: 56, fontFamily: "monospace", fontSize: 24, letterSpacing: 4, color: BAUPLAN, opacity: 0.85 * k }}>
          {titel}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Linie, die sich selbst zeichnet und glüht
export const GluehLinie: React.FC<{ s: number; ab: number; d: string; dauer?: number; farbe?: string; breite?: number; gestrichelt?: boolean }> = ({ s, ab, d, dauer = 0.8, farbe = BAUPLAN, breite = 3, gestrichelt = false }) => {
  const k = interpolate(s, [ab, ab + dauer], [0, 1], { ...klemm, easing: SANFT });
  if (k <= 0) return null;
  return (
    <g style={{ filter: `drop-shadow(0 0 8px ${farbe})` }}>
      {gestrichelt ? (
        <path d={d} pathLength={1} fill="none" stroke={farbe} strokeWidth={breite} strokeDasharray="0.012 0.012" strokeLinecap="round" opacity={k} />
      ) : (
        <path d={d} pathLength={1} fill="none" stroke={farbe} strokeWidth={breite} strokeDasharray="1 1" strokeDashoffset={1 - k} strokeLinecap="round" />
      )}
    </g>
  );
};

// Lichtpunkte, die entlang eines Pfades laufen (Datenfluss)
export const DatenPaket: React.FC<{ s: number; ab: number; d: string; anzahl?: number; tempo?: number; farbe?: string; bis?: number }> = ({ s, ab, d, anzahl = 3, tempo = 0.6, farbe = BAUPLAN, bis = Infinity }) => {
  if (s < ab || s > bis) return null;
  const laenge = getLength(d);
  return (
    <g>
      {new Array(anzahl).fill(0).map((_, i) => {
        const phase = ((s - ab) * tempo + i / anzahl) % 1;
        const p = getPointAtLength(d, phase * laenge);
        if (!p) return null;
        return <circle key={i} cx={p.x} cy={p.y} r={7} fill="#fff" style={{ filter: `drop-shadow(0 0 10px ${farbe}) drop-shadow(0 0 4px ${farbe})` }} />;
      })}
    </g>
  );
};

// Gerät/Station als gezeichneter Kasten mit Strich-Icon und kleiner Beschriftung
export const BauplanBox: React.FC<{ s: number; ab: number; x: number; y: number; b?: number; h?: number; label: string; icon: React.ReactNode; farbe?: string; alarm?: boolean }> = ({ s, ab, x, y, b = 340, h = 260, label, icon, farbe = BAUPLAN, alarm = false }) => {
  const k = interpolate(s, [ab, ab + 0.6], [0, 1], { ...klemm, easing: SANFT });
  if (k <= 0) return null;
  const f = alarm ? NOIR_ROT : farbe;
  const puls = alarm ? 0.6 + 0.4 * Math.sin(s * 8) : 1;
  return (
    <div style={{ position: "absolute", left: x - b / 2, top: y - h / 2, width: b, height: h }}>
      <svg width={b} height={h} style={{ position: "absolute", inset: 0, overflow: "visible", filter: `drop-shadow(0 0 ${10 * puls}px ${f})` }}>
        <rect x={2} y={2} width={b - 4} height={h - 4} rx={10} pathLength={1} fill={`${f}0d`} stroke={f} strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={1 - k} />
        {[[0, 0], [b, 0], [0, h], [b, h]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill={f} opacity={k} />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: f, opacity: interpolate(k, [0.5, 1], [0, 1], klemm) }}>{icon}</div>
      <div style={{ position: "absolute", left: -40, right: -40, top: h + 16, textAlign: "center", fontFamily: "monospace", fontSize: 32, letterSpacing: 3, color: f, opacity: interpolate(k, [0.6, 1], [0, 1], klemm) }}>{label}</div>
    </div>
  );
};

/* ───────── 4. Pinnwand: echte Belege fallen auf die Ermittler-Wand, rote Fäden verbinden ───────── */
export type PinElement = {
  ab: number;
  x: number; // Mitte
  y: number;
  breite: number;
  drehung?: number;
  bild?: string; // Foto/Screenshot
  zettel?: string; // handschriftlicher Zettel
  verhaeltnis?: number; // Breite/Höhe des Bildes
  ausschnittY?: number; // welcher Teil eines Screenshots (0 oben … 1 unten)
};

export const Pinnwand: React.FC<{ s: number; ab: number; elemente: PinElement[]; faeden?: [a: number, b: number, ab: number][]; fokus?: [t: number, index: number | null][] }> = ({ s, ab, elemente, faeden = [], fokus = [] }) => {
  const { W, H } = useFlaeche();
  // Kamera: leichte Fahrt, optional kurz zu einem Element (Zoom höchstens 1,15)
  const ziele = fokus.length ? fokus : [[ab, null] as [number, number | null]];
  let camX = W / 2;
  let camY = H / 2;
  let zoom = 1;
  for (let i = 0; i < ziele.length; i++) {
    const [t, idx] = ziele[i];
    const k = interpolate(s, [t, t + 0.8], [0, 1], { ...klemm, easing: SANFT });
    if (k <= 0) continue;
    const zx = idx === null ? W / 2 : elemente[idx].x;
    const zy = idx === null ? H / 2 : elemente[idx].y;
    const zz = idx === null ? 1 : 1.15;
    camX = camX + (zx - camX) * k;
    camY = camY + (zy - camY) * k;
    zoom = zoom + (zz - zoom) * k;
  }
  const drift = Math.sin((s - ab) * 0.4) * 6;
  const hoehe = (e: PinElement) => (e.zettel ? e.breite * 0.75 : e.breite / (e.verhaeltnis ?? 16 / 9));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <RauerGrund ton="#15100c" />
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2 - camX * zoom + drift}px, ${H / 2 - camY * zoom}px) scale(${zoom})` }}>
        {elemente.map((e, i) => {
          const k = Math.min(1.08, schwung(s, e.ab));
          if (s < e.ab) return null;
          const h = hoehe(e);
          const fall = interpolate(s, [e.ab, e.ab + 0.25], [1.35, 1], { ...klemm, easing: EXPO });
          return (
            <div key={i} style={{ position: "absolute", left: e.x - e.breite / 2, top: e.y - h / 2, width: e.breite, height: h, transform: `rotate(${e.drehung ?? 0}deg) scale(${fall})`, opacity: Math.min(1, k * 1.5), boxShadow: "0 30px 50px rgba(0,0,0,0.7), 0 6px 12px rgba(0,0,0,0.5)" }}>
              {e.bild ? (
                <div style={{ width: "100%", height: "100%", background: "#f2efe8", padding: 10, boxSizing: "border-box" }}>
                  <Img src={staticFile(e.bild)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${(e.ausschnittY ?? 0.5) * 100}%` }} />
                </div>
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#f3e6a8", padding: 24, boxSizing: "border-box", fontFamily: "'Comic Sans MS', 'Marker Felt', cursive", fontSize: e.breite / 9, color: "#2a1d0c", lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  {e.zettel}
                </div>
              )}
              {/* Pinnnadel */}
              <div style={{ position: "absolute", left: e.breite / 2 - 13, top: -10, width: 26, height: 26, borderRadius: 13, background: `radial-gradient(circle at 35% 30%, #ff8a8a, ${NOIR_ROT} 60%, #7a1010)`, boxShadow: "0 4px 8px rgba(0,0,0,0.6)" }} />
            </div>
          );
        })}
        {/* rote Fäden zwischen den Nadeln */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {faeden.map(([a, b, t], i) => {
            const k = interpolate(s, [t, t + 0.6], [0, 1], { ...klemm, easing: SANFT });
            if (k <= 0) return null;
            const ea = elemente[a];
            const eb = elemente[b];
            const ax = ea.x;
            const ay = ea.y - hoehe(ea) / 2;
            const bx = eb.x;
            const by = eb.y - hoehe(eb) / 2;
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2 + 40;
            return <path key={i} d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} pathLength={1} fill="none" stroke="#d11f1f" strokeWidth={4} strokeDasharray="1 1" strokeDashoffset={1 - k} style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.6))" }} />;
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const zufall = random;
