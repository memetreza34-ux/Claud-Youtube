import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, BAND_TOP, BandFoto, BandKarte, BandScreenshot, BandTitel, FigurHintergrund, KartenText, KartenZahl } from "./band";
import { AUDIO_V3_SEK, neueZeit } from "./reel-nvidia-schnitte";
import { ANTON_SCHRIFT, CLAMP, FARBE, Hintergrund, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 02 v3: Nvidia-Fall als Geschichte. Figur als Hintergrund, Belege im Band, Untertitel darunter.
// Jede Szene beginnt mit dem Wort, das sie zeigt (Wort-Zeitmarken von reel-02-nvidia-v3.wav).
export const REEL_NVIDIA3_SEK = AUDIO_V3_SEK;
const f = (s: number) => Math.round(s * 30);

type SzeneDef = { ab: number; inhalt: (dauer: number) => React.ReactNode };

const KursKarte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const balken = [
    { text: "−8,74 %", label: "zeitweise", wert: 8.74, ab: 0.15, farbe: FARBE.rot },
    { text: "−4,3 %", label: "Schluss (rund)", wert: 4.3, ab: 0.7, farbe: "#ff8a8a" },
  ];
  return (
    <>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: TEXT_SCHRIFT, fontSize: 48, fontWeight: 800, color: FARBE.weiss }}>
        Nvidia-Aktie am 9. November
      </div>
      <div style={{ position: "absolute", top: 160, left: 60, right: 60, height: 4, backgroundColor: "#4a4a55" }} />
      {balken.map((b, i) => (
        <div key={b.label} style={{ position: "absolute", top: 164, left: 130 + i * 450, width: 340, textAlign: "center" }}>
          <div
            style={{
              height: interpolate(frame, [b.ab * fps, (b.ab + 0.5) * fps], [0, b.wert * 30], { ...CLAMP, easing: WEICH }),
              backgroundColor: b.farbe,
              borderRadius: "0 0 10px 10px",
            }}
          />
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 90, color: b.farbe, lineHeight: 1.1 }}>{b.text}</div>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 700, color: FARBE.weiss }}>{b.label}</div>
        </div>
      ))}
    </>
  );
};

const NameEinblendung: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: BAND_TOP + 120,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: ANTON_SCHRIFT,
        fontSize: 120,
        color: FARBE.gelb,
        textTransform: "uppercase",
        WebkitTextStroke: "16px #000",
        paintOrder: "stroke fill",
        opacity: interpolate(frame, [0, 0.15 * fps], [0, 1], CLAMP),
        scale: interpolate(frame, [0, 0.3 * fps], [1.2, 1], { ...CLAMP, easing: WEICH, output: "perceptual-scale" }),
      }}
    >
      Der Strichermittler
    </div>
  );
};

