import { CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Nachrichten-Bausteine für Reels (1080x1920). Belegbereich oben: 0–1280 px, Untertitel darunter.
export const BELEG_HOEHE = 1280;

// Beleg im Vollbild: Screenshot/Foto randlos, langsamer Zoom auf den Fokuspunkt, Quelle als Chip
export const Beleg: React.FC<{
  bild: string;
  quelle: string;
  fokus?: [number, number]; // Prozent x/y, auf den gezoomt wird
  zoomVon?: number;
  zoomBis?: number;
  dauer: number; // Sekunden, über die gezoomt wird
  children?: React.ReactNode; // z. B. <Kreis>, zoomt mit (Koordinaten im 1080x1280-Bereich)
}> = ({ bild, quelle, fokus = [50, 50], zoomVon = 1.02, zoomBis = 1.18, dauer, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: BELEG_HOEHE, overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: `${fokus[0]}% ${fokus[1]}%`,
            scale: interpolate(frame, [0, dauer * fps], [zoomVon, zoomBis], CLAMP),
            opacity: interpolate(frame, [0, 0.15 * fps], [0, 1], CLAMP),
          }}
        >
          <CanvasImage src={staticFile(bild)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fokus[0]}% ${fokus[1]}%` }} />
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 260,
            background: "linear-gradient(180deg, rgba(11,11,14,0) 0%, rgba(11,11,14,1) 100%)",
          }}
        />
      </div>
      <QuellenChip text={quelle} />
    </>
  );
};

export const QuellenChip: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 150,
      left: 50,
      padding: "10px 20px",
      borderRadius: 10,
      backgroundColor: "rgba(11,11,14,0.85)",
      color: FARBE.weiss,
      fontFamily: TEXT_SCHRIFT,
      fontSize: 30,
      fontWeight: 700,
    }}
  >
    {text}
  </div>
);

// Roter gestrichelter Kreis, der sich zeichnet (Koordinaten im 1080x1920-Bild)
export const Kreis: React.FC<{ cx: number; cy: number; rx: number; ry: number; ab?: number }> = ({ cx, cy, rx, ry, ab = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const umfang = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const gezeichnet = interpolate(frame, [ab * fps, (ab + 0.7) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <mask id={`m-${cx}-${cy}`}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="white"
          strokeWidth={16}
          strokeDasharray={umfang}
          strokeDashoffset={umfang * (1 - gezeichnet)}
        />
      </mask>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={FARBE.rot}
        strokeWidth={9}
        strokeDasharray="28 16"
        mask={`url(#m-${cx}-${cy})`}
      />
    </svg>
  );
};

// Kurs-Grafik: zwei belegte Werte als Balken nach unten
export const KursBalken: React.FC<{ quelle: string }> = ({ quelle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const werte = [
    { label: "zeitweise", wert: 8.74, text: "−8,74 %", ab: 0.2, farbe: FARBE.rot },
    { label: "Schluss (rund)", wert: 4.3, text: "−4,3 %", ab: 0.9, farbe: "#ff8a8a" },
  ];
  const nullLinie = 520;
  const proProzent = 62;
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 80, fontFamily: TEXT_SCHRIFT, fontSize: 54, fontWeight: 800, color: FARBE.weiss }}>
        Nvidia-Aktie, 9. November
      </div>
      <div style={{ position: "absolute", top: 305, left: 80, fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 600, color: FARBE.grau }}>
        Tiefpunkt: 170,33 $
      </div>
      <div style={{ position: "absolute", top: nullLinie, left: 80, right: 80, height: 4, backgroundColor: "#4a4a55" }} />
      {werte.map((w, i) => {
        const h = interpolate(frame, [w.ab * fps, (w.ab + 0.6) * fps], [0, w.wert * proProzent], { ...CLAMP, easing: WEICH });
        return (
          <div key={w.label} style={{ position: "absolute", top: nullLinie + 4, left: 170 + i * 420, width: 320 }}>
            <div style={{ height: h, backgroundColor: w.farbe, borderRadius: "0 0 12px 12px" }} />
            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                fontFamily: ZAHLEN_SCHRIFT,
                fontSize: 96,
                color: w.farbe,
                lineHeight: 1,
                opacity: interpolate(frame, [(w.ab + 0.4) * fps, (w.ab + 0.7) * fps], [0, 1], CLAMP),
              }}
            >
              {w.text}
            </div>
            <div style={{ textAlign: "center", fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 700, color: FARBE.weiss }}>{w.label}</div>
          </div>
        );
      })}
      <QuellenChip text={quelle} />
    </>
  );
};

