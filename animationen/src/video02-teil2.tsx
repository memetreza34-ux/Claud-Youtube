import React from "react";
import { Banknote, BookOpen, Bug, Camera, Check, Cpu, Database, Download, Eye, Flame, Globe, Heater, Languages, Lock, LockOpen, Mail, Megaphone, Newspaper, Plug, Radar, Router, Search, ShieldAlert, ShieldCheck, ShieldOff, SolarPanel, Store, Target, Timer, Trash2, Truck, Waves, Wrench } from "lucide-react";
import { DE, EU, FR, IR } from "country-flag-icons/react/3x2";
import { AbsoluteFill, interpolate, random } from "remotion";
import { EXPO, klemm, lauf, NOIR_ORANGE, NOIR_ROT, rein, SANFT, schwung } from "./noir-buehne";
import { ZAHLEN_SCHRIFT } from "./stil";
import { BLAU, Beleg16, GRUEN, Grund16, H, IconKugel, KapitelTitel, Label, Plopp, RollZahl, ruck, Streich, W } from "./video02-bausteine";
import { Kuehltruhe } from "./video02-teil1";
import { Z } from "./video02-zeiten";

const V = "video-02";

/* ───────── E. Wie hackt man eine Kühltruhe? Steuerung → Internet → Login ───────── */
export const Steuerung: React.FC<{ s: number }> = ({ s }) => {
  const box = rein(s, Z.steuerung - 0.2, 0.4);
  const netz = interpolate(s, [Z.internet, Z.internet + 0.6], [0, 1], { ...klemm, easing: EXPO });
  const login = Math.min(1.08, schwung(s, Z.web));
  const tippen = interpolate(s, [Z.web + 0.4, Z.passwort + 0.3], [0, 1], klemm);
  const drin = s >= Z.fertig;
  const truhen = [0, 1, 2, 3];
  return (
    <Grund16>
      <KapitelTitel s={s} ab={Z.peinlich - 0.6} nr="3" text="WIE HACKT MAN EINE KÜHLTRUHE?" />
      {/* vier Kühlregale links */}
      {truhen.map((i) => (
        <div key={i} style={{ position: "absolute", left: 120, top: 210 + i * 150, width: 260, height: 120, borderRadius: 16, background: "linear-gradient(160deg, #1d2230 0%, #0e1118 100%)", border: `3px solid ${drin ? NOIR_ROT : BLAU}`, boxShadow: `0 0 24px ${drin ? NOIR_ROT : BLAU}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ZAHLEN_SCHRIFT, fontSize: 60, color: drin ? NOIR_ROT : BLAU, opacity: rein(s, Z.peinlich + i * 0.1, 0.3) }}>
          {drin ? "+8°C" : "−18°C"}
        </div>
      ))}
      {/* Leitungen zur Steuerung */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {truhen.map((i) => (
          <path key={i} d={`M380 ${270 + i * 150} C 520 ${270 + i * 150}, 560 470, 700 470`} fill="none" stroke={drin ? NOIR_ROT : "#4a5060"} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-s * 40} opacity={box} />
        ))}
        <path d="M1060 470 C 1200 470, 1250 470, 1390 470" fill="none" stroke={NOIR_ORANGE} strokeWidth={6} strokeDasharray={`${300 * netz} 400`} opacity={netz} />
      </svg>
      {/* Steuerungsbox = kleiner Computer */}
      <div style={{ position: "absolute", left: 700, top: 330, width: 360, height: 280, borderRadius: 24, background: "linear-gradient(160deg, #3a3d47 0%, #15171e 100%)", border: "4px solid #565b68", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", opacity: box, transform: `scale(${0.9 + 0.1 * box})` }}>
        <div style={{ position: "absolute", left: 30, top: 30, right: 30, height: 140, borderRadius: 12, background: "#0a1420", border: `2px solid ${BLAU}66`, padding: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 14, marginBottom: 12, borderRadius: 7, width: `${50 + random(`b${i}`) * 45}%`, background: drin ? NOIR_ROT : BLAU, opacity: 0.6 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 30, bottom: 30, display: "flex", gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: Math.sin(s * 6 + i) > 0 ? "#2fd27a" : "#124a2a" }} />
          ))}
        </div>
        <Cpu size={60} color="#9aa0ad" style={{ position: "absolute", right: 30, bottom: 20 }} />
      </div>
      <div style={{ position: "absolute", left: 700, width: 360, top: 630, opacity: rein(s, Z.computer, 0.4) }}><Label>STEUERUNG = KLEINER COMPUTER</Label></div>
      {/* Internet */}
      <Plopp s={s} ab={Z.internet + 0.4} x={1500} y={470}>
        <IconKugel farbe={NOIR_ORANGE} groesse={200}><Globe size={110} /></IconKugel>
      </Plopp>
      {/* Login-Fenster */}
      {s >= Z.web ? (
        <div style={{ position: "absolute", left: 1290, top: 590, width: 520, padding: 30, borderRadius: 22, background: "#f4f5f7", color: "#111", transform: `scale(${login})`, transformOrigin: "50% 0%", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}>
          <div style={{ fontWeight: 800, fontSize: 30, marginBottom: 18 }}>Kühlanlage · Anmeldung</div>
          <div style={{ height: 58, borderRadius: 10, border: "2px solid #c5cad3", padding: "0 18px", display: "flex", alignItems: "center", fontSize: 30, marginBottom: 14 }}>{"admin".slice(0, Math.round(tippen * 10))}</div>
          <div style={{ height: 58, borderRadius: 10, border: "2px solid #c5cad3", padding: "0 18px", display: "flex", alignItems: "center", fontSize: 30, letterSpacing: 6 }}>{"•••••".slice(0, Math.max(0, Math.round(tippen * 10) - 5))}</div>
          <div style={{ marginTop: 18, height: 58, borderRadius: 10, background: drin ? GRUEN : "#1a73c8", color: "#fff", fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {drin ? <><Check size={34} /> Verbunden</> : "Anmelden"}
          </div>
        </div>
      ) : null}
    </Grund16>
  );
};

export const BelegDanfoss: React.FC<{ s: number }> = ({ s }) => (
  <Beleg16 s={s} ab={Z.danfoss - 0.3} bild={`${V}/beleg-danfoss-alt.png`} quelle="SecurityWeek, 03.11.2026" kamera={[[Z.danfoss - 0.3, 960, 540, 1.0], [Z.copeland, 960, 520, 1.05], [Z.alt - 0.4, 820, 500, 1.3], [Z.tueren, 820, 502, 1.33]]} marken={[{ ab: Z.alt - 0.2, box: [195, 482, 1440, 518] }]} />
);

/* ───────── F. Drei offene Türen ───────── */
const Tuer: React.FC<{ nr: number; offen: number; aktiv: boolean; farbe?: string }> = ({ nr, offen, aktiv, farbe = NOIR_ORANGE }) => (
  <div style={{ position: "relative", width: 240, height: 400, perspective: 900 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: `linear-gradient(180deg, ${farbe}aa, ${farbe}22)`, boxShadow: `0 0 ${60 * offen}px ${farbe}` }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(160deg, #3a3d47 0%, #15171e 100%)", border: `4px solid ${aktiv ? farbe : "#565b68"}`, transformOrigin: "0% 50%", transform: `rotateY(${-55 * offen}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 140, color: aktiv ? farbe : "#6a6f7c" }}>{nr}</div>
      <div style={{ position: "absolute", right: 24, top: 190, width: 18, height: 18, borderRadius: 9, background: "#9aa0ad" }} />
    </div>
  </div>
);

export const DreiTueren: React.FC<{ s: number }> = ({ s }) => {
  // Überblick: drei Türen, dann zoomt die Kamera zur jeweiligen Tür
  const fokus = s < Z.tuer1 ? -1 : s < Z.tuer2 ? 0 : s < Z.tuer3 ? 1 : 2;
  const zoomK = s < Z.tuer1 ? 0 : rein(s, [Z.tuer1, Z.tuer2, Z.tuer3][fokus] - 0.2, 0.5);
  const tuerX = (i: number) => 560 + i * 400;
  const camX = fokus < 0 ? 960 : tuerX(fokus);
  return (
    <Grund16>
      <KapitelTitel s={s} ab={Z.tueren - 0.3} nr="4" text="DREI OFFENE TÜREN" />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: fokus < 0 ? undefined : `translateX(${(-(camX - 300) + 0) * zoomK}px) scale(${1 - 0.25 * zoomK})` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: tuerX(i) - 120, top: 230, opacity: rein(s, Z.tueren + i * 0.15, 0.3) }}>
            <Tuer nr={i + 1} offen={interpolate(s, [Z.tueren + 0.3 + i * 0.15, Z.tueren + 0.9 + i * 0.15], [0, 0.6], klemm) + (fokus === i ? 0.4 * zoomK : 0)} aktiv={fokus === i || fokus < 0} />
          </div>
        ))}
      </div>
      {fokus === 0 ? <TuerEins s={s} /> : null}
      {fokus === 1 ? <TuerZwei s={s} /> : null}
      {fokus === 2 ? <TuerDrei s={s} /> : null}
    </Grund16>
  );
};

