import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { RauerGrund } from "./doku-bausteine";
import { EXPO, klemm, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { ANTON_SCHRIFT, TEXT_SCHRIFT } from "./stil";
import { useFlaeche } from "./format";

// Doku-Bausteine Teil 2 (16:9): Memes mit eigener Figur, Chat, Post, Terminal, Fallakte, Karte, Browser.
// Memes NUR mit eigenen Posen aus public/posen (keine fremden Meme-Bilder).

const MEME_TEXT: React.CSSProperties = { fontFamily: ANTON_SCHRIFT, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "10px #000", paintOrder: "stroke fill", lineHeight: 1.05, textAlign: "center", letterSpacing: 1 };

/* ───────── Memes ───────── */

// Klassisches Meme: Pose groß, Text oben/unten, kurzer Zoom-Stoß beim Einblenden
export const MemeKlassisch: React.FC<{ s: number; ab: number; pose: string; oben?: string; unten?: string; untenAb?: number }> = ({ s, ab, pose, oben, unten, untenAb }) => {
  const { W, H, hoch } = useFlaeche();
  const gr = Math.min(W, H);
  const stoss = 1 + 0.06 * Math.exp(-7 * Math.max(0, s - ab));
  const k = rein(s, ab, 0.2);
  return (
    <AbsoluteFill style={{ background: "#0b0b0d", opacity: k }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${stoss})` }}>
        <Img src={staticFile(`posen/${pose}`)} style={{ height: gr, width: gr, objectFit: "cover" }} />
      </AbsoluteFill>
      {oben ? <div style={{ ...MEME_TEXT, position: "absolute", left: hoch ? 50 : 120, right: hoch ? 50 : 120, top: hoch ? 260 : 50, fontSize: hoch ? 88 : 96 }}>{oben}</div> : null}
      {unten && s >= (untenAb ?? ab) ? <div style={{ ...MEME_TEXT, position: "absolute", left: hoch ? 50 : 120, right: hoch ? 50 : 120, bottom: hoch ? 380 : 60, fontSize: hoch ? 110 : 96, transform: `scale(${Math.min(1.08, schwung(s, untenAb ?? ab))})` }}>{unten}</div> : null}
    </AbsoluteFill>
  );
};

// Zwei-Felder-Meme (Nein/Ja): zwei Posen untereinander, rechts der Text
export const MemeZweiFelder: React.FC<{ s: number; ab: number; nein: { pose: string; text: string }; ja: { pose: string; text: string; ab: number } }> = ({ s, ab, nein, ja }) => {
  const { W, H, hoch } = useFlaeche();
  const posGr = hoch ? W * 0.5 : H / 2;
  const zeile = (pose: string, text: string, t0: number, gut: boolean, y: number) => {
    const k = Math.min(1, schwung(s, t0));
    if (s < t0) return null;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: y, height: H / 2, display: "flex", opacity: Math.min(1, k * 1.5) }}>
        <Img src={staticFile(`posen/${pose}`)} style={{ width: posGr, height: H / 2, objectFit: "cover", transform: `scale(${0.9 + 0.1 * k})` }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: hoch ? "0 36px" : "0 80px", background: gut ? "#0e1a12" : "#1a0e0f", borderBottom: "4px solid #050506" }}>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: hoch ? 58 : 64, lineHeight: 1.15, color: gut ? "#7ee2a0" : "#ff9a9a" }}>{text}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {zeile(nein.pose, nein.text, ab, false, 0)}
      {zeile(ja.pose, ja.text, ja.ab, true, H / 2)}
    </AbsoluteFill>
  );
};

// Kurze Reaktion der Figur, die über eine laufende Szene springt (unten rechts, rund)
export const ReaktionsPop: React.FC<{ s: number; ab: number; bis: number; pose: string; text?: string }> = ({ s, ab, bis, pose, text }) => {
  if (s < ab || s > bis + 0.3) return null;
  const k = Math.min(1.1, schwung(s, ab)) * (1 - rein(s, bis, 0.25));
  return (
    <div style={{ position: "absolute", right: 70, bottom: 70, width: 340, height: 340, transform: `scale(${k}) rotate(${-6 + 6 * k}deg)`, transformOrigin: "100% 100%" }}>
      <div style={{ width: 340, height: 340, borderRadius: 170, overflow: "hidden", border: `8px solid ${NOIR_ORANGE}`, boxShadow: `0 0 40px ${NOIR_ORANGE}88, 0 30px 60px rgba(0,0,0,0.7)` }}>
        <Img src={staticFile(`posen/${pose}`)} style={{ width: 340, height: 340, objectFit: "cover" }} />
      </div>
      {text ? <div style={{ ...MEME_TEXT, position: "absolute", left: -60, right: -60, top: -40, fontSize: 64, WebkitTextStroke: "8px #000" }}>{text}</div> : null}
    </div>
  );
};

// Eskalations-Meme („Galaxy Brain“): Stufen untereinander, jede Stufe leuchtet stärker als die davor
export type MemeStufe = { pose: string; text: string; ab: number };
export const MemeStufen: React.FC<{ s: number; stufen: MemeStufe[] }> = ({ s, stufen }) => {
  const { W, H, hoch } = useFlaeche();
  const n = stufen.length;
  // Hochformat: Stufen untereinander (Text links, Pose rechts). Querformat: Stufen nebeneinander (Pose oben, Text unten).
  const zw = hoch ? W : W / n;
  const zh = hoch ? H / n : H;
  const posB = hoch ? W * 0.46 : zw;
  const posH = hoch ? zh : H * 0.68;
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {stufen.map((st, i) => {
        const x = hoch ? 0 : i * zw;
        const y = hoch ? i * zh : 0;
        const rahmen: React.CSSProperties = { position: "absolute", left: x, top: y, width: zw, height: zh, display: "flex", flexDirection: hoch ? "row" : "column", borderBottom: hoch ? "4px solid #050506" : undefined, borderRight: hoch ? undefined : "4px solid #050506" };
        if (s < st.ab) {
          // leere Stufe: Platzhalter baut Spannung auf, Fläche bleibt gefüllt
          return (
            <div key={i} style={{ ...rahmen, alignItems: "center", justifyContent: "center", background: "#0d0d10" }}>
              <div style={{ fontFamily: ANTON_SCHRIFT, fontSize: hoch ? 150 : 200, color: "rgba(255,138,31,0.18)" }}>?</div>
            </div>
          );
        }
        const k = Math.min(1.08, schwung(s, st.ab));
        const glut = (i + 1) / n;
        const puls = 0.85 + 0.15 * Math.sin(s * 6 + i);
        const textBox = (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: hoch ? "flex-start" : "center", padding: hoch ? "0 32px" : "0 34px", background: `linear-gradient(${hoch ? 90 : 180}deg, rgba(255,138,31,${0.05 + 0.35 * glut * puls}), rgba(255,138,31,${0.02 + 0.12 * glut}))` }}>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: hoch ? Math.min(60, zh * 0.2) : 52, lineHeight: 1.15, textAlign: hoch ? "left" : "center", color: "#fff", textShadow: glut > 0.7 ? `0 0 ${30 * glut}px ${NOIR_ORANGE}` : "none", transform: `translate${hoch ? "X" : "Y"}(${(1 - Math.min(1, k)) * -50}px)` }}>{st.text}</div>
          </div>
        );
        const bild = (
          <div style={{ width: posB, height: posH, overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <Img src={staticFile(`posen/${st.pose}`)} style={{ width: posB, height: posH, objectFit: "cover", transform: `scale(${0.92 + 0.08 * Math.min(1, k)})`, filter: `brightness(${0.75 + 0.5 * glut}) saturate(${0.8 + 0.6 * glut})` }} />
            <AbsoluteFill style={{ boxShadow: `inset 0 0 ${60 + 80 * glut}px rgba(255,138,31,${0.25 + 0.6 * glut * puls})` }} />
          </div>
        );
        return (
          <div key={i} style={{ ...rahmen, opacity: Math.min(1, k * 1.6) }}>
            {hoch ? textBox : bild}
            {hoch ? bild : textBox}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Erwartung vs. Realität: links/oben die Erwartung, dann knallt die Realität rein (Wackler, Rotstich)
export const MemeErwartung: React.FC<{ s: number; ab: number; erwartung: { pose: string; text?: string }; realitaet: { pose: string; text?: string; ab: number } }> = ({ s, ab, erwartung, realitaet }) => {
  const { W, H, hoch } = useFlaeche();
  const k1 = rein(s, ab, 0.35);
  const k2 = Math.min(1.1, schwung(s, realitaet.ab));
  const teil = rein(s, realitaet.ab, 0.3); // 0 = Erwartung allein (volle Fläche), 1 = geteilt
  const fw = hoch ? W : W - (W / 2) * teil;
  const fh = hoch ? H - (H / 2) * teil : H;
  const wackel = s > realitaet.ab ? Math.exp(-10 * (s - realitaet.ab)) * 14 : 0;
  const feld = (pose: string, label: string, text: string | undefined, x: number, y: number, k: number, real: boolean) => {
    const bw = real ? (hoch ? W : W / 2) : fw;
    const bh = real ? (hoch ? H / 2 : H) : fh;
    return (
    <div style={{ position: "absolute", left: x, top: y, width: bw, height: bh, overflow: "hidden", opacity: Math.min(1, k * 1.4), borderRight: !hoch && !real ? "6px solid #050506" : undefined, borderBottom: hoch && !real ? "6px solid #050506" : undefined }}>
      <Img src={staticFile(`posen/${pose}`)} style={{ width: bw, height: bh, objectFit: "cover", transform: `scale(${1.12 - 0.12 * Math.min(1, k)})`, filter: real ? "saturate(0.6) contrast(1.15)" : "saturate(1.05)" }} />
      {real ? <AbsoluteFill style={{ background: "rgba(239,68,68,0.16)", mixBlendMode: "multiply" }} /> : null}
      <div style={{ ...MEME_TEXT, position: "absolute", left: 0, right: 0, top: hoch ? 34 : 50, fontSize: hoch ? 72 : 84, color: real ? "#ff6b6b" : "#fff" }}>{label}</div>
      {text ? <div style={{ ...MEME_TEXT, position: "absolute", left: 30, right: 30, bottom: hoch ? 40 : 60, fontSize: hoch ? 56 : 62 }}>{text}</div> : null}
    </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#050506", transform: `translate(${wackel * Math.sin(s * 90)}px, ${wackel * Math.cos(s * 70)}px)` }}>
      {feld(erwartung.pose, "Erwartung", erwartung.text, 0, 0, k1, false)}
      {s >= realitaet.ab ? feld(realitaet.pose, "Realität", realitaet.text, hoch ? 0 : W - (W / 2) * teil, hoch ? H - (H / 2) * teil : 0, k2, true) : null}
    </AbsoluteFill>
  );
};

// Chaos-Meme („alles in Ordnung“): Pose ruhig, drumherum flackert Feuer bzw. Störung; Text oben/unten
export const MemeChaos: React.FC<{ s: number; ab: number; pose: string; oben?: string; unten?: string; untenAb?: number; art?: "feuer" | "glitch" }> = ({ s, ab, pose, oben, unten, untenAb, art = "feuer" }) => {
  const { W, H, hoch } = useFlaeche();
  const gr = Math.max(W, H * (hoch ? 0.62 : 1));
  const k = rein(s, ab, 0.3);
  const flacker = 0.75 + 0.25 * Math.sin(s * 23) * Math.sin(s * 7.3);
  const funken = Array.from({ length: 34 }, (_, i) => {
    const t = (s * (0.25 + random(`v${i}`) * 0.35) + random(`p${i}`)) % 1;
    return { x: random(`x${i}`) * W, y: H * (1.05 - t * 1.2), r: 3 + random(`r${i}`) * 6, o: Math.sin(t * Math.PI) };
  });
  const versatz = art === "glitch" && random(`g${Math.floor(s * 12)}`) > 0.7 ? 14 : 0;
  return (
    <AbsoluteFill style={{ background: "#0b0b0d", opacity: k }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile(`posen/${pose}`)} style={{ width: hoch ? W : gr, height: hoch ? H : gr, objectFit: "cover", filter: art === "feuer" ? `brightness(${0.9 + 0.15 * flacker})` : undefined, transform: `translateX(${versatz}px)` }} />
      </AbsoluteFill>
      {art === "feuer" ? (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 110%, rgba(255,110,20,${0.45 * flacker}), transparent 60%)`, mixBlendMode: "screen" }} />
          {funken.map((f, i) => (
            <div key={i} style={{ position: "absolute", left: f.x, top: f.y, width: f.r, height: f.r, borderRadius: f.r, background: "#ffb347", opacity: f.o * 0.9, boxShadow: "0 0 12px #ff8a1f" }} />
          ))}
        </>
      ) : (
        <>
          {versatz ? <AbsoluteFill style={{ background: "rgba(0,255,255,0.08)", transform: "translateX(-10px)", mixBlendMode: "screen" }} /> : null}
          {Array.from({ length: 6 }, (_, i) => {
            const an = random(`l${i}-${Math.floor(s * 10)}`) > 0.6;
            return an ? <div key={i} style={{ position: "absolute", left: 0, right: 0, top: random(`y${i}-${Math.floor(s * 10)}`) * H, height: 4 + random(`h${i}`) * 18, background: "rgba(255,255,255,0.12)" }} /> : null;
          })}
        </>
      )}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.85)" }} />
      {oben ? <div style={{ ...MEME_TEXT, position: "absolute", left: hoch ? 50 : 120, right: hoch ? 50 : 120, top: hoch ? 260 : 50, fontSize: hoch ? 84 : 92 }}>{oben}</div> : null}
      {unten && s >= (untenAb ?? ab) ? <div style={{ ...MEME_TEXT, position: "absolute", left: hoch ? 50 : 120, right: hoch ? 50 : 120, bottom: hoch ? 380 : 60, fontSize: hoch ? 104 : 96, transform: `scale(${Math.min(1.08, schwung(s, untenAb ?? ab))})` }}>{unten}</div> : null}
    </AbsoluteFill>
  );
};

