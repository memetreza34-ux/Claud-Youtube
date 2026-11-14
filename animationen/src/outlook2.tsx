import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, Chip } from "./band";
import { Rahmen, useEin } from "./ruhig";
import { CLAMP, FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Reel 03 v2: mehr echte Bilder, Karten, Mindmap, Bewegung. Jede Szene steht ca. 3–4 s.
const GRUEN = "#3ddc84";

const useFeder = (ab: number, daempfung = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - ab * fps, fps, config: { damping: daempfung } });
};

const useSek = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// 1) Datum knallt rein, darunter fallen Fehlermeldungen der Dienste übereinander
export const DatumFehler: React.FC<{ fehler: { name: string; ab: number }[] }> = ({ fehler }) => {
  const datum = useFeder(0, 12);
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 30, left: 60, scale: String(interpolate(datum, [0, 1], [1.6, 1])), opacity: datum, transformOrigin: "0% 0%" }}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, color: FARBE.grau }}>DONNERSTAG</div>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 170, lineHeight: 0.95, color: FARBE.gelb }}>12. NOVEMBER</div>
      </div>
      {fehler.map((f, i) => (
        <FehlerKarte key={f.name} {...f} index={i} />
      ))}
    </Rahmen>
  );
};

const FehlerKarte: React.FC<{ name: string; ab: number; index: number }> = ({ name, ab, index }) => {
  const ein = useFeder(ab, 13);
  const s = useSek();
  const wackeln = s > ab && s < ab + 0.35 ? Math.sin(s * 70) * 8 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 60 + index * 46,
        top: 245 + index * 86,
        width: 860,
        height: 78,
        borderRadius: 16,
        backgroundColor: "#1d1d24",
        border: `4px solid ${FARBE.rot}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "0 28px",
        opacity: ein,
        translate: `${wackeln + interpolate(ein, [0, 1], [-120, 0])}px 0px`,
      }}
    >
      <div style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: FARBE.rot, color: "#fff", fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, color: FARBE.weiss, width: 250 }}>{name}</div>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: FARBE.grau }}>Verbindung fehlgeschlagen</div>
    </div>
  );
};

// 2) Weltkarte: rote Wellen breiten sich aus
const KARTE_B = 1080;
const KARTE_H = (KARTE_B / 939.75) * 476.73;
// Positionen gemessen auf der Karte (Pixel bei 940 px Breite)
const ORTE = [
  { name: "New York", x: 298, y: 121, ab: 0 },
  { name: "Deutschland", x: 461, y: 88, ab: 0.5 },
];

export const Weltkarte: React.FC<{ textAb: number }> = ({ textAb }) => {
  const s = useSek();
  const text = useEin(textAb);
  const k = KARTE_B / 939.75;
  return (
    <Rahmen hintergrund="#0d1118">
      <Img
        src={staticFile("reel-outlook/weltkarte.svg")}
        style={{ position: "absolute", left: 0, top: 70, width: KARTE_B, height: KARTE_H, filter: "invert(1) brightness(0.6) sepia(1) hue-rotate(180deg) saturate(1.5)" }}
      />
      <svg width={1080} height={BAND_HOEHE} style={{ position: "absolute", inset: 0 }}>
        {ORTE.map((o) => {
          const t = s - o.ab;
          if (t < 0) return null;
          const cx = o.x * k;
          const cy = 70 + o.y * k;
          return (
            <g key={o.name}>
              {[0, 0.7, 1.4].map((v) => {
                const p = ((t + v) % 2.1) / 2.1;
                return <circle key={v} cx={cx} cy={cy} r={12 + p * 130} fill="none" stroke={FARBE.rot} strokeWidth={5} opacity={(1 - p) * 0.8} />;
              })}
              <circle cx={cx} cy={cy} r={16} fill={FARBE.rot} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 40, left: 60, opacity: text, fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, lineHeight: 1, color: FARBE.weiss }}>
        WELTWEIT <span style={{ color: FARBE.rot }}>GESTÖRT</span>
      </div>
      <Chip text="Quelle: ABC News („global outage“), 13.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Foto mit langsamer Fahrt (Ken Burns) und optionaler Einblendung
export const FotoFahrt: React.FC<{
  bild: string;
  nachweis: string;
  fokus?: [number, number];
  hinweis?: string;
  dunkel?: number;
  children?: React.ReactNode;
}> = ({ bild, nachweis, fokus = [50, 50], hinweis, dunkel = 0, children }) => {
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
          scale: String(1.04 + s * 0.018),
          filter: dunkel ? `brightness(${1 - dunkel})` : undefined,
        }}
      />
      {children}
      {hinweis ? <Chip text={hinweis} farbe="rgba(5,5,6,0.85)" textFarbe={FARBE.gelb} /> : null}
      <Chip text={nachweis} oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Microsoft meldet: Zitat-Karte über dem Campus-Foto
export const Meldung: React.FC<{ ab: number; zeit: string; text: string; quelle: string }> = ({ ab, zeit, text, quelle }) => {
  const ein = useFeder(ab, 15);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 150,
        padding: "26px 34px",
        borderRadius: 18,
        backgroundColor: "rgba(10,10,14,0.88)",
        borderLeft: `10px solid ${FARBE.gelb}`,
        opacity: ein,
        translate: `0px ${interpolate(ein, [0, 1], [40, 0])}px`,
      }}
    >
      <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: FARBE.gelb }}>{zeit}</div>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 46, fontWeight: 800, color: FARBE.weiss, lineHeight: 1.2, marginTop: 6 }}>{text}</div>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, fontWeight: 700, color: FARBE.grau, marginTop: 10 }}>{quelle}</div>
    </div>
  );
};

// 3) Mindmap: Microsoft 365 in der Mitte, Äste reißen rot ab
type Ast = { name: string; ab: number; winkel: number };
export const Mindmap: React.FC<{ aeste: Ast[] }> = ({ aeste }) => {
  const s = useSek();
  const kern = useFeder(0, 14);
  const cx = 540;
  const cy = 300;
  return (
    <Rahmen>
      <svg width={1080} height={BAND_HOEHE} style={{ position: "absolute", inset: 0 }}>
        {aeste.map((a) => {
          const r = 250;
          const rad = (a.winkel * Math.PI) / 180;
          const ex = cx + Math.cos(rad) * r * 1.55;
          const ey = cy + Math.sin(rad) * r * 0.82;
          const wachsen = interpolate(s, [0, 0.5], [0, 1], { ...CLAMP, easing: WEICH });
          const kaputt = s >= a.ab;
          const mx = cx + (ex - cx) * 0.5;
          const my = cy + (ey - cy) * 0.5;
          const riss = kaputt ? interpolate(s, [a.ab, a.ab + 0.3], [0, 14], CLAMP) : 0;
          return (
            <g key={a.name}>
              <line x1={cx} y1={cy} x2={cx + (mx - cx) * wachsen - riss} y2={cy + (my - cy) * wachsen} stroke={kaputt ? FARBE.rot : GRUEN} strokeWidth={8} strokeLinecap="round" />
              <line x1={mx + riss} y1={my} x2={mx + (ex - mx) * wachsen} y2={my + (ey - my) * wachsen} stroke={kaputt ? FARBE.rot : GRUEN} strokeWidth={8} strokeLinecap="round" strokeDasharray={kaputt ? "14 10" : undefined} />
            </g>
          );
        })}
      </svg>
      {aeste.map((a) => {
        const rad = (a.winkel * Math.PI) / 180;
        const ex = cx + Math.cos(rad) * 250 * 1.55;
        const ey = cy + Math.sin(rad) * 250 * 0.82;
        const kaputt = s >= a.ab;
        return (
          <div
            key={a.name}
            style={{
              position: "absolute",
              left: ex - 130,
              top: ey - 42,
              width: 260,
              height: 84,
              borderRadius: 42,
              border: `5px solid ${kaputt ? FARBE.rot : GRUEN}`,
              backgroundColor: kaputt ? "#3a1218" : "#13261b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: TEXT_SCHRIFT,
              fontSize: 34,
              fontWeight: 800,
              color: FARBE.weiss,
              scale: kaputt ? String(interpolate(s, [a.ab, a.ab + 0.15, a.ab + 0.3], [1, 1.12, 1], CLAMP)) : "1",
            }}
          >
            {a.name}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: cx - 150,
          top: cy - 75,
          width: 300,
          height: 150,
          borderRadius: 24,
          backgroundColor: FARBE.gelb,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          scale: String(kern),
          boxShadow: "0 0 60px rgba(255,212,0,0.35)",
        }}
      >
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 64, lineHeight: 1, color: "#111" }}>MICROSOFT</div>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 64, lineHeight: 1, color: "#111" }}>365</div>
      </div>
      <Chip text="Quelle: Microsoft-Status, laut Borncity, 12.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// 4) Geräte: Handy, Laptop, Apple Mail – überall dreht der Ladekreis
const Lader: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const s = useSek();
  return (
    <svg width={r * 2 + 20} height={r * 2 + 20} style={{ position: "absolute", left: x - r - 10, top: y - r - 10, rotate: `${s * 400}deg` }}>
      <circle cx={r + 10} cy={r + 10} r={r} fill="none" stroke="#3a3a44" strokeWidth={9} />
      <path d={`M${r + 10} 10 A${r} ${r} 0 0 1 ${2 * r + 10} ${r + 10}`} fill="none" stroke={FARBE.gelb} strokeWidth={9} strokeLinecap="round" />
    </svg>
  );
};

export const Geraete: React.FC<{ abs: [number, number, number] }> = ({ abs }) => {
  const [a, b, c] = abs.map((x) => useFeder(x, 13));
  const geraet = (sicht: number, inhalt: React.ReactNode, label: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: 0, opacity: sicht, translate: `0px ${interpolate(sicht, [0, 1], [60, 0])}px` }}>
      {inhalt}
      <div style={{ position: "absolute", top: 455, width: 300, textAlign: "center", fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 800, color: FARBE.weiss }}>{label}</div>
    </div>
  );
  return (
    <Rahmen>
      {geraet(
        a,
        <div style={{ position: "absolute", left: 80, top: 70, width: 170, height: 340, borderRadius: 30, border: "8px solid #cfcfd6", backgroundColor: "#16161c" }}>
          <Lader x={77} y={160} r={42} />
        </div>,
        "Handy",
        20,
      )}
      {geraet(
        b,
        <>
          <div style={{ position: "absolute", left: 10, top: 120, width: 300, height: 200, borderRadius: 14, border: "8px solid #cfcfd6", backgroundColor: "#16161c" }}>
            <Lader x={142} y={92} r={46} />
          </div>
          <div style={{ position: "absolute", left: -15, top: 320, width: 350, height: 22, borderRadius: 8, backgroundColor: "#cfcfd6" }} />
        </>,
        "Rechner",
        370,
      )}
      {geraet(
        c,
        <div style={{ position: "absolute", left: 40, top: 120, width: 240, height: 200, borderRadius: 18, border: "8px solid #cfcfd6", backgroundColor: "#16161c" }}>
          <svg width={240} height={200} style={{ position: "absolute", left: -8, top: -8 }}>
            <rect x={50} y={45} width={140} height={95} rx={10} fill="none" stroke="#cfcfd6" strokeWidth={8} />
            <path d="M50 50 L120 105 L190 50" fill="none" stroke="#cfcfd6" strokeWidth={8} />
          </svg>
          <div style={{ position: "absolute", right: -18, top: -18, width: 56, height: 56, borderRadius: 28, backgroundColor: FARBE.rot, color: "#fff", fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
        </div>,
        "Apple Mail",
        720,
      )}
      <Chip text="Quelle: Borncity, 12.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Last-Anzeige über dem Rechenzentrum: Zeiger schießt in den roten Bereich, Licht flackert
export const LastAnzeige: React.FC<{ ab: number; ausAb: number }> = ({ ab, ausAb }) => {
  const s = useSek();
  const wert = interpolate(s, [ab, ab + 1.2], [0.2, 1], { ...CLAMP, easing: WEICH });
  const aus = s >= ausAb;
  const flacker = aus ? (Math.floor(s * 12) % 3 === 0 ? 0.75 : 0.25) : 0;
  const winkel = -90 + wert * 180;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0,0,0,${flacker})` }} />
      {aus ? <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(230,57,70,0.18)" }} /> : null}
      <div style={{ position: "absolute", right: 50, top: 100, width: 330, height: 260, borderRadius: 20, backgroundColor: "rgba(10,10,14,0.88)" }}>
        <svg width={330} height={195}>
          <path d="M45 175 A120 120 0 0 1 165 55" fill="none" stroke={GRUEN} strokeWidth={20} />
          <path d="M165 55 A120 120 0 0 1 250 90" fill="none" stroke={FARBE.gelb} strokeWidth={20} />
          <path d="M250 90 A120 120 0 0 1 285 175" fill="none" stroke={FARBE.rot} strokeWidth={20} />
          <line x1={165} y1={175} x2={165 + Math.sin((winkel * Math.PI) / 180) * 105} y2={175 - Math.cos((winkel * Math.PI) / 180) * 105} stroke="#fff" strokeWidth={9} strokeLinecap="round" />
          <circle cx={165} cy={175} r={14} fill="#fff" />
        </svg>
        <div style={{ position: "absolute", bottom: 8, width: "100%", textAlign: "center", fontFamily: ZAHLEN_SCHRIFT, fontSize: 44, color: aus ? FARBE.rot : FARBE.weiss }}>
          {aus ? "SERVER WEG" : "LAST"}
        </div>
      </div>
    </>
  );
};

