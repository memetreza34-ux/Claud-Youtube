import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { BallonBegruessung } from "./begruessung";
import { BildFahrt, DiensteWolke, HandyFehler, HealthChecks, Kurve } from "./outlook3";
import { Beleg, FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 03 v3 im Stil von Hood Informatik: Bilder statt Text, Erklärteil als ruhige Animation, keine Quellen-Chips.
// Quellen und Bildnachweise: skripte/reel-03-outlook-beschreibung.md
export const REEL_OUTLOOK3_SEK = 77.0;
const f = (s: number) => Math.round(s * 30);

const T = {
  schuld: 4.8,
  willkommen: 9.98,
  name: 10.36,
  kurz: 11.66,
  kommen: 13.06,
  mit: 17.94,
  teams: 19.4,
  sharepoint: 20.06,
  copilot: 20.66,
  microsoft: 24.16,
  server: 25.38,
  faellt: 31.2,
  loadbalancer: 32.56,
  viele: 40.58,
  arbeit: 42.86,
  brechen: 44.76,
  laut: 47.2,
  frueheren: 49.42,
  startet: 54.48,
  neu: 54.94,
  kippen: 56.98,
  patch: 58.92,
  samstag: 61.7,
  hacker: 65.06,
  firma: 67.36,
  bericht: 73.08,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.kurz * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => Math.max(0, t - start);

const SZENEN: Szene[] = [
  { ab: 0, inhalt: () => <HandyFehler /> },
  { ab: T.schuld, inhalt: () => <BildFahrt bild="reel-outlook/microsoft-campus.jpg" fokus={[50, 55]} /> },
  { ab: T.willkommen, inhalt: (s) => <BallonBegruessung nameAb={rel(T.name, s)} ende={rel(T.kurz, s)} /> },
  { ab: T.kurz, inhalt: (s) => <Beleg bild="reel-outlook/abc-meldung.png" markierung={[142, 453, 936, 978]} kreisAb={rel(T.kommen, s)} /> },
  {
    ab: T.mit,
    inhalt: (s) => (
      <DiensteWolke
        dienste={[
          { icon: "icon-outlook.svg", ab: 0.1, ausAb: 0.9 },
          { icon: "icon-teams.svg", ab: 0.3, ausAb: rel(T.teams, s) },
          { icon: "icon-sharepoint.svg", ab: 0.5, ausAb: rel(T.sharepoint, s) },
          { icon: "icon-copilot.svg", ab: 0.7, ausAb: rel(T.copilot, s) },
        ]}
      />
    ),
  },
  {
    ab: T.microsoft,
    inhalt: (s) => (
      <HealthChecks
        z={{
          checks: rel(T.server, s),
          einer: rel(T.faellt, s),
          lb: rel(T.loadbalancer, s),
          viele: rel(T.viele, s),
          last: rel(T.arbeit, s),
          kippen: rel(T.brechen, s),
        }}
      />
    ),
  },
  { ab: T.laut, inhalt: (s) => <Beleg bild="reel-outlook/abc-upgrade.png" markierung={[60, 1010, 880, 1040]} kreisAb={rel(T.frueheren, s)} /> },
  {
    ab: T.startet,
    inhalt: (s) => <Kurve neustartAb={rel(T.neu, s)} kippAb={rel(T.kippen, s)} patchAb={rel(T.patch, s)} samstagAb={rel(T.samstag, s)} />,
  },
  { ab: T.hacker, inhalt: (s) => <Beleg bild="reel-outlook/abc-lamanna.png" markierung={[60, 1010, 270, 470]} mitteY={500} kreisAb={rel(T.hacker + 0.3, s)} /> },
  { ab: T.firma, inhalt: () => <BildFahrt bild="reel-outlook/computerraum.jpg" dunkel={0.15} /> },
  // Schluss: nur die Figur
  { ab: T.bericht, inhalt: () => null },
];

export const ReelOutlook3: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile("reel-outlook/audio-v3.wav")} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_OUTLOOK3_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei="reel-outlook/untertitel-v3.json" top={BAND_TOP + BAND_HOEHE + 40} wechselMs={650} groesse={60} saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
