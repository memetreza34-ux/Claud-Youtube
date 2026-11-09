import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, Quelle, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 1:08.4–1:18.4: "McAfee getestet ... 3 Sekunden ... 85 % ... mehr Aufnahmen ... 95 %"
const Balken: React.FC<{ name: string; label: string; wert: number; start: number; top: number; farbe: string }> = ({
  name,
  label,
  wert,
  start,
  top,
  farbe,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anteil = interpolate(frame, [start, start + 1.2 * fps], [0, wert], { ...CLAMP, easing: WEICH });
  return (
    <Interactive.Div
      name={name}
      style={{
        position: "absolute",
        top,
        left: 160,
        right: 160,
        opacity: interpolate(frame, [start - 0.5 * fps, start], [0, 1], { ...CLAMP, easing: WEICH }),
      }}
    >
      <div style={{ fontSize: 52, fontWeight: 700, marginBottom: 22 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ flex: 1, height: 90, borderRadius: 14, backgroundColor: FARBE.balkenLeer, overflow: "hidden" }}>
          <div style={{ width: `${anteil}%`, height: "100%", backgroundColor: farbe, borderRadius: 14 }} />
        </div>
        <div style={{ width: 260, fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, lineHeight: 1, color: farbe, textAlign: "right" }}>
          {Math.round(anteil)} %
        </div>
      </div>
    </Interactive.Div>
  );
};

export const McAfeeBalken: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Hintergrund>
      <Interactive.Div
        name="Ueberschrift"
        style={{
          position: "absolute",
          top: 120,
          left: 160,
          fontSize: 64,
          fontWeight: 800,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        }}
      >
        Wie echt klingt der Klon?
      </Interactive.Div>
      <Balken name="DreiSekunden" label="3–4 Sekunden Audio" wert={85} start={3 * fps} top={330} farbe={FARBE.gelb} />
      <Balken name="MehrAufnahmen" label="Mit mehr Aufnahmen" wert={95} start={7.4 * fps} top={600} farbe={FARBE.rot} />
      <Quelle text="McAfee, „Beware the Artificial Impostor“, 2023" />
    </Hintergrund>
  );
};