const Panel: React.FC<{ s: number; ab: number; children: React.ReactNode }> = ({ s, ab, children }) => {
  const k = rein(s, ab, 0.45);
  return <div style={{ position: "absolute", left: 760, top: 110, width: 1080, height: 720, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>{children}</div>;
};

const TuerEins: React.FC<{ s: number }> = ({ s }) => {
  const versuche: React.ReactNode[] = [];
  if (s > Z.okt20) {
    for (let i = 0; i < 26; i++) {
      const t0 = Z.okt20 + i * 0.12;
      const k = interpolate(s, [t0, t0 + 0.5], [0, 1], { ...klemm, easing: EXPO });
      if (k <= 0) continue;
      const a = random(`w${i}`) * Math.PI * 2;
      const r = 330 * (1 - k) + 70;
      versuche.push(<circle key={i} cx={760 + Math.cos(a) * r} cy={470 + Math.sin(a) * r} r={9} fill={NOIR_ROT} opacity={k < 1 ? 1 : 0.3} />);
    }
  }
  return (
    <Panel s={s} ab={Z.tuer1}>
      <div style={{ position: "absolute", left: 40, top: 10 }}><Label farbe={NOIR_ORANGE} groesse={34}>WERKSPASSWÖRTER</Label></div>
      {/* Handbuch */}
      <Plopp s={s} ab={Z.handbuch - 0.2} x={210} y={300}>
        <div style={{ width: 330, height: 410, borderRadius: 16, background: "#e9e4da", color: "#111", padding: 30, boxShadow: "0 30px 60px rgba(0,0,0,0.7)", transform: "rotate(-4deg)" }}>
          <BookOpen size={50} />
          <div style={{ fontWeight: 800, fontSize: 30, marginTop: 10 }}>Handbuch</div>
          {[0, 1, 2].map((i) => <div key={i} style={{ height: 12, borderRadius: 6, background: "#b9b3a6", width: `${60 + i * 12}%`, marginTop: 16 }} />)}
          <div style={{ marginTop: 22, padding: "10px 14px", borderRadius: 8, background: s > Z.handbuch + 0.3 ? "#ffe14d" : "transparent", fontFamily: "monospace", fontSize: 28, fontWeight: 700 }}>Passwort: ●●●●●</div>
        </div>
      </Plopp>
      {/* Köder-Gerät */}
      <svg width={1080} height={720} style={{ position: "absolute", inset: 0 }}>{versuche}</svg>
      <Plopp s={s} ab={Z.koeder} x={760} y={470}>
        <div style={{ textAlign: "center" }}>
          <IconKugel farbe={GRUEN} groesse={170}><Target size={90} /></IconKugel>
          <div style={{ marginTop: 10 }}><Label farbe={GRUEN}>KÖDER-GERÄT</Label></div>
        </div>
      </Plopp>
      <Plopp s={s} ab={Z.okt20} x={760} y={140}>
        <div style={{ padding: "10px 26px", borderRadius: 14, background: "#16080a", border: `3px solid ${NOIR_ROT}`, fontWeight: 800, fontSize: 36, color: NOIR_ROT }}>Login-Versuche ab 20. Oktober</div>
      </Plopp>
    </Panel>
  );
};

const TuerZwei: React.FC<{ s: number }> = ({ s }) => {
  const kaefer = interpolate(s, [Z.tuer2 + 0.4, Z.k2025 + 0.4], [0, 1], { ...klemm, easing: SANFT });
  const upd = rein(s, Z.updates, 0.4);
  const fragezeichen = Math.min(1.1, schwung(s, Z.nichtbest - 0.3));
  return (
    <Panel s={s} ab={Z.tuer2}>
      <div style={{ position: "absolute", left: 40, top: 10 }}><Label farbe={NOIR_ORANGE} groesse={34}>BEKANNTE SICHERHEITSLÜCKEN</Label></div>
      {/* Schloss, unter dem ein Käfer durchkrabbelt */}
      <div style={{ position: "absolute", left: 300, top: 180 }}>
        <IconKugel farbe={s > Z.k2025 ? NOIR_ROT : "#9aa0ad"} groesse={260}>{s > Z.k2025 ? <LockOpen size={130} /> : <Lock size={130} />}</IconKugel>
      </div>
      <Bug size={90} color={NOIR_ROT} style={{ position: "absolute", left: 120 + kaefer * 520, top: 480 - Math.sin(kaefer * Math.PI) * 120, transform: `rotate(${kaefer * 30}deg)`, filter: `drop-shadow(0 0 14px ${NOIR_ROT})`, opacity: s > Z.tuer2 + 0.3 ? 1 : 0 }} />
      <Plopp s={s} ab={Z.k2025} x={430} y={110}>
        <div style={{ fontWeight: 800, fontSize: 40, padding: "8px 24px", borderRadius: 12, background: "#16080a", border: `3px solid ${NOIR_ROT}`, color: NOIR_ROT }}>Lücken seit 2025 bekannt</div>
      </Plopp>
      {/* Update da, aber nicht eingespielt */}
      <div style={{ position: "absolute", left: 720, top: 230, opacity: upd }}>
        <IconKugel farbe={GRUEN} groesse={170}><Download size={80} /></IconKugel>
        <div style={{ marginTop: 12, width: 170 }}><Label farbe={GRUEN}>UPDATE</Label></div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 170, height: 170 }}><Streich s={s} ab={Z.offen - 0.4} breite={200} /></div>
      </div>
      {s > Z.nichtbest - 0.3 ? (
        <div style={{ position: "absolute", left: 640, top: 520, display: "flex", alignItems: "center", gap: 16, transform: `scale(${fragezeichen})`, transformOrigin: "0 50%" }}>
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, color: NOIR_ORANGE }}>?</div>
          <div style={{ fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.75)" }}>Ob genau diese Lücken<br />genutzt wurden: nicht bestätigt</div>
        </div>
      ) : null}
    </Panel>
  );
};