// Dramatischer Zoom: drei harte Zoom-Stöße auf die Pose (Reaktion auf eine Enthüllung)
export const MemeZoom: React.FC<{ s: number; ab: number; pose: string; text?: string; ziel?: [x: number, y: number] }> = ({ s, ab, pose, text, ziel = [0.5, 0.36] }) => {
  const { W, H, hoch } = useFlaeche();
  const gr = Math.max(W, H);
  const d = s - ab;
  const stufe = d < 0.35 ? 0 : d < 0.7 ? 1 : d < 1.05 ? 2 : 3;
  const zoom = [1, 1.35, 1.8, 2.5][stufe] * (1 + 0.02 * Math.max(0, d - stufe * 0.35));
  const blitz = stufe > 0 ? Math.exp(-14 * (d - stufe * 0.35)) : 0;
  return (
    <AbsoluteFill style={{ background: "#050506", overflow: "hidden" }}>
      {(() => {
        const tx = ziel[0] * gr - (gr - W) / 2; // Zielpunkt in Bildschirm-Koordinaten
        const ty = ziel[1] * gr - (gr - H) / 2;
        const m = Math.min(1, stufe); // ab dem ersten Stoß sitzt das Ziel in der Mitte
        return (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translate(${(W / 2 - tx) * m}px, ${(H / 2 - ty) * m}px) scale(${zoom})`, transformOrigin: `${tx}px ${ty}px` }}>
            <Img src={staticFile(`posen/${pose}`)} style={{ width: gr, height: gr, objectFit: "cover" }} />
          </AbsoluteFill>
        );
      })()}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${200 + stufe * 80}px rgba(0,0,0,0.9)` }} />
      <AbsoluteFill style={{ background: NOIR_ROT, opacity: blitz * 0.35 }} />
      {text && stufe >= 3 ? <div style={{ ...MEME_TEXT, position: "absolute", left: 40, right: 40, bottom: hoch ? 380 : 70, fontSize: hoch ? 100 : 104, transform: `scale(${Math.min(1.08, schwung(s, ab + 1.05))})` }}>{text}</div> : null}
    </AbsoluteFill>
  );
};

/* ───────── Chat-Verlauf (nachgestellt) ───────── */
export type ChatNachricht = { ab: number; text: string; ich?: boolean; name?: string };
export const ChatVerlauf: React.FC<{ s: number; ab: number; titel: string; nachrichten: ChatNachricht[]; hinweis?: string }> = ({ s, ab, titel, nachrichten, hinweis = "nachgestellt" }) => {
  const sichtbar = nachrichten.filter((n) => s >= n.ab);
  const naechste = nachrichten.find((n) => s < n.ab && s > n.ab - 1.2);
  const { W, H, hoch } = useFlaeche();
  const box = hoch ? { left: 40, top: 160, width: W - 80, height: H - 560 } : { left: W / 2 - 560, top: 50, width: 1120, height: 980 };
  const k = rein(s, ab, 0.5);
  return (
    <AbsoluteFill>
      <RauerGrund />
      <div style={{ position: "absolute", ...box, borderRadius: 50, background: "#0f1115", border: "6px solid #2a2d36", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,0.8)", opacity: k, transform: `translateY(${(1 - k) * 80}px)` }}>
        <div style={{ height: 120, background: "#171a21", display: "flex", alignItems: "center", gap: 20, padding: "0 36px", borderBottom: "2px solid #2a2d36" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#3a3f4c" }} />
          <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 36, color: "#f5f5f5" }}>{titel}</div>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, display: "flex", flexDirection: "column", gap: 18 }}>
          {sichtbar.map((n, i) => {
            const p = Math.min(1, schwung(s, n.ab));
            return (
              <div key={i} style={{ alignSelf: n.ich ? "flex-end" : "flex-start", maxWidth: "78%", padding: "20px 28px", borderRadius: 28, background: n.ich ? "#2b5f3d" : "#262a33", color: "#f5f5f5", fontFamily: TEXT_SCHRIFT, fontSize: 48, lineHeight: 1.3, transform: `scale(${p})`, transformOrigin: n.ich ? "100% 100%" : "0% 100%" }}>
                {n.name ? <div style={{ fontSize: 30, fontWeight: 800, color: NOIR_ORANGE, marginBottom: 4 }}>{n.name}</div> : null}
                {n.text}
              </div>
            );
          })}
          {naechste ? (
            <div style={{ alignSelf: naechste.ich ? "flex-end" : "flex-start", padding: "22px 30px", borderRadius: 28, background: naechste.ich ? "#2b5f3d" : "#262a33", display: "flex", gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#cfd3da", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(s * 8 - i)) }} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: TEXT_SCHRIFT, fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{hinweis}</div>
    </AbsoluteFill>
  );
};

/* ───────── Hacker-Terminal ───────── */
export type TerminalZeile = { ab: number; text: string; befehl?: boolean; farbe?: string };
export const Terminal: React.FC<{ s: number; ab: number; titel?: string; zeilen: TerminalZeile[]; tippTempo?: number }> = ({ s, ab, titel = "angreifer@server:~", zeilen, tippTempo = 28 }) => {
  const { W, H, hoch } = useFlaeche();
  const box = hoch ? { left: 30, top: 200, width: W - 60, height: H * 0.6 } : { left: 140, top: 90, width: W - 280, height: 860 };
  const k = rein(s, ab, 0.4);
  return (
    <AbsoluteFill>
      <RauerGrund />
      <div style={{ position: "absolute", ...box, borderRadius: 20, background: "rgba(8,9,11,0.96)", border: "3px solid #2a2d36", boxShadow: `0 0 60px ${NOIR_ORANGE}22, 0 50px 100px rgba(0,0,0,0.8)`, opacity: k, overflow: "hidden" }}>
        <div style={{ height: 56, background: "#15171d", display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
          <div style={{ marginLeft: 20, fontFamily: "monospace", fontSize: 24, color: "#8a8f9c" }}>{titel}</div>
        </div>
        <div style={{ padding: hoch ? "30px 30px" : "40px 50px", fontFamily: "monospace", fontSize: hoch ? 40 : 50, lineHeight: 1.55 }}>
          {zeilen.map((z, i) => {
            if (s < z.ab) return null;
            const n = z.befehl ? Math.floor((s - z.ab) * tippTempo) : z.text.length;
            const fertig = n >= z.text.length;
            const istLetzte = zeilen.filter((x) => s >= x.ab).length - 1 === i;
            return (
              <div key={i} style={{ color: z.farbe ?? (z.befehl ? "#f5f5f5" : "#9fe6b3"), whiteSpace: "pre-wrap" }}>
                {z.befehl ? <span style={{ color: NOIR_ORANGE }}>$ </span> : null}
                {z.text.slice(0, n)}
                {istLetzte && (!fertig || Math.floor(s * 2) % 2 === 0) ? <span style={{ background: "#f5f5f5", color: "transparent" }}>_</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Fallakte: Mappe öffnet sich, Text wird geschwärzt, Stempel, Lupe ───────── */
export type AktenZeile = { text: string; schwaerzen?: [von: number, bis: number, ab: number][] };
export const Fallakte: React.FC<{
  s: number;
  ab: number;
  aktenzeichen: string;
  titel: string;
  zeilen: AktenZeile[];
  stempel?: { text: string; ab: number; farbe?: string };
  lupe?: { ab: number; bis: number; zeile: number };
}> = ({ s, ab, aktenzeichen, titel, zeilen, stempel, lupe }) => {
  const auf = interpolate(s, [ab + 0.2, ab + 1.0], [0, 1], { ...klemm, easing: SANFT });
  const { W, H, hoch } = useFlaeche();
  const blattX = (W - 900) / 2;
  const blattY = hoch ? (H - 840) / 2 - 160 : 110;
  const blattB = 900;
  const zeileH = 62;
  const inhalt = (
    <div style={{ width: blattB, padding: "60px 70px", boxSizing: "border-box", fontFamily: "'Courier New', monospace", color: "#1d1a14" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700, color: "#6b5d43" }}>
        <span>AKTE {aktenzeichen}</span>
        <span>VERTRAULICH</span>
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, margin: "26px 0 30px", fontFamily: TEXT_SCHRIFT }}>{titel}</div>
      {zeilen.map((z, i) => (
        <div key={i} style={{ position: "relative", height: zeileH, fontSize: 32, lineHeight: `${zeileH}px`, whiteSpace: "nowrap" }}>
          {z.text}
          {(z.schwaerzen ?? []).map(([von, bis, t0], j) => {
            const k = interpolate(s, [t0, t0 + 0.35], [0, 1], { ...klemm, easing: EXPO });
            if (k <= 0) return null;
            return <div key={j} style={{ position: "absolute", left: von * 19.2, top: 12, width: (bis - von) * 19.2 * k, height: zeileH - 22, background: "#0b0b0b" }} />;
          })}
        </div>
      ))}
    </div>
  );
  // Lupe
  let lupeEl: React.ReactNode = null;
  if (lupe && s >= lupe.ab && s <= lupe.bis + 0.3) {
    const lk = rein(s, lupe.ab, 0.4) * (1 - rein(s, lupe.bis, 0.3));
    const lx = interpolate(s, [lupe.ab, lupe.bis], [blattX + 200, blattX + 640], { ...klemm, easing: SANFT });
    const ly = blattY + 176 + lupe.zeile * zeileH + zeileH / 2;
    const r = 150;
    const z = 1.8;
    lupeEl = (
      <div style={{ position: "absolute", left: lx - r, top: ly - r, width: r * 2, height: r * 2, borderRadius: r, overflow: "hidden", border: "10px solid #2b2b2b", boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.3)", opacity: lk, background: "#efe6cf" }}>
        <div style={{ position: "absolute", left: -(lx - blattX) * z + r, top: -(ly - blattY) * z + r, transform: `scale(${z})`, transformOrigin: "0 0" }}>{inhalt}</div>
        <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 40%)" }} />
      </div>
    );
  }
  const stempelK = stempel ? interpolate(s, [stempel.ab, stempel.ab + 0.18], [0, 1], { ...klemm, easing: EXPO }) : 0;
  return (
    <AbsoluteFill>
      <RauerGrund ton="#120e0a" />
      <AbsoluteFill style={{ transform: `scale(${hoch ? 1.08 : 1.2})`, transformOrigin: "50% 48%" }}>
      {/* Mappe */}
      <div style={{ position: "absolute", left: blattX - 60, top: blattY - 40, width: blattB + 120, height: 900, background: "linear-gradient(160deg, #c9a86a, #a4823f)", borderRadius: 14, boxShadow: "0 50px 100px rgba(0,0,0,0.8)" }} />
      {/* Blatt */}
      <div style={{ position: "absolute", left: blattX, top: blattY, width: blattB, height: 840, background: "#efe6cf", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", transform: `rotate(-1deg) translateY(${(1 - auf) * 60}px)`, opacity: auf }}>{inhalt}</div>
      {/* Deckel klappt auf */}
      <div style={{ position: "absolute", left: blattX - 60, top: blattY - 40, width: blattB + 120, height: 900, perspective: 2400, pointerEvents: "none" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #d4b47a, #a98848)", borderRadius: 14, transformOrigin: "0% 50%", transform: `rotateY(${-170 * auf}deg)`, opacity: auf > 0.55 ? 0 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 60, color: "#5a4420" }}>FALL {aktenzeichen}</div>
        </div>
      </div>
      {stempel && stempelK > 0 ? (
        <div style={{ position: "absolute", left: blattX + 470, top: blattY + 580, transform: `rotate(-14deg) scale(${2.2 - 1.2 * stempelK})`, opacity: stempelK, padding: "14px 34px", border: `8px solid ${stempel.farbe ?? NOIR_ROT}`, borderRadius: 12, fontFamily: ANTON_SCHRIFT, fontSize: 76, color: stempel.farbe ?? NOIR_ROT, letterSpacing: 4, mixBlendMode: "multiply" }}>
          {stempel.text}
        </div>
      ) : null}
      {lupeEl}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── Karte als Schauplatz (Natural Earth, gekippt, leuchtende Route) ───────── */
type Topo = { arcs: [number, number][][]; transform: { scale: [number, number]; translate: [number, number] }; objects: { land: { geometries: { type: string; arcs: number[][][] | number[][] }[] } } };
export const ladeLand = (topo: Topo): [number, number][][] => {
  const { scale, translate } = topo.transform;
  const arcs = topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number];
    });
  });
  const ring = (idx: number[]) => {
    const pts: [number, number][] = [];
    idx.forEach((a) => {
      const arc = a >= 0 ? arcs[a] : [...arcs[~a]].reverse();
      pts.push(...(pts.length ? arc.slice(1) : arc));
    });
    return pts;
  };
  const ringe: [number, number][][] = [];
  for (const g of topo.objects.land.geometries) {
    if (g.type === "Polygon") (g.arcs as number[][]).forEach((r) => ringe.push(ring(r)));
    else (g.arcs as number[][][]).forEach((poly) => poly.forEach((r) => ringe.push(ring(r))));
  }
  return ringe;
};

export type KartenOrt = { name: string; lon: number; lat: number; ab: number; farbe?: string };
export const KarteRaum: React.FC<{
  s: number;
  ab: number;
  land: [number, number][][] | null;
  mitte: [number, number];
  massstab: number; // Pixel pro Grad
  orte: KartenOrt[];
  routen?: { von: number; nach: number; ab: number; farbe?: string }[];
  kamera?: [t: number, lon: number, lat: number, zoom: number][];
}> = ({ s, ab, land, mitte, massstab, orte, routen = [], kamera = [] }) => {
  const { W, H } = useFlaeche();
  const ts = kamera.map((k) => k[0]);
  const opt = { ...klemm, easing: SANFT };
  const cLon = kamera.length ? interpolate(s, ts, kamera.map((k) => k[1]), opt) : mitte[0];
  const cLat = kamera.length ? interpolate(s, ts, kamera.map((k) => k[2]), opt) : mitte[1];
  const zoom = kamera.length ? interpolate(s, ts, kamera.map((k) => k[3]), opt) : 1;
  const proj = (lon: number, lat: number): [number, number] => [W / 2 + (lon - cLon) * massstab * zoom * Math.cos((50 * Math.PI) / 180), H / 2 - (lat - cLat) * massstab * zoom];
  const pfade = (land ?? [])
    .filter((r) => r.some(([lo, la]) => lo > -30 && lo < 70 && la > 20 && la < 75))
    .map((r) => "M" + r.map(([lo, la]) => proj(lo, la).map((v) => v.toFixed(1)).join(",")).join(" L") + " Z");
  const k = rein(s, ab, 0.8);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1420 0%, #040507 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", inset: -200, transform: "rotateX(32deg) translateY(60px)", opacity: k }}>
          <svg width={W + 400} height={H + 400} viewBox={`-200 -200 ${W + 400} ${H + 400}`}>
            {/* Längen- und Breitengrade */}
            {new Array(30).fill(0).map((_, i) => {
              const [x] = proj(-40 + i * 5, 0);
              return <line key={`l${i}`} x1={x} y1={-200} x2={x} y2={H + 200} stroke="#1c2a3d" strokeWidth={1} />;
            })}
            {new Array(14).fill(0).map((_, i) => {
              const [, y] = proj(0, 25 + i * 5);
              return <line key={`b${i}`} x1={-200} y1={y} x2={W + 200} y2={y} stroke="#1c2a3d" strokeWidth={1} />;
            })}
            {pfade.map((d, i) => (
              <path key={i} d={d} fill="#162033" stroke="#3b5578" strokeWidth={2} />
            ))}
            {routen.map((r, i) => {
              const a = orte[r.von];
              const b = orte[r.nach];
              const [ax, ay] = proj(a.lon, a.lat);
              const [bx, by] = proj(b.lon, b.lat);
              const mx = (ax + bx) / 2;
              const my = Math.min(ay, by) - Math.hypot(bx - ax, by - ay) * 0.25;
              const rk = interpolate(s, [r.ab, r.ab + 1.2], [0, 1], { ...klemm, easing: SANFT });
              if (rk <= 0) return null;
              const f = r.farbe ?? NOIR_ROT;
              return <path key={i} d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} pathLength={1} fill="none" stroke={f} strokeWidth={6} strokeDasharray="1 1" strokeDashoffset={1 - rk} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${f})` }} />;
            })}
            {orte.map((o, i) => {
              if (s < o.ab) return null;
              const [x, y] = proj(o.lon, o.lat);
              const p = Math.min(1.1, schwung(s, o.ab));
              const puls = 0.5 + 0.5 * Math.sin((s - o.ab) * 4);
              const f = o.farbe ?? NOIR_ORANGE;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
                  <circle r={30 + 16 * puls} fill={f} opacity={0.15} />
                  <circle r={14} fill={f} stroke="#fff" strokeWidth={3} />
                  <text x={26} y={-22} fontFamily={TEXT_SCHRIFT} fontWeight={800} fontSize={44} fill="#f5f5f5" stroke="#040507" strokeWidth={6} paintOrder="stroke">{o.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,5,7,0.9) 0%, transparent 22%, transparent 80%, rgba(4,5,7,0.9) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* ───────── Browser-Fenster: echte Seite scrollt (ganze Seite mit shot.py --voll) ───────── */
export const BrowserFenster: React.FC<{ s: number; ab: number; bis: number; bild: string; bildHoehe: number; url: string; scrollVon?: number; scrollBis?: number }> = ({ s, ab, bis, bild, bildHoehe, url, scrollVon = 0, scrollBis = 1200 }) => {
  const k = rein(s, ab, 0.5);
  const { W, H, hoch } = useFlaeche();
  const fensterB = hoch ? W - 60 : 1600;
  const fensterH = hoch ? H * 0.62 : 900;
  const innenH = fensterH - 70;
  const skala = fensterB / 1920;
  const scroll = interpolate(s, [ab + 0.8, bis - 0.4], [scrollVon, Math.min(scrollBis, bildHoehe - innenH / skala)], { ...klemm, easing: SANFT });
  return (
    <AbsoluteFill>
      <RauerGrund />
      <div style={{ position: "absolute", left: (W - fensterB) / 2, top: hoch ? 180 : 80, width: fensterB, height: fensterH, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 50px 100px rgba(0,0,0,0.8)", opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
        <div style={{ height: 70, background: "#e9eaee", display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: "1px solid #cfd2d8" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
          <div style={{ marginLeft: 24, flex: 1, height: 42, borderRadius: 21, background: "#fff", display: "flex", alignItems: "center", padding: "0 22px", fontFamily: TEXT_SCHRIFT, fontSize: 24, color: "#3a3d45" }}>
            🔒 {url}
          </div>
        </div>
        <div style={{ position: "relative", height: innenH, overflow: "hidden" }}>
          <Img src={staticFile(bild)} style={{ position: "absolute", left: 0, top: -scroll * skala, width: fensterB }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const zufall2 = random;
