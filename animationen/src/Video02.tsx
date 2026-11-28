import React from "react";
import { Audio } from "@remotion/media";
import { DE, IR } from "country-flag-icons/react/3x2";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NOIR_ORANGE, NOIR_ROT, sfx } from "./noir-buehne";
import { TEXT_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";
import { FlowBild } from "./video02-bausteine";
import { AbtauenErklaert, BelegDeutschland, BelegGeheimdienste, Begruessung16, Blutbank, DeutschlandKarte, ErsteWelle, HookSzene, ZweiteWelle } from "./video02-teil1";
import { BelegDanfoss, BelegIran, Belege, BelegUpdates, DreiTueren, EuZitat, FuerDich, KeinGeld, Nadelstiche, Scan, SchlussWitz, Spur, Steuerung, UpdatesHelfenNicht, WarumKuehl, ZweiWellen } from "./video02-teil2";
import { Z } from "./video02-zeiten";

// Video 02 (16:9): Hacker heizen Supermärkte auf 50 Grad – wer steckt dahinter?
export const VIDEO02_SEK = Z.ende + 1.2;
const V = "video-02";
const f = (s: number) => Math.round(s * 30);

type Abschnitt = [bis: number, render: (s: number) => React.ReactNode];

export const Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const [umrisse, setUmrisse] = React.useState<[number, number][][] | null>(null);
  React.useEffect(() => {
    fetch(staticFile(`${V}/deutschland.json`)).then((r) => r.json()).then(setUmrisse);
  }, []);

  const plan: Abschnitt[] = [
    [Z.wer, (t) => <HookSzene s={t} />],
    [Z.willkommen, (t) => <FlowBild s={t} ab={Z.wer} bis={Z.willkommen} bild={`${V}/szene-5.jpeg`} ursprung="70% 40%" />],
    [Z.fakten, (t) => <Begruessung16 s={t} />],
    [Z.gefrier, (t) => <ErsteWelle s={t} />],
    [Z.ernst, (t) => <AbtauenErklaert s={t} />],
    [Z.bsi - 0.3, (t) => <ZweiteWelle s={t} />],
    [Z.reisbach, (t) => <BelegDeutschland s={t} />],
    [Z.streich, (t) => <DeutschlandKarte s={t} umrisse={umrisse} />],
    [Z.verfassung - 0.4, (t) => <Blutbank s={t} />],
    [Z.wie, (t) => <BelegGeheimdienste s={t} />],
    [Z.peinlich - 0.6, (t) => <FlowBild s={t} ab={Z.wie} bis={Z.peinlich} bild={`${V}/szene-2.jpeg`} ursprung="35% 45%" />],
    [Z.danfoss - 0.3, (t) => <Steuerung s={t} />],
    [Z.tueren - 0.3, (t) => <BelegDanfoss s={t} />],
    [Z.finden - 0.2, (t) => <DreiTueren s={t} />],
    [Z.gut - 0.8, (t) => <Scan s={t} />],
    [Z.midnight - 0.3, (t) => <UpdatesHelfenNicht s={t} />],
    [Z.stunde, (t) => <BelegUpdates s={t} />],
    [Z.werwar - 0.4, (t) => <UpdatesHelfenNicht s={t} />],
    [Z.neunter, (t) => <KeinGeld s={t} />],
    [Z.iran - 0.2, (t) => <FlowBild s={t} ab={Z.neunter} bis={Z.iran} bild={`${V}/szene-3.jpeg`} ursprung="40% 45%" />],
    [Z.belege, (t) => <Spur s={t} />],
    [Z.erste - 0.3, (t) => <Belege s={t} />],
    [Z.wichtig, (t) => <BelegIran s={t} />],
    [Z.warumkuehl - 0.4, (t) => <ZweiWellen s={t} />],
    [Z.eu - 0.2, (t) => <WarumKuehl s={t} />],
    [Z.hybrid2 - 0.3, (t) => <EuZitat s={t} />],
    [Z.dich - 0.3, (t) => <Nadelstiche s={t} />],
    [Z.witz - 0.3, (t) => <FuerDich s={t} />],
    [Z.leicht + 1.3, (t) => <SchlussWitz s={t} />],
    [Infinity, (t) => <FlowBild s={t} ab={Z.leicht + 1.3} bis={VIDEO02_SEK} bild={`${V}/szene-4.jpeg`} zoomVon={1.05} zoomBis={1.15} />],
  ];
  const aktiv = plan.find(([bis]) => s < bis) ?? plan[plan.length - 1];

  const klaenge: [number, Parameters<typeof sfx>[0], number][] = [
    [Z.kassen, "pop", 0.3], [Z.kunden, "pop", 0.3], [Z.k50, "minus", 0.4], [Z.brennt, "whoosh", 0.35], [Z.de, "stempel", 0.35],
    [Z.carrefour, "pop", 0.3], [Z.k700b, "tick", 0.35], [Z.alarme, "minus", 0.4], [Z.nacht, "whoosh", 0.3], [Z.braende, "stempel", 0.35],
    [Z.belgien, "pop", 0.3], [Z.de2, "stempel", 0.4], [Z.reisbach, "pop", 0.35], [Z.lilienthal, "pop", 0.35], [Z.k110, "minus", 0.4],
    [Z.internet, "whoosh", 0.3], [Z.fertig, "ding", 0.35], [Z.tuer1, "schnipp", 0.35], [Z.tuer2, "schnipp", 0.35], [Z.tuer3, "schnipp", 0.35],
    [Z.k13000, "tick", 0.35], [Z.sechs, "minus", 0.4], [Z.loesegeld, "pop", 0.3], [Z.gestohlen, "pop", 0.3], [Z.brief, "pop", 0.3],
    [Z.iran, "stempel", 0.4], [Z.wasser, "pop", 0.3], [Z.tool, "pop", 0.3], [Z.propaganda, "pop", 0.3], [Z.persisch, "pop", 0.3],
    [Z.geklaert, "ding", 0.3], [Z.nadel, "minus", 0.35], [Z.pw, "tick", 0.35], [Z.upd, "tick", 0.35], [Z.netz, "tick", 0.35],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#050506" }}>
      <Audio src={staticFile(`${V}/audio.wav`)} />
      {klaenge.map(([t, k, v], i) => (
        <Sequence key={i} from={f(t)} durationInFrames={30}>
          <Audio src={sfx(k)} volume={v} />
        </Sequence>
      ))}
      {aktiv[1](s)}
      <Untertitel datei={`${V}/untertitel.json`} top={900} wechselMs={1400} groesse={46} saetze ohne={[[Z.willkommen * 1000, Z.fakten * 1000 - 50]]} />
    </AbsoluteFill>
  );
};