const TuerDrei: React.FC<{ s: number }> = ({ s }) => {
  const rot = rein(s, Z.viele, 0.6);
  const maerkte = new Array(10).fill(0).map((_, i) => {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    return { x: 540 + Math.cos(a) * 300, y: 400 + Math.sin(a) * 250 };
  });
  return (
    <Panel s={s} ab={Z.tuer3}>
      <div style={{ position: "absolute", left: 40, top: 10 }}><Label farbe={NOIR_ORANGE} groesse={34}>WARTUNGSFIRMEN</Label></div>
      <svg width={1080} height={720} style={{ position: "absolute", inset: 0 }}>
        {maerkte.map((m, i) => (
          <line key={i} x1={540} y1={400} x2={m.x} y2={m.y} stroke={rot > 0.2 ? NOIR_ROT : "#4a5060"} strokeWidth={4} strokeDasharray={rot > 0.2 ? "14 10" : undefined} strokeDashoffset={-s * 60} opacity={rein(s, Z.dienst, 0.4)} />
        ))}
      </svg>
      {maerkte.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: m.x - 45, top: m.y - 45, opacity: rein(s, Z.dienst + i * 0.05, 0.3) }}>
          <IconKugel farbe={rot > 0.2 + i * 0.05 ? NOIR_ROT : BLAU} groesse={90}><Store size={42} /></IconKugel>
        </div>
      ))}
      <div style={{ position: "absolute", left: 540 - 95, top: 400 - 95 }}>
        <IconKugel farbe={NOIR_ROT} groesse={190}><Truck size={70} /><Wrench size={44} style={{ position: "absolute", right: 30, bottom: 30 }} /></IconKugel>
      </div>
    </Panel>
  );
};

