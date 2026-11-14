import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP, Chip } from "./band";
import { BallonBegruessung } from "./begruessung";
import { DiensteRaster, PostfachLeer, ServerNeustart, Wiederhergestellt } from "./outlook";
import { Beleg, FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 03: Outlook-Störung. Aufbau wie ReelNvidia4, Zeiten in Sekunden auf reel-outlook/audio.wav.
export const REEL_OUTLOOK_SEK = 61.2;
const f = (s: number) => Math.round(s * 30);

const T = {
  keine: 3.92,
  termine: 4.76,
  mehr: 6.64,
  willkommen: 8.74,
  name: 9.44,
  am12: 12.5,
  nutzer: 14.68,
  betroffen: 19.04,
  outlook: 19.92,
  teams: 21.68,
  sharepoint: 22.46,
  copilot: 23.1,
  weitere: 23.78,
  handy: 25.66,
  stoppt: 28.12,
  alle: 29.42,
  doch: 32.54,
  last: 33.28,
  nicht: 35.1,
  newyork: 36.1,
  katastrophenschutz: 37.26,
  hacker: 40.74,
  laut: 42.08,
  entschuldigt: 47.46,
  regret: 47.84,
  samstag: 49.46,
  wiederhergestellt: 52.82,
  frage: 54.0,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, 10640 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => Math.max(0, t - start);
const ABC = "ABC News, 13.11.2026";

const SZENEN: Szene[] = [
  { ab: 0, inhalt: (s) => <PostfachLeer keineAb={rel(T.keine, s)} termineAb={rel(T.termine, s)} dauerAb={rel(T.mehr, s)} /> },
  { ab: T.willkommen, inhalt: (s) => <BallonBegruessung nameAb={rel(T.name, s)} ende={rel(T.am12, s)} /> },
  { ab: T.am12, inhalt: (s) => <Beleg bild="reel-outlook/abc-meldung.png" quelle={ABC} markierung={[142, 453, 936, 978]} kreisAb={rel(T.nutzer, s)} /> },
  {
    ab: T.betroffen,
    inhalt: (s) => (
      <DiensteRaster
        geraeteAb={rel(T.handy, s)}
        dienste={[
          { name: "Outlook", ab: rel(T.outlook, s) },
          { name: "Teams-Kalender", ab: rel(T.teams, s) },
          { name: "SharePoint", ab: rel(T.sharepoint, s) },
          { name: "Copilot", ab: rel(T.copilot, s) },
          { name: "Planner", ab: rel(T.weitere, s) },
          { name: "To Do", ab: rel(T.weitere + 0.15, s) },
        ]}
      />
    ),
  },
  { ab: T.stoppt, inhalt: (s) => <Beleg bild="reel-outlook/abc-updates.png" quelle={ABC} markierung={[68, 905, 914, 1005]} kreisAb={rel(T.alle, s)} /> },
  { ab: T.doch, inhalt: (s) => <ServerNeustart lastAb={rel(T.last, s)} ausAb={rel(T.nicht, s)} /> },
  { ab: T.newyork, inhalt: (s) => <Beleg bild="reel-outlook/abc-newyork.png" quelle={ABC} markierung={[562, 939, 940, 979]} mitteY={1020} kreisAb={rel(T.katastrophenschutz, s)} /> },
  { ab: T.hacker, inhalt: (s) => <Beleg bild="reel-outlook/abc-lamanna.png" quelle={ABC} markierung={[66, 1000, 480, 530]} mitteY={560} kreisAb={rel(T.laut, s)} /> },
  { ab: T.entschuldigt, inhalt: (s) => <Beleg bild="reel-outlook/abc-meldung.png" quelle={ABC} markierung={[66, 1000, 1505, 1680]} kreisAb={rel(T.regret, s)} /> },
  { ab: T.samstag, inhalt: (s) => <Wiederhergestellt hakenAb={rel(T.wiederhergestellt, s)} /> },
  { ab: T.frage, inhalt: () => <Chip text="Stand: 14.11.2026" oben={BAND_TOP + BAND_HOEHE - 70} /> },
];

export const ReelOutlook: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile("reel-outlook/audio.wav")} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_OUTLOOK_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei="reel-outlook/untertitel.json" top={BAND_TOP + BAND_HOEHE + 20} wechselMs={700} groesse={100} comic saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
