import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, FARBE, Hintergrund, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Voiceover 2:00.4–2:43.4: "Das ist ein nachgestelltes Beispiel. Schritt 1 ... Schritt 5 ... das Geld ist weg."
// Startzeiten der Stufen in Sekunden, passend zu "Schritt 1" bis "Schritt 5"
const STUFEN = [
  { start: 1.9, titel: "Der Schock", text: "Geklonte Stimme weint" },
  { start: 11.2, titel: "Die Übergabe", text: "Falscher Kommissar übernimmt" },
  { start: 22.2, titel: "Der Zeitdruck", text: "Kaution – heute, jetzt, sofort" },
  { start: 29.6, titel: "Die Isolation", text: "„Sprechen Sie mit niemandem“" },
  { start: 37.1, titel: "Die Abholung", text: "Bote holt Bargeld ab" },
];
const BREITE = 330;
const ABSTAND = 340;
const HOEHE_SCHRITT = 110;
const SOCKEL = 310;

export const AnrufTreppe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <Hintergrund>
      <Interactive.Div
        name="Nachgestellt"
        style={{
          position: "absolute",
          top: 100,
          left: 120,
          padding: "10px 26px",
          border: `4px solid ${FARBE.rot}`,
          borderRadius: 10,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 4,
          color: FARBE.rot,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        }}
      >
        NACHGESTELLT
      </Interactive.Div>
      {STUFEN.map((s, i) => {
        const aktiv = t >= s.start && (i === STUFEN.length - 1 || t < STUFEN[i + 1].start);
        const sichtbar = interpolate(frame, [s.start * fps, (s.start + 0.6) * fps], [0, 1], { ...CLAMP, easing: WEICH });
        const unten = 900 - i * HOEHE_SCHRITT;
        return (
          <Interactive.Div
            key={s.titel}
            name={`Stufe${i + 1}`}
            style={{
              position: "absolute",
              left: 120 + i * ABSTAND,
              top: unten - SOCKEL,
              width: BREITE,
              height: SOCKEL + i * HOEHE_SCHRITT,
              opacity: sichtbar * (aktiv ? 1 : 0.45),
              translate: interpolate(frame, [s.start * fps, (s.start + 0.6) * fps], ["0px 40px", "0px 0px"], { ...CLAMP, easing: WEICH }),
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 16,
                backgroundColor: aktiv ? FARBE.gelb : "#2a2a33",
                color: aktiv ? FARBE.hintergrund : FARBE.weiss,
                padding: "20px 22px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 38, fontWeight: 800, marginTop: 6, whiteSpace: "nowrap" }}>{s.titel}</div>
              <div style={{ fontSize: 30, fontWeight: 600, marginTop: 10, lineHeight: 1.25 }}>{s.text}</div>
            </div>
          </Interactive.Div>
        );
      })}
    </Hintergrund>
  );
};
