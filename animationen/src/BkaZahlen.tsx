import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, Quelle, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 0:36.5–0:47.5: "Laut BKA ... rund 49 Millionen ... falsche Polizisten ... fast 50 Millionen dazu"
export const BkaZahlen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zahl1 = interpolate(frame, [3.4 * fps, 4.6 * fps], [0, 49], { ...CLAMP, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const zahl2 = interpolate(frame, [8.2 * fps, 9.2 * fps], [0, 49.5], { ...CLAMP, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });

  return (
    <Hintergrund>
      <Interactive.Div
        name="Ueberschrift"
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: 2,
          color: FARBE.weiss,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [0, 0.6 * fps], ["0px 30px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        }}
      >
        SCHADEN IN DEUTSCHLAND 2025
      </Interactive.Div>

      <Interactive.Div
        name="Enkeltrick"
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [7.2 * fps, 8 * fps], ["0px 0px", "-420px 0px"], { ...CLAMP, easing: WEICH }),
          scale: interpolate(frame, [7.2 * fps, 8 * fps], [1, 0.72], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 300, lineHeight: 1, color: FARBE.gelb }}>
          {Math.round(zahl1)} MIO. €
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 20 }}>Enkeltrick &amp; Schockanrufe</div>
      </Interactive.Div>

      <Interactive.Div
        name="FalschePolizisten"
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [7.6 * fps, 8.2 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [7.6 * fps, 8.4 * fps], ["600px 0px", "420px 0px"], { ...CLAMP, easing: WEICH }),
          scale: 0.72,
        }}
      >
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 300, lineHeight: 1, color: FARBE.rot }}>
          + {zahl2.toFixed(1).replace(".", ",")} MIO. €
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 20 }}>„Falsche Polizisten“</div>
      </Interactive.Div>

      <Quelle text="BKA, Polizeiliche Kriminalstatistik 2025 (via dpa)" />
    </Hintergrund>
  );
};