// Eilmeldung-Leiste über New York
export const Eilmeldung: React.FC<{ ab: number; titel: string; text: string }> = ({ ab, titel, text }) => {
  const ein = useFeder(ab, 15);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 95, translate: `${interpolate(ein, [0, 1], [-1080, 0])}px 0px` }}>
      <div style={{ display: "inline-block", backgroundColor: FARBE.rot, padding: "8px 24px", fontFamily: ZAHLEN_SCHRIFT, fontSize: 48, color: "#fff" }}>{titel}</div>
      <div style={{ backgroundColor: "rgba(10,10,14,0.92)", padding: "18px 24px", fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, color: FARBE.weiss }}>{text}</div>
    </div>
  );
};

// 5) Hackerangriff? Silhouette wird durchgestrichen
export const KeinHacker: React.FC<{ streichAb: number }> = ({ streichAb }) => {
  const s = useSek();
  const ein = useFeder(0, 14);
  const strich = interpolate(s, [streichAb, streichAb + 0.4], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <Rahmen hintergrund="#0b0f0b">
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, fontFamily: "monospace", fontSize: 26, lineHeight: "30px", color: GRUEN, overflow: "hidden", whiteSpace: "pre" }}>
        {Array.from({ length: 22 }, (_, i) => "01001110 10110 0110 1101001 0011 101 11001 0101101 1010 0110110 10 ".repeat(2).slice((i * 7 + Math.floor(s * 8)) % 20)).join("\n")}
      </div>
      <svg width={1080} height={BAND_HOEHE} style={{ position: "absolute", inset: 0, opacity: ein }}>
        <path d="M400 520 Q400 300 540 260 Q680 300 680 520 Z" fill="#1c1c22" />
        <path d="M440 300 Q440 150 540 135 Q640 150 640 300 Q640 360 540 375 Q440 360 440 300 Z" fill="#1c1c22" />
        <path d="M465 300 Q470 205 540 195 Q610 205 615 300 Q610 345 540 352 Q470 345 465 300 Z" fill="#050506" />
        <rect x={490} y={275} width={30} height={10} rx={5} fill={GRUEN} />
        <rect x={560} y={275} width={30} height={10} rx={5} fill={GRUEN} />
        <circle cx={540} cy={330} r={240} fill="none" stroke={FARBE.rot} strokeWidth={22} strokeDasharray={1508} strokeDashoffset={1508 * (1 - strich)} />
        <line x1={370} y1={160} x2={370 + 340 * strich} y2={160 + 340 * strich} stroke={FARBE.rot} strokeWidth={22} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 96, lineHeight: 1, color: FARBE.weiss }}>HACKERANGRIFF?</div>
      <div style={{ position: "absolute", top: 40, right: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 96, lineHeight: 1, color: FARBE.rot, opacity: strich }}>NEIN</div>
      <Chip text="Laut Microsoft · ABC News, 13.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// 6) Zeitleiste Do–Sa: roter Balken wächst, wird am Samstag grün
