import React from "react";
import { BellOff, CreditCard, Database, Droplet, Moon, ShieldCheck, Store, Timer, Trash2 } from "lucide-react";
import { BE, DE, EE, FR, IE, LU, NL, SE } from "country-flag-icons/react/3x2";
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { EXPO } from "./noir-buehne";
import { klemm, lauf, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";
import { BLAU, Beleg16, Dampf, Flammen, GRUEN, Grund16, H, IconKugel, KapitelTitel, Label, Plopp, RollZahl, ruck, Streich, W } from "./video02-bausteine";
import { Z } from "./video02-zeiten";

const V = "video-02";

/* ───────── Held: die Kühltruhe mit Temperaturanzeige ───────── */
export const Kuehltruhe: React.FC<{ s: number; x: number; y: number; temp: number; modus?: string; alarmAus?: boolean; skala?: number; schuettel?: number }> = ({ s, x, y, temp, modus, alarmAus, skala = 1, schuettel = 0 }) => {
  const heiss = interpolate(temp, [-18, 50], [0, 1], klemm);
  const glas = heiss < 0.5 ? `rgba(90,180,255,${0.25 - heiss * 0.3})` : `rgba(239,68,68,${(heiss - 0.5) * 0.7})`;
  const rand = heiss > 0.5 ? NOIR_ROT : BLAU;
  const produkte: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const farben = ["#e9e4da", "#5ab4ff", "#ffb020", "#7bd389", "#ff7a7a"];
      const f = farben[Math.floor(random(`p${r}${c}`) * farben.length)];
      const sacken = heiss > 0.7 ? (heiss - 0.7) * 30 * random(`s${r}${c}`) : 0;
      produkte.push(<div key={`${r}${c}`} style={{ position: "absolute", left: 30 + c * 112, top: 70 + r * 128 + sacken, width: 92, height: 96 - sacken, borderRadius: 10, background: f, opacity: 0.85 - heiss * 0.35, filter: `saturate(${1 - heiss * 0.6})` }} />);
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${skala}) translateX(${schuettel}px)` }}>
      {/* Anzeige */}
      <div style={{ position: "absolute", left: 120, top: -150, width: 280, height: 120, borderRadius: 18, background: "#08090c", border: `4px solid ${rand}`, boxShadow: `0 0 40px ${rand}88`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 96, color: rand, textShadow: `0 0 24px ${rand}` }}>{temp > 0 ? "+" : ""}{Math.round(temp)}°C</div>
      </div>
      {modus ? <div style={{ position: "absolute", left: 0, right: 0, top: -205, textAlign: "center", fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: modus.startsWith("ABTAU") ? NOIR_ROT : "rgba(255,255,255,0.6)" }}>{modus}</div> : null}
      {alarmAus ? (
        <div style={{ position: "absolute", left: 430, top: -150, width: 110, height: 110, borderRadius: 55, background: "#16080a", border: `4px solid ${NOIR_ROT}`, display: "flex", alignItems: "center", justifyContent: "center", color: NOIR_ROT }}>
          <BellOff size={60} />
        </div>
      ) : null}
      {/* Gehäuse */}
      <div style={{ position: "relative", width: 520, height: 620, borderRadius: 26, background: "linear-gradient(160deg, #2a2c34 0%, #101116 60%)", border: "4px solid #3a3c46", boxShadow: `0 50px 100px rgba(0,0,0,0.8), 0 0 ${60 * heiss}px ${NOIR_ROT}66` }}>
        <div style={{ position: "absolute", inset: 18, borderRadius: 16, overflow: "hidden", background: "#0b0d12", border: `3px solid ${rand}66` }}>
          {produkte}
          <div style={{ position: "absolute", inset: 0, background: glas }} />
          {/* Reif am Glas, schmilzt bei Wärme */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(255,255,255,0.25), transparent 45%)", opacity: 1 - heiss * 1.6 }} />
        </div>
      </div>
      <Dampf s={s} x={260} y={0} breite={460} staerke={interpolate(heiss, [0.6, 1], [0, 1], klemm)} />
    </div>
  );
};

const tempKurve = (s: number, t0: number, dauer = 1.6) => interpolate(s, [t0, t0 + dauer], [-18, 50], { ...klemm, easing: SANFT });

/* ───────── A. Hook ───────── */
const Punktfeld: React.FC<{ s: number; ab: number; anzahl: number; x: number; y: number; breite: number; hoehe: number; farbe?: string; welle?: number }> = ({ s, ab, anzahl, x, y, breite, hoehe, farbe = NOIR_ROT, welle = 1.2 }) => {
  const spalten = Math.round(Math.sqrt((anzahl * breite) / hoehe));
  const zeilen = Math.ceil(anzahl / spalten);
  const dx = breite / spalten;
  const dy = hoehe / zeilen;
  const p: React.ReactNode[] = [];
  for (let i = 0; i < anzahl; i++) {
    const c = i % spalten;
    const r = Math.floor(i / spalten);
    const px = x + c * dx + dx / 2;
    const py = y + r * dy + dy / 2;
    const d = Math.hypot(px - (x + breite / 2), py - (y + hoehe / 2)) / Math.hypot(breite / 2, hoehe / 2);
    const k = interpolate(s, [ab + d * welle, ab + d * welle + 0.2], [0, 1], klemm);
    p.push(<circle key={i} cx={px} cy={py} r={Math.min(dx, dy) * 0.32} fill={k > 0.5 ? farbe : "#2a2c34"} opacity={0.35 + 0.65 * k} />);
  }
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{p}</svg>;
};

export const HookSzene: React.FC<{ s: number }> = ({ s }) => {
  const temp = tempKurve(s, Z.k50 - 0.4);
  const brennt = rein(s, Z.brennt, 0.4);
  const europa = rein(s, Z.europa, 0.5);
  return (
    <Grund16 ton={temp > 20 ? "rot" : "kalt"}>
      <Kuehltruhe s={s} x={560} y={560} temp={temp} skala={0.95 + 0.04 * lauf(s, 0, Z.wer, 0, 1)} schuettel={ruck(s, Z.k50) + ruck(s, Z.brennt)} />
      <Flammen s={s} x={560} y={262} breite={480} k={brennt} />
      {/* rechts: die 700 Märkte, dann halb Europa */}
      {s >= Z.k700 ? (
        <>
          <Punktfeld s={s} ab={Z.k700} anzahl={700} x={1080} y={120} breite={700} hoehe={460} />
          <div style={{ position: "absolute", left: 1080, width: 700, top: 600, textAlign: "center", opacity: rein(s, Z.k700, 0.4) }}>
            <RollZahl s={s} ab={Z.k700} bis={700} groesse={130} farbe={NOIR_ROT} />
            <Label>SUPERMÄRKTE · EINE NACHT</Label>
          </div>
        </>
      ) : null}
      {/* Nicht die Kassen, nicht die Kundendaten */}
      <Plopp s={s} ab={Z.kassen} x={1250} y={260} weg={Z.k50 - 0.3}>
        <div style={{ position: "relative" }}>
          <IconKugel farbe={BLAU} aus={s > Z.kassen + 0.4}><CreditCard size={70} /></IconKugel>
          <Streich s={s} ab={Z.kassen + 0.35} breite={190} />
        </div>
      </Plopp>
      <Plopp s={s} ab={Z.kunden} x={1610} y={260} weg={Z.k50 - 0.3}>
        <div style={{ position: "relative" }}>
          <IconKugel farbe={BLAU} aus={s > Z.kunden + 0.4}><Database size={70} /></IconKugel>
          <Streich s={s} ab={Z.kunden + 0.4} breite={190} />
        </div>
      </Plopp>
      {/* halb Europa + Deutschland */}
      {europa > 0 ? (
        <div style={{ position: "absolute", left: 1080, top: 790, width: 700, display: "flex", justifyContent: "center", gap: 18, opacity: europa }}>
          {[FR, BE, NL, LU, SE, IE, EE].map((F, i) => (
            <div key={i} style={{ transform: `scale(${Math.min(1, schwung(s, Z.europa + i * 0.08))})` }}>
              <F style={{ width: 70, borderRadius: 6 }} />
            </div>
          ))}
          <div style={{ transform: `scale(${1.3 * Math.min(1.1, schwung(s, Z.de))})`, filter: s > Z.de ? `drop-shadow(0 0 16px ${NOIR_ORANGE})` : undefined }}>
            <DE style={{ width: 70, borderRadius: 6 }} />
          </div>
        </div>
      ) : null}
    </Grund16>
  );
};

/* ───────── Begrüßung 16:9 ───────── */
export const Begruessung16: React.FC<{ s: number }> = ({ s }) => {
  const t = s - Z.willkommen;
  const licht = interpolate(t, [0, 0.06, 0.1, 0.16, 0.24], [0, 0.9, 0.25, 1, 1], klemm);
  const strich = interpolate(t, [0.55, 1.05], [0, 1], { ...klemm, easing: EXPO });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: licht, transform: `scale(${1 + t * 0.03})` }}>
        <Img src={staticFile(`${V}/szene-1.jpeg`)} style={{ width: W, height: H, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 110, top: 360 }}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 700, fontSize: 34, letterSpacing: 12, color: "#e9e4da", opacity: rein(s, Z.willkommen + 0.1, 0.3) }}>WILLKOMMEN BEIM</div>
        <div style={{ position: "relative", marginTop: 10, clipPath: `inset(0 ${100 - strich * 100}% 0 0)` }}>
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, color: "#f5f5f5", lineHeight: 1 }}>STRICHERMITTLER</div>
        </div>
        <div style={{ height: 8, width: 860 * strich, background: NOIR_ORANGE, borderRadius: 4, boxShadow: `0 0 24px ${NOIR_ORANGE}` }} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── C. Kapitel 1: die erste Welle ───────── */
export const ErsteWelle: React.FC<{ s: number }> = ({ s }) => {
  const ketten = ["Carrefour", "Intermarché", "Leclerc"];
  const abtau = s >= Z.abtau;
  const temp = abtau ? interpolate(s, [Z.abtau + 0.2, Z.gefrier - 0.2], [-18, 12], klemm) : -18;
  const truheAn = rein(s, Z.abtau - 0.3, 0.4);
  const listeWeg = rein(s, Z.abtau - 0.3, 0.3);
  return (
    <Grund16>
      <KapitelTitel s={s} ab={Z.fakten} nr="1" text="DIE ERSTE WELLE" />
      {/* Datum + Flagge */}
      {(() => {
        const k = interpolate(s, [Z.carrefour - 0.6, Z.carrefour], [0, 1], { ...klemm, easing: SANFT });
        const gross = 1 - k;
        return (
          <div style={{ position: "absolute", left: 1320 - 820 * gross, top: 120 + 260 * gross, display: "flex", alignItems: "center", gap: 20 + 20 * gross, transform: `scale(${1 + 1.2 * gross})`, transformOrigin: "0 50%", opacity: Math.max(rein(s, Z.fakten + 0.4, 0.4), 0) * (1 - listeWeg * 0.7) }}>
            <FR style={{ width: 90, borderRadius: 8 }} />
            <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 40, whiteSpace: "nowrap" }}>Nacht zum 12. Oktober</div>
          </div>
        );
      })()}
      {/* Ketten und Kleine */}
      <div style={{ opacity: 1 - listeWeg }}>
        {ketten.map((k, i) => (
          <Plopp key={k} s={s} ab={Z.carrefour + i * 0.45} x={420 + i * 330} y={380}>
            <div style={{ textAlign: "center" }}>
              <IconKugel farbe={NOIR_ROT} groesse={170}><Store size={80} /></IconKugel>
              <div style={{ marginTop: 16, fontWeight: 800, fontSize: 34 }}>{k}</div>
            </div>
          </Plopp>
        ))}
        <Plopp s={s} ab={Z.metzger} x={1420} y={420}>
          <div style={{ display: "flex", gap: 14 }}>
            {new Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ transform: `scale(${Math.min(1, schwung(s, Z.metzger + i * 0.06))})` }}>
                <IconKugel farbe={NOIR_ORANGE} groesse={80}><Store size={38} /></IconKugel>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}><Label>METZGEREIEN · SCHLACHTHOF</Label></div>
        </Plopp>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
          {s >= Z.k700b - 0.1 ? (
            <>
              <RollZahl s={s} ab={Z.k700b - 0.1} bis={700} groesse={190} farbe={NOIR_ROT} format={(n) => `~${Math.round(n)}`} />
              <Label>STANDORTE IN FRANKREICH</Label>
            </>
          ) : null}
        </div>
      </div>
      {/* Abtaumodus ohne Zeitlimit, Alarme aus */}
      {truheAn > 0 ? (
        <div style={{ opacity: truheAn }}>
          <Kuehltruhe s={s} x={W / 2} y={570} temp={temp} modus={abtau ? "ABTAUEN · OHNE ZEITLIMIT" : "KÜHLEN"} alarmAus={s >= Z.alarme} skala={0.85} schuettel={ruck(s, Z.alarme, 8)} />
        </div>
      ) : null}
    </Grund16>
  );
};

/* ───────── C3. Abtauen erklärt: Heizelement, Minuten statt Nacht ───────── */
export const AbtauenErklaert: React.FC<{ s: number }> = ({ s }) => {
  const heiz = rein(s, Z.heiz, 0.5);
  const nacht = s >= Z.nacht;
  const uhr = nacht ? (s - Z.nacht) * 720 : Math.max(0, s - Z.minuten) * 60;
  const temp = s >= Z.k50b - 0.5 ? tempKurve(s, Z.k50b - 0.5, 0.9) : interpolate(s, [Z.heiz, Z.k50b - 0.5], [-18, 5], klemm);
  const muell = rein(s, Z.mio, 0.4);
  const braende = rein(s, Z.braende, 0.4);
  return (
    <Grund16 ton={temp > 20 ? "rot" : "kalt"}>
      {/* Querschnitt Gefrierschrank: Heizdraht unter dem Eis */}
      <div style={{ position: "absolute", left: 230, top: 150, width: 560, height: 640, borderRadius: 30, background: "linear-gradient(160deg, #e9edf3 0%, #b9c0cc 100%)", boxShadow: "0 50px 100px rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: 18, background: "#0e1118", overflow: "hidden" }}>
          {/* Eis */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150 * (1 - heiz * 0.9), background: "linear-gradient(180deg, #dff3ff 0%, #9fd6ff 100%)", opacity: 0.85 }} />
          {heiz > 0.3
            ? new Array(8).fill(0).map((_, i) => {
                const ph = ((s - Z.heiz) * 0.8 + i / 8) % 1;
                return <Droplet key={i} size={30} color="#9fd6ff" style={{ position: "absolute", left: 40 + i * 58, top: 130 + ph * 400, opacity: 1 - ph }} />;
              })
            : null}
          {/* Heizdraht */}
          <svg width={500} height={60} style={{ position: "absolute", left: 0, top: 160 }}>
            <path d="M20 30 Q45 0 70 30 T120 30 T170 30 T220 30 T270 30 T320 30 T370 30 T420 30 T470 30" fill="none" stroke={heiz > 0 ? "#ff6a2a" : "#555"} strokeWidth={10} style={{ filter: heiz > 0 ? `drop-shadow(0 0 ${14 * heiz}px #ff6a2a)` : undefined }} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, opacity: heiz }}><Label farbe="#ff8a4a">HEIZELEMENT</Label></div>
        </div>
      </div>
      {/* Uhr: ein paar Minuten … die ganze Nacht */}
      <div style={{ position: "absolute", left: 1000, top: 170, display: "flex", alignItems: "center", gap: 40, opacity: rein(s, Z.minuten - 0.2, 0.4) }}>
        <div style={{ position: "relative", width: 230, height: 230, borderRadius: 115, border: `8px solid ${nacht ? NOIR_ROT : "#e9e4da"}`, background: "#0d0e12" }}>
          <div style={{ position: "absolute", left: 111, top: 30, width: 8, height: 85, background: nacht ? NOIR_ROT : "#e9e4da", borderRadius: 4, transformOrigin: "50% 100%", transform: `rotate(${uhr}deg)` }} />
          <div style={{ position: "absolute", left: 111, top: 65, width: 8, height: 50, background: "#e9e4da", borderRadius: 4, transformOrigin: "50% 100%", transform: `rotate(${uhr / 12}deg)` }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, fontWeight: 800, color: nacht ? "rgba(255,255,255,0.35)" : "#f5f5f5", textDecoration: nacht ? "line-through" : "none" }}><Timer size={44} /> ein paar Minuten</div>
          {nacht ? <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 52, fontWeight: 800, color: NOIR_ROT, marginTop: 14, transform: `scale(${Math.min(1.08, schwung(s, Z.nacht))})`, transformOrigin: "0 50%" }}><Moon size={52} /> die ganze Nacht</div> : null}
        </div>
      </div>
      {/* Ergebnis: 50 Grad, Millionen im Müll, Brände */}
      {s >= Z.k50b - 0.6 ? (
        <div style={{ position: "absolute", left: 960, top: 480, width: 900, height: 320 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 300, textAlign: "center" }}>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, color: NOIR_ROT, lineHeight: 1, textShadow: `0 0 40px ${NOIR_ROT}88` }}>{Math.round(temp)}°C</div>
            <Label>IM KÜHLREGAL</Label>
          </div>
          <Plopp s={s} ab={Z.mio} x={480} y={110}>
            <div style={{ textAlign: "center", opacity: muell }}>
              <IconKugel farbe={NOIR_ORANGE} groesse={150}><Trash2 size={70} /></IconKugel>
              <div style={{ marginTop: 12 }}><Label groesse={24}>ZWEISTELLIGE<br />MILLIONEN €</Label></div>
            </div>
          </Plopp>
          <Plopp s={s} ab={Z.braende} x={760} y={110}>
            <div style={{ textAlign: "center", opacity: braende }}>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 130, color: NOIR_ORANGE, lineHeight: 1.1 }}>~20</div>
              <Label>BRÄNDE</Label>
            </div>
          </Plopp>
        </div>
      ) : null}
    </Grund16>
  );
};

