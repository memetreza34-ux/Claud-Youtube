import React from "react";
import { evolvePath } from "@remotion/paths";
import { CN, US } from "country-flag-icons/react/3x2";
import { Bot, Eye, KeyRound, Laptop, Mail, Server, ShieldAlert, X } from "lucide-react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import {
  NOIR_GRUEN,
  NOIR_ORANGE,
  NOIR_ROT,
  klemm,
  rein,
  schwung,
  zweier,
} from "./noir-buehne";
import { FARBE, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Neue Voll-Bühne bis direkt über die Untertitel (y = 140 .. 1380 = 1240 px Höhe).
// Oben nur 140 px Schutz-Platz für Handy-UI, kein schwarzes 600px-Loch mehr!
const UNTERTITEL_GRENZE = BAND_TOP + BAND_HOEHE; // 1380

export const VollBuehne: React.FC<{
  oberzeile?: string;
  unterzeile?: string;
  oberfarbe?: string;
  children: React.ReactNode;
}> = ({ oberzeile, unterzeile, oberfarbe = NOIR_ORANGE, children }) => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: "#050506" }}>
    {/* Dezentes Hintergrund-Leuchten */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        height: 1260,
        background: "radial-gradient(circle at 50% 45%, rgba(255,138,31,0.06), transparent 70%)",
      }}
    />
    {oberzeile ? (
      <div style={{ position: "absolute", left: 56, right: 56, top: 145, textAlign: "center" }}>
        <div
          style={{
            fontFamily: ZAHLEN_SCHRIFT,
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: 1.5,
            color: oberfarbe,
            lineHeight: 1.08,
          }}
        >
          {oberzeile}
        </div>
        {unterzeile ? (
          <div
            style={{
              fontFamily: TEXT_SCHRIFT,
              fontSize: 28,
              fontWeight: 600,
              color: "#9ca3af",
              marginTop: 8,
            }}
          >
            {unterzeile}
          </div>
        ) : null}
      </div>
    ) : null}

    {/* Großer Arbeitsbereich von y=280 bis y=1370 */}
    <div
      style={{
        position: "absolute",
        left: 44,
        right: 44,
        top: oberzeile ? 285 : 155,
        height: oberzeile ? UNTERTITEL_GRENZE - 295 : UNTERTITEL_GRENZE - 165,
        borderRadius: 28,
        overflow: "hidden",
        backgroundColor: "#0b0d14",
        border: "2px solid #1e2333",
        boxShadow: "0 24px 70px rgba(0,0,0,0.75)",
      }}
    >
      {children}
    </div>
  </div>
);

