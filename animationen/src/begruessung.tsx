import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON_SCHRIFT, CLAMP, TEXT_SCHRIFT } from "./stil";

// Begrüßung „Willkommen beim Strichermittler“: Ballons in den Farben der Figur
// (Orange vom Hutband, Weiß vom Kopf, Schwarz vom Mantel) tragen das Namensschild ins Bild.
// Zeiten in Sekunden relativ zum Beginn der Begrüßung.

const ORANGE = "#ff7410";
type Farbe = "orange" | "weiss" | "schwarz";
const VERLAUF: Record<Farbe, [string, string, string]> = {
  orange: ["#ffc590", "#ff7410", "#8f2903"],
  weiss: ["#ffffff", "#eceae6", "#9a978f"],
  schwarz: ["#5e5e66", "#1a1a1f", "#060608"],
};
const KNOTEN: Record<Farbe, string> = { orange: "#b3400a", weiss: "#b9b5ad", schwarz: "#121215" };

const form = (r: number) =>
  `M 0 ${-1.18 * r} C ${0.75 * r} ${-1.18 * r} ${r} ${-0.55 * r} ${r} ${-0.1 * r} ` +
  `C ${r} ${0.5 * r} ${0.45 * r} ${r} 0 ${1.18 * r} C ${-0.45 * r} ${r} ${-r} ${0.5 * r} ${-r} ${-0.1 * r} ` +
  `C ${-r} ${-0.55 * r} ${-0.75 * r} ${-1.18 * r} 0 ${-1.18 * r} Z`;

// Knoten-Punkt eines gedrehten Ballons
const knoten = (x: number, y: number, r: number, drehung: number) => {
  const rad = (drehung * Math.PI) / 180;
  return [x - Math.sin(rad) * 1.3 * r, y + Math.cos(rad) * 1.3 * r] as const;
};

const Verlaeufe: React.FC = () => (
  <defs>
    {(Object.keys(VERLAUF) as Farbe[]).map((f) => (
      <radialGradient key={f} id={`ballon-${f}`} cx="0.36" cy="0.3" r="0.85" fx="0.34" fy="0.26">
        <stop offset="0" stopColor={VERLAUF[f][0]} />
        <stop offset="0.45" stopColor={VERLAUF[f][1]} />
        <stop offset="1" stopColor={VERLAUF[f][2]} />
      </radialGradient>
    ))}
    <radialGradient id="ballon-glanz">
      <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    {/* orangefarbenes Streiflicht wie bei der Figur */}
    <linearGradient id="ballon-kante" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0.55" stopColor={ORANGE} stopOpacity="0" />
      <stop offset="1" stopColor={ORANGE} stopOpacity="0.95" />
    </linearGradient>
  </defs>
);

const Ballon: React.FC<{ x: number; y: number; r: number; farbe: Farbe; drehung: number }> = ({ x, y, r, farbe, drehung }) => (
  <g transform={`translate(${x} ${y}) rotate(${drehung})`}>
    <path d={form(r)} fill={`url(#ballon-${farbe})`} />
    {farbe === "schwarz" && <path d={form(r)} fill="none" stroke="url(#ballon-kante)" strokeWidth={r * 0.07} />}
    <ellipse cx={-0.4 * r} cy={-0.56 * r} rx={0.15 * r} ry={0.28 * r} transform={`rotate(-28 ${-0.4 * r} ${-0.56 * r})`} fill="url(#ballon-glanz)" />
    <path d={`M ${-0.12 * r} ${1.31 * r} L ${0.12 * r} ${1.31 * r} L 0 ${1.14 * r} Z`} fill={KNOTEN[farbe]} />
  </g>
);

const Schnur: React.FC<{ von: readonly [number, number]; bis: readonly [number, number]; bogen: number }> = ({ von, bis, bogen }) => {
  const mx = (von[0] + bis[0]) / 2 + bogen;
  const my = (von[1] + bis[1]) / 2;
  return <path d={`M ${von[0]} ${von[1]} Q ${mx} ${my} ${bis[0]} ${bis[1]}`} fill="none" stroke="#d8d2c8" strokeWidth={2.5} strokeOpacity={0.75} />;
};

// Freie Ballons an den Seiten, damit das Gesicht frei bleibt
const FREI: { x: number; r: number; farbe: Farbe; start: number; dauer: number; phase: number }[] = [
  { x: 95, r: 88, farbe: "orange", start: 0, dauer: 2.6, phase: 0 },
  { x: 985, r: 96, farbe: "weiss", start: 0.08, dauer: 2.5, phase: 0.4 },
  { x: 175, r: 62, farbe: "schwarz", start: 0.4, dauer: 2.9, phase: 0.2 },
  { x: 885, r: 66, farbe: "orange", start: 0.55, dauer: 2.8, phase: 0.7 },
  { x: 40, r: 58, farbe: "weiss", start: 0.9, dauer: 2.9, phase: 0.5 },
  { x: 1035, r: 60, farbe: "schwarz", start: 1.0, dauer: 2.8, phase: 0.9 },
  { x: 140, r: 74, farbe: "schwarz", start: 1.3, dauer: 2.5, phase: 0.3 },
  { x: 940, r: 72, farbe: "orange", start: 1.45, dauer: 2.35, phase: 0.6 },
];

