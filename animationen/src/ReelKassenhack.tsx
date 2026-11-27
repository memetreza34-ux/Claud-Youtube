import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { NoirBegruessung } from "./intro-noir";
import {
  FaktenServerSzene,
  HookKassenSzene,
  KassenExploitSzene,
  KreditkarteAbgriffSzene,
  WeltkarteDESzene,
} from "./kassenhack";
import { BildBuehne } from "./optimizely";
import { FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 06: Millionen Kartendaten von Windows-Kassenterminals gestohlen (CVE-2024-49138)
// Individuelle Flow-Szenen + echte Flaggen + nachgebautes Kassenterminal & Kreditkarte
export const REEL_KASSENHACK_SEK = 67.5;
const f = (s: number) => Math.round(s * 30);

const T = {
  de: 3.12,
  million: 4.6,
  willkommen: 7.42,
  name: 8.1,
  cybernews: 9.34,
  serverDaten: 13.36,
  karten: 14.3,
  kassen: 16.96,
  brasilien: 19.38,
  deFakten: 21.12,
  interessant: 22.8,
  systemrechte: 34.44,
  trojaner: 37.74,
  kartenzahlung: 42.18,
  nummer: 44.54,
  ablauf: 45.66,
  bankdaten: 46.68,
  kontrollfeld: 48.62,
  abgeschaltet: 50.64,
  offen: 54.5,
  achtung: 60.84,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.cybernews * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => t - start;
const R = "reel-kassenhack";

const SZENEN: Szene[] = [
  // 1. Hook (0.00 - 7.42 s): Flow-Szene an der Kasse + Länderflaggen + 1 Mio.+ Zähler
  {
    ab: 0,
    inhalt: (s) => <HookKassenSzene deAb={rel(T.de, s)} millionAb={rel(T.million, s)} />,
  },
  // 2. Noir-Begrüßung (7.42 - 9.34 s)
  {
    ab: T.willkommen,
    inhalt: (s) => <NoirBegruessung nameAb={rel(T.name, s)} ende={rel(T.cybernews, s)} bild="figur/intro-noir.jpg" />,
  },
  // 3. Echter Beleg-Screenshot (9.34 - 13.36 s)
  {
    ab: T.cybernews,
    inhalt: () => <BildBuehne bild={`${R}/beleg-itfinanz.png`} fokus={[50, 58]} modus="cover" />,
  },
  // 4. Fakten-Panel (13.36 - 19.38 s): 1 Mio.+ Karten, ~800 Kassen
  {
    ab: T.serverDaten,
    inhalt: (s) => <FaktenServerSzene kartenAb={rel(T.karten, s)} kassenAb={rel(T.kassen, s)} />,
  },
  // 5. Animierte Weltkarte mit echten Flaggen (19.38 - 22.80 s): Brasilien -> Deutschland
  {
    ab: T.brasilien,
    inhalt: (s) => <WeltkarteDESzene deAb={rel(T.deFakten, s)} />,
  },
  // 6. Flow-Szene: Strichermittler prüft alte verstaubte Windows-Kasse mit Lupe (22.80 - 34.44 s)
  {
    ab: T.interessant,
    inhalt: () => <BildBuehne bild={`${R}/flow-lupe-kasse.png`} fokus={[50, 48]} />,
  },
  // 7. Nachgebautes Kassenterminal in Remotion: CLFS-Lücke -> Trojaner aktiv (34.44 - 42.18 s)
  {
    ab: T.systemrechte,
    inhalt: (s) => <KassenExploitSzene trojanerAb={rel(T.trojaner, s)} />,
  },
  // 8. Nachgebaute animierte Kreditkarte: Nummer, Ablauf, Bankdaten -> Kontrollfeld (42.18 - 50.64 s)
  {
    ab: T.kartenzahlung,
    inhalt: (s) => (
      <KreditkarteAbgriffSzene
        nummerAb={rel(T.nummer, s)}
        ablaufAb={rel(T.ablauf, s)}
        bankAb={rel(T.bankdaten, s)}
        serverAb={rel(T.kontrollfeld, s)}
      />
    ),
  },
  // 9. Flow-Szene: Strichermittler schaltet Täter-Server ab (50.64 - 54.50 s)
  {
    ab: T.abgeschaltet,
    inhalt: () => <BildBuehne bild={`${R}/flow-server-aus.png`} fokus={[50, 46]} />,
  },
  // 10. Spurensuchwand mit rotem Faden (54.50 - 60.84 s)
  {
    ab: T.offen,
    inhalt: () => (
      <BildBuehne
        bild={`${R}/pose-wand.jpg`}
        fokus={[50, 58]}
        titel="Täter & Patch-Stand offen"
        akzent="#ff8a1f"
      />
    ),
  },
  // 11. Flow-Szene Schluss: Banking-App + mahnender Zeigefinger (60.84 - 67.50 s)
  {
    ab: T.achtung,
    inhalt: () => <BildBuehne bild={`${R}/flow-banking-app.png`} fokus={[50, 45]} />,
  },
];

export const ReelKassenhack: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile(`${R}/audio.wav`)} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_KASSENHACK_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel
      datei={`${R}/untertitel.json`}
      top={BAND_TOP + BAND_HOEHE + 40}
      wechselMs={650}
      groesse={60}
      saetze
      ohne={OHNE_UNTERTITEL}
    />
  </Hintergrund>
);
