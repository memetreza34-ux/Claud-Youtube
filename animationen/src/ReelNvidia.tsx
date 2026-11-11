import { Audio } from "@remotion/media";
import { Interactive, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BeweisKarte, ErmittlerWand, Marke, Stempel, Titel } from "./ermittler";
import { CLAMP, FARBE, Hintergrund, WEICH, ZAHLEN_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 02: Wurde der Nvidia-Chef ausspioniert? 1080x1920, 66,7 s
// Zeiten in Sekunden aus den Wort-Zeitmarken von reel-02-nvidia.wav
const Z = {
  fallOffen: 6.4,
  fall: 7.5,
  nyt: 8.76,
  megaspeed: 19.36,
  zahl: 23.5,
  seit2024: 27.64,
  wende: 33.18,
  email: 34.98,
  untreu: 38.04,
  folgen: 42.18,
  fbi: 46.22,
  aktie: 48.52,
  china: 50.82,
  offen: 52.6,
  affaere: 54.9,
  ermittelt: 55.98,
  peking: 58.4,
  keinHinweis: 60.9,
  keineAnklage: 63.96,
  dran: 65.36,
  ende: 66.7,
};

const f = (sek: number) => Math.round(sek * 30);

// Blendet ein Element ab einer Zeit (relativ zum Abschnitt) ein
const useEin = (ab: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return {
    opacity: interpolate(frame, [ab * fps, (ab + 0.35) * fps], [0, 1], { ...CLAMP, easing: WEICH }),
    translate: interpolate(frame, [ab * fps, (ab + 0.35) * fps], ["0px 40px", "0px 0px"], { ...CLAMP, easing: WEICH }),
  };
};

const FaktZeile: React.FC<{ ab: number; top: number; label: string; wert: string; farbe: string }> = ({ ab, top, label, wert, farbe }) => (
  <Interactive.Div
    name={label}
    style={{
      position: "absolute",
      top,
      left: 90,
      right: 90,
      padding: "26px 34px",
      borderRadius: 18,
      backgroundColor: "rgba(20,20,26,0.92)",
      borderLeft: `12px solid ${farbe}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...useEin(ab),
    }}
  >
    <div style={{ fontSize: 46, fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, color: farbe, lineHeight: 1 }}>{wert}</div>
  </Interactive.Div>
);

const TafelPunkt: React.FC<{ ab: number; text: string; top: number; links: boolean; zeichen?: string }> = ({
  ab,
  text,
  top,
  links,
  zeichen,
}) => (
  <Interactive.Div
    name={text}
    style={{
      position: "absolute",
      top,
      left: links ? 70 : 560,
      width: 450,
      fontSize: 42,
      fontWeight: 700,
      lineHeight: 1.2,
      ...useEin(ab),
    }}
  >
    {zeichen ?? (links ? "✓ " : "? ")}
    {text}
  </Interactive.Div>
);

const Tafel: React.FC = () => {
  const o = Z.offen;
  const kopf = (text: string, farbe: string, links: boolean) => (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: links ? 70 : 560,
        width: 450,
        fontFamily: ZAHLEN_SCHRIFT,
        fontSize: 110,
        color: farbe,
        borderBottom: `6px solid ${farbe}`,
      }}
    >
      {text}
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", top: 340, left: 40, right: 40, height: 820, borderRadius: 24, backgroundColor: "rgba(11,11,14,0.85)" }} />
      <div style={{ position: "absolute", top: 400, height: 700, left: 538, width: 4, backgroundColor: "#33333d" }} />
      {kopf("BESTÄTIGT", FARBE.gelb, true)}
      {kopf("OFFEN", FARBE.rot, false)}
      <TafelPunkt ab={Z.affaere - o} text="Affäre zugegeben" top={560} links />
      <TafelPunkt ab={Z.ermittelt - o} text="Es wird ermittelt" top={720} links />
      <TafelPunkt ab={Z.keineAnklage - o} text="Keine Anklage" top={880} links />
      <TafelPunkt ab={Z.peking - o} text="Infos nach Peking geflossen?" top={560} links={false} />
      <TafelPunkt ab={Z.keinHinweis - o} text="Verwaltungsrat: bisher kein Hinweis" top={760} links={false} zeichen="→ " />
    </>
  );
};

const Megaspeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ab = Z.zahl - Z.megaspeed;
  const wert = interpolate(frame, [ab * fps, (ab + 1) * fps], [0, 4.8], { ...CLAMP, easing: WEICH });
  return (
    <>
      <Titel text="Megaspeed (Singapur)" farbe={FARBE.weiss} />
      <Interactive.Div name="Zahl" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", ...useEin(ab - 0.3) }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 300, lineHeight: 1, color: FARBE.gelb }}>
          {wert.toFixed(1).replace(".", ",")} MRD. $
        </div>
        <div style={{ fontSize: 46, fontWeight: 700, color: FARBE.weiss }}>bei Nvidia eingekauft (laut NYT)</div>
      </Interactive.Div>
      <Interactive.Div
        name="Pruefung"
        style={{
          position: "absolute",
          top: 950,
          left: 90,
          right: 90,
          padding: "30px 36px",
          borderRadius: 18,
          border: `5px solid ${FARBE.rot}`,
          backgroundColor: "rgba(11,11,14,0.9)",
          fontSize: 48,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.25,
          ...useEin(Z.seit2024 - Z.megaspeed),
        }}
      >
        US-Prüfung seit 2024:
        <br />
        <span style={{ color: FARBE.rot }}>Verbotene KI-Chips nach China?</span>
      </Interactive.Div>
    </>
  );
};

const FigurHelligkeit: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  // Figur vorne im Einstieg und am Schluss, sonst im Hintergrund
  const hell = interpolate(t, [0, Z.fall - 0.3, Z.fall, Z.dran - 0.3, Z.dran], [1, 1, 0.18, 0.18, 1], CLAMP);
  return <ErmittlerWand figurHell={hell} />;
};

export const ReelNvidia: React.FC = () => {
  return (
    <Hintergrund>
      <Audio src={staticFile("reel-nvidia/audio.wav")} />
      <FigurHelligkeit />

      <Sequence durationInFrames={f(Z.fall)} layout="none">
        <Titel text={"Wurde der Nvidia‑Chef ausspioniert?"} groesse={74} />
        <Sequence from={f(Z.fallOffen)} layout="none">
          <Stempel text="FALL OFFEN" top={1180} left={330} />
        </Sequence>
      </Sequence>

      <Sequence from={f(Z.fall)} durationInFrames={f(Z.megaspeed - Z.fall)} layout="none">
        <Titel text="Der Bericht" />
        <BeweisKarte
          bild="reel-nvidia/jensen-huang-2024.jpg"
          breite={620}
          hoehe={760}
          top={330}
          bildPosition="50% 20%"
          nachweis="Jensen Huang · Foto: Peter DaSilva, CC BY 4.0"
        />
        <Sequence from={f(Z.nyt - Z.fall)} layout="none">
          <Stempel text="BERICHT: NEW YORK TIMES" top={1020} left={150} />
        </Sequence>
      </Sequence>

      <Sequence from={f(Z.megaspeed)} durationInFrames={f(Z.wende - Z.megaspeed)} layout="none">
        <Megaspeed />
      </Sequence>

      <Sequence from={f(Z.wende)} durationInFrames={f(Z.folgen - Z.wende)} layout="none">
        <Titel text="8. November: die Wende" />
        <Sequence from={f(Z.email - Z.wende)} layout="none">
          <BeweisKarte
            bild="reel-nvidia/orf-untreu.png"
            breite={900}
            hoehe={820}
            top={330}
            drehung={1.5}
            bildPosition="50% 46%"
            nachweis="ORF, 9.11.2026"
          />
        </Sequence>
        <Sequence from={f(Z.untreu - Z.wende)} layout="none">
          <Stempel text="ZUGEGEBEN" top={1080} left={560} drehung={-10} />
        </Sequence>
      </Sequence>

      <Sequence from={f(Z.folgen)} durationInFrames={f(Z.offen - Z.folgen)} layout="none">
        <Titel text="Die Folgen" />
        <Sequence durationInFrames={f(Z.fbi - Z.folgen)} layout="none">
          <BeweisKarte
            bild="reel-nvidia/orf-verwaltungsrat.png"
            breite={900}
            hoehe={820}
            top={330}
            drehung={-1.5}
            bildPosition="50% 48%"
            nachweis="ORF, 9.11.2026"
          />
        </Sequence>
        <FaktZeile ab={Z.fbi - Z.folgen} top={420} label="Ermittelt (laut Trump)" wert="FBI" farbe={FARBE.weiss} />
        <FaktZeile ab={Z.aktie - Z.folgen} top={640} label="Aktie zeitweise" wert="−8,7 %" farbe={FARBE.rot} />
        <FaktZeile ab={Z.china - Z.folgen} top={860} label="China nennt es" wert="VERLEUMDUNG" farbe={FARBE.gelb} />
      </Sequence>

      <Sequence from={f(Z.offen)} durationInFrames={f(Z.dran - Z.offen)} layout="none">
        <Titel text="Was wir wissen – und was nicht" groesse={72} />
        <Tafel />
      </Sequence>

      <Sequence from={f(Z.dran)} layout="none">
        <Titel text="Ich bleibe dran." farbe={FARBE.gelb} groesse={96} />
      </Sequence>

      <Untertitel datei="reel-nvidia/untertitel.json" top={1430} />
      <Marke />
    </Hintergrund>
  );
};

export const REEL_NVIDIA_FRAMES = f(Z.ende);