// Zeitleiste: Punkte erscheinen nacheinander, der aktuelle ist hervorgehoben
export const Zeitleiste: React.FC<{ punkte: { datum: string; text: string; ab: number }[]; quelle: string }> = ({ punkte, quelle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const oben = 260;
  const abstand = 150;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: oben + 20,
          width: 6,
          height: interpolate(t, [punkte[0].ab, punkte[punkte.length - 1].ab + 0.4], [0, (punkte.length - 1) * abstand], CLAMP),
          backgroundColor: "#4a4a55",
        }}
      />
      {punkte.map((p, i) => {
        const aktiv = t >= p.ab && (i === punkte.length - 1 || t < punkte[i + 1].ab);
        return (
          <Interactive.Div
            key={p.datum}
            name={p.datum}
            style={{
              position: "absolute",
              top: oben + i * abstand,
              left: 105,
              right: 70,
              display: "flex",
              alignItems: "flex-start",
              gap: 40,
              opacity: interpolate(frame, [p.ab * fps, (p.ab + 0.3) * fps], [0, aktiv ? 1 : 0.55], CLAMP),
              translate: interpolate(frame, [p.ab * fps, (p.ab + 0.3) * fps], ["40px 0px", "0px 0px"], { ...CLAMP, easing: WEICH }),
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: aktiv ? FARBE.gelb : "#4a4a55", flexShrink: 0 }} />
            <div style={{ fontFamily: TEXT_SCHRIFT }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: aktiv ? FARBE.gelb : FARBE.weiss }}>{p.datum}</div>
              <div style={{ fontSize: 36, fontWeight: 600, color: FARBE.weiss }}>{p.text}</div>
            </div>
          </Interactive.Div>
        );
      })}
      <QuellenChip text={quelle} />
    </>
  );
};

// Große belegte Zahl
export const GrosseZahl: React.FC<{ von: number; bis: number; format: (n: number) => string; zeile: string; quelle: string }> = ({
  von,
  bis,
  format,
  zeile,
  quelle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = interpolate(frame, [0.1 * fps, 1.1 * fps], [von, bis], { ...CLAMP, easing: WEICH });
  return (
    <>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 280, lineHeight: 1, color: FARBE.gelb }}>{format(n)}</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 46, fontWeight: 700, color: FARBE.weiss, marginTop: 10, padding: "0 80px" }}>{zeile}</div>
      </div>
      <QuellenChip text={quelle} />
    </>
  );
};

// Zitat-Karte für Stellungnahmen ohne brauchbaren Screenshot
export const Zitat: React.FC<{ wer: string; text: string; quelle: string }> = ({ wer, text, quelle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 80,
          right: 80,
          fontFamily: TEXT_SCHRIFT,
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], CLAMP),
          translate: interpolate(frame, [0, 0.4 * fps], ["0px 40px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: FARBE.grau, letterSpacing: 2 }}>{wer}</div>
        <div style={{ fontSize: 76, fontWeight: 800, color: FARBE.weiss, lineHeight: 1.15, marginTop: 20, borderLeft: `10px solid ${FARBE.rot}`, paddingLeft: 36 }}>
          {text}
        </div>
      </div>
      <QuellenChip text={quelle} />
    </>
  );
};
