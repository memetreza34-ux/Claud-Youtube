import { Audio } from "@remotion/media";
import { CanvasImage, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BELEG_HOEHE, Beleg, GrosseZahl, Kreis, KursBalken, QuellenChip, Zeitleiste, Zitat } from "./beweise";
import { CLAMP, FARBE, Hintergrund, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 02 v2: Nvidia-Fall im Nachrichten-Schnitt. Jede Szene zeigt einen echten Beleg oder echte Zahlen.
// Zeiten (Sekunden) aus den Wort-Zeitmarken von reel-02-nvidia-v2.wav
const S = [
  { ab: 0, name: "foto" },
  { ab: 6.0, name: "zitatUntreu" },
  { ab: 8.5, name: "kurs" },
  { ab: 11.75, name: "nvidiaZiel" },
  { ab: 14.4, name: "figurSpionage" },
  { ab: 16.4, name: "nytBericht" },
  { ab: 25.3, name: "megaspeedZahl" },
  { ab: 31.4, name: "zeitleiste" },
  { ab: 38.2, name: "kongress" },
  { ab: 42.95, name: "nvidiaUntersuchung" },
  { ab: 50.6, name: "fbi" },
  { ab: 52.7, name: "china" },
  { ab: 54.6, name: "anklage" },
  { ab: 56.25, name: "offen" },
  { ab: 60.7, name: "befragung" },
  { ab: 63.7, name: "dran" },
] as const;
export const REEL_NVIDIA2_SEK = 65.25;

const f = (sek: number) => Math.round(sek * 30);
const bereich = (name: (typeof S)[number]["name"]) => {
  const i = S.findIndex((s) => s.name === name);
  const von = S[i].ab;
  const bis = i + 1 < S.length ? S[i + 1].ab : REEL_NVIDIA2_SEK;
  return { from: f(von), durationInFrames: f(bis) - f(von), dauer: bis - von, von };
};

const Szene: React.FC<{ name: (typeof S)[number]["name"]; children: (dauer: number, von: number) => React.ReactNode }> = ({ name, children }) => {
  const b = bereich(name);
  return (
    <Sequence from={b.from} durationInFrames={b.durationInFrames} layout="none">
      {children(b.dauer, b.von)}
    </Sequence>
  );
};

const Schlagzeile: React.FC<{ text: string; farbe?: string; top?: number; groesse?: number }> = ({ text, farbe = FARBE.weiss, top = 260, groesse = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: ZAHLEN_SCHRIFT,
        fontSize: groesse,
        lineHeight: 1,
        color: farbe,
        opacity: interpolate(frame, [0, 0.12 * fps], [0, 1], CLAMP),
        scale: interpolate(frame, [0, 0.3 * fps], [1.15, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
      }}
    >
      {text}
    </div>
  );
};

const Figur: React.FC<{ top: number; groesse: number }> = ({ top, groesse }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: (1080 - groesse) / 2,
        width: groesse,
        height: groesse,
        scale: interpolate(frame, [0, 3 * fps], [1.08, 1], CLAMP),
        maskImage: "radial-gradient(circle at 50% 50%, black 55%, transparent 71%)",
      }}
    >
      <CanvasImage src={staticFile("figur/master.jpg")} style={{ width: groesse, height: groesse }} />
    </div>
  );
};

const Datum: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 230,
      left: 50,
      padding: "12px 24px",
      backgroundColor: FARBE.rot,
      color: FARBE.weiss,
      fontFamily: ZAHLEN_SCHRIFT,
      fontSize: 64,
      letterSpacing: 2,
    }}
  >
    {text}
  </div>
);

