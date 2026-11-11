import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Hochformat-Version von Codewort.tsx, gleiche Zeiten (0 s = Voiceover 3:25.9)
const einblenden = (frame: number, fps: number, ab: number) =>
  interpolate(frame, [ab * fps, (ab + 0.5) * fps], [0, 1], { ...CLAMP, easing: WEICH });

export const CodewortHoch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zeile: React.CSSProperties = { position: "absolute", left: 80, right: 80, textAlign: "center", fontWeight: 800 };
  return (
    <>
      <Interactive.Div
        name="Titel"
        style={{ ...zeile, top: 150, fontFamily: ZAHLEN_SCHRIFT, fontSize: 230, lineHeight: 1, color: FARBE.gelb, opacity: einblenden(frame, fps, 0.3) }}
      >
        CODEWORT
      </Interactive.Div>
      <Interactive.Div
        name="Schloss"
        style={{
          position: "absolute",
          top: 430,
          left: (1080 - 300) / 2,
          opacity: einblenden(frame, fps, 0),
          scale: interpolate(frame, [0, 0.6 * fps], [0.8, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
        }}
      >
        <svg width={300} height={371} viewBox="0 0 420 520">
          <path
            d="M100 240 V150 a110 110 0 0 1 220 0 V240"
            fill="none"
            stroke={FARBE.weiss}
            strokeWidth={44}
            strokeLinecap="round"
            style={{ translate: interpolate(frame, [0.6 * fps, 1.1 * fps], ["0px -60px", "0px 0px"], { ...CLAMP, easing: WEICH }) }}
          />
          <rect x={30} y={220} width={360} height={290} rx={36} fill={FARBE.gelb} />
          <circle cx={210} cy={340} r={34} fill={FARBE.hintergrund} />
          <rect x={196} y={350} width={28} height={80} rx={10} fill={FARBE.hintergrund} />
        </svg>
      </Interactive.Div>
      <Interactive.Div name="Beispiel" style={{ ...zeile, top: 850, fontSize: 66, opacity: einblenden(frame, fps, 8.2) }}>
        z. B. „Ananas-Fahrrad“
      </Interactive.Div>
      <Interactive.Div
        name="Frage"
        style={{ ...zeile, top: 980, display: "flex", justifyContent: "center", opacity: einblenden(frame, fps, 11.4) }}
      >
        <div style={{ padding: "18px 32px", borderRadius: 24, backgroundColor: FARBE.weiss, color: FARBE.hintergrund, fontSize: 54 }}>
          „Wie lautet unser Codewort?“
        </div>
      </Interactive.Div>
      <Interactive.Div name="KiWeissNicht" style={{ ...zeile, top: 1150, fontSize: 58, color: FARBE.rot, opacity: einblenden(frame, fps, 13.4) }}>
        Eine KI kann das nicht wissen.
      </Interactive.Div>
    </>
  );
};
