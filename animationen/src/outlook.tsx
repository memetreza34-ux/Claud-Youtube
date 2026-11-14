import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, Chip } from "./band";
import { Rahmen, useEin } from "./ruhig";
import { CLAMP, FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

const GRUEN = "#3ddc84";

// Hook: Postfach lädt nicht, dann „Keine Mails, keine Termine“ und die Dauer
export const PostfachLeer: React.FC<{ keineAb: number; termineAb: number; dauerAb: number }> = ({ keineAb, termineAb, dauerAb }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mails = useEin(keineAb);
  const termine = useEin(termineAb);
  const dauer = interpolate(frame, [dauerAb * fps, (dauerAb + 0.35) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  const drehung = (frame / fps) * 360;
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 50, left: 60, right: 60, height: 300, border: "4px solid #2c2c35", borderRadius: 18, backgroundColor: "#16161c" }}>
        <div style={{ position: "absolute", top: 26, left: 34, fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: FARBE.grau }}>Posteingang</div>
        <svg width={90} height={90} style={{ position: "absolute", top: 105, left: 34, rotate: `${drehung}deg` }}>
          <circle cx={45} cy={45} r={34} fill="none" stroke="#3a3a44" strokeWidth={9} />
          <path d="M45 11 A34 34 0 0 1 79 45" fill="none" stroke={FARBE.gelb} strokeWidth={9} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", top: 118, left: 150, fontFamily: TEXT_SCHRIFT, fontSize: 46, fontWeight: 800, color: FARBE.weiss }}>Verbindung wird hergestellt …</div>
        <div style={{ position: "absolute", top: 210, left: 34, display: "flex", gap: 40, fontFamily: TEXT_SCHRIFT, fontSize: 44, fontWeight: 800 }}>
          <span style={{ color: FARBE.rot, opacity: mails }}>✕ Keine Mails</span>
          <span style={{ color: FARBE.rot, opacity: termine }}>✕ Keine Termine</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 380, left: 60, right: 60, opacity: dauer, display: "flex", alignItems: "baseline", gap: 24 }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, lineHeight: 1, color: FARBE.gelb }}>über 24 Std.</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 800, color: FARBE.weiss }}>gestört</div>
      </div>
      <Chip text="Quelle: Microsoft, laut Digital Trends" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Dienste-Raster: Kacheln werden rot, wenn sie genannt werden
type Dienst = { name: string; ab: number };
const Kachel: React.FC<Dienst> = ({ name, ab }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rot = interpolate(frame, [ab * fps, (ab + 0.25) * fps], [0, 1], CLAMP);
  return (
    <div
      style={{
        width: 300,
        height: 118,
        borderRadius: 14,
        border: `4px solid ${rot > 0.5 ? FARBE.rot : "#3a3a44"}`,
        backgroundColor: rot > 0.5 ? "rgba(230,57,70,0.18)" : "#16161c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        whiteSpace: "nowrap",
        fontFamily: TEXT_SCHRIFT,
        fontSize: 32,
        fontWeight: 800,
        color: rot > 0.5 ? FARBE.weiss : FARBE.grau,
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: rot > 0.5 ? FARBE.rot : GRUEN }} />
      {name}
    </div>
  );
};

export const DiensteRaster: React.FC<{ dienste: Dienst[]; geraeteAb: number }> = ({ dienste, geraeteAb }) => {
  const geraete = useEin(geraeteAb);
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, lineHeight: 1, color: FARBE.gelb }}>Betroffene Dienste</div>
      <div style={{ position: "absolute", top: 150, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 20 }}>
        {dienste.map((d) => (
          <Kachel key={d.name} {...d} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 452, left: 60, right: 60, opacity: geraete, fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 800, color: FARBE.weiss }}>
        <span style={{ color: FARBE.gelb }}>Überall:</span> Handy · Rechner · Web · Apple Mail
      </div>
      <Chip text="Quelle: Microsoft-Status, laut Borncity, 12.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Server: Neustart, dann fallen sie unter Last wieder aus
export const ServerNeustart: React.FC<{ lastAb: number; ausAb: number }> = ({ lastAb, ausAb }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const last = useEin(lastAb);
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, lineHeight: 1, color: FARBE.gelb }}>Neustart – und wieder weg</div>
      <div style={{ position: "absolute", top: 160, left: 60, right: 60, display: "flex", gap: 22 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const aus = frame >= (ausAb + i * 0.18) * fps;
          return (
            <div key={i} style={{ flex: 1, height: 250, borderRadius: 12, border: `4px solid ${aus ? FARBE.rot : "#3a3a44"}`, backgroundColor: "#16161c", padding: "18px 14px" }}>
              {[0, 1, 2, 3].map((z) => (
                <div key={z} style={{ display: "flex", alignItems: "center", gap: 10, height: 52 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: aus ? FARBE.rot : GRUEN }} />
                  <span style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: "#2c2c35" }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 440, left: 60, right: 60, opacity: last, fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: FARBE.weiss }}>
        Unter neuer Last: <span style={{ color: FARBE.rot }}>wieder nicht erreichbar</span>
      </div>
      <Chip text="Quelle: Stuttgarter Nachrichten, 13.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};

// Entwarnung am Samstag
export const Wiederhergestellt: React.FC<{ hakenAb: number }> = ({ hakenAb }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const haken = interpolate(frame, [hakenAb * fps, (hakenAb + 0.4) * fps], [0, 1], { ...CLAMP, easing: WEICH });
  return (
    <Rahmen>
      <div style={{ position: "absolute", top: 40, left: 60, fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, color: FARBE.grau }}>Microsoft 365 Status · Samstag, 14.11.</div>
      <div style={{ position: "absolute", top: 110, left: 60, right: 60, borderLeft: `8px solid ${FARBE.gelb}`, paddingLeft: 30 }}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 46, fontWeight: 800, color: FARBE.weiss, lineHeight: 1.25 }}>
          „restored service to the remaining impacted customers and regions“
        </div>
      </div>
      <div style={{ position: "absolute", top: 360, left: 60, display: "flex", alignItems: "center", gap: 28, opacity: haken > 0 ? 1 : 0 }}>
        <svg width={120} height={120}>
          <circle cx={60} cy={60} r={54} fill="none" stroke={GRUEN} strokeWidth={8} />
          <path d="M33 62 L52 81 L88 42" fill="none" stroke={GRUEN} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - haken)} />
        </svg>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, lineHeight: 1, color: GRUEN }}>Wiederhergestellt</div>
      </div>
      <Chip text="Quelle: @MSFT365Status, laut Digital Trends, 14.11.2026" oben={BAND_HOEHE - 70} />
    </Rahmen>
  );
};
