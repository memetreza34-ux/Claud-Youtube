import { CanvasImage, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, BAND_TOP, Chip } from "./band";
import { CLAMP, FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Ruhiger Nachrichten-Schnitt: kein Zoom, keine Sprung-Effekte, harte Schnitte.
// Figur steht fest im Hintergrund, Belege im Band, Inhalte erscheinen nur, wenn sie gesagt werden.

export const FigurStill: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#050506" }} />
    <div style={{ position: "absolute", top: -40, left: -440, width: 1960, height: 1960 }}>
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

const Rahmen: React.FC<{ children: React.ReactNode; hintergrund?: string }> = ({ children, hintergrund = "#101015" }) => (
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
    }}
  >
    {children}
  </div>
);

// Blendet ein Element ab einer Sekunde (relativ zur Szene) kurz ein
const useEin = (ab: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [ab * fps, (ab + 0.2) * fps], [0, 1], CLAMP);
};

// Screenshot (1080x1920): Ausschnitt um die Markierung, roter Kreis zeichnet sich, wenn das Wort fällt
export const Beleg: React.FC<{
  bild: string;
  quelle: string;
  markierung: [number, number, number, number];
  kreisAb?: number;
  ohneKreis?: boolean;
  mitteY?: number;
}> = ({ bild, quelle, markierung, kreisAb = 0.4, ohneKreis = false, mitteY: mitteVorgabe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [x1, x2, y1, y2] = markierung;
  const mitteY = (y1 + y2) / 2;
  const versatz = Math.max(0, Math.min(1920 - BAND_HOEHE, (mitteVorgabe ?? mitteY) - BAND_HOEHE / 2));
  const cy = mitteY - versatz;
  const rand = 10;
  const bx = Math.max(6, x1 - rand);
  const bw = Math.min(1074, x2 + rand) - bx;
  const by = cy - (y2 - y1) / 2 - rand;
  const bh = y2 - y1 + 2 * rand;
  const umfang = 2 * (bw + bh);
  const gezeichnet = interpolate(frame, [kreisAb * fps, (kreisAb + 0.4) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <Rahmen hintergrund="#ffffff">
      <div style={{ position: "absolute", left: 0, top: -versatz, width: 1080, height: 1920 }}>
        <CanvasImage src={staticFile(bild)} style={{ width: 1080, height: 1920 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 80, background: "linear-gradient(180deg, #fff 45%, rgba(255,255,255,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "linear-gradient(0deg, #fff 20%, rgba(255,255,255,0))" }} />
      {ohneKreis ? null : (
        <svg width={1080} height={BAND_HOEHE} style={{ position: "absolute", inset: 0 }}>
          <rect
            x={bx}
            y={by}
            width={bw}
            height={bh}
            rx={12}
            fill="none"
            stroke={FARBE.rot}
            strokeWidth={7}
            strokeDasharray={umfang}
            strokeDashoffset={umfang * (1 - gezeichnet)}
            opacity={gezeichnet > 0 ? 1 : 0}
          />
        </svg>
      )}
      <Chip text={quelle} />
    </Rahmen>
  );
};

// Foto ohne Bewegung, mit Bildnachweis und optionalem Hinweis oben
export const Foto: React.FC<{ bild: string; nachweis: string; fokus?: [number, number]; hinweis?: string; helligkeit?: number }> = ({
  bild,
  nachweis,
  fokus = [50, 40],
  hinweis,
  helligkeit = 1,
}) => (
  <Rahmen>
    <CanvasImage
      src={staticFile(bild)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `${fokus[0]}% ${fokus[1]}%`,
        filter: helligkeit !== 1 ? `brightness(${helligkeit})` : undefined,
      }}
    />
    {hinweis ? <Chip text={hinweis} farbe="rgba(5,5,6,0.85)" textFarbe={FARBE.gelb} /> : null}
    <Chip text={nachweis} oben={BAND_HOEHE - 70} />
  </Rahmen>
);

// Steckbrief: Zeilen erscheinen, wenn sie gesagt werden
export type Zeile = { ab: number; label: string; wert: string; zusatz?: string; gross?: boolean };
export const Steckbrief: React.FC<{ titel: string; zeilen: Zeile[]; quelle: string }> = ({ titel, zeilen, quelle }) => (
  <Rahmen>
    <div style={{ position: "absolute", top: 40, left: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, lineHeight: 1, color: FARBE.gelb }}>{titel}</div>
    <div style={{ position: "absolute", top: 165, left: 60, right: 60 }}>
      {zeilen.map((z) => (
        <SteckbriefZeile key={z.label} {...z} />
      ))}
    </div>
    <Chip text={quelle} oben={BAND_HOEHE - 70} />
  </Rahmen>
);

const SteckbriefZeile: React.FC<Zeile> = ({ ab, label, wert, zusatz, gross }) => {
  const sicht = useEin(ab);
  return (
    <div style={{ opacity: sicht, display: "flex", alignItems: "baseline", borderTop: "2px solid #2c2c35", padding: "12px 0" }}>
      <div style={{ width: 240, flexShrink: 0, fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 700, color: FARBE.grau }}>{label}</div>
      <div
        style={{
          fontFamily: gross ? ZAHLEN_SCHRIFT : TEXT_SCHRIFT,
          fontSize: gross ? 84 : 46,
          fontWeight: gross ? 400 : 800,
          lineHeight: 1.05,
          color: gross ? FARBE.gelb : FARBE.weiss,
        }}
      >
        {wert}
      </div>
      {zusatz ? <div style={{ marginLeft: 18, fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 700, color: FARBE.weiss }}>{zusatz}</div> : null}
    </div>
  );
};

// Erklär-Grafik: Nvidia -> Megaspeed -> China?
const Kasten: React.FC<{ x: number; titel: string; unter: string; farbe: string; sicht: number }> = ({ x, titel, unter, farbe, sicht }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 230,
      width: 270,
      height: 160,
      border: `5px solid ${farbe}`,
      borderRadius: 14,
      backgroundColor: "#16161c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity: sicht,
    }}
  >
    <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 64, lineHeight: 1, color: farbe }}>{titel}</div>
    <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: FARBE.grau, marginTop: 6 }}>{unter}</div>
  </div>
);