/* ───────── F5. Wie findet man die Geräte? Suchmaschinen, 12.976 Treffer ───────── */
export const Scan: React.FC<{ s: number }> = ({ s }) => {
  const strahl = (s - Z.such) * 120;
  const punkte: React.ReactNode[] = [];
  for (let i = 0; i < 360; i++) {
    const a = random(`sa${i}`) * Math.PI * 2;
    const r = 60 + random(`sr${i}`) * 380;
    const winkel = ((a * 180) / Math.PI + 360) % 360;
    const getroffen = s > Z.such && ((strahl % 360) + 360) % 360 > winkel - 3 && (s - Z.such) * 120 > winkel - 360 * Math.floor((s - Z.such) * 120 / 360);
    const an = s > Z.such + (winkel / 120) || getroffen;
    punkte.push(<circle key={i} cx={560 + Math.cos(a) * r} cy={460 + Math.sin(a) * r} r={5} fill={an ? NOIR_ROT : "#2a2c34"} opacity={an ? 0.9 : 0.6} />);
  }
  const frankreich = interpolate(s, [Z.k1800, Z.k1800 + 1], [0, 1], { ...klemm, easing: SANFT });
  return (
    <Grund16>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={560} cy={460} r={440} fill="none" stroke="#24262e" strokeWidth={3} />
        <circle cx={560} cy={460} r={290} fill="none" stroke="#24262e" strokeWidth={2} />
        {s > Z.such ? <path d={`M560 460 L${560 + Math.cos((strahl * Math.PI) / 180) * 440} ${460 + Math.sin((strahl * Math.PI) / 180) * 440}`} stroke={NOIR_ORANGE} strokeWidth={5} style={{ filter: `drop-shadow(0 0 12px ${NOIR_ORANGE})` }} /> : null}
        {punkte}
      </svg>
      <Plopp s={s} ab={Z.finden - 0.2} x={560} y={460}>
        <IconKugel farbe={NOIR_ORANGE} groesse={130}>{s > Z.such ? <Radar size={64} /> : <Search size={64} />}</IconKugel>
      </Plopp>
      <div style={{ position: "absolute", left: 1150, top: 170 }}>
        {s >= Z.k13000 - 0.2 ? (
          <>
            <RollZahl s={s} ab={Z.k13000 - 0.2} bis={12976} groesse={170} farbe={NOIR_ROT} />
            <Label>ERREICHBARE KÜHLSTEUERUNGEN</Label>
          </>
        ) : null}
        {s >= Z.k99 ? <div style={{ marginTop: 24, fontWeight: 800, fontSize: 48, opacity: rein(s, Z.k99, 0.3) }}>in 99 Ländern</div> : null}
        {s >= Z.k1800 - 0.3 ? (
          <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 20, opacity: rein(s, Z.k1800 - 0.3, 0.3) }}>
            <FR style={{ width: 90, borderRadius: 8 }} />
            <div>
              <div style={{ height: 40, width: 520 * frankreich, background: NOIR_ROT, borderRadius: 8 }} />
              <div style={{ marginTop: 8, fontWeight: 800, fontSize: 32 }}>1.825 offene Danfoss-Oberflächen</div>
            </div>
          </div>
        ) : null}
      </div>
    </Grund16>
  );
};

