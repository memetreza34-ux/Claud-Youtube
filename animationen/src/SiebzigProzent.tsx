import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, Quelle, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 1:50.4–1:57.4: "70 % der Menschen nicht sicher, ob sie eine geklonte Stimme erkennen würden"
export const SiebzigProzent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wert = interpolate(frame, [1.4 * fps, 2.4 * fps], [0, 70], { ...CLAMP, easing: WEICH });
  return (
    <Hintergrund>
      <Interactive.Div
        name="Zahl"
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: ZAHLEN_SCHRIFT,
          fontSize: 420,
          lineHeight: 1,
          color: FARBE.gelb,
          opacity: interpolate(frame, [1.2 * fps, 1.6 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          scale: interpolate(frame, [1.2 * fps, 2.4 * fps], [0.85, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        {Math.round(wert)} %
      </Interactive.Div>
      <Interactive.Div
        name="Text"
        style={{
          position: "absolute",
          top: 640,
          left: 160,
          right: 160,
          textAlign: "center",
          fontSize: 60,
          fontWeight: 700,
          lineHeight: 1.25,
          opacity: interpolate(frame, [2.8 * fps, 3.4 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [2.8 * fps, 3.4 * fps], ["0px 30px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        }}
      >
        sind <span style={{ color: FARBE.rot }}>nicht sicher</span>, ob sie eine
        <br />
        KI-Stimme erkennen würden
      </Interactive.Div>
      <Quelle text="McAfee, „Beware the Artificial Impostor“, 2023" />
    </Hintergrund>
  );
};
