import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile } from "remotion";
import { MarkenLogo } from "./noir-kit";
import { EXPO, klemm, NOIR_GRUEN, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";

// Teil 2 der Reel-08-Probe (35–65 s): Altlast, Suche nach Schlüsseln, offene Frage, Schluss.
const R = "reel-todoist";

export const T2 = {
  altlast: 35.84,
  konten: 36.74,
  zehn: 38.4,
  sha1: 40.78,
  brisant: 42.64,
  durchforstet: 44.6,
  aufgaben: 46.18,
  kommentare: 47.06,
  outlook: 47.8,
  schluessel: 49.26,
  stand: 50.02,
  blockiert: 50.46,
  schaltet: 52.86,
  warnt: 54.64,
  offen: 55.86,
  geknackt: 58.24,
  bleibt: 59.1,
  schluss: 59.92,
  todo: 62.98,
  dran: 64.56,
  ende: 65.5,
};

const ruck = (s: number, t0: number, staerke = 12) => {
  const d = s - t0;
  if (d < 0 || d > 0.35) return 0;
  return Math.sin(d * 70) * staerke * (1 - d / 0.35);
};

const Grund: React.FC<{ children: React.ReactNode; warm?: boolean }> = ({ children, warm }) => (
  <AbsoluteFill style={{ background: warm ? "radial-gradient(ellipse at 50% 40%, #17110c 0%, #050506 70%)" : "radial-gradient(ellipse at 50% 40%, #121318 0%, #050506 72%)", overflow: "hidden" }}>
    {children}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 68%, #050506 78%)" }} />
  </AbsoluteFill>
);

export const Schloss: React.FC<{ farbe: string; riss: number; size: number }> = ({ farbe, riss, size }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
    <path d="M28 52 V34 a22 22 0 0 1 44 0 V52" fill="none" stroke={farbe} strokeWidth={9} />
    <rect x={14} y={50} width={72} height={60} rx={12} fill={farbe} />
    <circle cx={50} cy={76} r={8} fill="#050506" />
    <rect x={46} y={78} width={8} height={18} rx={3} fill="#050506" />
    {riss > 0 ? (
      <polyline points="38,50 50,66 42,78 58,94 52,110" fill="none" stroke="#050506" strokeWidth={5} strokeDasharray={90} strokeDashoffset={90 * (1 - riss)} />
    ) : null}
  </svg>
);

/* ───────── E. Altlast: Konten mit 10 Jahre altem Passwort, Schlösser brechen ───────── */

export const AltlastSzene: React.FC<{ s: number }> = ({ s }) => {
  const jahr = Math.round(interpolate(s, [T2.zehn - 0.3, T2.zehn + 0.9], [2026, 2016], { ...klemm, easing: SANFT }));
  const jahrAn = rein(s, T2.zehn - 0.4, 0.4);
  const alt = interpolate(s, [T2.zehn + 0.3, T2.zehn + 1.3], [0, 1], klemm);
  const karten: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const ab = 35.2 + i * 0.12;
    const k = schwung(s, ab);
    const riss = interpolate(s, [T2.sha1 + i * 0.05, T2.sha1 + i * 0.05 + 0.3], [0, 1], klemm);
    const x = 70 + col * 320;
    const y = 520 + row * 200;
    const schlossFarbe = riss > 0.2 ? NOIR_ROT : alt > 0.5 ? "#8b7a5e" : "#c9ced8";
    karten.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y + ruck(s, T2.sha1 + i * 0.05, 6),
          width: 300,
          height: 170,
          borderRadius: 22,
          background: `linear-gradient(160deg, ${alt > 0 ? `rgba(60,50,36,${0.6 + 0.4 * alt})` : "#1b1d24"} 0%, #0f1015 100%)`,
          border: `3px solid ${riss > 0.2 ? NOIR_ROT : "#2c2f39"}`,
          boxShadow: riss > 0.2 ? `0 0 26px rgba(239,68,68,${0.45 * riss})` : "0 20px 40px rgba(0,0,0,0.6)",
          transform: `translateY(${(1 - k) * -260}px) scale(${0.7 + 0.3 * Math.min(1.1, k)})`,
          opacity: Math.min(1, k * 1.5),
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
          filter: `sepia(${0.6 * alt})`,
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#2d313c", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, borderRadius: 7, background: "#4a4f5c", width: `${60 + random(`m${i}`) * 35}%`, marginBottom: 14 }} />
          <div style={{ height: 12, borderRadius: 6, background: "#33363f", width: "55%" }} />
        </div>
        <div style={{ position: "relative" }}>
          <Schloss farbe={schlossFarbe} riss={riss} size={54} />
          {riss > 0.5 ? (
            <div style={{ position: "absolute", top: 72, left: -8, fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 18, color: NOIR_ROT }}>SHA-1</div>
          ) : null}
        </div>
      </div>,
    );
  }
  // Staub, sobald die Konten „alt“ werden
  const staub: React.ReactNode[] = [];
  for (let i = 0; i < 40; i++) {
    const yy = (random(`sy${i}`) * 1300 + (s - T2.zehn) * 40 * (0.5 + random(`sv${i}`))) % 1300;
    staub.push(<circle key={i} cx={random(`sx${i}`) * 1080} cy={300 + yy} r={2 + random(`sr${i}`) * 3} fill="#d8c7a4" opacity={0.25 * alt} />);
  }
  return (
    <Grund>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>{staub}</svg>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", opacity: jahrAn }}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "rgba(255,255,255,0.5)" }}>PASSWORT ZULETZT GEÄNDERT</div>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 190, lineHeight: 1, color: jahr <= 2016 ? NOIR_ORANGE : "#f5f5f5", textShadow: jahr <= 2016 ? `0 0 40px rgba(255,138,31,0.5)` : undefined }}>{jahr}</div>
      </div>
      {karten}
    </Grund>
  );
};