/* ───────── G. Updates helfen nicht ───────── */
export const UpdatesHelfenNicht: React.FC<{ s: number }> = ({ s }) => {
  const balken = interpolate(s, [Z.gut, Z.gut + 1.6], [0, 1], { ...klemm, easing: SANFT });
  const risse = Math.floor(interpolate(s, [Z.sechs, Z.sechs + 0.9], [0, 6], klemm));
  const rot = s >= Z.sechs;
  const stecker = interpolate(s, [Z.loesung + 0.3, Z.loesung + 1.0], [0, 1], { ...klemm, easing: EXPO });
  const RISS = ["M-60 -80 L-20 -30 L-50 10", "M50 -90 L20 -40 L60 -10", "M-80 20 L-30 40 L-60 90", "M70 30 L30 50 L60 100", "M-10 -110 L5 -60", "M0 60 L-15 120"];
  return (
    <Grund16 ton={rot ? "rot" : "kalt"}>
      <KapitelTitel s={s} ab={Z.gut - 0.8} nr="5" text="UPDATES REICHEN NICHT" />
      {/* Schild mit Update */}
      <div style={{ position: "absolute", left: 300, top: 210, width: 420, height: 480, transform: `translateX(${ruck(s, Z.sechs, 10)}px)` }}>
        <svg width={420} height={480} viewBox="-210 -240 420 480">
          <path d="M0 -200 L170 -140 L170 20 Q170 150 0 220 Q-170 150 -170 20 L-170 -140 Z" fill={rot ? "#3a0d12" : "#0d2a18"} stroke={rot ? NOIR_ROT : GRUEN} strokeWidth={10} style={{ filter: `drop-shadow(0 0 30px ${rot ? NOIR_ROT : GRUEN})` }} />
          {RISS.slice(0, risse).map((d, i) => <path key={i} d={d} stroke={NOIR_ROT} strokeWidth={8} fill="none" strokeLinecap="round" />)}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center" }}>
          {rot ? <ShieldAlert size={110} color={NOIR_ROT} /> : <ShieldCheck size={110} color={GRUEN} />}
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 730, width: 420 }}>
        <div style={{ height: 22, borderRadius: 11, background: "#24262e" }}><div style={{ height: 22, borderRadius: 11, width: `${balken * 100}%`, background: GRUEN }} /></div>
        <div style={{ marginTop: 10 }}><Label>{balken < 1 ? "UPDATE WIRD INSTALLIERT …" : "UPDATE 5.3.2 INSTALLIERT"}</Label></div>
      </div>
      {/* rechts: Midnight Blue, eine Stunde, sechs Lücken */}
      <div style={{ position: "absolute", left: 960, top: 180 }}>
        <Plopp s={s} ab={Z.midnight} x={220} y={60}>
          <div style={{ fontWeight: 800, fontSize: 42, padding: "10px 26px", borderRadius: 14, background: "#0f1420", border: `3px solid ${BLAU}`, whiteSpace: "nowrap" }}>Forscher: Midnight Blue</div>
        </Plopp>
        <Plopp s={s} ab={Z.stunde} x={150} y={250}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Timer size={70} color={NOIR_ORANGE} /><div style={{ fontWeight: 800, fontSize: 50, whiteSpace: "nowrap" }}>1 Stunde</div></div>
        </Plopp>
        {s >= Z.sechs - 0.1 ? (
          <div style={{ position: "absolute", left: 0, top: 330, width: 860, display: "flex", alignItems: "center", gap: 30 }}>
            <RollZahl s={s} ab={Z.sechs - 0.1} bis={6} dauer={0.8} groesse={230} farbe={NOIR_ROT} />
            <div style={{ fontWeight: 800, fontSize: 44, width: 520 }}>neue Lücken:<br />Übernahme ohne Anmeldung</div>
          </div>
        ) : null}
        {s >= Z.bsi2 ? (
          <div style={{ position: "absolute", left: 0, top: 640, width: 900, fontWeight: 800, fontSize: 38, color: NOIR_ORANGE, opacity: rein(s, Z.bsi2, 0.4) }}>BSI: auch das neueste Update ist keine Garantie</div>
        ) : null}
      </div>
      {/* Lösung: Stecker raus */}
      {s >= Z.loesung ? (
        <AbsoluteFill style={{ background: "rgba(5,5,6,0.85)", opacity: rein(s, Z.loesung, 0.3) }}>
          <div style={{ position: "absolute", left: 560, top: 360, display: "flex", alignItems: "center" }}>
            <IconKugel farbe="#9aa0ad" groesse={170}><Cpu size={80} /></IconKugel>
            <div style={{ width: 160 + stecker * 200, height: 8, background: "#9aa0ad" }} />
            <div style={{ transform: `translateX(${stecker * 0}px)` }}><Plug size={90} color={GRUEN} /></div>
            <div style={{ width: 160, height: 8, background: "#4a5060", marginLeft: 60 * stecker }} />
            <IconKugel farbe={stecker > 0.5 ? "#3a3c46" : NOIR_ORANGE} groesse={170} aus={stecker > 0.5}><Globe size={80} /></IconKugel>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontWeight: 800, fontSize: 48, color: GRUEN, opacity: rein(s, Z.loesung + 0.8, 0.4) }}>Nicht ans offene Internet hängen</div>
        </AbsoluteFill>
      ) : null}
    </Grund16>
  );
};

export const BelegUpdates: React.FC<{ s: number }> = ({ s }) => (
  <Beleg16 s={s} ab={Z.midnight - 0.3} bild={`${V}/beleg-updates.png`} quelle="heise online, 13.11.2026" kamera={[[Z.midnight - 0.3, 960, 540, 1.0], [Z.midnight + 0.3, 880, 540, 1.08], [Z.stunde, 880, 545, 1.08]]} marken={[{ ab: Z.midnight, box: [20, 425, 1720, 590] }]} />
);

/* ───────── H. Wer war das? ───────── */
export const KeinGeld: React.FC<{ s: number }> = ({ s }) => {
  const items = [
    { ab: Z.loesegeld, icon: <Banknote size={80} />, text: "Lösegeld" },
    { ab: Z.gestohlen, icon: <Database size={80} />, text: "Datenverkauf" },
    { ab: Z.brief, icon: <Mail size={80} />, text: "Erpresserbrief" },
  ];
  const schaden = Math.min(1.1, schwung(s, Z.schaden));
  return (
    <Grund16 ton={s > Z.schaden ? "rot" : "kalt"}>
      <KapitelTitel s={s} ab={Z.werwar - 0.4} nr="6" text="WER WAR DAS?" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 110, opacity: 1 - rein(s, Z.schaden, 0.4) * 0.7 }}>
        {items.map((it) => (
          <div key={it.text} style={{ textAlign: "center", opacity: s >= it.ab - 0.15 ? 1 : 0, transform: `scale(${Math.min(1, schwung(s, it.ab - 0.15))})` }}>
            <div style={{ position: "relative" }}>
              <IconKugel farbe={NOIR_ORANGE} groesse={200} aus={s > it.ab + 0.5}>{it.icon}</IconKugel>
              <Streich s={s} ab={it.ab + 0.4} breite={240} />
            </div>
            <div style={{ marginTop: 16, fontWeight: 800, fontSize: 36 }}>{it.text}</div>
          </div>
        ))}
      </div>
      {s >= Z.schaden ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, transform: `scale(${schaden})` }}>
          <Flame size={110} color={NOIR_ROT} />
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 150, color: NOIR_ROT, textShadow: `0 0 50px ${NOIR_ROT}88` }}>ZIEL: SCHADEN</div>
        </div>
      ) : null}
    </Grund16>
  );
};