// Cover (YouTube-Thumbnail 16:9): Flow-Bild + erklärender Text
export const CoverVideo02: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050506" }}>
    <Img src={staticFile(`${V}/szene-5.jpeg`)} style={{ position: "absolute", left: 120, top: 0, width: 1920, height: 1080, objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, #050506 0%, rgba(5,5,6,0.92) 38%, rgba(5,5,6,0) 62%)" }} />
    <div style={{ position: "absolute", left: 80, top: 210, width: 1000, fontFamily: TEXT_SCHRIFT }}>
      <div style={{ display: "inline-block", padding: "10px 24px", borderRadius: 14, background: NOIR_ROT, color: "#fff", fontWeight: 800, fontSize: 46, letterSpacing: 1 }}>SUPERMÄRKTE GEHACKT</div>
      <div style={{ marginTop: 26, fontWeight: 800, fontSize: 118, lineHeight: 1.0, color: "#f5f5f5", letterSpacing: -2 }}>
        Kühlregale auf <span style={{ color: NOIR_ORANGE }}>50°C</span>
      </div>
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 58, color: "#f5f5f5" }}>Die Spur führt in den <span style={{ color: NOIR_ROT }}>Iran</span></div>
        <IR style={{ width: 120, borderRadius: 8 }} />
      </div>
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 18 }}>
        <DE style={{ width: 80, borderRadius: 6 }} />
        <div style={{ fontWeight: 700, fontSize: 40, color: "rgba(255,255,255,0.85)" }}>auch in Deutschland</div>
      </div>
    </div>
  </AbsoluteFill>
);
