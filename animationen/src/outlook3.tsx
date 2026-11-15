import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { Rahmen } from "./ruhig";
import { CLAMP, TEXT_SCHRIFT, WEICH } from "./stil";

// Reel 03 v3: Bilder statt Text. Schlichte Erklärgrafik (dunkel, dünne Linien, wenig Farbe), keine Quellen-Chips.
const LINIE = "#5b5f6b";
const FLAECHE = "#16181f";
const OK = "#4ade80";
const FEHLER = "#ef4444";
const AKZENT = "#ff8a1f";

const useSek = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
const weich = (s: number, a: number, dauer = 0.5) => interpolate(s, [a, a + dauer], [0, 1], { ...CLAMP, easing: WEICH });

// Ganze Fläche über den Untertiteln, Figur ausgeblendet (wie Erklärteil bei Hood Informatik)
export const Buehne: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: BAND_TOP + BAND_HOEHE, backgroundColor: "#0c0d12", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(255,138,31,0.07), rgba(0,0,0,0) 60%)" }} />
    {children}
  </div>
);

// ---------- Hook: Handy mit echter Fehlerseite vor dunklem Büro ----------
export const HandyFehler: React.FC = () => {
  const s = useSek();
  return (
    <Rahmen>
      <Img
        src={staticFile("reel-outlook/computerraum.jpg")}
        style={{ position: "absolute", inset: -40, width: 1160, height: BAND_HOEHE + 80, objectFit: "cover", filter: "blur(10px) brightness(0.35)" }}
      />
      <div
        style={{
          position: "absolute",
          left: 280,
          top: -70 - s * 5,
          width: 520,
          height: 1060,
          borderRadius: 64,
          backgroundColor: "#0a0a0a",
          padding: 16,
          boxShadow: "0 40px 90px rgba(0,0,0,0.8), inset 0 0 0 3px #3a3a3a",
          rotate: "-2deg",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", backgroundColor: "#fff" }}>
          <div style={{ height: 112, backgroundColor: "#f1f3f4", display: "flex", alignItems: "flex-end", padding: "0 20px 14px" }}>
            <div style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: "#fff", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: TEXT_SCHRIFT, fontSize: 22, fontWeight: 500, color: "#202124" }}>
              outlook.live.com
            </div>
          </div>
          <Img src={staticFile("reel-outlook/handy-fehler.png")} style={{ width: "100%", display: "block" }} />
          <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 32, marginLeft: -55, borderRadius: 16, backgroundColor: "#000" }} />
        </div>
      </div>
    </Rahmen>
  );
};