export const Spur: React.FC<{ s: number }> = ({ s }) => {
  const karte = rein(s, Z.iran, 0.5);
  return (
    <Grund16 ton="warm">
      {/* Spur von Frankreich in den Iran */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M420 420 C 800 200, 1150 250, 1480 460" fill="none" stroke={NOIR_ROT} strokeWidth={6} strokeDasharray="16 14" strokeDashoffset={-s * 50} opacity={karte} pathLength={1} />
      </svg>
      <div style={{ position: "absolute", left: 300, top: 330, opacity: rein(s, Z.neunter, 0.4) }}>
        <FR style={{ width: 240, borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.7)" }} />
        <div style={{ marginTop: 14, fontWeight: 800, fontSize: 32 }}>Frankreich · 9. November</div>
      </div>
      <Plopp s={s} ab={Z.iran} x={1480} y={420}>
        <IR style={{ width: 240, borderRadius: 12, boxShadow: `0 0 40px ${NOIR_ROT}` }} />
      </Plopp>
      <Plopp s={s} ab={Z.kaveh - 0.1} x={1480} y={640}>
        <div style={{ textAlign: "center", padding: "20px 36px", borderRadius: 20, background: "#16080a", border: `3px solid ${NOIR_ROT}` }}>
          <div style={{ fontWeight: 800, fontSize: 52 }}>Shahid Kaveh</div>
          <div style={{ fontWeight: 700, fontSize: 28, color: "rgba(255,255,255,0.6)" }}>Cyber-Einheit der Revolutionsgarde</div>
        </div>
      </Plopp>
      <Plopp s={s} ab={Z.tarn} x={960} y={170}>
        <div style={{ padding: "12px 30px", borderRadius: 14, background: "#121520", border: "3px dashed #9aa0ad", fontWeight: 800, fontSize: 36 }}>Tarnname: „CyberAv3ngers“</div>
      </Plopp>
    </Grund16>
  );
};

export const Belege: React.FC<{ s: number }> = ({ s }) => {
  const karten = [
    { ab: Z.wasser, icon: <Waves size={70} />, titel: "Gleiche Server", text: "spähten auch Wasserkraftwerke aus" },
    { ab: Z.tool, icon: <Search size={70} />, titel: "Typisches Werkzeug", text: "Scan-Programm der Gruppe" },
    { ab: Z.propaganda, icon: <Megaphone size={70} />, titel: "Propagandakanal", text: "meldete den Angriff am 13. Oktober" },
    { ab: Z.persisch, icon: <Languages size={70} />, titel: "Spuren auf Persisch", text: "und Adressen im Iran" },
  ];
  return (
    <Grund16 ton="warm">
      <div style={{ position: "absolute", left: 90, top: 70, opacity: rein(s, Z.belege, 0.3) }}><Label farbe={NOIR_ORANGE} groesse={34}>DIE BELEGE LAUT FRANKREICH</Label></div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 190, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50 }}>
        {karten.map((k, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, padding: "56px 40px", borderRadius: 28, background: "#121520", border: `3px solid ${s > k.ab ? NOIR_ORANGE : "#2a2c34"}`, opacity: s >= k.ab - 0.15 ? 1 : 0.15, transform: `scale(${s >= k.ab - 0.15 ? Math.min(1, schwung(s, k.ab - 0.15)) : 0.95}) rotate(${(i % 2 ? 1 : -1) * 1.2}deg)` }}>
            <IconKugel farbe={NOIR_ORANGE} groesse={130}>{k.icon}</IconKugel>
            <div>
              <div style={{ fontWeight: 800, fontSize: 48 }}>{k.titel}</div>
              <div style={{ fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.75)", marginTop: 8 }}>{k.text}</div>
            </div>
            {i === 3 && s > Z.ipiran ? <IR style={{ width: 110, borderRadius: 8, marginLeft: "auto" }} /> : null}
          </div>
        ))}
      </div>
    </Grund16>
  );
};

export const BelegIran: React.FC<{ s: number }> = ({ s }) => (
  <Beleg16 s={s} ab={Z.erste - 0.3} bild={`${V}/beleg-iran.png`} quelle="The Hacker News, 10.11.2026" kamera={[[Z.erste - 0.3, 960, 540, 1.0], [Z.erste + 0.4, 700, 560, 1.4], [Z.haft, 700, 600, 1.45]]} marken={[{ ab: Z.erste + 0.2, box: [200, 535, 1170, 565] }]} />
);

