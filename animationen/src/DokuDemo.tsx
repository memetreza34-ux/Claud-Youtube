import React from "react";
import { Cpu, Globe, Skull, Store, Thermometer } from "lucide-react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ArtikelSchraeg, BAUPLAN, BauplanBox, BauplanGrund, DatenPaket, FilmLook, GluehLinie, Pinnwand } from "./doku-bausteine";
import { klemm, NOIR_ROT, rein } from "./noir-buehne";

// Vorführung der neuen Doku-Bausteine mit Material aus Video 02
export const DOKU_DEMO_SEK = 32;
const V = "video-02";

const BauplanSzene: React.FC<{ s: number; ab: number }> = ({ s, ab }) => {
  const t = (x: number) => ab + x;
  const weg1 = "M480 600 L740 600";
  const weg2 = "M1080 600 L1340 600";
  const weg3 = "M1680 600 C 1800 600, 1800 260, 1680 250 L1360 250";
  const alarm = s > t(5.6);
  return (
    <AbsoluteFill>
      <BauplanGrund s={s} ab={ab} titel="FALL 02 · KÜHLSTEUERUNG · SCHEMA" />
      <BauplanBox s={s} ab={t(0.3)} x={310} y={600} label="KÜHLREGALE" icon={<Store size={130} strokeWidth={1.4} />} alarm={alarm} />
      <BauplanBox s={s} ab={t(1.2)} x={910} y={600} label="STEUERUNG" icon={<Cpu size={130} strokeWidth={1.4} />} alarm={alarm} />
      <BauplanBox s={s} ab={t(2.3)} x={1510} y={600} label="INTERNET" icon={<Globe size={130} strokeWidth={1.4} />} />
      <BauplanBox s={s} ab={t(3.6)} x={1210} y={250} b={300} h={220} label="ANGREIFER" icon={<Skull size={110} strokeWidth={1.4} />} farbe={NOIR_ROT} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <GluehLinie s={s} ab={t(1.0)} d={weg1} />
        <GluehLinie s={s} ab={t(2.1)} d={weg2} />
        <GluehLinie s={s} ab={t(4.0)} d={weg3} farbe={NOIR_ROT} dauer={1.0} />
        <DatenPaket s={s} ab={t(2.8)} d={weg1} bis={t(4.6)} />
        <DatenPaket s={s} ab={t(2.8)} d={weg2} bis={t(4.6)} />
        <DatenPaket s={s} ab={t(4.8)} d="M1360 250 L1680 250 C 1800 260, 1800 600, 1680 600 L1080 600 L740 600" farbe={NOIR_ROT} anzahl={4} tempo={0.35} />
      </svg>
      {/* Messwert in Bauplan-Schrift */}
      <div style={{ position: "absolute", left: 160, top: 850, display: "flex", alignItems: "center", gap: 14, fontFamily: "monospace", fontSize: 56, color: alarm ? NOIR_ROT : BAUPLAN, opacity: rein(s, t(0.8), 0.4) }}>
        <Thermometer size={60} strokeWidth={1.5} />
        {alarm ? `+${Math.round(interpolate(s, [t(5.6), t(7)], [-18, 50], klemm))}°C` : "−18°C"}
      </div>
    </AbsoluteFill>
  );
};

export const DokuDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  let szene: React.ReactNode;
  if (s < 8) {
    szene = <ArtikelSchraeg s={s} ab={0} bis={8} bild={`${V}/beleg-geheimdienste.png`} quelle="heise online, 07.11.2026" fokusY={0.47} />;
  } else if (s < 17) {
    szene = <BauplanSzene s={s} ab={8} />;
  } else if (s < 27) {
    szene = (
      <Pinnwand
        s={s}
        ab={17}
        elemente={[
          { ab: 17.3, x: 470, y: 330, breite: 560, drehung: -3, bild: `${V}/beleg-deutschland.png`, ausschnittY: 0.3 },
          { ab: 18.2, x: 1150, y: 300, breite: 520, drehung: 2.5, bild: `${V}/szene-1.jpeg` },
          { ab: 19.1, x: 1560, y: 640, breite: 300, drehung: 4, zettel: "Wer war das?" },
          { ab: 20.0, x: 600, y: 760, breite: 600, drehung: 1.5, bild: `${V}/beleg-iran.png`, ausschnittY: 0.45 },
          { ab: 20.9, x: 1180, y: 770, breite: 420, drehung: -4, bild: `${V}/szene-3.jpeg` },
        ]}
        faeden={[
          [0, 1, 21.6],
          [1, 2, 22.2],
          [2, 3, 22.8],
          [3, 4, 23.4],
        ]}
        fokus={[
          [17, null],
          [24.0, 3],
          [25.8, null],
        ]}
      />
    );
  } else {
    const k = interpolate(s, [27, 32], [1.08, 1.0], klemm);
    szene = (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(`${V}/szene-5.jpeg`)} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `scale(${k})` }} />
      </AbsoluteFill>
    );
  }
  return (
    <FilmLook s={s} lichtschein={[8, 17, 27]}>
      <AbsoluteFill style={{ backgroundColor: "#050506" }}>{szene}</AbsoluteFill>
    </FilmLook>
  );
};
