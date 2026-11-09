import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, WEICH } from "./stil";

// Voiceover 0:47.2–0:51.7: "Und das sind nur die Fälle, die angezeigt werden. Viele Opfer schämen sich und schweigen."
const WASSER_Y = 430;

export const Eisberg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Hintergrund>
      <Interactive.Div
        name="Wasser"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: WASSER_Y,
          bottom: 0,
          background: "linear-gradient(180deg, #0f2a44 0%, #07121e 100%)",
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polygon
          points={`960,250 1080,${WASSER_Y} 840,${WASSER_Y}`}
          fill={FARBE.weiss}
          opacity={interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], { ...CLAMP, easing: WEICH })}
        />
        <polygon
          points={`840,${WASSER_Y} 1080,${WASSER_Y} 1420,700 1240,1000 680,1000 500,720`}
          fill="#8fb3cf"
          opacity={interpolate(frame, [2.6 * fps, 3.4 * fps], [0, 0.85], { ...CLAMP, easing: WEICH })}
        />
      </svg>
      <Interactive.Div
        name="Angezeigt"
        style={{
          position: "absolute",
          left: 1140,
          top: 290,
          fontSize: 56,
          fontWeight: 800,
          color: FARBE.gelb,
          opacity: interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [1.2 * fps, 1.7 * fps], ["-30px 0px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        }}
      >
        angezeigt
      </Interactive.Div>
      <Interactive.Div
        name="Dunkelfeld"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 720,
          textAlign: "center",
          fontSize: 84,
          fontWeight: 800,
          color: FARBE.hintergrund,
          opacity: interpolate(frame, [3 * fps, 3.6 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          scale: interpolate(frame, [3 * fps, 3.6 * fps], [0.9, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        DUNKELFELD
        <div style={{ fontSize: 44, fontWeight: 700 }}>Scham · Schweigen</div>
      </Interactive.Div>
    </Hintergrund>
  );
};