// Scharfe Portrait-Dossier-Karte im Querformat-Rahmen (verhindert Unschärfe durch Hochskalierung)
export const ForscherKarte: React.FC<{
  bild: string;
  oberzeile: string;
  unterzeile?: string;
  rolle: string;
  quelle: string;
}> = ({ bild, oberzeile, unterzeile, rolle, quelle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const ein = schwung(zweier(s), 0.04);

  return (
    <VollBuehne oberzeile={oberzeile} unterzeile={unterzeile}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 46px", gap: 36 }}>
        <div
          style={{
            width: "100%",
            height: 560,
            borderRadius: 24,
            overflow: "hidden",
            border: `3.5px solid ${NOIR_ORANGE}`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
            transform: `scale(${0.95 + 0.05 * ein})`,
          }}
        >
          <Img
            src={staticFile(bild)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 25%",
              filter: "contrast(1.06) saturate(1.05)",
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "28px 34px",
            borderRadius: 22,
            backgroundColor: "#141824",
            border: "2.5px solid #2b3245",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: "rgba(255,138,31,0.14)", border: `2.5px solid ${NOIR_ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldAlert size={40} color={NOIR_ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 30, fontWeight: 900, color: "#f8fafc" }}>{rolle}</div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, color: "#9ca3af", marginTop: 4 }}>{quelle}</div>
            </div>
          </div>
        </div>
      </div>
    </VollBuehne>
  );
};

// Großer, sauber zentrierter Artikel-/Webseiten-Beleg (mit animiertem rotem Rahmen + optionalem Stempel)
export const VollBeleg: React.FC<{
  bild: string;
  oberzeile: string;
  unterzeile?: string;
  oberfarbe?: string;
  markierung: [number, number, number, number]; // x1, x2, y1, y2 auf 1080x1920
  kreisAb?: number;
  ohneKreis?: boolean;
  mitteY?: number;
  stempelText?: string;
  stempelAb?: number;
  stempelFarbe?: string;
}> = ({
  bild,
  oberzeile,
  unterzeile,
  oberfarbe = NOIR_ORANGE,
  markierung,
  kreisAb = 0.35,
  ohneKreis = false,
  mitteY: mitteVorgabe,
  stempelText,
  stempelAb = 1.8,
  stempelFarbe = NOIR_ROT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const containerW = 992; // 1080 - 2*44
  const containerH = UNTERTITEL_GRENZE - 295; // 1085
  const scale = containerW / 1080;
  const imgH = 1920 * scale;

  const [x1, x2, y1, y2] = markierung;
  const targetMitte = (mitteVorgabe ?? (y1 + y2) / 2) * scale;
  const versatz = Math.max(0, Math.min(imgH - containerH, targetMitte - containerH / 2));

  const bx = Math.max(8, x1 * scale - 10);
  const bw = Math.min(containerW - 8, x2 * scale + 10) - bx;
  const by = y1 * scale - versatz - 10;
  const bh = (y2 - y1) * scale + 20;
  const umfang = 2 * (bw + bh);
  const gezeichnet = interpolate(frame, [kreisAb * fps, (kreisAb + 0.45) * fps], [0, 1], {
    ...klemm,
    easing: WEICH,
  });
  const stempelEin = stempelText ? schwung(zweier(s), stempelAb) : 0;

  return (
    <VollBuehne oberzeile={oberzeile} unterzeile={unterzeile} oberfarbe={oberfarbe}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#ffffff" }}>
        <div style={{ position: "absolute", left: 0, top: -versatz, width: containerW, height: imgH }}>
          <Img src={staticFile(bild)} style={{ width: containerW, height: imgH }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 48, background: "linear-gradient(180deg, #fff 15%, transparent)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 48, background: "linear-gradient(0deg, #fff 15%, transparent)" }} />
        {ohneKreis ? null : (
          <svg width={containerW} height={containerH} style={{ position: "absolute", inset: 0 }}>
            <rect
              x={bx}
              y={by}
              width={bw}
              height={bh}
              rx={14}
              fill="none"
              stroke={FARBE.rot}
              strokeWidth={7}
              strokeDasharray={umfang}
              strokeDashoffset={umfang * (1 - gezeichnet)}
              opacity={gezeichnet > 0 ? 1 : 0}
            />
          </svg>
        )}
        {stempelText && s >= stempelAb ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 190,
              background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.92) 38%, rgba(10,12,18,0.97) 100%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 38,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                padding: "16px 38px",
                borderRadius: 18,
                backgroundColor: "rgba(22, 10, 14, 0.96)",
                border: `4px solid ${stempelFarbe}`,
                color: stempelFarbe === NOIR_GRUEN ? "#bbf7d0" : "#fecaca",
                fontFamily: ZAHLEN_SCHRIFT,
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: 1.8,
                transform: `scale(${0.8 + 0.2 * stempelEin}) rotate(-2deg)`,
                opacity: stempelEin,
                boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
              }}
            >
              {stempelText}
            </div>
          </div>
        ) : null}
      </div>
    </VollBuehne>
  );
};

// 1. Erklärung Teil 1 (volle Bühnenhöhe 992 x 1085!):
// Oben: Deine App -> gestrichelter Direktweg zum Großen Modell wird mit X blockiert -> Umleitung über Zwischenhändler in der Mitte -> Täter liest direkt an der Tür mit!
export const PromptWegMotion: React.FC<{
  appsRel: number;
  nichtDirektRel: number;
  zwischenRel: number;
  tuerRel: number;
  mitschnittRel: number;
}> = ({ appsRel, nichtDirektRel, zwischenRel, tuerRel, mitschnittRel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);

  const direktPfad = "M 230 220 H 750";
  const umweg1 = "M 180 325 C 180 490, 320 530, 420 545";
  const umweg2 = "M 575 545 C 720 530, 810 450, 810 325";

  const direktEvo = evolvePath(rein(s, appsRel, 0.9), direktPfad);
  const umweg1Evo = evolvePath(rein(s, zwischenRel - 0.5, 0.8), umweg1);
  const umweg2Evo = evolvePath(rein(s, zwischenRel + 0.5, 0.9), umweg2);

  const xEin = schwung(z, nichtDirektRel);
  const zwischenEin = rein(s, zwischenRel - 0.35, 0.4);
  const tuerEin = schwung(z, tuerRel);
  const abgriffEin = rein(s, tuerRel, 0.25);

  const briefT = interpolate(s, [zwischenRel - 0.4, zwischenRel + 0.4], [0, 1], klemm);
  const briefX = 180 + briefT * 316;
  const briefY = 325 + Math.sin(briefT * Math.PI * 0.5) * 220;

  // Kontinuierlich abgezweigte Datenpakete zum Täter (ab tuerRel bis Ende)
  const leckPunkt = (offset: number) => ((s - tuerRel + offset) % 1.2) / 1.2;
  const recBlink = Math.sin(s * 8) > 0 ? 1 : 0.35;

  return (
    <VollBuehne
      oberzeile={s >= tuerRel ? "ABGEFANGEN AN DER HAUSTÜR" : "DER WEG DEINER ANFRAGE"}
      unterzeile={s >= tuerRel ? "Mitgelesen noch vor der Antwort" : "Warum Apps Umwege über Zwischenhändler nehmen"}
      oberfarbe={s >= tuerRel ? NOIR_ROT : NOIR_ORANGE}
    >
      <svg width={992} height={1085} style={{ position: "absolute", inset: 0 }}>
        {/* Direktweg (wird durchgestrichen) */}
        <path
          d={direktPfad}
          fill="none"
          stroke={s >= nichtDirektRel ? "#475569" : NOIR_GRUEN}
          strokeWidth={5}
          strokeDasharray={direktEvo.strokeDasharray}
          strokeDashoffset={direktEvo.strokeDashoffset}
          opacity={s >= nichtDirektRel ? 0.35 : 0.9}
        />

        {/* Umweg über Zwischenhändler */}
        <path
          d={umweg1}
          fill="none"
          stroke={NOIR_ORANGE}
          strokeWidth={6}
          strokeDasharray={umweg1Evo.strokeDasharray}
          strokeDashoffset={umweg1Evo.strokeDashoffset}
        />
        <path
          d={umweg2}
          fill="none"
          stroke={s >= tuerRel ? NOIR_ROT : "#64748b"}
          strokeWidth={6}
          strokeDasharray={umweg2Evo.strokeDasharray}
          strokeDashoffset={umweg2Evo.strokeDashoffset}
        />

        {/* Abgriff-Leitung nach unten zum Täter */}
        {s >= tuerRel ? (
          <>
            <path d="M 496 680 V 875" fill="none" stroke={NOIR_ROT} strokeWidth={5} strokeDasharray="10 8" opacity={0.85} />
            {[0, 0.4, 0.8].map((off, idx) => {
              const t = leckPunkt(off);
              const py = 685 + t * 180;
              return <circle key={idx} cx={496} cy={py} r={10} fill="#fecaca" stroke={NOIR_ROT} strokeWidth={3} />;
            })}
          </>
        ) : null}
      </svg>

      {/* Oben links: Deine App */}
      <div style={{ position: "absolute", left: 75, top: 120, width: 210, textAlign: "center", transform: `scale(${schwung(z, 0.02)})` }}>
        <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: 34, backgroundColor: "#141824", border: `3.5px solid ${NOIR_ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Laptop size={76} color={NOIR_ORANGE} strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 14 }}>Deine KI-App</div>
      </div>

      {/* Oben rechts: Großes KI-Modell */}
      <div style={{ position: "absolute", left: 705, top: 120, width: 210, textAlign: "center" }}>
        <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: 34, backgroundColor: "#141824", border: `3.5px solid ${NOIR_GRUEN}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={76} color={NOIR_GRUEN} strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 800, color: "#d1d5db", marginTop: 14 }}>Großes Modell</div>
      </div>

      {/* Durchgestrichener Direktweg-Hinweis */}
      {s >= nichtDirektRel ? (
        <div style={{ position: "absolute", left: 446, top: 170, width: 100, height: 100, borderRadius: 50, backgroundColor: "#2a0e12", border: `3px solid ${NOIR_ROT}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${xEin})` }}>
          <X size={58} color={NOIR_ROT} strokeWidth={3.2} />
        </div>
      ) : null}

      {/* Mitte unten: Günstiger Zwischenhändler */}
      <div style={{ position: "absolute", left: 326, top: 440, width: 340, textAlign: "center", opacity: 0.25 + 0.75 * zwischenEin }}>
        <div
          style={{
            width: 190,
            height: 190,
            margin: "0 auto",
            borderRadius: 40,
            backgroundColor: "#141824",
            border: `4px solid ${s >= tuerRel ? NOIR_ROT : NOIR_ORANGE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: s >= tuerRel ? "0 0 55px rgba(239,68,68,0.35)" : "none",
          }}
        >
          <Server size={92} color={s >= tuerRel ? NOIR_ROT : NOIR_ORANGE} strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 800, color: s >= tuerRel ? "#fecaca" : "#fff", marginTop: 14 }}>
          Günstiger Zwischenhändler
        </div>
      </div>

      {/* Fliegender Prompt-Brief */}
      {s >= zwischenRel - 0.5 && s < zwischenRel + 0.7 ? (
        <div style={{ position: "absolute", left: briefX - 36, top: briefY - 36, width: 72, height: 72, borderRadius: 18, backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 28px rgba(0,0,0,0.65)" }}>
          <Mail size={42} color="#050506" strokeWidth={2.4} />
        </div>
      ) : null}

      {/* Unten: Klar lesbare Täter-Alarmbox + aktives Mitlesen-Signal */}
      {s >= tuerRel ? (
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 58,
            padding: "24px 30px",
            borderRadius: 24,
            backgroundColor: "rgba(32,12,16,0.96)",
            border: `3.5px solid ${NOIR_ROT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${0.92 + 0.08 * tuerEin})`,
            opacity: abgriffEin,
            boxShadow: "0 16px 40px rgba(239,68,68,0.28)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Eye size={52} color="#fecaca" />
            <div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 30, fontWeight: 900, color: "#ffffff" }}>
                TÄTER AN DER HAUSTÜR
              </div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 23, color: "#fecaca", marginTop: 4 }}>
                {s >= mitschnittRel ? "Jede Nachricht heimlich mitgeschnitten" : "Direkter Zugriff am Zwischenhändler"}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              backgroundColor: NOIR_ROT,
              color: "#ffffff",
              fontFamily: ZAHLEN_SCHRIFT,
              fontSize: 20,
              fontWeight: 900,
              opacity: recBlink,
            }}
          >
            ● MITLESEN
          </div>
        </div>
      ) : null}
    </VollBuehne>
  );
};