// Namensschild mit Ballontrauben an beiden Ecken
const SCHILD = { links: 110, oben: 1050, breite: 860, hoehe: 250 };
const ECKE_L = [SCHILD.links + 70, SCHILD.oben + 24] as const;
const ECKE_R = [SCHILD.links + SCHILD.breite - 70, SCHILD.oben + 24] as const;
const TRAUBE: { x: number; y: number; r: number; farbe: Farbe; ecke: readonly [number, number]; phase: number }[] = [
  { x: 125, y: 780, r: 94, farbe: "orange", ecke: ECKE_L, phase: 0 },
  { x: 250, y: 825, r: 80, farbe: "weiss", ecke: ECKE_L, phase: 0.5 },
  { x: 955, y: 780, r: 94, farbe: "schwarz", ecke: ECKE_R, phase: 0.25 },
  { x: 830, y: 825, r: 80, farbe: "orange", ecke: ECKE_R, phase: 0.75 },
];

// nameAb: wann „Strichermittler“ gesagt wird; ende: Länge der Szene
export const BallonBegruessung: React.FC<{ nameAb: number; ende: number }> = ({ nameAb, ende }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const welle = (frequenz: number, phase: number) => Math.sin(2 * Math.PI * (frequenz * t + phase));

  // Schild steigt von unten auf, schwebt, und fliegt zum Schluss nach oben davon
  const aufstieg = interpolate(t, [0, 1.0], [1000, 0], { easing: Easing.out(Easing.cubic), ...CLAMP });
  const abflug = interpolate(t, [ende - 0.65, ende], [0, -1450], { easing: Easing.in(Easing.cubic), ...CLAMP });
  const dy = aufstieg + abflug + 7 * welle(0.55, 0) - 12 * t;
  const pendel = 1.3 * welle(0.45, 0.15);
  const strich = interpolate(t, [nameAb, nameAb + 0.5], [0, 1], { easing: Easing.out(Easing.cubic), ...CLAMP });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Verlaeufe />
        {FREI.map((b, i) => {
          const y = interpolate(t, [b.start, b.start + b.dauer], [1920 + 2.6 * b.r, -2.6 * b.r], CLAMP);
          if (t < b.start) return null;
          const x = b.x + 16 * welle(0.5, b.phase);
          const drehung = 5 * welle(0.5, b.phase + 0.25);
          const k = knoten(x, y, b.r, drehung);
          return (
            <g key={i}>
              <Schnur von={k} bis={[k[0] - 6 * welle(0.5, b.phase), k[1] + 2.6 * b.r]} bogen={14 * welle(0.7, b.phase)} />
              <Ballon x={x} y={y} r={b.r} farbe={b.farbe} drehung={drehung} />
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px) rotate(${pendel}deg)`, transformOrigin: `540px 820px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Verlaeufe />
          {TRAUBE.map((b, i) => {
            const x = b.x + 6 * welle(0.6, b.phase);
            const y = b.y + 5 * welle(0.7, b.phase + 0.3);
            const drehung = (b.x < 540 ? -6 : 6) + 3 * welle(0.6, b.phase);
            return <Schnur key={`s${i}`} von={knoten(x, y, b.r, drehung)} bis={b.ecke} bogen={8 * welle(0.6, b.phase)} />;
          })}
          {TRAUBE.map((b, i) => {
            const x = b.x + 6 * welle(0.6, b.phase);
            const y = b.y + 5 * welle(0.7, b.phase + 0.3);
            const drehung = (b.x < 540 ? -6 : 6) + 3 * welle(0.6, b.phase);
            return <Ballon key={`b${i}`} x={x} y={y} r={b.r} farbe={b.farbe} drehung={drehung} />;
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            left: SCHILD.links,
            top: SCHILD.oben,
            width: SCHILD.breite,
            height: SCHILD.hoehe,
            borderRadius: 24,
            border: `5px solid ${ORANGE}`,
            background: "linear-gradient(180deg, #1b1b21 0%, #0c0c0f 100%)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.75), inset 0 0 40px rgba(255,116,16,0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[ECKE_L, ECKE_R].map((e, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: e[0] - SCHILD.links - 9,
                top: e[1] - SCHILD.oben - 9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: "radial-gradient(circle at 35% 35%, #f2f2f2, #8a8a8a)",
              }}
            />
          ))}
          <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 36, letterSpacing: 9, color: ORANGE, marginTop: 6 }}>WILLKOMMEN BEIM</div>
          <div style={{ fontFamily: ANTON_SCHRIFT, fontSize: 112, lineHeight: 1.05, color: "#fff", letterSpacing: 2 }}>STRICHERMITTLER</div>
          <svg width={640} height={22} style={{ marginTop: 2 }}>
            <line x1={10} y1={11} x2={630} y2={11} stroke={ORANGE} strokeWidth={9} strokeLinecap="round" strokeDasharray={620} strokeDashoffset={620 * (1 - strich)} opacity={strich > 0 ? 1 : 0} />
          </svg>
        </div>
      </div>
    </div>
  );
};
