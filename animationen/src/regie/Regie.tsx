import React from "react";
import * as Icons from "lucide-react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ArtikelSchraeg, BauplanBox, BauplanGrund, DatenPaket, FilmLook, GluehLinie, Pinnwand } from "../doku-bausteine";
import { BrowserFenster, ChatVerlauf, Fallakte, KarteRaum, ladeLand, MemeKlassisch, MemeZweiFelder, ReaktionsPop, Terminal } from "../doku-bausteine2";
import { useFlaeche } from "../format";
import { klemm, NOIR_ORANGE, NOIR_ROT, rein, SANFT, sfx } from "../noir-buehne";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "../stil";
import { Untertitel } from "../Untertitel";
import { KapitelTitel } from "../video02-bausteine";
import type { Szene } from "./typen";

// Regie: rendert einen Szenenplan. Jede Szene bekommt automatisch Film-Look, Lichtschein beim Wechsel,
// einen passenden Klang und optional Kapitel-Titel und Figur-Reaktion.

const Icon: React.FC<{ name: string; size: number }> = ({ name, size }) => {
  const K = (Icons as unknown as Record<string, React.FC<{ size?: number; strokeWidth?: number }>>)[name] ?? Icons.Circle;
  return <K size={size} strokeWidth={1.4} />;
};