/* ───────── F. Suche nach Schlüsseln: Handy (wie im Hook), Kommentar, Outlook ───────── */

const ZEILEN = ["Milch und Brot kaufen", "Server-Passwort: S0mmer!24", "Geschenk für Mama", "API-Key: sk-8f3kQ…", "Steuererklärung abgeben"];
const GEHEIM = [false, true, false, true, false];

export const SucheSzene: React.FC<{ s: number }> = ({ s }) => {
  const auftritt = rein(s, T2.aufgaben - 0.28, 0.4);
  const scanY = ((s - T2.aufgaben) * 900) % 1500;
  const scanAn = s > T2.aufgaben && s < T2.schluessel;
  const kommentar = schwung(s, T2.kommentare);
  const outlook = schwung(s, T2.outlook);
  const flug = interpolate(s, [T2.schluessel, T2.schluessel + 0.6], [0, 1], { ...klemm, easing: Easing.in(Easing.cubic) });
  const getroffen = (y: number) => scanAn && Math.abs(scanY + 150 - y) < 70;

  const schluesselStart: [number, number][] = [
    [390, 560],
    [390, 860],
    [830, 520],
    [830, 950],
  ];

  return (
    <Grund warm>
      {/* Handy links */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 200,
          width: 560,
          height: 1020,
          borderRadius: 70,
          padding: 14,
          background: "linear-gradient(160deg, #2a2a30 0%, #0c0c0f 40%, #050506 100%)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.8), -14px 0 40px rgba(255,138,31,0.25)",
          transform: `perspective(1600px) rotateY(10deg) translateX(${(1 - auftritt) * -200}px)`,
          opacity: auftritt,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 58, overflow: "hidden", background: "#1e1e1e", fontFamily: TEXT_SCHRIFT }}>
          <div style={{ height: 170, background: "#dc4c3e", display: "flex", alignItems: "flex-end", gap: 16, padding: "0 34px 26px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MarkenLogo name="todoist-icon" size={42} />
            </div>
            <div style={{ color: "#fff", fontSize: 42, fontWeight: 800 }}>Heute</div>
          </div>
          {ZEILEN.map((z, i) => {
            const y = 200 + i * 150;
            const rot = GEHEIM[i] && s > T2.aufgaben + 0.3;
            return (
              <div
                key={z}
                style={{
                  position: "absolute",
                  top: y,
                  left: 20,
                  right: 20,
                  height: 120,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 20px",
                  color: "#eee",
                  fontSize: 27,
                  fontWeight: rot ? 800 : 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  background: rot ? "rgba(239,68,68,0.22)" : "transparent",
                  border: rot ? `3px solid ${NOIR_ROT}` : "3px solid transparent",
                  opacity: rot || !scanAn ? 1 : 0.55,
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 17, border: `3px solid ${rot ? NOIR_ROT : "#777"}`, flexShrink: 0 }} />
                {z}
              </div>
            );
          })}
          {scanAn ? <div style={{ position: "absolute", left: 0, right: 0, top: scanY - 40, height: 80, background: "linear-gradient(180deg, transparent, rgba(239,68,68,0.35), transparent)", borderBottom: `4px solid ${NOIR_ROT}` }} /> : null}
        </div>
      </div>

      {/* Kommentar-Blase */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 420,
          width: 480,
          padding: "26px 28px",
          borderRadius: 28,
          background: getroffen(470) ? "#3a1416" : "#1b1d24",
          border: `3px solid ${s > T2.kommentare + 0.4 ? NOIR_ROT : "#3a3c46"}`,
          fontFamily: TEXT_SCHRIFT,
          transform: `scale(${kommentar}) rotate(-3deg)`,
          transformOrigin: "0% 50%",
          boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Kommentar</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>AWS: AKIA7X…</div>
      </div>

      {/* Outlook-Mail */}
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 820,
          width: 460,
          padding: "24px 26px",
          borderRadius: 24,
          background: "#f4f5f7",
          border: `4px solid ${s > T2.outlook + 0.4 ? NOIR_ROT : "transparent"}`,
          fontFamily: TEXT_SCHRIFT,
          transform: `scale(${outlook}) rotate(3deg)`,
          transformOrigin: "0% 50%",
          boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "#1a73c8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={30} height={24} viewBox="0 0 30 24"><rect x={1} y={1} width={28} height={22} rx={3} fill="none" stroke="#fff" strokeWidth={2.5} /><path d="M2 3 L15 13 L28 3" fill="none" stroke="#fff" strokeWidth={2.5} /></svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#222" }}>Outlook · Posteingang</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>Ihr neues Passwort</div>
        <div style={{ height: 12, borderRadius: 6, background: "#cfd3da", width: "80%", marginTop: 12 }} />
      </div>

      {/* Schlüssel fliegen zum Angreifer nach oben */}
      {s > T2.schluessel - 0.05
        ? schluesselStart.map(([x, y], i) => {
            const pop = schwung(s, T2.schluessel + i * 0.06);
            return (
              <div key={i} style={{ position: "absolute", left: x - 40, top: y - 40 - flug * (y + 200), transform: `scale(${pop}) rotate(${-30 + i * 20}deg)`, filter: `drop-shadow(0 0 18px ${NOIR_ROT})` }}>
                <svg width={80} height={80} viewBox="0 0 64 64">
                  <circle cx="20" cy="32" r="12" fill="none" stroke={NOIR_ROT} strokeWidth="6" />
                  <path d="M32 32 H58 M48 32 V42 M56 32 V40" stroke={NOIR_ROT} strokeWidth="6" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            );
          })
        : null}
    </Grund>
  );
};

/* ───────── H. Offene Frage: wird der alte Hash geknackt? ───────── */

const HEX = "0123456789abcdef";
export const OffenSzene: React.FC<{ s: number }> = ({ s }) => {
  const an = rein(s, T2.offen, 0.4);
  const eingefroren = s >= T2.bleibt;
  const tz = eingefroren ? T2.bleibt : s;
  const zeilen = [0, 1, 2].map((z) =>
    new Array(14)
      .fill(0)
      .map((_, i) => HEX[Math.floor(random(`h${z}-${i}-${Math.floor(tz * 18)}`) * 16)])
      .join(""),
  );
  const ring = (tz - T2.offen) * 220;
  const frage = schwung(s, T2.bleibt);
  const knack = rein(s, T2.geknackt, 0.3);
  return (
    <Grund>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", opacity: an }}>
        <div style={{ position: "relative", width: 460, height: 460 }}>
          <svg width={460} height={460} style={{ position: "absolute", inset: 0, transform: `rotate(${ring}deg)` }}>
            <circle cx={230} cy={230} r={210} fill="none" stroke="#24262e" strokeWidth={14} />
            <circle cx={230} cy={230} r={210} fill="none" stroke={NOIR_ORANGE} strokeWidth={14} strokeDasharray="300 1020" strokeLinecap="round" opacity={eingefroren ? 0.3 : 1} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${eingefroren ? 0 : Math.sin(s * 40) * 4 * knack}px)` }}>
            {frage > 0 ? (
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 300, color: NOIR_ORANGE, transform: `scale(${frage})`, textShadow: "0 0 60px rgba(255,138,31,0.6)" }}>?</div>
            ) : (
              <Schloss farbe={NOIR_ROT} riss={1} size={200} />
            )}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 58, lineHeight: 1.35, color: eingefroren ? "rgba(255,255,255,0.35)" : "#e8e8e8", opacity: an }}>
        {zeilen.map((z, i) => (
          <div key={i}>{z}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", fontFamily: TEXT_SCHRIFT, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: "rgba(255,255,255,0.45)", opacity: an }}>
        ALTER SHA-1-HASH
      </div>
    </Grund>
  );
};

/* ───────── I. Schluss: Figur zeigt, Geheimnisse raus aus der Liste, „Ich bleibe dran“ ───────── */

const FigurBild: React.FC<{ s: number; t0: number; bild: string; ursprung?: string }> = ({ s, t0, bild, ursprung = "50% 40%" }) => {
  const d = s - t0;
  const zoom = 1.16 - 0.08 * Math.min(1, d / 2.5) + 0.04 * Math.exp(-8 * Math.max(0, d));
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ursprung }}>
        <Img src={staticFile(bild)} style={{ position: "absolute", top: 140, left: -150, width: 1380, height: 1380, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,6,0) 55%, #050506 78%)" }} />
    </AbsoluteFill>
  );
};

const AUFRAEUMEN = ["Milch und Brot kaufen", "Server-Passwort: S0mmer!24", "Zahnarzt Do 14:00", "API-Key: sk-8f3kQ…", "Geschenk für Mama"];

const AufraeumHandy: React.FC<{ s: number }> = ({ s }) => {
  const t0 = T2.todo - 0.16;
  const auftritt = rein(s, t0, 0.35);
  return (
    <Grund warm>
      <div
        style={{
          position: "absolute",
          left: 180,
          top: 150,
          width: 720,
          height: 1230,
          borderRadius: 84,
          padding: 18,
          background: "linear-gradient(160deg, #2a2a30 0%, #0c0c0f 40%, #050506 100%)",
          boxShadow: `0 60px 120px rgba(0,0,0,0.8), -18px 0 50px rgba(255,138,31,0.28)`,
          transform: `perspective(1800px) rotateY(-6deg) rotateX(5deg) scale(${0.94 + 0.06 * auftritt})`,
          opacity: auftritt,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 68, overflow: "hidden", background: "#1e1e1e", fontFamily: TEXT_SCHRIFT }}>
          <div style={{ height: 220, background: "#dc4c3e", display: "flex", alignItems: "flex-end", gap: 22, padding: "0 44px 34px" }}>
            <div style={{ width: 70, height: 70, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MarkenLogo name="todoist-icon" size={52} />
            </div>
            <div style={{ color: "#fff", fontSize: 52, fontWeight: 800 }}>Heute</div>
          </div>
          {AUFRAEUMEN.map((z, i) => {
            const geheim = z.includes(":") && !z.includes("Zahnarzt");
            const nr = geheim ? (z.startsWith("Server") ? 0 : 1) : -1;
            const streich = geheim ? interpolate(s, [t0 + 0.2 + nr * 0.25, t0 + 0.5 + nr * 0.25], [0, 1], klemm) : 0;
            const raus = geheim ? interpolate(s, [t0 + 0.7 + nr * 0.25, t0 + 1.1 + nr * 0.25], [0, 1], { ...klemm, easing: Easing.in(Easing.cubic) }) : 0;
            // Zeilen rücken nach, wenn Geheimnisse verschwinden
            const vorher = AUFRAEUMEN.slice(0, i).filter((x, j) => x.includes(":") && !x.includes("Zahnarzt") && j < i).length;
            const nachruecken = vorher > 0 ? interpolate(s, [t0 + 0.9, t0 + 1.5], [0, vorher], { ...klemm, easing: EXPO }) : 0;
            const y = 262 + (i - nachruecken) * 150;
            return (
              <div
                key={z}
                style={{
                  position: "absolute",
                  top: y,
                  left: 30,
                  right: 30,
                  height: 136,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "0 26px",
                  borderRadius: 22,
                  color: "#e8e8e8",
                  fontSize: 38,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  background: geheim ? `rgba(239,68,68,${0.2 * (1 - streich * 0.5)})` : "transparent",
                  border: geheim ? `3px solid rgba(239,68,68,${1 - streich})` : "3px solid transparent",
                  transform: `translateX(${raus * 760}px)`,
                  opacity: 1 - raus,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${geheim && streich > 0.5 ? NOIR_GRUEN : "#777"}`, background: geheim && streich > 0.5 ? NOIR_GRUEN : "transparent", flexShrink: 0 }} />
                <span style={{ position: "relative" }}>
                  {z}
                  {geheim ? <span style={{ position: "absolute", left: 0, top: "52%", height: 5, width: `${streich * 100}%`, background: "#f5f5f5" }} /> : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Grund>
  );
};

export const SchlussSzene: React.FC<{ s: number }> = ({ s }) => {
  if (s < T2.todo - 0.16) return <FigurBild s={s} t0={T2.schluss} bild={`${R}/pose-zeige.jpg`} ursprung="35% 45%" />;
  if (s < T2.dran) return <AufraeumHandy s={s} />;
  return <FigurBild s={s} t0={T2.dran} bild={`${R}/pose-brand.jpg`} />;
};