// Foto ohne Text, langsame Fahrt
export const BildFahrt: React.FC<{ bild: string; fokus?: [number, number]; dunkel?: number }> = ({ bild, fokus = [50, 50], dunkel = 0 }) => {
  const s = useSek();
  return (
    <Rahmen>
      <Img
        src={staticFile(bild)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${fokus[0]}% ${fokus[1]}%`,
          scale: String(1.03 + s * 0.015),
          filter: dunkel ? `brightness(${1 - dunkel})` : undefined,
        }}
      />
    </Rahmen>
  );
};

// ---------- Cloud mit Diensten ----------
const Wolke: React.FC<{ x: number; y: number; sicht: number }> = ({ x, y, sicht }) => (
  <div style={{ position: "absolute", left: x - 190, top: y - 95, width: 380, height: 190, opacity: sicht, scale: String(0.9 + 0.1 * sicht) }}>
    <svg width={380} height={190} viewBox="0 0 380 190">
      <path
        d="M95 170 C40 170 20 125 45 95 C35 50 85 25 125 45 C140 10 210 0 240 40 C280 15 345 40 335 95 C370 110 360 170 300 170 Z"
        fill={FLAECHE}
        stroke={AKZENT}
        strokeWidth={4}
      />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 20, fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: "#d6d8de" }}>
      Exchange Online
    </div>
  </div>
);

type Dienst = { icon: string; ab: number; ausAb: number };
export const DiensteWolke: React.FC<{ dienste: Dienst[] }> = ({ dienste }) => {
  const s = useSek();
  const wolke = weich(s, 0, 0.6);
  const cx = 540;
  const cy = 520;
  const breite = 860;
  return (
    <Buehne>
      <Wolke x={cx} y={cy} sicht={wolke} />
      <svg width={1080} height={1400} style={{ position: "absolute", inset: 0 }}>
        {dienste.map((d, i) => {
          const x = cx - breite / 2 + (breite / (dienste.length - 1)) * i;
          const y = 900;
          const l = weich(s, d.ab, 0.45);
          const aus = s >= d.ausAb;
          return (
            <path
              key={d.icon}
              d={`M${cx} ${cy + 95} C ${cx} ${cy + 220}, ${x} ${y - 200}, ${x} ${y - 85}`}
              fill="none"
              stroke={aus ? FEHLER : LINIE}
              strokeWidth={4}
              strokeDasharray={aus ? "10 10" : "600"}
              strokeDashoffset={aus ? 0 : 600 * (1 - l)}
            />
          );
        })}
      </svg>
      {dienste.map((d, i) => {
        const x = cx - breite / 2 + (breite / (dienste.length - 1)) * i;
        const l = weich(s, d.ab + 0.3, 0.4);
        const aus = s >= d.ausAb;
        return (
          <div
            key={d.icon}
            style={{
              position: "absolute",
              left: x - 80,
              top: 900 - 80,
              width: 160,
              height: 160,
              borderRadius: 36,
              backgroundColor: FLAECHE,
              border: `3px solid ${aus ? FEHLER : "#2a2d38"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: l,
              scale: String(0.85 + 0.15 * l),
            }}
          >
            <Img src={staticFile(`reel-outlook/${d.icon}`)} style={{ width: 96, height: 96, objectFit: "contain", filter: aus ? "grayscale(0.4) brightness(0.75)" : undefined }} />
            {aus ? (
              <div style={{ position: "absolute", right: -16, top: -16, width: 52, height: 52, borderRadius: 26, backgroundColor: FEHLER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={26} height={26}>
                  <path d="M5 5 L21 21 M21 5 L5 21" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
    </Buehne>
  );
};

// ---------- Health Checks und Load Balancer ----------
// Phasen (Sekunden relativ zur Szene): Server erscheinen → Checks laufen → einer fällt → LB verteilt → viele fallen → Last wandert → alles kippt
export type ServerZeiten = { checks: number; einer: number; lb: number; viele: number; last: number; kippen: number };

const SPALTEN = 4;
const ZEILEN = 3;
const SX = 140;
const SY = 760;
const SB = 180;
const SH = 120;
const GX = 40;
const GY = 46;
const serverPos = (i: number) => ({ x: SX + (i % SPALTEN) * (SB + GX), y: SY + Math.floor(i / SPALTEN) * (SH + GY) });
const VIELE = [1, 2, 4, 6, 7, 9, 11];
const LETZTE = [0, 3, 5, 8, 10];

const serverStatus = (i: number, s: number, z: ServerZeiten): "aus" | "ok" | "fehler" | "heiss" => {
  if (s < z.checks + i * 0.12) return "aus";
  if (s >= z.kippen + LETZTE.indexOf(i) * 0.25 && LETZTE.includes(i)) return "fehler";
  if (i === 6 && s >= z.einer) return "fehler";
  if (VIELE.includes(i) && s >= z.viele + VIELE.indexOf(i) * 0.15) return "fehler";
  if (LETZTE.includes(i) && s >= z.last) return "heiss";
  return "ok";
};

const Server: React.FC<{ i: number; z: ServerZeiten }> = ({ i, z }) => {
  const s = useSek();
  const { x, y } = serverPos(i);
  const st = serverStatus(i, s, z);
  const ein = weich(s, z.checks * 0 + i * 0.05, 0.4);
  const rand = st === "fehler" ? FEHLER : st === "heiss" ? AKZENT : "#2a2d38";
  const zittern = st === "heiss" ? Math.sin(s * 60 + i) * 3 : 0;
  const lastBreite = st === "heiss" ? interpolate(s, [z.last, z.last + 1.2], [0.35, 0.98], CLAMP) : st === "ok" ? 0.35 : st === "fehler" ? 0 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x + zittern,
        top: y,
        width: SB,
        height: SH,
        borderRadius: 16,
        backgroundColor: FLAECHE,
        border: `3px solid ${rand}`,
        opacity: ein * (st === "fehler" ? 0.75 : 1),
        padding: "16px 18px",
      }}
    >
      {[0, 1].map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: st === "fehler" ? FEHLER : st === "aus" ? LINIE : OK }} />
          <span style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: "#2a2d38" }} />
        </div>
      ))}
      <div style={{ height: 10, borderRadius: 5, backgroundColor: "#2a2d38", overflow: "hidden" }}>
        <div style={{ width: `${lastBreite * 100}%`, height: "100%", backgroundColor: st === "heiss" ? AKZENT : OK }} />
      </div>
      {st === "fehler" || st === "ok" ? (
        <div
          style={{
            position: "absolute",
            right: -14,
            top: -14,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: st === "fehler" ? FEHLER : OK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={22} height={22}>
            {st === "fehler" ? (
              <path d="M5 5 L17 17 M17 5 L5 17" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            ) : (
              <path d="M4 11 L9 16 L18 6" fill="none" stroke="#0c0d12" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </div>
      ) : null}
    </div>
  );
};

export const HealthChecks: React.FC<{ z: ServerZeiten }> = ({ z }) => {
  const s = useSek();
  const lb = weich(s, z.lb, 0.5);
  const lbX = 540;
  const lbY = 470;
  // Herzschlag-Linie über den Servern während der Checks
  const puls = s >= z.checks && s < z.lb + 1 ? weich(s, z.checks, 0.5) : s >= z.lb + 1 ? Math.max(0, 1 - (s - z.lb - 1) * 2) : 0;
  const pulsVersatz = (s * 260) % 1080;
  // Anfragen: Punkte vom LB zu den Servern
  const ziele = Array.from({ length: SPALTEN * ZEILEN }, (_, i) => i).filter((i) => serverStatus(i, s, z) !== "fehler" && serverStatus(i, s, z) !== "aus");
  const punkte = s >= z.lb + 0.4 && ziele.length ? Array.from({ length: 14 }, (_, k) => k) : [];
  return (
    <Buehne>
      <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: 560, opacity: puls }}>
        <defs>
          <linearGradient id="pulsfade" x1="0" x2="1">
            <stop offset="0" stopColor={OK} stopOpacity={0} />
            <stop offset="0.5" stopColor={OK} stopOpacity={1} />
            <stop offset="1" stopColor={OK} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d={`M${-1080 + pulsVersatz} 100 ${Array.from({ length: 8 }, (_, k) => {
            const b = -1080 + pulsVersatz + k * 270;
            return `L${b + 90} 100 L${b + 115} 40 L${b + 140} 160 L${b + 165} 70 L${b + 185} 100 L${b + 270} 100`;
          }).join(" ")}`}
          fill="none"
          stroke="url(#pulsfade)"
          strokeWidth={5}
        />
      </svg>
      {/* Load Balancer */}
      <div
        style={{
          position: "absolute",
          left: lbX - 150,
          top: lbY - 70,
          width: 300,
          height: 140,
          borderRadius: 24,
          backgroundColor: FLAECHE,
          border: `4px solid ${AKZENT}`,
          opacity: lb,
          scale: String(0.9 + 0.1 * lb),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={150} height={90} viewBox="0 0 150 90">
          <circle cx={30} cy={45} r={14} fill={AKZENT} />
          <path d="M44 45 L120 15 M44 45 L120 45 M44 45 L120 75" stroke={AKZENT} strokeWidth={6} strokeLinecap="round" />
          <circle cx={128} cy={15} r={8} fill={AKZENT} />
          <circle cx={128} cy={45} r={8} fill={AKZENT} />
          <circle cx={128} cy={75} r={8} fill={AKZENT} />
        </svg>
      </div>
      <svg width={1080} height={1400} style={{ position: "absolute", inset: 0, opacity: lb }}>
        {Array.from({ length: SPALTEN * ZEILEN }, (_, i) => {
          const { x, y } = serverPos(i);
          const st = serverStatus(i, s, z);
          return (
            <line
              key={i}
              x1={lbX}
              y1={lbY + 70}
              x2={x + SB / 2}
              y2={y}
              stroke={st === "fehler" ? FEHLER : LINIE}
              strokeOpacity={st === "fehler" ? 0.25 : 0.5}
              strokeWidth={3}
              strokeDasharray={st === "fehler" ? "6 10" : undefined}
            />
          );
        })}
        {punkte.map((k) => {
          const ziel = ziele[(k * 7 + Math.floor(s * 2)) % ziele.length];
          const { x, y } = serverPos(ziel);
          const p = ((s * 0.9 + k / 14) % 1 + 1) % 1;
          return <circle key={k} cx={lbX + (x + SB / 2 - lbX) * p} cy={lbY + 70 + (y - lbY - 70) * p} r={9} fill={AKZENT} opacity={0.9} />;
        })}
      </svg>
      {Array.from({ length: SPALTEN * ZEILEN }, (_, i) => (
        <Server key={i} i={i} z={z} />
      ))}
    </Buehne>
  );
};

// ---------- Verfügbarkeitskurve: fällt, kommt kurz zurück, fällt, dann stabil ----------
export const Kurve: React.FC<{ neustartAb: number; kippAb: number; patchAb: number; samstagAb: number }> = ({ neustartAb, kippAb, patchAb, samstagAb }) => {
  const s = useSek();
  const L = 110;
  const R = 970;
  const O = 520;
  const U = 1000;
  // Stützpunkte (x in 0..1, y in 0..1 mit 1 = alles läuft)
  const pkt: [number, number][] = [
    [0, 1],
    [0.12, 1],
    [0.16, 0.12],
    [0.3, 0.1],
    [0.36, 0.7],
    [0.41, 0.72],
    [0.45, 0.08],
    [0.58, 0.1],
    [0.66, 0.6],
    [0.76, 0.85],
    [0.88, 0.97],
    [1, 0.98],
  ];
  // wie weit die Kurve gezeichnet ist, gekoppelt an den Text
  const fortschritt = interpolate(s, [0, 0.35, Math.max(0.4, neustartAb), Math.max(0.4, neustartAb) + 0.8, kippAb, kippAb + 0.6, patchAb, patchAb + 1.5, samstagAb, samstagAb + 1], [0, 0.3, 0.3, 0.42, 0.42, 0.58, 0.58, 0.8, 0.8, 1], CLAMP);
  const xy = ([x, y]: [number, number]) => [L + x * (R - L), U - y * (U - O)] as const;
  const sichtbar: [number, number][] = [];
  for (let i = 0; i < pkt.length; i++) {
    if (pkt[i][0] <= fortschritt) sichtbar.push(pkt[i]);
    else {
      const [a, b] = [pkt[i - 1], pkt[i]];
      const t = (fortschritt - a[0]) / (b[0] - a[0]);
      sichtbar.push([fortschritt, a[1] + (b[1] - a[1]) * t]);
      break;
    }
  }
  const d = sichtbar.map((p, i) => `${i ? "L" : "M"}${xy(p)[0]} ${xy(p)[1]}`).join(" ");
  const ende = xy(sichtbar[sichtbar.length - 1]);
  const gut = sichtbar[sichtbar.length - 1][1] > 0.5;
  return (
    <Buehne>
      <div style={{ position: "absolute", left: L - 30, top: O - 90, width: R - L + 60, height: U - O + 160, borderRadius: 28, backgroundColor: FLAECHE, border: "2px solid #23262f" }} />
      <svg width={1080} height={1400} style={{ position: "absolute", inset: 0 }}>
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={L} x2={R} y1={U - g * (U - O)} y2={U - g * (U - O)} stroke="#23262f" strokeWidth={2} />
        ))}
        <path d={d} fill="none" stroke={gut ? OK : FEHLER} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={ende[0]} cy={ende[1]} r={14} fill={gut ? OK : FEHLER} />
        <circle cx={ende[0]} cy={ende[1]} r={14 + ((s * 30) % 30)} fill="none" stroke={gut ? OK : FEHLER} strokeWidth={3} opacity={1 - ((s * 30) % 30) / 30} />
      </svg>
      {[
        ["Do", 0.05],
        ["Fr", 0.5],
        ["Sa", 0.92],
      ].map(([t, x]) => (
        <div key={t} style={{ position: "absolute", top: U + 30, left: L + (x as number) * (R - L) - 40, width: 80, textAlign: "center", fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: "#7d818d" }}>
          {t}
        </div>
      ))}
    </Buehne>
  );
};
