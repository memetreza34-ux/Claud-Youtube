import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { NoirBegruessung } from "./intro-noir";
import {
  BildBuehne,
  BrowserSchaden,
  HookMarkenSzene,
  LueckeGeschlossen,
  MarkenSpotSzene,
  OptimizelyKette,
  ScottHelmeSzene,
  WebBausteineSzene,
  ZahlenNetzSzene,
} from "./optimizely";
import { FigurStill } from "./ruhig";
import { Hintergrund } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 05: Optimizely Client-Side Supply-Chain-Angriff (Zoom, BBC, CNN, IKEA u. a.).
// Themenbezogene Visualisierung zu jedem Satz: Scott Helme, Marken-Logos, Finanz-UI,
// Login-Lücke, Code-Projekt-Szene, Browser-Folgen, Kreditkarte, Ermittlungswand, Browser-Update.
// Quellen und Bildnachweise: skripte/reel-05-optimizely.md
export const REEL_OPTIMIZELY_SEK = 76.4;
const f = (s: number) => Math.round(s * 30);

const T = {
  zoom: 2.14,
  bbc: 3.0,
  ikea: 3.68,
  ohneKnacken: 4.68,
  willkommen: 7.64,
  name: 8.28,
  am16: 9.26,
  in188: 12.8,
  snippets: 12.9,
  orgs: 15.08,
  darunter: 19.26,
  zoom2: 19.3,
  bbc2: 20.1,
  cnn2: 20.9,
  ikea2: 21.55,
  finanzseiten: 22.25,
  interessant: 24.0,
  optimizely: 26.92,
  lautOptimizely: 33.46,
  gabenSich: 37.38,
  weilBrowser: 41.74,
  schadcode2: 41.8,
  browser: 41.98,
  einmal: 47.46,
  krypto: 49.3,
  karte: 51.35,
  cookies: 52.68,
  iphones: 54.58,
  stand: 57.38,
  dreiStunden: 58.6,
  entfernt: 61.0,
  wieViele: 62.26,
  werDahinter: 64.84,
  lehre: 67.5,
  bausteine: 69.2,
  alsoHalte: 72.44,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.am16 * 1000 - 50]];

type Szene = { ab: number; inhalt: (start: number) => React.ReactNode };
const rel = (t: number, start: number) => t - start;
const R = "reel-optimizely";