const SZENEN: SzeneDef[] = [
  // Einstieg: die Bar
  {
    ab: 0,
    inhalt: (d) => (
      <BandFoto bild="reel-nvidia/bar-taipeh.jpg" nachweis="Bar in Taipeh · Foto: 4300streetcar, CC BY 4.0" extra="SYMBOLBILD" fokus={[50, 70]} dauer={d} helligkeit={1.6} zoomVon={1.25} zoomBis={1.0}>
        <BandTitel text="Taipeh · 2024" ab={0.05} farbe={FARBE.weiss} groesse={130} />
      </BandFoto>
    ),
  },
  {
    ab: 3.0,
    inhalt: (d) => (
      <BandFoto bild="reel-nvidia/bar-taipeh.jpg" nachweis="Bar in Taipeh · Foto: 4300streetcar, CC BY 4.0" extra="SYMBOLBILD" fokus={[50, 70]} dauer={d} helligkeit={0.8} zoomVon={1.0} zoomBis={1.1}>
        <BandTitel text="Die Wette" ab={0.05} farbe={FARBE.gelb} groesse={170} />
      </BandFoto>
    ),
  },
  {
    ab: 5.75,
    inhalt: (d) => (
      <BandFoto bild="reel-nvidia/jensen-huang-2024.jpg" nachweis="Jensen Huang · Foto: Peter DaSilva, CC BY 4.0" extra="LAUT NEW YORK TIMES" fokus={[50, 33]} dauer={d} zoomVon={1.0} zoomBis={1.15}>
        <BandTitel text="Nvidia-Chef Jensen Huang" ab={neueZeit(8.68) - neueZeit(5.75)} farbe={FARBE.weiss} groesse={80} unten />
      </BandFoto>
    ),
  },
  {
    ab: 10.9,
    inhalt: (d) => (
      <BandFoto bild="reel-nvidia/jensen-huang-2024.jpg" nachweis="Jensen Huang · Foto: Peter DaSilva, CC BY 4.0" extra="LAUT NEW YORK TIMES" fokus={[50, 33]} dauer={d} zoomVon={1.15} zoomBis={1.25} helligkeit={0.55}>
        <BandTitel text="Ein Whiskey mit der Gruppe" ab={0.05} farbe={FARBE.gelb} groesse={100} />
      </BandFoto>
    ),
  },
  {
    ab: 12.8,
    inhalt: () => (
      <BandKarte>
        <KartenText text="SO BEGINNT EIN FALL …" schrift="zahl" groesse={150} farbe={FARBE.weiss} />
      </BandKarte>
    ),
  },
  // Nvidia, Washington, Peking
  { ab: 14.85, inhalt: (d) => <BandScreenshot bild="reel-nvidia/nvidia-untersuchung.png" quelle="Nvidia" markierung={[492, 863, 942, 979]} ohneKreis dauer={d} /> },
  { ab: 15.75, inhalt: (d) => <BandScreenshot bild="reel-nvidia/kongress-brief.png" quelle="US-Kongress" markierung={[450, 673, 932, 985]} ohneKreis dauer={d} /> },
  {
    ab: 16.35,
    inhalt: () => (
      <BandKarte>
        <KartenText text="PEKING" schrift="zahl" groesse={200} farbe={FARBE.rot} />
      </BandKarte>
    ),
  },
  // Vorstellung: Band weg, Figur ganz zu sehen
  { ab: 17.7, inhalt: () => <NameEinblendung /> },
  {
    ab: 19.3,
    inhalt: () => (
      <BandKarte>
        <KartenText text="Was ist wirklich bekannt?" groesse={80} />
      </BandKarte>
    ),
  },
  // Megaspeed
  {
    ab: 21.8,
    inhalt: () => (
      <BandKarte quelle="Quelle: Al Jazeera, TechCrunch">
        <KartenText text="MEGASPEED" schrift="zahl" groesse={190} farbe={FARBE.gelb} />
        <KartenText text="Singapur · Rechenzentren" groesse={56} />
        <Sequence from={f(neueZeit(26.42) - neueZeit(21.8))} layout="none">
          <KartenText text="Einer der größten Nvidia-Kunden" groesse={56} farbe={FARBE.gelb} />
        </Sequence>
      </BandKarte>
    ),
  },
  {
    ab: 29.0,
    inhalt: () => (
      <BandKarte quelle="Quelle: New York Times, laut TechCrunch">
        <KartenZahl von={0} bis={4.8} format={(n) => `${n.toFixed(1).replace(".", ",")} MRD. $`} />
        <KartenText text="Einkäufe bei Nvidia in knapp zwei Jahren" groesse={46} />
      </BandKarte>
    ),
  },
  // Verdacht: Exportverbot, Prüfung
  {
    ab: 34.85,
    inhalt: () => (
      <BandKarte>
        <KartenText text="US-EXPORTVERBOT" schrift="zahl" groesse={150} farbe={FARBE.rot} />
        <KartenText text="Die stärksten KI-Chips dürfen nicht nach China" groesse={52} />
      </BandKarte>
    ),
  },
  { ab: 37.5, inhalt: (d) => <BandScreenshot bild="reel-nvidia/techcrunch-trump.png" quelle="TechCrunch, 10.11.2026" markierung={[60, 1020, 1395, 1475]} kreisAb={2.2} dauer={d} /> },
  // Trump
  { ab: 44.1, inhalt: (d) => <BandFoto bild="reel-nvidia/trump-2025.jpg" nachweis="Präsident Donald Trump · Foto: Weißes Haus, gemeinfrei" fokus={[50, 38]} dauer={d} /> },
  { ab: 49.7, inhalt: (d) => <BandScreenshot bild="reel-nvidia/techcrunch-trump.png" quelle="TechCrunch, 10.11.2026" markierung={[312, 501, 1054, 1091]} kreisAb={1.4} dauer={d} /> },
  // Memo
  {
    ab: 52.25,
    inhalt: () => (
      <BandKarte quelle="laut New York Times">
        <KartenText text="GEHEIMES MEMO" schrift="zahl" groesse={170} farbe={FARBE.rot} />
        <KartenText text="US-Regierung, Frühjahr 2026" groesse={52} />
      </BandKarte>
    ),
  },
  { ab: 56.9, inhalt: (d) => <BandScreenshot bild="reel-nvidia/techcrunch-memo.png" quelle="TechCrunch, 7.11.2026" markierung={[66, 937, 1028, 1117]} kreisAb={1.8} dauer={d} /> },
  // Öffentlich, Dementi
  {
    ab: 63.95,
    inhalt: () => (
      <BandKarte>
        <KartenText text="ENDE OKTOBER 2026" schrift="zahl" groesse={130} farbe={FARBE.gelb} />
        <KartenText text="Die New York Times macht den Fall öffentlich" groesse={52} />
      </BandKarte>
    ),
  },
  { ab: 67.2, inhalt: (d) => <BandScreenshot bild="reel-nvidia/yahoo-normal.png" quelle="Yahoo Finance / Bloomberg" markierung={[450, 757, 936, 981]} kreisAb={0.8} dauer={d} /> },
  // Wende
  {
    ab: 69.6,
    inhalt: () => (
      <BandKarte>
        <KartenText text="8. NOVEMBER" schrift="zahl" groesse={200} farbe={FARBE.gelb} />
        <KartenText text="Brief an die Mitarbeiter" groesse={52} />
      </BandKarte>
    ),
  },
  { ab: 72.3, inhalt: (d) => <BandScreenshot bild="reel-nvidia/orf-untreu.png" quelle="ORF, 9.11.2026" markierung={[30, 953, 910, 1007]} kreisAb={0.1} dauer={d} /> },
  { ab: 74.0, inhalt: (d) => <BandScreenshot bild="reel-nvidia/nvidia-untersuchung.png" quelle="Nvidia, Erklärung des Verwaltungsrats" markierung={[492, 863, 942, 979]} kreisAb={1.5} dauer={d} /> },
  {
    ab: 77.1,
    inhalt: () => (
      <BandKarte quelle="Quelle: ORF, 9.11.2026">
        <KursKarte />
      </BandKarte>
    ),
  },
  // Stand
  {
    ab: 80.1,
    inhalt: () => (
      <BandKarte>
        <KartenText text="WAS BLEIBT?" schrift="zahl" groesse={200} farbe={FARBE.weiss} />
      </BandKarte>
    ),
  },
  { ab: 81.8, inhalt: (d) => <BandScreenshot bild="reel-nvidia/nvidia-verwaltungsrat.png" quelle="Nvidia, Erklärung des Verwaltungsrats" markierung={[320, 607, 940, 977]} kreisAb={1.2} dauer={d} /> },
  {
    ab: 85.85,
    inhalt: () => (
      <BandKarte quelle="Quelle: Al Jazeera, ORF">
        <KartenText text="AUSSENMINISTERIUM CHINA" groesse={44} farbe={FARBE.grau} />
        <KartenText text="„Verleumdung“" schrift="zahl" groesse={190} farbe={FARBE.rot} />
      </BandKarte>
    ),
  },
  {
    ab: 87.9,
    inhalt: () => (
      <BandKarte>
        <KartenText text="ANKLAGE" schrift="zahl" groesse={140} />
        <KartenText text="KEINE" schrift="zahl" groesse={210} farbe={FARBE.gelb} />
      </BandKarte>
    ),
  },
  { ab: 89.05, inhalt: (d) => <BandScreenshot bild="reel-nvidia/kongress-brief.png" quelle="US-Repräsentantenhaus, 4.11.2026" markierung={[450, 673, 932, 985]} kreisAb={0.6} dauer={d} /> },
  {
    ab: 92.9,
    inhalt: () => (
      <BandKarte quelle="Stand: 10.11.2026">
        <KartenText text="OFFEN" schrift="zahl" groesse={150} farbe={FARBE.rot} />
        <KartenText text="Ist etwas nach Peking geflossen?" groesse={64} />
      </BandKarte>
    ),
  },
  { ab: 96.7, inhalt: () => null },
];