export const ZweiWellen: React.FC<{ s: number }> = ({ s }) => {
  const zweite = rein(s, Z.dritter, 0.4);
  const frage = Math.min(1.15, schwung(s, Z.geklaert - 0.3));
  return (
    <Grund16>
      <div style={{ position: "absolute", left: 200, right: 200, top: 470, height: 8, background: "#2a2c34", borderRadius: 4 }} />
      {/* Welle 1 */}
      <div style={{ position: "absolute", left: 300, top: 240, textAlign: "center", opacity: rein(s, Z.wichtig, 0.3) }}>
        <div style={{ fontWeight: 800, fontSize: 40 }}>Welle 1 · Oktober</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "26px 0" }}><FR style={{ width: 120, borderRadius: 8 }} /></div>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: NOIR_ROT, margin: "0 auto" }} />
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <IR style={{ width: 90, borderRadius: 6 }} />
          <div style={{ fontWeight: 800, fontSize: 32, color: NOIR_ORANGE }}>laut Frankreich: Iran</div>
        </div>
      </div>
      {/* Welle 2 */}
      <div style={{ position: "absolute", left: 1130, top: 240, textAlign: "center", opacity: zweite }}>
        <div style={{ fontWeight: 800, fontSize: 40 }}>Welle 2 · 3. November</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "26px 0" }}><EU style={{ width: 120, borderRadius: 8 }} /><DE style={{ width: 120, borderRadius: 8 }} /></div>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: NOIR_ROT, margin: "0 auto" }} />
        {s >= Z.geklaert - 0.3 ? <div style={{ marginTop: 10, fontFamily: ZAHLEN_SCHRIFT, fontSize: 200, color: NOIR_ORANGE, lineHeight: 1, transform: `scale(${frage})` }}>?</div> : null}
      </div>
    </Grund16>
  );
};