export const ReelNvidia2: React.FC = () => {
  return (
    <Hintergrund>
      <Audio src={staticFile("reel-nvidia/audio-v2.wav")} />

      <Szene name="foto">
        {(d) => (
          <>
            <Beleg bild="reel-nvidia/jensen-huang-2024.jpg" quelle="Jensen Huang · Foto: Peter DaSilva, CC BY 4.0" fokus={[50, 22]} zoomVon={1.15} zoomBis={1.0} dauer={d} />
            <Datum text="SONNTAG, 8. NOVEMBER" />
          </>
        )}
      </Szene>

      <Szene name="zitatUntreu">
        {(d) => (
          <Beleg bild="reel-nvidia/orf-untreu.png" quelle="ORF, 9.11.2026" dauer={d} zoomVon={1.0} zoomBis={1.12}>
            <Kreis cx={492} cy={638} rx={505} ry={88} ab={1.1} />
          </Beleg>
        )}
      </Szene>

      <Szene name="kurs">{() => <KursBalken quelle="Quelle: ORF, 9.11.2026" />}</Szene>

      <Szene name="nvidiaZiel">
        {(d) => (
          <Beleg bild="reel-nvidia/nvidia-ziel-geheimdienst.png" quelle="Nvidia, Erklärung des Verwaltungsrats" dauer={d} zoomVon={1.0} zoomBis={1.15}>
            <Kreis cx={290} cy={640} rx={295} ry={62} ab={0.6} />
          </Beleg>
        )}
      </Szene>

      <Szene name="figurSpionage">
        {() => (
          <>
            <Figur top={330} groesse={880} />
            <Schlagzeile text="SPIONAGE FÜR CHINA?" farbe={FARBE.rot} top={190} />
          </>
        )}
      </Szene>

      <Szene name="nytBericht">
        {(_, von) => (
          <>
            <Zitat
              wer="BERICHT DER NEW YORK TIMES, ENDE OKTOBER"
              text="US-Geheimdienste halten eine Megaspeed-Managerin für eine Quelle Pekings."
              quelle="Quelle: Al Jazeera, ORF (9.11.2026)"
            />
            <Sequence from={f(22.4 - von)} layout="none">
              <div
                style={{
                  position: "absolute",
                  top: 930,
                  left: 80,
                  right: 80,
                  fontFamily: TEXT_SCHRIFT,
                  fontSize: 54,
                  fontWeight: 700,
                  color: FARBE.gelb,
                }}
              >
                Sie soll engen Kontakt zu Jensen Huang gehabt haben.
              </div>
            </Sequence>
          </>
        )}
      </Szene>

      <Szene name="megaspeedZahl">
        {() => (
          <Sequence from={f(29.2 - 25.3)} layout="none">
            <GrosseZahl
              von={0}
              bis={4.8}
              format={(n) => `${n.toFixed(1).replace(".", ",")} MRD. $`}
              zeile="Einkäufe von Megaspeed bei Nvidia – einer der größten Kunden"
              quelle="Quelle: New York Times, laut Al Jazeera"
            />
          </Sequence>
        )}
      </Szene>
      <Szene name="megaspeedZahl">
        {() => <Schlagzeile text="MEGASPEED · SINGAPUR" farbe={FARBE.weiss} top={230} groesse={96} />}
      </Szene>

      <Szene name="zeitleiste">
        {(_, von) => (
          <Zeitleiste
            quelle="Quelle: Al Jazeera, ORF"
            punkte={[
              { datum: "Seit 2024", text: "US-Prüfung: Chips über Megaspeed nach China?", ab: 31.9 - von },
              { datum: "Mai 2025", text: "Abendessen in Taipeh, beide anwesend (laut Berichten)", ab: 34.4 - von },
              { datum: "Ende Okt. 2026", text: "Bericht der New York Times", ab: 36.4 - von },
            ]}
          />
        )}
      </Szene>

      <Szene name="kongress">
        {(d) => (
          <Beleg bild="reel-nvidia/kongress-brief.png" quelle="US-Repräsentantenhaus, 4.11.2026" dauer={d} zoomVon={1.0} zoomBis={1.1} />
        )}
      </Szene>

      <Szene name="nvidiaUntersuchung">
        {(d, von) => (
          <Beleg bild="reel-nvidia/nvidia-verwaltungsrat.png" quelle="Nvidia, Erklärung des Verwaltungsrats" dauer={d} zoomVon={1.0} zoomBis={1.15}>
            <Kreis cx={463} cy={638} rx={180} ry={58} ab={47.85 - von} />
          </Beleg>
        )}
      </Szene>

      <Szene name="fbi">
        {(d) => (
          <Beleg bild="reel-nvidia/orf-fbi.png" quelle="ORF, 9.11.2026" dauer={d} zoomVon={1.0} zoomBis={1.08}>
            <Kreis cx={880} cy={638} rx={170} ry={58} ab={0.4} />
          </Beleg>
        )}
      </Szene>

      <Szene name="china">
        {() => (
          <Zitat wer="AUSSENMINISTERIUM CHINA, 9. NOVEMBER" text="„Nichts als Verleumdungen gegen China.“" quelle="Quelle: Al Jazeera, ORF" />
        )}
      </Szene>

      <Szene name="anklage">
        {() => (
          <>
            <Schlagzeile text="ANKLAGE" farbe={FARBE.weiss} top={400} groesse={150} />
            <Schlagzeile text="KEINE" farbe={FARBE.gelb} top={570} groesse={230} />
          </>
        )}
      </Szene>

      <Szene name="offen">
        {() => (
          <>
            <Schlagzeile text="OFFEN" farbe={FARBE.rot} top={330} groesse={150} />
            <div
              style={{
                position: "absolute",
                top: 560,
                left: 90,
                right: 90,
                textAlign: "center",
                fontFamily: TEXT_SCHRIFT,
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.15,
                color: FARBE.weiss,
              }}
            >
              Sind Informationen nach Peking geflossen?
            </div>
            <QuellenChip text="Stand: 10.11.2026" />
          </>
        )}
      </Szene>

      <Szene name="befragung">
        {(d) => (
          <Beleg bild="reel-nvidia/kongress-brief.png" quelle="US-Repräsentantenhaus: Termin 18.11." dauer={d} zoomVon={1.05} zoomBis={1.2}>
            <Kreis cx={561} cy={638} rx={150} ry={58} ab={1.2} />
          </Beleg>
        )}
      </Szene>

      <Szene name="dran">
        {() => (
          <>
            <Figur top={300} groesse={900} />
            <Schlagzeile text="ICH BLEIBE DRAN." farbe={FARBE.gelb} top={190} groesse={110} />
          </>
        )}
      </Szene>

      <div style={{ position: "absolute", left: 0, right: 0, top: BELEG_HOEHE, bottom: 0, backgroundColor: FARBE.hintergrund }} />
      <Untertitel datei="reel-nvidia/untertitel-v2.json" top={1330} wechselMs={550} groesse={96} />
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: TEXT_SCHRIFT,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 6,
          color: FARBE.grau,
        }}
      >
        DER STRICHERMITTLER
      </div>
    </Hintergrund>
  );
};