// 2. Erklärung Teil 2 (volle Bühnenhöhe 992 x 1085!):
// Oben großer Key-Zähler (~200 Cloud-Schlüssel) -> unten strahlen Blitze auf 3x3 Server-Raster (1.000+ Server)!
export const KeysAngriffMotion: React.FC<{ keysRel: number; serverRel: number }> = ({
  keysRel,
  serverRel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);

  const keyZahl = Math.round(interpolate(s, [0.1, keysRel + 0.45], [14, 200], klemm));
  const srvEin = rein(s, serverRel, 0.35);

  const cols = [216, 496, 776];
  const rows = [625, 785, 945];
  const serverPos = rows.flatMap((y) => cols.map((x) => ({ x, y })));

  return (
    <VollBuehne
      oberzeile={s >= serverRel ? "TAUSENDE SERVER ANGEGRIFFEN" : "GESTOHLENE CLOUD-SCHLÜSSEL"}
      unterzeile="Aus den Lockvogel-Prompts in Stunden ausgenutzt"
      oberfarbe={s >= serverRel ? NOIR_ROT : NOIR_ORANGE}
    >
      <svg width={992} height={1085} style={{ position: "absolute", inset: 0 }}>
        {serverPos.map((p, i) => {
          const hit = rein(s, serverRel + i * 0.08, 0.22);
          const d = `M 496 390 L ${p.x} ${p.y - 50}`;
          const evo = evolvePath(hit, d);
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={NOIR_ROT}
              strokeWidth={4}
              strokeDasharray={evo.strokeDasharray}
              strokeDashoffset={evo.strokeDashoffset}
            />
          );
        })}
      </svg>

      {/* Oben mittig: Großer Key-Block */}
      <div
        style={{
          position: "absolute",
          left: 196,
          right: 196,
          top: 75,
          height: 315,
          borderRadius: 28,
          backgroundColor: "#141824",
          border: `3.5px solid ${NOIR_ORANGE}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${schwung(z, 0.02)})`,
        }}
      >
        <KeyRound size={74} color="#facc15" strokeWidth={2.4} />
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 104, fontWeight: 900, color: NOIR_ORANGE, lineHeight: 1.0, marginTop: 8 }}>
          ~{keyZahl}
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 700, color: "#e5e7eb", marginTop: 6 }}>
          gestohlene Cloud-Schlüssel
        </div>
      </div>

      {/* Unten: 3x3 Server-Raster */}
      {serverPos.map((p, i) => {
        const hit = rein(s, serverRel + i * 0.09, 0.22);
        const wackel = hit > 0.2 && hit < 0.95 ? Math.sin(s * 50 + i) * 4 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - 105 + wackel,
              top: p.y - 52,
              width: 210,
              height: 104,
              borderRadius: 18,
              backgroundColor: "#141824",
              border: `3px solid ${hit > 0.2 ? NOIR_ROT : "#343947"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            {hit > 0.2 ? <ShieldAlert size={38} color={NOIR_ROT} /> : <Server size={38} color={NOIR_GRUEN} />}
            <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 25, fontWeight: 900, color: hit > 0.2 ? "#fecaca" : "#9ca3af", letterSpacing: 0.5 }}>
              {hit > 0.2 ? "ZUGRIFF" : `SRV-0${i + 1}`}
            </span>
          </div>
        );
      })}

      {srvEin > 0.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: ZAHLEN_SCHRIFT, fontSize: 32, fontWeight: 900, color: NOIR_ROT, opacity: srvEin }}>
          INNERHALB VON STUNDEN ABGEGRIFFEN
        </div>
      ) : null}
    </VollBuehne>
  );
};

// 3. China-Abfluss (volle Bühnenhöhe 992 x 1085): Große US-Flagge -> geschwungene Kurve mit fliegendem Prompt-Paket -> China-Flagge
export const ChinaBandMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const kurve = interpolate(s, [0.08, 0.95], [0, 1], klemm);
  const evo = evolvePath(kurve, "M 320 300 C 560 300, 440 760, 670 760");
  const cnEin = schwung(zweier(s), 0.25);
  // Kontinuierlich wanderndes Datenpaket entlang der Bezier-Kurve P0(320,300)..P3(670,760)
  const t = Math.min(0.98, ((s + 0.05) % 1.05) / 1.05);
  const mt = 1 - t;
  const px = mt ** 3 * 320 + 3 * mt ** 2 * t * 560 + 3 * mt * t ** 2 * 440 + t ** 3 * 670;
  const py = mt ** 3 * 300 + 3 * mt ** 2 * t * 300 + 3 * mt * t ** 2 * 760 + t ** 3 * 760;
  const trefferPulse = s >= 0.95 ? 1 + Math.sin((s - 0.95) * 8) * 0.035 : 1;

  return (
    <VollBuehne oberzeile="DATENABFLUSS NACH CHINA" unterzeile="Prompts von US-Anbietern weitergeleitet" oberfarbe={NOIR_ROT}>
      <svg width={992} height={1085} style={{ position: "absolute", inset: 0 }}>
        <path
          d="M 320 300 C 560 300, 440 760, 670 760"
          fill="none"
          stroke={NOIR_ROT}
          strokeWidth={8}
          strokeDasharray={evo.strokeDasharray}
          strokeDashoffset={evo.strokeDashoffset}
        />
      </svg>

      <div style={{ position: "absolute", left: 110, top: 170, width: 320, textAlign: "center" }}>
        <US style={{ width: 300, borderRadius: 16, border: "3px solid #343947" }} />
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 800, color: "#fff", marginTop: 14 }}>
          US-Anbieter
        </div>
      </div>

      {/* Wanderndes Prompt-/Datenpaket von US nach China */}
      {s >= 0.08 ? (
        <div
          style={{
            position: "absolute",
            left: px - 42,
            top: py - 42,
            width: 84,
            height: 84,
            borderRadius: 22,
            backgroundColor: "#f8fafc",
            border: `4px solid ${NOIR_ROT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 32px rgba(239,68,68,0.55)",
          }}
        >
          <Mail size={44} color={NOIR_ROT} strokeWidth={2.5} />
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 540, top: 620, width: 340, textAlign: "center", transform: `scale(${cnEin * trefferPulse})` }}>
        <CN style={{ width: 320, borderRadius: 16, border: `4px solid ${NOIR_ROT}`, boxShadow: s >= 0.95 ? "0 0 48px rgba(239,68,68,0.45)" : "none" }} />
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 40, fontWeight: 900, color: NOIR_ROT, marginTop: 14 }}>
          CHINA
        </div>
      </div>
    </VollBuehne>
  );
};