export const Zeitleiste: React.FC<{ gruenAb: number; dauerAb: number }> = ({ gruenAb, dauerAb }) => {
  const s = useSek();
  const balken = interpolate(s, [0.2, gruenAb], [0, 1], { ...CLAMP, easing: WEICH });
  const gruen = s >= gruenAb;
  const dauer = useFeder(dauerAb, 14);
  const tage = ["DO 12.11.", "FR 13.11.", "SA 14.11."];
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, lineHeight: 1, color: FARBE.gelb }}>Die Störung</div>
      {tage.map((t, i) => (
        <div key={t} style={{ position: "absolute", top: 160, left: 60 + i * 400, fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 800, color: FARBE.weiss }}>
          {t}
        </div>
      ))}
      <div style={{ position: "absolute", top: 225, left: 60, right: 60, height: 70, borderRadius: 35, backgroundColor: "#24242b" }} />
      <div style={{ position: "absolute", top: 225, left: 60, width: 830 * balken, height: 70, borderRadius: 35, backgroundColor: FARBE.rot }} />
      {gruen ? (
        <div style={{ position: "absolute", top: 225, left: 870, width: 150, height: 70, borderRadius: 35, backgroundColor: GRUEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: "#111", fontWeight: 800, fontFamily: TEXT_SCHRIFT }}>✓</div>
      ) : null}
      <div style={{ position: "absolute", top: 320, left: 60, right: 60, opacity: gruen ? 1 : 0, fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: GRUEN }}>
        „restored service to the remaining impacted customers and regions“
      </div>
      <div style={{ position: "absolute", top: 432, left: 60, opacity: dauer, scale: String(interpolate(dauer, [0, 1], [1.3, 1])), transformOrigin: "0% 50%", fontFamily: ZAHLEN_SCHRIFT, fontSize: 96, color: FARBE.rot }}>
        ÜBER 24 STUNDEN STILLSTAND
      </div>
      <Chip text="Quelle: @MSFT365Status, laut Digital Trends, 14.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};
