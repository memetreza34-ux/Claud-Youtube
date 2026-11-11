import { Audio } from "@remotion/media";
import { CanvasImage, Interactive, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CodewortHoch } from "./CodewortHoch";
import { CLAMP, FARBE, Hintergrund, WEICH } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 1080x1920, 33,6 s. Audio: Voiceover 3:19.0–3:40.9 + 0,3 s Pause + 4:21.95–4:32.7
// Teil 1 (0–6,9 s): Einstieg mit Figur · Teil 2 (6,9–22,2 s): Codewort-Animation · Teil 3 (ab 22,2 s): Aufruf
const CODEWORT_AB = 6.9;
const AUFRUF_AB = 22.2;

const Figur: React.FC<{ top: number; groesse: number }> = ({ top, groesse }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Figur"
      style={{
        position: "absolute",
        top,
        left: (1080 - groesse) / 2,
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        scale: interpolate(frame, [0, 6 * fps], [1, 1.06], CLAMP),
        maskImage: "radial-gradient(circle at 50% 50%, black 52%, transparent 70%)",
      }}
    >
      <CanvasImage src={staticFile("figur/master.jpg")} style={{ width: groesse, height: groesse }} />
    </Interactive.Div>
  );
};

const Kopfzeile: React.FC<{ text: string; farbe: string }> = ({ text, farbe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Kopfzeile"
      style={{
        position: "absolute",
        top: 170,
        left: 80,
        right: 80,
        textAlign: "center",
        fontSize: 86,
        fontWeight: 800,
        lineHeight: 1.1,
        color: farbe,
        opacity: interpolate(frame, [0.1 * fps, 0.5 * fps], [0, 1], { ...CLAMP, easing: WEICH }),
        translate: interpolate(frame, [0.1 * fps, 0.5 * fps], ["0px 30px", "0px 0px"], { ...CLAMP, easing: WEICH }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

export const ReelCodewort: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Hintergrund>
      <Audio src={staticFile("reel-codewort/audio.wav")} />

      <Sequence durationInFrames={Math.round(CODEWORT_AB * fps)} layout="none">
        <Kopfzeile text="Der wichtigste Tipp gegen Schockanrufe" farbe={FARBE.weiss} />
        <Figur top={470} groesse={860} />
      </Sequence>

      <Sequence from={Math.round(CODEWORT_AB * fps)} durationInFrames={Math.round((AUFRUF_AB - CODEWORT_AB) * fps)} layout="none">
        <CodewortHoch />
      </Sequence>

      <Sequence from={Math.round(AUFRUF_AB * fps)} layout="none">
        <Kopfzeile text="Schick das deinen Eltern." farbe={FARBE.gelb} />
        <Figur top={470} groesse={860} />
      </Sequence>

      <Untertitel datei="reel-codewort/untertitel.json" top={1360} />

      <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, textAlign: "center", fontSize: 34, fontWeight: 700, letterSpacing: 6, color: FARBE.grau }}>
        DER STRICHERMITTLER
      </div>
    </Hintergrund>
  );
};