/* ───────── I. Warum ausgerechnet Kühlregale? ───────── */
export const WarumKuehl: React.FC<{ s: number }> = ({ s }) => {
  const punkte = [
    { ab: Z.schlecht, icon: <LockOpen size={60} />, text: "schlecht geschützt" },
    { ab: Z.kritis, icon: <ShieldOff size={60} />, text: "keine kritische Infrastruktur" },
    { ab: Z.sichtbar, icon: <Eye size={60} />, text: "Schaden für jeden sichtbar" },
  ];
  const vergleich = s >= Z.datenleck - 0.3;
  return (
    <Grund16 ton={vergleich ? "rot" : "kalt"}>
      <KapitelTitel s={s} ab={Z.warumkuehl - 0.4} nr="7" text="WARUM KÜHLREGALE?" />
      {!vergleich ? (
        <>
          <Kuehltruhe s={s} x={560} y={560} temp={-18} skala={0.85} />
          <div style={{ position: "absolute", left: 1000, top: 250 }}>
            {punkte.map((p) => (
              <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 46, opacity: s >= p.ab - 0.15 ? 1 : 0, transform: `translateX(${(1 - rein(s, p.ab - 0.15, 0.4)) * 60}px)` }}>
                <IconKugel farbe={NOIR_ROT} groesse={120}>{p.icon}</IconKugel>
                <div style={{ fontWeight: 800, fontSize: 46 }}>{p.text}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 260, top: 300, textAlign: "center", opacity: 0.5, transform: "scale(0.8)" }}>
            <IconKugel farbe="#9aa0ad" groesse={220}><Newspaper size={110} /></IconKugel>
            <div style={{ marginTop: 16 }}><Label>DATENLECK: NUR IN DER ZEITUNG</Label></div>
          </div>
          <div style={{ position: "absolute", left: 850, top: 160 }}>
            {/* leeres Regal */}
            <div style={{ width: 820, height: 520, borderRadius: 20, background: "#101116", border: `4px solid ${NOIR_ROT}`, boxShadow: `0 0 60px ${NOIR_ROT}55`, padding: 30 }}>
              {[0, 1, 2].map((r) => (
                <div key={r} style={{ height: 140, borderBottom: "8px solid #3a3c46", position: "relative" }}>
                  {r === 1 ? <Trash2 size={70} color={NOIR_ROT} style={{ position: "absolute", left: 360, top: 40 }} /> : null}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}><Label farbe={NOIR_ROT}>LEERE REGALE: SIEHT JEDER</Label></div>
          </div>
        </>
      )}
    </Grund16>
  );
};

export const EuZitat: React.FC<{ s: number }> = ({ s }) => (
  <Grund16>
    <div style={{ position: "absolute", left: 240, right: 240, top: 210, padding: "50px 70px", borderRadius: 30, background: "#0f1420", border: "3px solid #2c3a66", opacity: rein(s, Z.eu - 0.2, 0.4), transform: `scale(${0.96 + 0.04 * rein(s, Z.eu - 0.2, 0.6)})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
        <EU style={{ width: 110, borderRadius: 8 }} />
        <div style={{ fontWeight: 800, fontSize: 34, color: "rgba(255,255,255,0.7)" }}>EU-Agrarkommissar Christophe Hansen</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.25 }}>
        Ein gezielter Versuch, die <span style={{ color: NOIR_ORANGE }}>Lebensmittelkette</span> zu stören und das <span style={{ color: NOIR_ORANGE }}>Vertrauen</span> der Verbraucher zu erschüttern.
      </div>
      <div style={{ marginTop: 24, fontSize: 24, color: "rgba(255,255,255,0.45)" }}>sinngemäß übersetzt · Quelle: SecurityWeek, 03.11.2026</div>
    </div>
  </Grund16>
);

export const Nadelstiche: React.FC<{ s: number }> = ({ s }) => {
  const ziele = [
    { icon: <Store size={60} />, text: "Supermarkt" },
    { icon: <Waves size={60} />, text: "Wasser" },
    { icon: <Heater size={60} />, text: "Energie" },
    { icon: <Truck size={60} />, text: "Logistik" },
  ];
  return (
    <Grund16 ton="rot">
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 90 }}>
        {ziele.map((z, i) => {
          const ab = Z.nadel - 0.4 + i * 0.25;
          const fall = interpolate(s, [ab, ab + 0.35], [-400, 0], { ...klemm, easing: EXPO });
          return (
            <div key={z.text} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", left: 92, top: -110 + fall, width: 6, height: 110, background: NOIR_ROT, opacity: s > ab ? 1 : 0, boxShadow: `0 0 12px ${NOIR_ROT}` }} />
              <IconKugel farbe={s > ab + 0.3 ? NOIR_ROT : "#9aa0ad"} groesse={190} aus={s < ab + 0.3}>{z.icon}</IconKugel>
              <div style={{ marginTop: 16, fontWeight: 800, fontSize: 34 }}>{z.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontFamily: ZAHLEN_SCHRIFT, fontSize: 110, color: "#f5f5f5", opacity: rein(s, Z.hybrid2 - 0.2, 0.4) }}>HYBRIDE KRIEGSFÜHRUNG</div>
    </Grund16>
  );
};

/* ───────── J. Was heißt das für dich? ───────── */
export const FuerDich: React.FC<{ s: number }> = ({ s }) => {
  const geraete = [
    { ab: Z.heizung, icon: <Heater size={70} />, text: "Heizung" },
    { ab: Z.kamera, icon: <Camera size={70} />, text: "Kamera" },
    { ab: Z.router, icon: <Router size={70} />, text: "Router" },
    { ab: Z.solar, icon: <SolarPanel size={70} />, text: "Solaranlage" },
  ];
  const teil2 = s >= Z.lehre - 0.2;
  const tipps = [
    { ab: Z.pw, text: "Werkspasswörter sofort ändern" },
    { ab: Z.upd, text: "Updates einspielen" },
    { ab: Z.netz, text: "Nicht nötig? Nicht ans Internet" },
  ];
  return (
    <Grund16>
      <KapitelTitel s={s} ab={Z.dich - 0.3} nr="8" text="WAS HEISST DAS FÜR DICH?" />
      {!teil2 ? (
        <>
          <Plopp s={s} ab={Z.gutnachricht} x={640} y={470}>
            <div style={{ textAlign: "center", width: 560 }}>
              <IconKugel farbe={GRUEN} groesse={220}><ShieldCheck size={110} /></IconKugel>
              <div style={{ marginTop: 18, fontWeight: 800, fontSize: 40, color: GRUEN }}>Versorgung nicht in Gefahr</div>
            </div>
          </Plopp>
          <Plopp s={s} ab={Z.vernichtet} x={1280} y={470}>
            <div style={{ textAlign: "center", width: 560 }}>
              <IconKugel farbe={GRUEN} groesse={220}><Trash2 size={110} /></IconKugel>
              <div style={{ marginTop: 18, fontWeight: 800, fontSize: 40, color: GRUEN }}>Verdorbenes wird vernichtet</div>
            </div>
          </Plopp>
        </>
      ) : (
        <>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {geraete.map((g, i) => (
              <line key={i} x1={300 + i * 250} y1={330} x2={1480} y2={200} stroke={s > Z.tuer ? NOIR_ROT : "#4a5060"} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-s * 40} opacity={s > g.ab ? 1 : 0} />
            ))}
          </svg>
          {geraete.map((g, i) => (
            <Plopp key={g.text} s={s} ab={g.ab - 0.1} x={300 + i * 250} y={330}>
              <div style={{ textAlign: "center" }}>
                <IconKugel farbe={s > Z.tuer ? NOIR_ROT : BLAU} groesse={150}>{g.icon}</IconKugel>
                <div style={{ marginTop: 10, fontWeight: 800, fontSize: 30 }}>{g.text}</div>
              </div>
            </Plopp>
          ))}
          <Plopp s={s} ab={Z.heizung - 0.2} x={1480} y={200}>
            <IconKugel farbe={NOIR_ORANGE} groesse={150}><Globe size={80} /></IconKugel>
          </Plopp>
          <div style={{ position: "absolute", left: 220, top: 560 }}>
            {tipps.map((t) => (
              <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26, opacity: s >= t.ab - 0.1 ? 1 : 0, transform: `translateX(${(1 - rein(s, t.ab - 0.1, 0.4)) * 50}px)` }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: GRUEN, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={44} color="#050506" /></div>
                <div style={{ fontWeight: 800, fontSize: 46 }}>{t.text}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </Grund16>
  );
};

/* ───────── K. Schluss: der Witz und die Wahrheit ───────── */
export const SchlussWitz: React.FC<{ s: number }> = ({ s }) => (
  <Grund16 ton="rot">
    <Kuehltruhe s={s} x={560} y={560} temp={50} skala={0.8} />
    <div style={{ position: "absolute", left: 1050, top: 300 }}>
      <div style={{ fontWeight: 800, fontSize: 50, opacity: rein(s, Z.witz - 0.3, 0.4) }}>Klingt wie ein Witz …</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40, opacity: rein(s, Z.militaer - 0.4, 0.4) }}>
        <IR style={{ width: 110, borderRadius: 8 }} />
        <div style={{ fontWeight: 800, fontSize: 46, color: NOIR_ROT }}>… laut Frankreich:<br />ein fremdes Militär</div>
      </div>
    </div>
  </Grund16>
);

export const nichtGenutzt = { lauf, H };
