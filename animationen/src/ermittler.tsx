import { CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Bausteine für Reels im Ermittler-Look (1080x1920)

// Dauerhafter Hintergrund: dunkle Ermittler-Wand mit Raster und roten Fäden, Figur rechts oben.
// figurHell: 1 = Figur im Vordergrund, 0.25 = tritt bei Beweisen zurück
export const ErmittlerWand: React.FC<{ figurHell: number }> = ({ figurHell }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * 96} y1={0} x2={i * 96} y2={1920} stroke="#2a2a33" strokeWidth={2} />
        ))}
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 96} x2={1080} y2={i * 96} stroke="#2a2a33" strokeWidth={2} />
        ))}
        <path d="M 60 420 L 520 760 L 980 520" stroke={FARBE.rot} strokeWidth={4} fill="none" opacity={0.7} />
        <path d="M 120 1300 L 560 980 L 1000 1260" stroke={FARBE.rot} strokeWidth={4} fill="none" opacity={0.6} />
        {[
          [60, 420],
          [520, 760],
          [980, 520],
          [120, 1300],
          [560, 980],
          [1000, 1260],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={12} fill={FARBE.rot} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 90,
          width: 900,
          height: 900,
          opacity: figurHell,
          scale: interpolate(frame, [0, 60 * 30], [1, 1.08], CLAMP),
          maskImage: "radial-gradient(circle at 50% 50%, black 50%, transparent 70%)",
        }}
      >
        <CanvasImage src={staticFile("figur/master.jpg")} style={{ width: 900, height: 900 }} />
      </div>
    </>
  );
};

export const Titel: React.FC<{ text: string; farbe?: string; groesse?: number }> = ({ text, farbe = FARBE.weiss, groesse = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Titel"
      style={{
        position: "absolute",
        top: 140,
        left: 80,
        right: 80,
        textAlign: "center",
        fontSize: groesse,
        fontWeight: 800,
        lineHeight: 1.1,
        color: farbe,
        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        translate: interpolate(frame, [0, 0.4 * fps], ["0px 30px", "0px 0px"], { ...CLAMP, easing: WEICH }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

// Beweiskarte mit Bild (Foto oder Screenshot), leicht schräg, fliegt ein
export const BeweisKarte: React.FC<{
  bild: string;
  breite: number;
  hoehe: number;
  top: number;
  drehung?: number;
  bildPosition?: string;
  nachweis?: string;
}> = ({ bild, breite, hoehe, top, drehung = -2, bildPosition = "50% 50%", nachweis }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="BeweisKarte"
      style={{
        position: "absolute",
        top,
        left: (1080 - breite) / 2,
        width: breite,
        opacity: interpolate(frame, [0, 0.35 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        translate: interpolate(frame, [0, 0.5 * fps], ["0px 120px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        rotate: `${drehung}deg`,
      }}
    >
      <div style={{ padding: 14, backgroundColor: FARBE.weiss, borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ width: breite - 28, height: hoehe, overflow: "hidden", borderRadius: 4 }}>
          <CanvasImage src={staticFile(bild)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: bildPosition }} />
        </div>
      </div>
      {nachweis ? (
        <div style={{ marginTop: 14, fontSize: 26, fontWeight: 600, color: FARBE.grau, textAlign: "center" }}>{nachweis}</div>
      ) : null}
    </Interactive.Div>
  );
};

// Stempel wie auf einer Akte, knallt rein
export const Stempel: React.FC<{ text: string; top: number; left: number; farbe?: string; drehung?: number }> = ({
  text,
  top,
  left,
  farbe = FARBE.rot,
  drehung = -8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Stempel"
      style={{
        position: "absolute",
        top,
        left,
        padding: "10px 24px",
        border: `6px solid ${farbe}`,
        borderRadius: 12,
        color: farbe,
        backgroundColor: "rgba(11,11,14,0.85)",
        fontFamily: ZAHLEN_SCHRIFT,
        fontSize: 64,
        letterSpacing: 3,
        whiteSpace: "nowrap",
        rotate: `${drehung}deg`,
        opacity: interpolate(frame, [0, 0.15 * fps], [0, 1], CLAMP),
        scale: interpolate(frame, [0, 0.25 * fps], [1.8, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

export const Marke: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 90,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: 6,
      color: FARBE.grau,
    }}
  >
    DER STRICHERMITTLER
  </div>
);
