import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 2:51.2–2:58.7: "Schock schaltet das klare Denken aus. Zeitdruck verhindert Nachfragen. Und Geheimhaltung ..."
const WORTE = [
  { start: 0.2, wort: "SCHOCK", text: "schaltet das Denken aus" },
  { start: 2.5, wort: "ZEITDRUCK", text: "verhindert Nachfragen" },
  { start: 4.6, wort: "GEHEIMNIS", text: "verhindert Hilfe von außen" },
];

export const DreiWorte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Hintergrund>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 60 }}>
        {WORTE.map((w, i) => (
          <Interactive.Div
            key={w.wort}
            name={w.wort}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 540,
              opacity: interpolate(frame, [w.start * fps, (w.start + 0.4) * fps], [0, 1], { ...CLAMP, easing: WEICH }),
              scale: interpolate(frame, [w.start * fps, (w.start + 0.4) * fps], [1.4, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
            }}
          >
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, lineHeight: 1, color: i === 0 ? FARBE.rot : i === 1 ? FARBE.gelb : FARBE.weiss }}>
              {w.wort}
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: FARBE.grau, marginTop: 14, textAlign: "center", whiteSpace: "nowrap" }}>{w.text}</div>
          </Interactive.Div>
        ))}
      </div>
    </Hintergrund>
  );
};