const Schluss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: BAND_TOP + 140,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: ANTON_SCHRIFT,
        fontSize: 130,
        color: FARBE.gelb,
        textTransform: "uppercase",
        WebkitTextStroke: "16px #000",
        paintOrder: "stroke fill",
        opacity: interpolate(frame, [0, 0.15 * fps], [0, 1], CLAMP),
      }}
    >
      Ich bleibe dran.
    </div>
  );
};

export const ReelNvidia3: React.FC = () => {
  return (
    <Hintergrund>
      <Audio src={staticFile("reel-nvidia/audio-v3.wav")} />
      <FigurHintergrund />
      {SZENEN.map((s, i) => {
        const von = neueZeit(s.ab);
        const bis = i + 1 < SZENEN.length ? neueZeit(SZENEN[i + 1].ab) : REEL_NVIDIA3_SEK;
        return (
          <Sequence key={s.ab} from={f(von)} durationInFrames={f(bis) - f(von)} layout="none">
            {s.inhalt(bis - von)}
          </Sequence>
        );
      })}
      <Sequence from={f(neueZeit(96.7))} layout="none">
        <Schluss />
      </Sequence>
      <Untertitel datei="reel-nvidia/untertitel-v3.json" top={BAND_TOP + BAND_HOEHE + 20} wechselMs={500} groesse={100} comic />
    </Hintergrund>
  );
};