const FigurSzene: React.FC<{ s: number; ab: number; bis: number; bild: string; ursprung?: string; zoomVon?: number; zoomBis?: number }> = ({ s, ab, bis, bild, ursprung = "50% 45%", zoomVon = 1.12, zoomBis = 1.0 }) => {
  const { W, H } = useFlaeche();
  const zoom = interpolate(s, [ab, bis], [zoomVon, zoomBis], klemm) + 0.04 * Math.exp(-8 * Math.max(0, s - ab));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#050506" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ursprung }}>
        <Img src={staticFile(bild)} style={{ width: W, height: H, objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ZahlSzene: React.FC<{ s: number; ab: number; wert: number; vorsilbe?: string; einheit?: string; label: string; bild?: string; rot?: boolean }> = ({ s, ab, wert, vorsilbe = "", einheit = "", label, bild, rot }) => {
  const { W, H, hoch } = useFlaeche();
  const k = interpolate(s, [ab + 0.2, ab + 1.4], [0, 1], { ...klemm, easing: SANFT });
  const f = rot ? NOIR_ROT : NOIR_ORANGE;
  const zahl = Math.round(wert * k).toLocaleString("de-DE");
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506", overflow: "hidden" }}>
      {bild ? <Img src={staticFile(bild)} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "blur(10px) brightness(0.35)", transform: `scale(${1.15 - 0.05 * k})` }} /> : null}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: hoch ? 300 : 340, lineHeight: 1, color: f, textShadow: `0 0 80px ${f}88`, transform: `scale(${0.85 + 0.15 * rein(s, ab, 0.5)})` }}>
          {vorsilbe}
          {zahl}
          {einheit}
        </div>
        <div style={{ marginTop: 20, fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: hoch ? 52 : 56, letterSpacing: 4, color: "#f5f5f5", textAlign: "center", padding: "0 60px", opacity: rein(s, ab + 0.6, 0.4) }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BauplanSzene: React.FC<{ s: number; sz: Extract<Szene, { typ: "bauplan" }> }> = ({ s, sz }) => {
  const { W, H, hoch } = useFlaeche();
  const pos = (id: string) => {
    const k = sz.knoten.find((n) => n.id === id)!;
    return [k.x * W, k.y * H] as const;
  };
  const boxB = hoch ? 400 : 340;
  const boxH = hoch ? 320 : 260;
  return (
    <AbsoluteFill>
      <BauplanGrund s={s} ab={sz.ab} titel={sz.titel} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {sz.linien.map((l, i) => {
          const [ax, ay] = pos(l.von);
          const [bx, by] = pos(l.nach);
          const d = `M${ax} ${ay} L${bx} ${by}`;
          return (
            <g key={i}>
              <GluehLinie s={s} ab={l.ab} d={d} farbe={l.rot ? NOIR_ROT : NOIR_ORANGE} />
              {l.daten ? <DatenPaket s={s} ab={l.daten[0]} bis={l.daten[1]} d={d} farbe={l.rot ? NOIR_ROT : NOIR_ORANGE} /> : null}
            </g>
          );
        })}
      </svg>
      {sz.knoten.map((n) => (
        <BauplanBox key={n.id} s={s} ab={n.ab} x={n.x * W} y={n.y * H} b={boxB} h={boxH} label={n.label} icon={<Icon name={n.icon} size={hoch ? 150 : 130} />} farbe={n.rot ? NOIR_ROT : NOIR_ORANGE} alarm={n.alarmAb !== undefined && s >= n.alarmAb} />
      ))}
      {sz.messwert ? (
        <div style={{ position: "absolute", left: hoch ? 60 : 160, top: hoch ? 240 : H - 230, fontFamily: "monospace", fontSize: hoch ? 64 : 56, color: sz.messwert.rotAb !== undefined && s >= sz.messwert.rotAb ? NOIR_ROT : NOIR_ORANGE, opacity: rein(s, sz.messwert.ab, 0.4) }}>
          {sz.messwert.rotAb !== undefined && s >= sz.messwert.rotAb ? sz.messwert.rotText : sz.messwert.text}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const KLANG: Partial<Record<Szene["typ"], Parameters<typeof sfx>[0]>> = {
  artikel: "whoosh",
  browser: "whoosh",
  pinnwand: "pop",
  meme: "stempel",
  memeZwei: "pop",
  chat: "pop",
  terminal: "tick",
  akte: "schnipp",
  karte: "whoosh",
  zahl: "tick",
  bauplan: "schnipp",
};

export const Regie: React.FC<{
  plan: Szene[];
  audio?: string;
  untertitel?: { datei: string; ohne?: [number, number][] };
  eigeneSzenen?: Record<string, (s: number, sz: Szene) => React.ReactNode>;
}> = ({ plan, audio, untertitel, eigeneSzenen = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { H, hoch } = useFlaeche();
  const s = frame / fps;
  const [land, setLand] = React.useState<[number, number][][] | null>(null);
  const brauchtKarte = plan.some((p) => p.typ === "karte");
  React.useEffect(() => {
    if (brauchtKarte) fetch(staticFile("karten/land-110m.json")).then((r) => r.json()).then((t) => setLand(ladeLand(t)));
  }, [brauchtKarte]);

  const sz = plan.find((p) => s >= p.ab && s < p.bis) ?? plan[plan.length - 1];
  const rel = <T extends { x: number; y: number; breite: number }>(e: T, W: number, Hh: number) => ({ ...e, x: e.x * W, y: e.y * Hh, breite: e.breite * W });

  const render = (): React.ReactNode => {
    switch (sz.typ) {
      case "artikel":
        return <ArtikelSchraeg s={s} ab={sz.ab} bis={sz.bis} bild={sz.bild} quelle={sz.quelle} fokusY={sz.fokusY} richtung={sz.richtung} seitenVerhaeltnis={sz.verhaeltnis} />;
      case "browser":
        return <BrowserFenster s={s} ab={sz.ab} bis={sz.bis} bild={sz.bild} bildHoehe={sz.bildHoehe} url={sz.url} scrollBis={sz.scrollBis} />;
      case "pinnwand":
        return <PinnwandRel s={s} sz={sz} rel={rel} />;
      case "bauplan":
        return <BauplanSzene s={s} sz={sz} />;
      case "meme":
        return <MemeKlassisch s={s} ab={sz.ab} pose={sz.pose} oben={sz.oben} unten={sz.unten} untenAb={sz.untenAb} />;
      case "memeZwei":
        return <MemeZweiFelder s={s} ab={sz.ab} nein={sz.nein} ja={sz.ja} />;
      case "chat":
        return <ChatVerlauf s={s} ab={sz.ab} titel={sz.titel} nachrichten={sz.nachrichten} />;
      case "terminal":
        return <Terminal s={s} ab={sz.ab} titel={sz.titel} zeilen={sz.zeilen.map((z) => ({ ...z, farbe: z.rot ? NOIR_ROT : undefined }))} />;
      case "akte":
        return <Fallakte s={s} ab={sz.ab} aktenzeichen={sz.aktenzeichen} titel={sz.titel} zeilen={sz.zeilen} stempel={sz.stempel} lupe={sz.lupe} />;
      case "karte":
        return <KarteRaum s={s} ab={sz.ab} land={land} mitte={sz.mitte} massstab={sz.massstab} orte={sz.orte.map((o) => ({ ...o, farbe: o.rot ? NOIR_ROT : undefined }))} routen={sz.routen} kamera={sz.kamera} />;
      case "figur":
        return <FigurSzene s={s} ab={sz.ab} bis={sz.bis} bild={sz.bild} ursprung={sz.ursprung} zoomVon={sz.zoomVon} zoomBis={sz.zoomBis} />;
      case "zahl":
        return <ZahlSzene s={s} ab={sz.ab} wert={sz.wert} vorsilbe={sz.vorsilbe} einheit={sz.einheit} label={sz.label} bild={sz.bild} rot={sz.rot} />;
      case "eigen":
        return eigeneSzenen[sz.komponente]?.(s, sz) ?? null;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#050506" }}>
      {audio ? <Audio src={staticFile(audio)} /> : null}
      {plan.map((p, i) =>
        KLANG[p.typ] ? (
          <Sequence key={`k${i}`} from={Math.round(p.ab * fps)} durationInFrames={30}>
            <Audio src={sfx(KLANG[p.typ]!)} volume={0.28} />
          </Sequence>
        ) : null,
      )}
      <FilmLook s={s} lichtschein={plan.slice(1).map((p) => p.ab)}>
        <AbsoluteFill>{render()}</AbsoluteFill>
        {sz.kapitel && !hoch ? <KapitelTitel s={s} ab={sz.ab} nr={sz.kapitel.nr} text={sz.kapitel.text} /> : null}
        {sz.reaktion ? <ReaktionsPop s={s} ab={sz.reaktion.ab} bis={sz.reaktion.bis} pose={sz.reaktion.pose} text={sz.reaktion.text} /> : null}
      </FilmLook>
      {untertitel ? <Untertitel datei={untertitel.datei} top={hoch ? H - 420 : H - 180} wechselMs={1080} groesse={hoch ? 60 : 46} saetze ohne={untertitel.ohne} /> : null}
    </AbsoluteFill>
  );
};

const PinnwandRel: React.FC<{ s: number; sz: Extract<Szene, { typ: "pinnwand" }>; rel: <T extends { x: number; y: number; breite: number }>(e: T, W: number, H: number) => T }> = ({ s, sz, rel }) => {
  const { W, H } = useFlaeche();
  return <Pinnwand s={s} ab={sz.ab} elemente={sz.elemente.map((e) => rel(e, W, H))} faeden={sz.faeden} fokus={sz.fokus} />;
};
