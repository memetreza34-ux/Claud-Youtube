import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP, Chip } from "./band";
import { BallonBegruessung } from "./begruessung";
import { DatumFehler, Eilmeldung, FotoFahrt, Geraete, KeinHacker, LastAnzeige, Meldung, Mindmap, Weltkarte, Zeitleiste } from "./outlook2";
import { Beleg, FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 03 v2: Hook nach Formel (Datum → was geht nicht → „Was ist passiert?“), mehr echte Bilder und Animation.
// Jede Szene steht ca. 3–4 s. Zeiten in Sekunden auf reel-outlook/audio-v2.wav.
export const REEL_OUTLOOK2_SEK = 57.0;
const f = (s: number) => Math.round(s * 30);

const T = {
  outlook1: 1.86,
  teams1: 3.56,
  sharepoint1: 4.3,
  copilot1: 4.88,
  und: 6.94,
  weltweit: 7.2,
  willkommen: 9.2,
  name: 9.6,
  kurz: 10.92,
  meldet: 12.38,
  nutzer: 13.8,
  postfaecher: 15.14,
  betrifft: 16.06,
  outlook: 17.02,
  teams: 18.72,
  sharepoint: 19.18,
  copilot: 19.7,
  handy: 21.16,
  rechner: 21.92,
  apple: 23.02,
  stoppt: 23.76,
  alle: 24.72,
  doch: 26.6,
  last: 27.72,
  brechen: 28.82,
  newyork: 30.22,
  katastrophenschutz: 31.36,
  hacker: 34.84,
  laut: 36.38,
  manager: 37.66,
  keinen: 39.78,
  entschuldigt: 41.76,
  samstag: 43.58,
  wiederhergestellt: 47.54,
  ueber: 48.7,
  frage: 50.26,
  ermittle: 54.7,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.kurz * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => Math.max(0, t - start);
const ABC = "ABC News, 13.11.2026";

const SZENEN: Szene[] = [
  // Hook
  {
    ab: 0,
    inhalt: (s) => (
      <DatumFehler
        fehler={[
          { name: "Outlook", ab: rel(T.outlook1, s) },
          { name: "Teams", ab: rel(T.teams1, s) },
          { name: "SharePoint", ab: rel(T.sharepoint1, s) },
          { name: "Copilot", ab: rel(T.copilot1, s) },
        ]}
      />
    ),
  },
  { ab: T.und, inhalt: (s) => <Weltkarte textAb={rel(T.weltweit, s)} /> },
  { ab: T.willkommen, inhalt: (s) => <BallonBegruessung nameAb={rel(T.name, s)} ende={rel(T.kurz, s)} /> },
  // Die Meldung
  {
    ab: T.kurz,
    inhalt: (s) => (
      <FotoFahrt bild="reel-outlook/microsoft-campus.jpg" nachweis="Microsoft-Campus Redmond · Foto: Jiaqian AirplaneFan, CC BY 3.0" fokus={[50, 55]} dunkel={0.25}>
        <Meldung ab={rel(T.meldet, s)} zeit="Do 12.11. · kurz vor 19 Uhr (MEZ)" text="„Investigating reports of users experiencing issues“" quelle="Microsoft, laut ABC News" />
      </FotoFahrt>
    ),
  },
  { ab: T.nutzer, inhalt: (s) => <Beleg bild="reel-outlook/abc-meldung.png" quelle={ABC} markierung={[142, 453, 936, 978]} kreisAb={rel(T.postfaecher, s)} /> },
  // Was alles betroffen ist
  {
    ab: T.betrifft,
    inhalt: (s) => (
      <Mindmap
        aeste={[
          { name: "Outlook", ab: rel(T.outlook, s), winkel: 200 },
          { name: "Teams", ab: rel(T.teams, s), winkel: 340 },
          { name: "SharePoint", ab: rel(T.sharepoint, s), winkel: 140 },
          { name: "Copilot", ab: rel(T.copilot, s), winkel: 40 },
        ]}
      />
    ),
  },
  { ab: T.handy, inhalt: (s) => <Geraete abs={[rel(T.handy + 0.15, s), rel(T.rechner, s), rel(T.apple, s)]} /> },
  // Reaktion
  { ab: T.stoppt, inhalt: (s) => <Beleg bild="reel-outlook/abc-updates.png" quelle={ABC} markierung={[68, 905, 914, 1005]} kreisAb={rel(T.alle, s)} /> },
  {
    ab: T.doch,
    inhalt: (s) => (
      <FotoFahrt bild="reel-outlook/rechenzentrum.jpg" nachweis="Symbolbild Rechenzentrum · Foto: BalticServers.com, CC BY-SA 3.0" hinweis="SYMBOLBILD">
        <LastAnzeige ab={rel(T.last, s)} ausAb={rel(T.brechen, s)} />
      </FotoFahrt>
    ),
  },
  {
    ab: T.newyork,
    inhalt: (s) => (
      <FotoFahrt bild="reel-outlook/new-york.jpg" nachweis="New York · Foto: Diliff, CC BY-SA 3.0 · Warnung laut ABC News" fokus={[45, 50]}>
        <Eilmeldung ab={rel(T.katastrophenschutz, s)} titel="NYC EMERGENCY MANAGEMENT" text="Städtische Dienste können sich verzögern" />
      </FotoFahrt>
    ),
  },
  // Hacker?
  { ab: T.hacker, inhalt: (s) => <KeinHacker streichAb={rel(T.laut, s)} /> },
  { ab: T.manager, inhalt: (s) => <Beleg bild="reel-outlook/abc-lamanna.png" quelle={ABC} markierung={[66, 1000, 480, 530]} mitteY={560} kreisAb={rel(T.keinen, s)} /> },
  { ab: T.entschuldigt, inhalt: (s) => <Beleg bild="reel-outlook/abc-meldung.png" quelle={ABC} markierung={[66, 1000, 1505, 1680]} kreisAb={rel(T.entschuldigt + 0.2, s)} /> },
  // Entwarnung
  { ab: T.samstag, inhalt: (s) => <Zeitleiste gruenAb={rel(T.wiederhergestellt, s)} dauerAb={rel(T.ueber, s)} /> },
  // Offene Frage
  {
    ab: T.frage,
    inhalt: () => <FotoFahrt bild="reel-outlook/computerraum.jpg" nachweis="Symbolbild · Foto: Bertrand Soubeyrand, CC BY 4.0" hinweis="SYMBOLBILD" dunkel={0.2} />,
  },
  { ab: T.ermittle, inhalt: () => <Chip text="Stand: 14.11.2026 · Teil 2 folgt" oben={BAND_TOP + BAND_HOEHE - 70} /> },
];

export const ReelOutlook2: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile("reel-outlook/audio-v2.wav")} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_OUTLOOK2_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei="reel-outlook/untertitel-v2.json" top={BAND_TOP + BAND_HOEHE + 20} wechselMs={700} groesse={100} comic saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