/* ───────── D. Kapitel 2: die zweite Welle (Flaggen, Karte Deutschland) ───────── */
const LAENDER: { F: typeof DE; name: string; key: keyof typeof Z }[] = [
  { F: BE, name: "Belgien", key: "belgien" },
  { F: SE, name: "Schweden", key: "schweden" },
  { F: IE, name: "Irland", key: "irland" },
  { F: LU, name: "Luxemburg", key: "lux" },
  { F: EE, name: "Estland", key: "estland" },
  { F: NL, name: "Niederlande", key: "nl" },
  { F: DE, name: "Deutschland", key: "de2" },
];

export const ZweiteWelle: React.FC<{ s: number }> = ({ s }) => (
  <Grund16>
    <KapitelTitel s={s} ab={Z.ernst} nr="2" text="DIE ZWEITE WELLE" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: rein(s, Z.ernst + 0.3, 0.4) }}>
      <div style={{ fontFamily: TEXT_SCHRIFT, fontWeight: 800, fontSize: 44, color: NOIR_ORANGE, letterSpacing: 2 }}>Nacht zum 3. November</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 34 }}>
      {LAENDER.map(({ F, name, key }) => {
        const ab = Z[key] as number;
        const k = Math.min(1.1, schwung(s, ab));
        const istDE = name === "Deutschland";
        return (
          <div key={name} style={{ textAlign: "center", opacity: s >= ab ? 1 : 0, transform: `scale(${k * (istDE ? 1.25 : 1)})` }}>
            <F style={{ width: 170, borderRadius: 10, boxShadow: istDE ? `0 0 40px ${NOIR_ORANGE}` : "0 20px 40px rgba(0,0,0,0.6)" }} />
            <div style={{ marginTop: 14, fontWeight: 800, fontSize: 28, color: istDE ? NOIR_ORANGE : "#e9e4da" }}>{name}</div>
          </div>
        );
      })}
    </div>
  </Grund16>
);