const Pfeil: React.FC<{ x: number; anteil: number; farbe: string; gestrichelt?: boolean; text: string }> = ({ x, anteil, farbe, gestrichelt, text }) => (
  <>
    <svg width={105} height={60} style={{ position: "absolute", left: x, top: 280 }}>
      <line
        x1={8}
        y1={30}
        x2={8 + 80 * anteil}
        y2={30}
        stroke={farbe}
        strokeWidth={7}
        strokeDasharray={gestrichelt ? "12 9" : undefined}
        strokeLinecap="round"
      />
      {anteil > 0.95 ? <polygon points="84,16 102,30 84,44" fill={farbe} /> : null}
    </svg>
    <div
      style={{
        position: "absolute",
        left: x,
        width: 105,
        top: 238,
        textAlign: "center",
        fontFamily: TEXT_SCHRIFT,
        fontSize: 24,
        fontWeight: 800,
        color: farbe,
        opacity: anteil,
      }}
    >
      {text}
    </div>
  </>
);

export const Lieferweg: React.FC<{ verbotAb: number; chinaAb: number; pruefungAb: number }> = ({ verbotAb, chinaAb, pruefungAb }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const verbot = useEin(verbotAb);
  const pruefung = useEin(pruefungAb);
  const china = interpolate(frame, [chinaAb * fps, (chinaAb + 0.4) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 50, left: 60, right: 60, opacity: verbot }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 76, lineHeight: 1, color: FARBE.rot }}>US-Exportverbot</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: FARBE.weiss, marginTop: 8 }}>
          Die stärksten KI-Chips dürfen nicht nach China.
        </div>
      </div>
      <Kasten x={30} titel="NVIDIA" unter="USA" farbe={FARBE.weiss} sicht={1} />
      <Pfeil x={300} anteil={1} farbe={FARBE.weiss} text="Chips" />
      <Kasten x={405} titel="MEGASPEED" unter="Singapur" farbe={FARBE.gelb} sicht={1} />
      <Pfeil x={675} anteil={china} farbe={FARBE.rot} gestrichelt text="weiter?" />
      <Kasten x={780} titel="CHINA" unter="Verdacht" farbe={FARBE.rot} sicht={china} />
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 60,
          right: 60,
          opacity: pruefung,
          borderTop: "2px solid #2c2c35",
          paddingTop: 18,
          fontFamily: TEXT_SCHRIFT,
          fontSize: 34,
          fontWeight: 800,
          color: FARBE.weiss,
        }}
      >
        <span style={{ color: FARBE.gelb }}>Oktober 2025:</span> USA und Singapur prüfen Megaspeed
      </div>
      <Chip text="Quelle: New York Times, laut TechCrunch" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

export const Kurs: React.FC<{ ab: number }> = ({ ab }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const balken = [
    { text: "−8,74 %", label: "zeitweise", wert: 8.74, ab: ab, farbe: FARBE.rot },
    { text: "−4,3 %", label: "Schluss (rund)", wert: 4.3, ab: ab + 0.9, farbe: "#ff8a8a" },
  ];
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: TEXT_SCHRIFT, fontSize: 48, fontWeight: 800, color: FARBE.weiss }}>
        Nvidia-Aktie am 9. November
      </div>
      <div style={{ position: "absolute", top: 160, left: 60, right: 60, height: 4, backgroundColor: "#4a4a55" }} />
      {balken.map((b, i) => (
        <div key={b.label} style={{ position: "absolute", top: 164, left: 130 + i * 450, width: 340, textAlign: "center" }}>
          <div
            style={{
              height: interpolate(frame, [b.ab * fps, (b.ab + 0.5) * fps], [0, b.wert * 24], { ...CLAMP, easing: WEICH }),
              backgroundColor: b.farbe,
              borderRadius: "0 0 10px 10px",
            }}
          />
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 90, color: b.farbe, lineHeight: 1.1 }}>{b.text}</div>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 700, color: FARBE.weiss }}>{b.label}</div>
        </div>
      ))}
      <Chip text="Quelle: ORF, 9.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};