const SZENEN: Szene[] = [
  // 1. Hook: Strichermittler vor den infizierten Browser-Fenstern von Zoom, BBC, CNN, IKEA
  {
    ab: 0,
    inhalt: (s) => <HookMarkenSzene zoomAb={rel(T.zoom, s)} bbcAb={rel(T.bbc, s)} ikeaAb={rel(T.ikea, s)} />,
  },
  // 2. Originales Report-URI-Schaubild („ohne diese Firmen überhaupt zu knacken. Wie geht das?“)
  {
    ab: T.ohneKnacken,
    inhalt: () => <BildBuehne bild={`${R}/reporturi-alert.png`} modus="contain" />,
  },
  // 3. Noir-Begrüßung („Willkommen beim Strichermittler.“)
  {
    ab: T.willkommen,
    inhalt: (s) => <NoirBegruessung nameAb={rel(T.name, s)} ende={rel(T.am16, s)} bild="figur/intro-noir.jpg" />,
  },
  // 4. Scott Helme: echtes Portrait von ihm, sobald sein Name fällt
  {
    ab: T.am16,
    inhalt: () => <ScottHelmeSzene />,
  },
  // 5. Fakten: 188 Programmteile von 178 bekannten Organisationen (reine Zahlen-/Netz-Grafik)
  {
    ab: T.in188,
    inhalt: (s) => <ZahlenNetzSzene snipsAb={rel(T.snippets, s)} orgsAb={rel(T.orgs, s)} />,
  },
  // 6. Exakt aufs Wort: Zoom, BBC, CNN, IKEA Logos groß im Fokus
  {
    ab: T.darunter,
    inhalt: (s) => (
      <MarkenSpotSzene
        zoomAb={rel(T.zoom2, s)}
        bbcAb={rel(T.bbc2, s)}
        cnnAb={rel(T.cnn2, s)}
        ikeaAb={rel(T.ikea2, s)}
      />
    ),
  },
  // 7. Zweiunddreißig Finanzseiten: passendes Banking-/Finanz-Terminal-Bild
  {
    ab: T.finanzseiten,
    inhalt: () => <BildBuehne bild={`${R}/szene-finanzseiten.jpg`} fokus={[50, 58]} titel="32 Finanz- und Bankseiten" akzent="#ef4444" />,
  },
  // 8. Erklärgrafik Teil 1: Web-Test-Skript von Optimizely
  {
    ab: T.interessant,
    inhalt: (s) => (
      <OptimizelyKette z={{ seiten: 0, optimizely: rel(T.optimizely, s), luecke: 999, infiziert: 999, browser: 999 }} />
    ),
  },
  // 9. Lücke bei der Konto-Anmeldung: passendes Login-Portal-Lücken-Bild
  {
    ab: T.lautOptimizely,
    inhalt: () => <BildBuehne bild={`${R}/szene-konto-luecke.jpg`} fokus={[50, 54]} />,
  },
  // 10. Als Firmenkunden in deren Projekte geschrieben: Detektiv am Laptop mit Code-Fenstern & Projekt-Ordnern
  {
    ab: T.gabenSich,
    inhalt: () => <BildBuehne bild={`${R}/szene-projekt-code.jpg`} fokus={[50, 50]} />,
  },
  // 11. Erklärgrafik Teil 2: Vom echten Server direkt in den Browser (mit Zertifikat)
  {
    ab: T.weilBrowser,
    inhalt: (s) => (
      <OptimizelyKette z={{ seiten: -5, optimizely: -5, luecke: -5, infiziert: rel(T.schadcode2, s), browser: rel(T.browser, s) }} />
    ),
  },
  // 12. Folgen im Browser: Krypto, Kartendaten, Cookies & Screenshots, ältere iPhones
  {
    ab: T.einmal,
    inhalt: (s) => (
      <BrowserSchaden
        z={{
          krypto: rel(T.krypto, s),
          karte: rel(T.karte, s),
          cookies: rel(T.cookies, s),
          iphone: rel(T.iphones, s),
        }}
      />
    ),
  },
  // 13. Stand: binnen 3 Stunden geschlossen & Code entfernt
  {
    ab: T.stand,
    inhalt: (s) => <LueckeGeschlossen geschlossenAb={rel(T.dreiStunden, s)} entferntAb={rel(T.entfernt, s)} />,
  },
  // 14. Wie viele Karten oder Geräte betroffen waren: echtes Zahlungsterminal-Foto
  {
    ab: T.wieViele,
    inhalt: () => <BildBuehne bild={`${R}/kreditkarte.jpg`} fokus={[50, 48]} helligkeit={0.85} />,
  },
  // 15. Wer dahintersteckt bleibt offen: Spurensuchwand mit rotem Faden (sauber bis unten abgedunkelt)
  {
    ab: T.werDahinter,
    inhalt: () => <BildBuehne bild={`${R}/a-19-spurensuch-wand-roter-faden.jpg`} fokus={[50, 60]} />,
  },
  // 16. Lehre: Webseite öffnet sich und zeigt fremde Bausteine
  {
    ab: T.lehre,
    inhalt: (s) => <WebBausteineSzene bausteineAb={rel(T.bausteine, s)} />,
  },
  // 17. Schluss: Strichermittler zeigt warnend auf Browser & Smartphone mit Schutzschild
  {
    ab: T.alsoHalte,
    inhalt: () => <BildBuehne bild={`${R}/szene-browser-update.jpg`} fokus={[50, 50]} />,
  },
];

export const ReelOptimizely: React.FC = () => (
  <Hintergrund>
    <Audio src={staticFile(`${R}/audio.wav`)} />
    <FigurStill />
    {SZENEN.map((s, i) => {
      const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].ab : REEL_OPTIMIZELY_SEK;
      return (
        <Sequence key={i} from={f(s.ab)} durationInFrames={Math.max(1, f(bis) - f(s.ab))} layout="none">
          {s.inhalt(s.ab)}
        </Sequence>
      );
    })}
    <Untertitel datei={`${R}/untertitel.json`} top={BAND_TOP + BAND_HOEHE + 40} wechselMs={650} groesse={60} saetze ohne={OHNE_UNTERTITEL} />
  </Hintergrund>
);
