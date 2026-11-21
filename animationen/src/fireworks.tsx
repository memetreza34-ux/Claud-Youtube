import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE } from "./band";
import { Buehne } from "./ruhig";
import { CLAMP, TEXT_SCHRIFT, WEICH } from "./stil";

// Reel 04 Fireworks AI: Lieferketten-Angriff als ruhige Erklärgrafik. Wenig Text, nur kleine Beschriftungen.
const LINIE = "#5b5f6b";
const FLAECHE = "#16181f";
const FEHLER = "#ef4444";
const AKZENT = "#ff8a1f";

const useSek = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
const weich = (s: number, a: number, dauer = 0.5) => interpolate(s, [a, a + dauer], [0, 1], { ...CLAMP, easing: WEICH });

const Kachel: React.FC<{ x: number; y: number; b: number; h: number; sicht: number; rand: string; children: React.ReactNode; label?: string }> = ({
  x,
  y,
  b,
  h,
  sicht,
  rand,
  children,
  label,
}) => (
  <div style={{ position: "absolute", left: x - b / 2, top: y - h / 2, width: b, height: h, opacity: sicht, scale: String(0.88 + 0.12 * sicht) }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 28,
        backgroundColor: FLAECHE,
        border: `4px solid ${rand}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: rand === FEHLER ? "0 0 50px rgba(239,68,68,0.35)" : undefined,
      }}
    >
      {children}
    </div>
    {label ? (
      <div style={{ position: "absolute", top: h + 14, width: "100%", textAlign: "center", fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: "#9a9eab" }}>{label}</div>
    ) : null}
  </div>
);

const Schluessel: React.FC<{ farbe: string }> = ({ farbe }) => (
  <svg width={70} height={36} viewBox="0 0 70 36">
    <circle cx={16} cy={18} r={12} fill="none" stroke={farbe} strokeWidth={6} />
    <path d="M28 18 H66 M54 18 V30 M64 18 V28" stroke={farbe} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

const Angreifer: React.FC<{ x: number; y: number; sicht: number }> = ({ x, y, sicht }) => (
  <svg width={150} height={170} style={{ position: "absolute", left: x - 75, top: y - 85, opacity: sicht }}>
    <path d="M20 165 Q20 95 75 82 Q130 95 130 165 Z" fill="#23252e" />
    <path d="M38 70 Q38 10 75 6 Q112 10 112 70 Q112 96 75 102 Q38 96 38 70 Z" fill="#23252e" />
    <path d="M50 70 Q52 30 75 26 Q98 30 100 70 Q98 88 75 91 Q52 88 50 70 Z" fill="#050506" />
    <rect x={58} y={58} width={13} height={5} rx={2} fill={FEHLER} />
    <rect x={80} y={58} width={13} height={5} rx={2} fill={FEHLER} />
  </svg>
);

// Linie, die sich zeichnet; rot und gestrichelt für den Weg der Angreifer
const Weg: React.FC<{ d: string; anteil: number; rot?: boolean; laenge?: number }> = ({ d, anteil, rot, laenge = 900 }) => (
  <path
    d={d}
    fill="none"
    stroke={rot ? FEHLER : LINIE}
    strokeWidth={rot ? 7 : 5}
    strokeLinecap="round"
    strokeDasharray={`${laenge}`}
    strokeDashoffset={laenge * (1 - anteil)}
    opacity={anteil > 0 ? 1 : 0}
  />
);

export type LieferketteZeiten = {
  fireworks: number; // Fireworks erscheint
  notion: number; // Notion oben, Verbindung zu Fireworks, Chat-Blase wandert runter
  zugriff: number; // Angreifer taucht auf, Fireworks wird rot
  schluessel: number; // Schlüssel wandern zum Angreifer
  cloud: number; // Cloud-Anbieter unten, roter Weg Angreifer -> Cloud -> Fireworks
  lieferkette: number; // Uber erscheint, beide hängen an Fireworks, roter Weg bis nach oben
};

export const Lieferkette: React.FC<{ z: LieferketteZeiten }> = ({ z }) => {
  const s = useSek();
  const fw = weich(s, z.fireworks, 0.6);
  const notion = weich(s, z.notion, 0.5);
  const uber = weich(s, z.lieferkette, 0.5);
  const boese = weich(s, z.zugriff, 0.5);
  const cloud = weich(s, z.cloud, 0.5);
  const fwRot = s >= z.zugriff;
  const NX = 320;
  const UX = 760;
  const OY = 330;
  const FX = 540;
  const FY = 700;
  const CX = 540;
  const CY = 1070;
  const AX = 170;
  const AY = 1070;
  // Chat-Blase wandert von Notion zu Fireworks (wiederholt)
  const chatT = s >= z.notion + 0.6 && s < z.zugriff ? ((s - z.notion - 0.6) % 1.6) / 1.6 : -1;
  // Schlüssel wandern von Fireworks zum Angreifer
  const keyT = s >= z.schluessel ? Math.min(1, (s - z.schluessel) / 1.2) : 0;
  return (
    <Buehne>
      <svg width={1080} height={BAND_HOEHE + 760} style={{ position: "absolute", inset: 0 }}>
        <Weg d={`M${NX} ${OY + 90} C ${NX} ${OY + 250}, ${FX} ${FY - 260}, ${FX} ${FY - 95}`} anteil={notion} />
        <Weg d={`M${UX} ${OY + 90} C ${UX} ${OY + 250}, ${FX} ${FY - 260}, ${FX} ${FY - 95}`} anteil={uber} />
        <Weg d={`M${AX + 70} ${AY} L${CX - 120} ${CY}`} anteil={cloud} rot />
        <Weg d={`M${CX} ${CY - 90} L${FX} ${FY + 95}`} anteil={weich(s, z.cloud + 0.4, 0.5)} rot />
        {/* in der Lieferketten-Phase: rote Wege weiter nach oben zu Notion und Uber */}
        <Weg d={`M${FX - 30} ${FY - 95} C ${FX - 30} ${FY - 240}, ${NX + 20} ${OY + 260}, ${NX + 20} ${OY + 95}`} anteil={weich(s, z.lieferkette + 0.8, 0.6)} rot />
        <Weg d={`M${FX + 30} ${FY - 95} C ${FX + 30} ${FY - 240}, ${UX - 20} ${OY + 260}, ${UX - 20} ${OY + 95}`} anteil={weich(s, z.lieferkette + 1.1, 0.6)} rot />
      </svg>
      <Kachel x={NX} y={OY} b={240} h={180} sicht={notion} rand={s >= z.lieferkette + 1.4 ? FEHLER : "#2a2d38"} label="Notion">
        <Img src={staticFile("reel-fireworks/logo-notion.svg")} style={{ width: 110, height: 110, objectFit: "contain", filter: "invert(1)" }} />
      </Kachel>
      <Kachel x={UX} y={OY} b={240} h={180} sicht={uber} rand={s >= z.lieferkette + 1.7 ? FEHLER : "#2a2d38"} label="Uber">
        <Img src={staticFile("reel-fireworks/logo-uber.svg")} style={{ width: 160, height: 70, objectFit: "contain", filter: "invert(1)" }} />
      </Kachel>
      <Kachel x={FX} y={FY} b={360} h={190} sicht={fw} rand={fwRot ? FEHLER : AKZENT} label="Fireworks AI">
        <svg width={120} height={120} viewBox="0 0 120 120">
          {Array.from({ length: 10 }, (_, i) => {
            const w = (i / 10) * Math.PI * 2;
            return <line key={i} x1={60 + Math.cos(w) * 18} y1={60 + Math.sin(w) * 18} x2={60 + Math.cos(w) * 48} y2={60 + Math.sin(w) * 48} stroke={fwRot ? FEHLER : AKZENT} strokeWidth={8} strokeLinecap="round" />;
          })}
        </svg>
      </Kachel>
      <Kachel x={CX} y={CY} b={240} h={150} sicht={cloud} rand={FEHLER} label="Cloud-Anbieter">
        <svg width={140} height={80} viewBox="0 0 140 80">
          <path d="M35 72 C12 72 6 50 20 40 C16 18 40 8 56 18 C64 2 96 0 104 22 C126 14 140 34 132 50 C140 60 134 72 118 72 Z" fill="none" stroke="#c9ccd4" strokeWidth={6} />
        </svg>
      </Kachel>
      <Angreifer x={AX} y={AY} sicht={boese} />
      {chatT >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: NX + (FX - NX) * chatT - 40,
            top: OY + 110 + (FY - OY - 220) * chatT,
            width: 80,
            height: 56,
            borderRadius: 16,
            backgroundColor: "#e6e8ee",
            opacity: Math.sin(chatT * Math.PI),
          }}
        >
          {[14, 26, 38].map((y) => (
            <div key={y} style={{ position: "absolute", left: 14, top: y - 4, width: y === 38 ? 30 : 52, height: 6, borderRadius: 3, backgroundColor: "#8a8f9c" }} />
          ))}
        </div>
      ) : null}
      {[0, 1, 2].map((k) => {
        const t = Math.max(0, Math.min(1, keyT * 1.3 - k * 0.15));
        if (keyT <= 0 || t <= 0) return null;
        return (
          <div key={k} style={{ position: "absolute", left: FX - 35 + (AX - FX) * t + k * 18, top: FY + 40 + (AY - 150 - FY) * t, opacity: 1 - Math.max(0, t - 0.85) * 6 }}>
            <Schluessel farbe={AKZENT} />
          </div>
        );
      })}
    </Buehne>
  );
};

// Posen-Bild als ganze Fläche (wie ein Meme bei Hood Informatik); die Hintergrund-Figur ist dabei verdeckt
export const Pose: React.FC<{ bild: string; fokusY?: number }> = ({ bild }) => {
  const s = useSek();
  return (
    <Buehne>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#121214" }} />
      <Img
        src={staticFile(bild)}
        style={{ position: "absolute", left: -60, top: BAND_HOEHE + 760 - 1200, width: 1200, height: 1200, objectFit: "cover", scale: String(1 + s * 0.012), transformOrigin: "50% 40%" }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 260, background: "linear-gradient(180deg, #121214 30%, rgba(18,18,20,0))" }} />
    </Buehne>
  );
};