type Ort = { name: string; lon: number; lat: number; key: keyof typeof Z; info?: string };
const ORTE: Ort[] = [
  { name: "Reisbach", lon: 12.63, lat: 48.57, key: "reisbach", info: "bis 50 °C" },
  { name: "Lilienthal", lon: 8.91, lat: 53.14, key: "lilienthal", info: "> 360.000 € Ware" },
  { name: "Wuppertal", lon: 7.15, lat: 51.26, key: "wuppertal" },
  { name: "Wetter", lon: 7.39, lat: 51.39, key: "wuppertal" },
  { name: "Münsterland", lon: 6.84, lat: 51.77, key: "wuppertal" },
  { name: "Westpfalz", lon: 7.77, lat: 49.44, key: "wuppertal" },
];

export const DeutschlandKarte: React.FC<{ s: number; umrisse: [number, number][][] | null }> = ({ s, umrisse }) => {
  // einfache Projektion: Längengrad gestaucht mit cos(51°)
  const proj = (lon: number, lat: number): [number, number] => [560 + (lon - 10.4) * 0.63 * 92, 470 - (lat - 51.2) * 92];
  const pfade = (umrisse ?? []).map((ring) => "M" + ring.map(([lo, la]) => proj(lo, la).map((v) => v.toFixed(1)).join(",")).join(" L") + " Z");
  return (
    <Grund16>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {pfade.map((d, i) => (
          <path key={i} d={d} fill="#161922" stroke="#4a5060" strokeWidth={3} />
        ))}
        {ORTE.map((o, i) => {
          const ab = (Z[o.key] as number) + (o.key === "wuppertal" ? i * 0.25 - 0.5 : 0);
          const k = Math.min(1.15, schwung(s, ab));
          if (s < ab) return null;
          const [x, y] = proj(o.lon, o.lat);
          const puls = 0.5 + 0.5 * Math.sin((s - ab) * 5);
          return (
            <g key={o.name} transform={`translate(${x} ${y}) scale(${k})`}>
              <circle r={26 + 14 * puls} fill={NOIR_ROT} opacity={0.18} />
              <circle r={14} fill={NOIR_ROT} stroke="#fff" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {/* Infokarten rechts für die zwei großen Fälle */}
      {ORTE.filter((o) => o.info).map((o, i) => (
        <Plopp key={o.name} s={s} ab={(Z[o.key] as number) + 0.2} x={1400} y={300 + i * 260}>
          <div style={{ width: 640, padding: "26px 34px", borderRadius: 24, background: "#121520", border: `3px solid ${NOIR_ROT}`, boxShadow: `0 0 30px ${NOIR_ROT}55` }}>
            <div style={{ fontWeight: 800, fontSize: 46 }}>{o.name}</div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, color: NOIR_ROT, lineHeight: 1.1 }}>{o.info}</div>
          </div>
        </Plopp>
      ))}
      <div style={{ position: "absolute", left: 1080, top: 840, opacity: rein(s, Z.wuppertal, 0.4) }}><Label>WEITERE MELDUNGEN: WUPPERTAL · WETTER · MÜNSTERLAND · WESTPFALZ</Label></div>
    </Grund16>
  );
};

/* ───────── D3. Blutbank: 110 Grad, rechtzeitig entdeckt ───────── */
export const Blutbank: React.FC<{ s: number }> = ({ s }) => {
  const ziel = interpolate(s, [Z.k110 - 0.3, Z.k110 + 0.8], [4, 110], { ...klemm, easing: SANFT });
  const gestoppt = s > Z.k110 + 1.6;
  return (
    <Grund16 ton="rot">
      <div style={{ position: "absolute", left: 360, top: 160, transform: `translateX(${ruck(s, Z.k110, 10)}px)` }}>
        {/* Blutbeutel */}
        <svg width={360} height={520} viewBox="0 0 360 520">
          <rect x={60} y={60} width={240} height={360} rx={50} fill="#5a0d12" stroke="#e9e4da" strokeWidth={8} />
          <rect x={60} y={60 + 360 * 0.3} width={240} height={360 * 0.7} rx={50} fill="#b3121d" />
          <rect x={160} y={10} width={40} height={60} rx={10} fill="#e9e4da" />
          <path d="M180 420 L180 510" stroke="#e9e4da" strokeWidth={10} />
        </svg>
        <div style={{ marginTop: -10 }}><Label>BLUTBANK · FRANKREICH</Label></div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 220, opacity: rein(s, Z.blutbank, 0.4) }}>
        <Label>ZIELTEMPERATUR DER TÄTER</Label>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 260, lineHeight: 1, color: NOIR_ROT, textShadow: `0 0 60px ${NOIR_ROT}88` }}>{Math.round(ziel)}°C</div>
      </div>
      <Plopp s={s} ab={Z.k110 + 1.6} x={1180} y={680}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 30px", borderRadius: 20, background: "#0d1a12", border: `3px solid ${GRUEN}`, opacity: gestoppt ? 1 : 0 }}>
          <ShieldCheck size={56} color={GRUEN} />
          <div style={{ fontWeight: 800, fontSize: 40, color: GRUEN }}>rechtzeitig entdeckt</div>
        </div>
      </Plopp>
    </Grund16>
  );
};

export const BelegDeutschland: React.FC<{ s: number }> = ({ s }) => (
  <Beleg16 s={s} ab={Z.bsi - 0.3} bild={`${V}/beleg-deutschland.png`} quelle="Telepolis, 04.11.2026" kamera={[[Z.bsi - 0.3, 960, 540, 1.0], [Z.bsi + 0.4, 960, 500, 1.0], [Z.reisbach, 960, 500, 1.0]]} marken={[{ ab: Z.bsi + 0.3, box: [20, 435, 1800, 505] }]} />
);

export const BelegGeheimdienste: React.FC<{ s: number }> = ({ s }) => (
  <Beleg16 s={s} ab={Z.verfassung - 0.4} bild={`${V}/beleg-geheimdienste.png`} quelle="heise online, 07.11.2026" kamera={[[Z.verfassung - 0.4, 960, 540, 1.0], [Z.verfassung + 0.3, 880, 540, 1.08], [Z.wie, 880, 545, 1.08]]} marken={[{ ab: Z.verfassung, box: [20, 425, 1720, 590] }, { ab: Z.hybrid, box: [20, 615, 1700, 720] }]} />
);

