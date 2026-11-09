import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 3:25.9–3:41.4: "Ein Familiencodewort ... Ananas-Fahrrad ... Wie lautet unser Codewort? Eine KI kann das nicht wissen."
export const Codewort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Hintergrund>
      <Interactive.Div
        name="Schloss"
        style={{
          position: "absolute",
          left: 200,
          top: 260,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          scale: interpolate(frame, [0, 0.6 * fps], [0.8, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        <svg width={420} height={520} viewBox="0 0 420 520">
          <path
            d="M100 240 V150 a110 110 0 0 1 220 0 V240"
            fill="none"
            stroke={FARBE.weiss}
            strokeWidth={44}
            strokeLinecap="round"
            style={{
              translate: interpolate(frame, [0.6 * fps, 1.1 * fps], ["0px -60px", "0px 0px"], { ...CLAMP, easing: WEICH }),
            }}
          />
          <rect x={30} y={220} width={360} height={290} rx={36} fill={FARBE.gelb} />
          <circle cx={210} cy={340} r={34} fill={FARBE.hintergrund} />
          <rect x={196} y={350} width={28} height={80} rx={10} fill={FARBE.hintergrund} />
        </svg>
      </Interactive.Div>

      <Interactive.Div
        name="Titel"
        style={{
          position: "absolute",
          left: 760,
          top: 230,
          fontFamily: ZAHLEN_SCHRIFT,
          fontSize: 220,
          lineHeight: 1,
          color: FARBE.gelb,
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        }}
      >
        CODEWORT
      </Interactive.Div>

      <Interactive.Div
        name="Beispiel"
        style={{
          position: "absolute",
          left: 760,
          top: 480,
          fontSize: 64,
          fontWeight: 800,
          opacity: interpolate(frame, [8.2 * fps, 8.7 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          translate: interpolate(frame, [8.2 * fps, 8.7 * fps], ["0px 30px", "0px 0px"], { ...CLAMP, easing: WEICH }),
        }}
      >
        z. B. „Ananas-Fahrrad“
      </Interactive.Div>

      <Interactive.Div
        name="Frage"
        style={{
          position: "absolute",
          left: 760,
          top: 610,
          padding: "20px 34px",
          borderRadius: 24,
          backgroundColor: FARBE.weiss,
          color: FARBE.hintergrund,
          fontSize: 56,
          fontWeight: 800,
          opacity: interpolate(frame, [11.4 * fps, 11.9 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
          scale: interpolate(frame, [11.4 * fps, 11.9 * fps], [0.9, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        „Wie lautet unser Codewort?“
      </Interactive.Div>

      <Interactive.Div
        name="KiWeissNicht"
        style={{
          position: "absolute",
          left: 760,
          top: 790,
          fontSize: 56,
          fontWeight: 800,
          color: FARBE.rot,
          opacity: interpolate(frame, [13.4 * fps, 13.9 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        }}
      >
        Eine KI kann das nicht wissen.
      </Interactive.Div>
    </Hintergrund>
  );
};
