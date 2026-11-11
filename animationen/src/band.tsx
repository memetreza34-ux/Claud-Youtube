import { CanvasImage, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON_SCHRIFT, CLAMP, FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Layout wie bei Erklär-Shorts: Figur als Hintergrund, Beleg-Band in der Mitte, Untertitel darunter (1080x1920)
export const BAND_TOP = 760;
export const BAND_HOEHE = 620;

// Der Strichermittler füllt das ganze Bild, Hut und Augen bleiben über dem Band sichtbar
export const FigurHintergrund: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#050506" }} />
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -440,
          width: 1960,
          height: 1960,
          scale: interpolate(frame, [0, 90 * 30], [1, 1.06], CLAMP),
          transformOrigin: "50% 30%",
        }}
      >
        <CanvasImage src={staticFile("figur/master.jpg")} style={{ width: 1960, height: 1960 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: BAND_TOP + BAND_HOEHE - 40,
          bottom: 0,
          background: "linear-gradient(180deg, rgba(5,5,6,0.55) 0%, rgba(5,5,6,0.85) 40%)",
        }}
      />
    </>
  );
};

// Rahmen des Bands: schiebt sich rein, Inhalte darin
export const Band: React.FC<{ children: React.ReactNode; hintergrund?: string }> = ({ children, hintergrund = "#111116" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: BAND_TOP,
        width: 1080,
        height: BAND_HOEHE,
        overflow: "hidden",
        backgroundColor: hintergrund,
        boxShadow: "0 0 0 6px rgba(0,0,0,0.6), 0 30px 80px rgba(0,0,0,0.8)",
        translate: interpolate(frame, [0, 0.18 * fps], ["0px 60px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        opacity: interpolate(frame, [0, 0.1 * fps], [0, 1], CLAMP),
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ text: string; farbe?: string; textFarbe?: string; links?: number; oben?: number }> = ({
  text,
  farbe = "rgba(5,5,6,0.85)",
  textFarbe = FARBE.weiss,
  links = 24,
  oben = 22,
}) => (
  <div
    style={{
      position: "absolute",
      top: oben,
      left: links,
      padding: "8px 18px",
      borderRadius: 8,
      backgroundColor: farbe,
      color: textFarbe,
      fontFamily: TEXT_SCHRIFT,
      fontSize: 28,
      fontWeight: 700,
      zIndex: 5,
    }}
  >
    {text}
  </div>
);

// Screenshot (1080 breit) im Band: Markierung wird mittig gesetzt, roter Kreis zeichnet sich darum, leichter Zoom
export const BandScreenshot: React.FC<{
  bild: string;
  quelle: string;
  markierung: [number, number, number, number]; // x1, x2, y1, y2 im Screenshot
  kreisAb?: number;
  ohneKreis?: boolean;
  dauer: number;
}> = ({ bild, quelle, markierung, kreisAb = 0.5, ohneKreis = false, dauer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [x1, x2, y1, y2] = markierung;
  const mitteY = (y1 + y2) / 2;
  const versatz = Math.max(0, Math.min(1920 - BAND_HOEHE, mitteY - BAND_HOEHE / 2));
  const cx = (x1 + x2) / 2;
  const cy = mitteY - versatz;
  const rx = (x2 - x1) / 2 + 45;
  const ry = Math.max(46, (y2 - y1) / 2 + 30);
  const umfang = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const gezeichnet = interpolate(frame, [kreisAb * fps, (kreisAb + 0.6) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <Band hintergrund="#ffffff">
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${cx}px ${cy}px`,
          scale: interpolate(frame, [0, dauer * fps], [1, 1.12], CLAMP),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: -versatz, width: 1080, height: 1920 }}>
          <CanvasImage src={staticFile(bild)} style={{ width: 1080, height: 1920 }} />
        </div>
        {ohneKreis ? null : (
          <svg width={1080} height={BAND_HOEHE} style={{ position: "absolute", inset: 0 }}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={Math.min(rx, 530)}
              ry={ry}
              fill="none"
              stroke={FARBE.rot}
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={umfang}
              strokeDashoffset={umfang * (1 - gezeichnet)}
            />
          </svg>
        )}
      </div>
      <Chip text={quelle} />
    </Band>
  );
};

// Große Einblendung im Band (Anton, schwarze Kontur), erscheint ab einer Zeit
export const BandTitel: React.FC<{ text: string; ab: number; farbe?: string; groesse?: number; unten?: boolean }> = ({
  text,
  ab,
  farbe = FARBE.gelb,
  groesse = 120,
  unten = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: unten ? undefined : 0,
        bottom: unten ? 90 : 0,
        display: "flex",
        alignItems: unten ? "flex-end" : "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: ANTON_SCHRIFT,
        fontSize: groesse,
        lineHeight: 1.05,
        color: farbe,
        textTransform: "uppercase",
        WebkitTextStroke: "14px #000",
        paintOrder: "stroke fill",
        zIndex: 4,
        opacity: interpolate(frame, [ab * fps, (ab + 0.12) * fps], [0, 1], CLAMP),
        scale: interpolate(frame, [ab * fps, (ab + 0.3) * fps], [1.25, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
      }}
    >
      {text}
    </div>
  );
};

// Foto im Band (beliebiges Format), Zoom auf einen Punkt, optional Einblendungen
export const BandFoto: React.FC<{
  bild: string;
  nachweis: string;
  fokus?: [number, number];
  dauer: number;
  zoomVon?: number;
  zoomBis?: number;
  extra?: string;
  helligkeit?: number;
  children?: React.ReactNode;
}> = ({ bild, nachweis, fokus = [50, 40], dauer, zoomVon = 1.0, zoomBis = 1.12, extra, helligkeit = 1, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Band>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${fokus[0]}% ${fokus[1]}%`,
          scale: interpolate(frame, [0, dauer * fps], [zoomVon, zoomBis], CLAMP),
          filter: helligkeit !== 1 ? `brightness(${helligkeit})` : undefined,
        }}
      >
        <CanvasImage src={staticFile(bild)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fokus[0]}% ${fokus[1]}%` }} />
      </div>
      {children}
      {extra ? <Chip text={extra} farbe={FARBE.rot} oben={22} /> : null}
      <Chip text={nachweis} oben={BAND_HOEHE - 70} />
    </Band>
  );
};

// Dunkle Karte im Band für Zahlen und kurze Fakten
export const BandKarte: React.FC<{ children: React.ReactNode; quelle?: string }> = ({ children, quelle }) => (
  <Band hintergrund="#101015">
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
      {children}
    </div>
    {quelle ? <Chip text={quelle} oben={BAND_HOEHE - 70} /> : null}
  </Band>
);

export const KartenZahl: React.FC<{ von: number; bis: number; format: (n: number) => string; farbe?: string }> = ({ von, bis, format, farbe = FARBE.gelb }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = interpolate(frame, [0.1 * fps, 1.0 * fps], [von, bis], { ...CLAMP, easing: WEICH });
  return <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 250, lineHeight: 1, color: farbe }}>{format(n)}</div>;
};

export const KartenText: React.FC<{ text: string; groesse?: number; farbe?: string; schrift?: "zahl" | "text" }> = ({
  text,
  groesse = 56,
  farbe = FARBE.weiss,
  schrift = "text",
}) => (
  <div
    style={{
      fontFamily: schrift === "zahl" ? ZAHLEN_SCHRIFT : TEXT_SCHRIFT,
      fontSize: groesse,
      fontWeight: schrift === "zahl" ? 400 : 800,
      lineHeight: 1.15,
      color: farbe,
      marginTop: 10,
    }}
  >
    {text}
  </div>
);
