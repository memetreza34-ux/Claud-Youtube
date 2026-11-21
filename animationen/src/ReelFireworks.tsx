import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { NoirBegruessung } from "./intro-noir";
import { Lieferkette, Pose } from "./fireworks";
import { Beleg, FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 04: Hack bei Fireworks AI trifft Uber und Notion (Lieferketten-Angriff).
// Hood-Stil: Hook unter 7 s, Bilder 4–8 s, eigene Posen statt Memes, keine Text-Einblendungen.
// Quellen und Bildnachweise: skripte/reel-04-fireworks.md
export const REEL_FIREWORKS_SEK = 76.0;
const f = (s: number) => Math.round(s * 30);

const T = {
  uber: 4.64,
  willkommen: 6.66,
  name: 7.04,
  anbieter: 8.28,
  firmen: 11.0,
  notion: 11.46,
  oktober6: 18.02,
  internen: 20.94,
  angreifer: 22.62,
  api: 23.64,
  oktober23: 28.9,
  diesmal: 32.26,
  lieferkette: 36.28,
  knackt: 38.84,
  beiNotion: 44.16,
  einem: 46.56,
  beiUber: 48.4,
  fahrern: 50.66,
  ziel: 52.16,
  zugaenge: 54.46,
  gestohlenen: 56.06,
  notionRaet: 63.54,
  lehre: 68.78,
  ichBleibe: 74.82,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.anbieter * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => t - start;
const R = "reel-fireworks";

const SZENEN: Szene[] = [
  // Hook: echte Schlagzeile
  { ab: 0, inhalt: (s) => <Beleg bild={`${R}/tc-titel.png`} markierung={[24, 1040, 955, 1180]} mitteY={950} kreisAb={rel(T.uber, s)} /> },
  { ab: T.willkommen, inhalt: (s) => <NoirBegruessung nameAb={rel(T.name, s)} ende={rel(T.anbieter, s)} bild="figur/intro-noir.jpg" /> },
  // Wer ist Fireworks?
  { ab: T.anbieter, inhalt: () => <Beleg bild={`${R}/fireworks-seite.png`} markierung={[0, 1080, 0, 10]} mitteY={420} ohneKreis /> },
  {
    ab: T.firmen,
    inhalt: (s) => (
      <Lieferkette z={{ fireworks: 0, notion: rel(T.notion, s), zugriff: 999, schluessel: 999, cloud: 999, lieferkette: 999 }} />
    ),
  },
  // Erster Einbruch
  { ab: T.oktober6, inhalt: (s) => <Beleg bild={`${R}/reg-zugang.png`} markierung={[30, 1000, 880, 1030]} kreisAb={rel(T.internen, s)} /> },
  {
    ab: T.angreifer,
    inhalt: (s) => (
      <Lieferkette
        z={{ fireworks: -5, notion: -5, zugriff: 0, schluessel: rel(T.api, s), cloud: rel(T.diesmal, s), lieferkette: rel(T.lieferkette + 0.2, s) }}
      />
    ),
  },
  // Folgen
  { ab: T.beiNotion, inhalt: (s) => <Beleg bild={`${R}/reg-prozent.png`} markierung={[520, 745, 925, 995]} kreisAb={rel(T.einem, s)} /> },
  { ab: T.beiUber, inhalt: (s) => <Beleg bild={`${R}/tc-titel.png`} markierung={[24, 1040, 955, 1180]} mitteY={950} kreisAb={rel(T.fahrern - 1.2, s)} /> },
  // Motiv
  { ab: T.ziel, inhalt: (s) => <Beleg bild={`${R}/reg-llmjacking.png`} markierung={[20, 1000, 800, 885]} mitteY={700} kreisAb={rel(T.zugaenge, s)} /> },
  { ab: T.gestohlenen, inhalt: () => <Pose bild={`${R}/pose-b-geld-werfen.jpg`} /> },
  // Rat und Lehre
  { ab: T.notionRaet, inhalt: () => <Pose bild={`${R}/pose-b-gluehbirne-idee.jpg`} /> },
  { ab: T.lehre, inhalt: () => <Pose bild={`${R}/pose-b-zeigt-auf-dich.jpg`} fokusY={35} /> },
  { ab: T.ichBleibe, inhalt: () => null },
];

export const ReelFireworks: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile(`${R}/audio.wav`)} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_FIREWORKS_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei={`${R}/untertitel.json`} top={BAND_TOP + BAND_HOEHE + 40} wechselMs={650} groesse={60} saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
