import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP, Chip } from "./band";
import { BallonBegruessung } from "./begruessung";
import { Beleg, FigurStill, Foto, Kurs, Lieferweg, Steckbrief } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 02 v4: Hook, Begrüßung, Geschichte. Wenige Bilder, jedes bleibt bis zum nächsten stehen.
// Kein Zoom, harte Schnitte. Zeiten in Sekunden auf audio-v4.wav (Pausen bereits gekürzt).
export const REEL_NVIDIA4_SEK = 96.2;
const f = (s: number) => Math.round(s * 30);

// Wort-Zeitmarken (Whisper) der Stellen, an denen ein Bild wechselt oder etwas erscheint
const T = {
  untreu1: 3.55,
  memo1: 4.24,
  ausspionieren: 8.3,
  willkommen: 10.85,
  name: 11.52,
  schauen: 12.7,
  bar: 14.62,
  jensen: 23.2,
  megaspeed: 25.44,
  singapur: 28.08,
  rechenzentren: 28.7,
  kunden: 31.34,
  milliarden: 34.98,
  faellt: 37.1,
  chips: 38.2,
  china: 40.1,
  oktober: 40.88,
  trump: 47.12,
  nichts: 53.7,
  fruehjahr: 54.96,
  staatssicherheit: 60.6,
  ende_oktober: 63.34,
  normal: 67.44,
  november: 68.54,
  untreu2: 71.3,
  verwaltungsrat: 72.96,
  untersuchung: 74.66,
  aktie: 76.02,
  verliert: 76.72,
  was_bleibt: 79.26,
  hinweis: 81.72,
  achtzehnten: 87.32,
  frage: 91.22,
};

// „Willkommen beim Strichermittler“ steht schon auf dem Schild
const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.schauen * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
// Zeit relativ zum Szenenbeginn
const rel = (t: number, start: number) => Math.max(0, t - start);

const SZENEN: Szene[] = [
  // Hook
  { ab: 0, inhalt: (s) => <Beleg bild="reel-nvidia/orf-untreu.png" quelle="ORF, 9.11.2026" markierung={[30, 953, 910, 1007]} kreisAb={rel(T.untreu1, s)} /> },
  { ab: T.memo1, inhalt: (s) => <Beleg bild="reel-nvidia/techcrunch-memo.png" quelle="TechCrunch, 7.11.2026" markierung={[66, 937, 1028, 1117]} kreisAb={rel(T.ausspionieren, s)} /> },
  // Begrüßung: Band weg, Ballons tragen das Namensschild herein
  { ab: T.willkommen, inhalt: (s) => <BallonBegruessung nameAb={rel(T.name, s)} ende={rel(T.bar, s)} /> },
  // Die Bar
  {
    ab: T.bar,
    inhalt: () => (
      <Foto bild="reel-nvidia/bar-taipeh.jpg" nachweis="Bar in Taipeh · Foto: 4300streetcar, CC BY 4.0" hinweis="SYMBOLBILD · Szene laut New York Times" fokus={[50, 70]} helligkeit={1.3} />
    ),
  },
  { ab: T.jensen, inhalt: () => <Foto bild="reel-nvidia/jensen-huang-2024.jpg" nachweis="Nvidia-Chef Jensen Huang · Foto: Peter DaSilva, CC BY 4.0" fokus={[50, 33]} /> },
  // Megaspeed
  {
    ab: T.megaspeed,
    inhalt: (s) => (
      <Steckbrief
        titel="Megaspeed"
        quelle="Quelle: New York Times, laut TechCrunch"
        zeilen={[
          { ab: rel(T.singapur, s), label: "Sitz", wert: "Singapur" },
          { ab: rel(T.rechenzentren, s), label: "Geschäft", wert: "Rechenzentren" },
          { ab: rel(T.kunden, s), label: "Bei Nvidia", wert: "einer der größten Kunden" },
          { ab: rel(T.milliarden, s), label: "Einkäufe", wert: "≈ 4,8 Mrd. $", zusatz: "in knapp 2 Jahren", gross: true },
        ]}
      />
    ),
  },
  // Verdacht
  { ab: T.faellt, inhalt: (s) => <Lieferweg verbotAb={rel(T.chips, s)} chinaAb={rel(T.china, s)} pruefungAb={rel(T.oktober, s)} /> },
  // Trump
  { ab: T.trump, inhalt: (s) => <Beleg bild="reel-nvidia/techcrunch-trump.png" quelle="TechCrunch, 10.11.2026" markierung={[312, 501, 1054, 1091]} mitteY={1055} kreisAb={rel(T.nichts, s)} /> },
  // Memo
  { ab: T.fruehjahr, inhalt: (s) => <Beleg bild="reel-nvidia/techcrunch-memo.png" quelle="TechCrunch, 7.11.2026" markierung={[66, 937, 1028, 1117]} kreisAb={rel(T.staatssicherheit, s)} /> },
  // Öffentlich
  { ab: T.ende_oktober, inhalt: (s) => <Beleg bild="reel-nvidia/yahoo-normal.png" quelle="Yahoo Finance / Bloomberg" markierung={[450, 757, 936, 981]} mitteY={1050} kreisAb={rel(T.normal, s)} /> },
  // Wende
  { ab: T.november, inhalt: (s) => <Beleg bild="reel-nvidia/orf-untreu.png" quelle="ORF, 9.11.2026" markierung={[30, 953, 910, 1007]} kreisAb={rel(T.untreu2, s)} /> },
  { ab: T.verwaltungsrat, inhalt: (s) => <Beleg bild="reel-nvidia/nvidia-untersuchung.png" quelle="Nvidia, Erklärung des Verwaltungsrats" markierung={[492, 863, 942, 979]} mitteY={1145} kreisAb={rel(T.untersuchung, s)} /> },
  { ab: T.aktie, inhalt: (s) => <Kurs ab={rel(T.verliert, s)} /> },
  // Stand
  { ab: T.was_bleibt, inhalt: (s) => <Beleg bild="reel-nvidia/nvidia-verwaltungsrat.png" quelle="Nvidia, Erklärung des Verwaltungsrats" markierung={[320, 607, 940, 977]} mitteY={1023} kreisAb={rel(T.hinweis, s)} /> },
  { ab: T.achtzehnten, inhalt: (s) => <Beleg bild="reel-nvidia/kongress-brief.png" quelle="US-Repräsentantenhaus, 4.11.2026" markierung={[450, 673, 932, 985]} mitteY={1098} kreisAb={0.3} /> },
  // Schluss: Band weg, der Strichermittler stellt die offene Frage
  { ab: T.frage, inhalt: () => <Chip text="Stand: 10.11.2026" oben={BAND_TOP + BAND_HOEHE - 70} /> },
];

export const ReelNvidia4: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile("reel-nvidia/audio-v4.wav")} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_NVIDIA4_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei="reel-nvidia/untertitel-v4.json" top={BAND_TOP + BAND_HOEHE + 20} wechselMs={700} groesse={100} comic saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
