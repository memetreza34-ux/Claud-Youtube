import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { Buehne } from "./ruhig";
import { CLAMP, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Reel 05 Optimizely: Themenbezogene, abwechslungsreiche Bausteine ohne leere Lückenfüller.
const LINIE = "#5b5f6b";
const FLAECHE = "#16181f";
const FEHLER = "#ef4444";
const AKZENT = "#ff8a1f";
const OK = "#22c55e";
const R = "reel-optimizely";

const useSek = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const weich = (s: number, a: number, dauer = 0.4) => interpolate(s, [a, a + dauer], [0, 1], { ...CLAMP, easing: WEICH });

// Vollbühne bis über den Untertitel-Bereich, damit nie eine abgeschnittene Hintergrund-Figur unten durchscheint
export const BuehneVoll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: BAND_TOP + BAND_HOEHE - 2, bottom: 0, backgroundColor: "#050506" }} />
    <Buehne>{children}</Buehne>
  </>
);

// Sauberes Szenenbild / Foto auf der Vollbühne mit langsamer Kamerafahrt, Luft oben und weichem Übergang unten
export const BildBuehne: React.FC<{
  bild: string;
  fokus?: [number, number];
  titel?: string;
  untertitel?: string;
  akzent?: string;
  helligkeit?: number;
  modus?: "cover" | "contain";
}> = ({ bild, fokus = [50, 50], titel, untertitel, akzent = AKZENT, helligkeit = 1, modus = "cover" }) => {
  const s = useSek();
  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#08090d" }} />
      <Img
        src={staticFile(bild)}
        style={{
          position: "absolute",
          left: modus === "contain" ? 40 : 0,
          top: modus === "contain" ? 180 : 0,
          width: modus === "contain" ? 1000 : "100%",
          height: modus === "contain" ? 960 : "100%",
          objectFit: modus,
          objectPosition: `${fokus[0]}% ${fokus[1]}%`,
          scale: String(1.02 + s * 0.015),
          filter: helligkeit !== 1 ? `brightness(${helligkeit})` : undefined,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 190, background: "linear-gradient(180deg, #050506 20%, rgba(5,5,6,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240, background: "linear-gradient(0deg, #050506 20%, rgba(5,5,6,0))" }} />
      {titel ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 70,
            padding: "20px 28px",
            borderRadius: 20,
            backgroundColor: "rgba(16,18,26,0.9)",
            border: `3px solid ${akzent}`,
          }}
        >
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: "#ffffff" }}>{titel}</div>
          {untertitel ? <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 26, fontWeight: 600, color: "#c9ccd4", marginTop: 6 }}>{untertitel}</div> : null}
        </div>
      ) : null}
    </BuehneVoll>
  );
};

// Scott Helme: Echtes Portrait mit sauberer Einblendung
export const ScottHelmeSzene: React.FC = () => {
  const s = useSek();
  const ein = weich(s, 0.15, 0.45);
  return (
    <BuehneVoll>
      <Img
        src={staticFile(`${R}/scott-helme.jpg`)}
        style={{
          position: "absolute",
          left: 0,
          top: 90,
          width: 1080,
          height: 1180,
          objectFit: "cover",
          objectPosition: "50% 25%",
          scale: String(1.02 + s * 0.015),
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230, background: "linear-gradient(180deg, #050506 45%, rgba(5,5,6,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 320, background: "linear-gradient(0deg, #050506 35%, rgba(5,5,6,0))" }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 70,
          padding: "22px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(18,20,28,0.92)",
          borderLeft: `8px solid ${AKZENT}`,
          opacity: ein,
          transform: `translateY(${(1 - ein) * 18}px)`,
        }}
      >
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 40, fontWeight: 800, color: "#ffffff" }}>Scott Helme</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 26, fontWeight: 700, color: AKZENT, marginTop: 4 }}>Sicherheitsforscher · Report URI</div>
      </div>
    </BuehneVoll>
  );
};

// Hook-Szene: Echte Browser-Fenster (Zoom, BBC, CNN, IKEA) werden infiziert, Strichermittler untersucht sie
export const HookMarkenSzene: React.FC<{ zoomAb: number; bbcAb: number; ikeaAb: number }> = ({ zoomAb, bbcAb, ikeaAb }) => {
  const s = useSek();
  const karten = [
    { name: "zoom.us", logo: `${R}/logo-zoom.svg`, x: 64, y: 200, w: 440, h: 245, ab: zoomAb, hell: true },
    { name: "bbc.com", logo: `${R}/logo-bbc.svg`, x: 540, y: 155, w: 440, h: 245, ab: bbcAb, hell: true },
    { name: "cnn.com", logo: `${R}/logo-cnn.svg`, x: 74, y: 485, w: 420, h: 240, ab: bbcAb + 0.35, hell: false },
    { name: "ikea.com", logo: `${R}/logo-ikea.svg`, x: 530, y: 440, w: 440, h: 240, ab: ikeaAb, hell: false },
  ];

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 38% 35%, rgba(239,68,68,0.18), rgba(12,13,18,0) 65%)" }} />
      {karten.map((k) => {
        const inf = weich(s, k.ab, 0.35);
        return (
          <div
            key={k.name}
            style={{
              position: "absolute",
              left: k.x,
              top: k.y,
              width: k.w,
              height: k.h,
              borderRadius: 22,
              backgroundColor: "#141720",
              border: `4px solid ${inf > 0.3 ? FEHLER : "#2c3140"}`,
              overflow: "hidden",
            }}
          >
            <div style={{ height: 42, backgroundColor: "#1d212e", display: "flex", alignItems: "center", padding: "0 16px", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: inf > 0.3 ? FEHLER : "#5b5f6b" }} />
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 20, fontWeight: 700, color: "#9a9eab" }}>{k.name}</div>
              {inf > 0.4 ? <div style={{ marginLeft: "auto", fontFamily: TEXT_SCHRIFT, fontSize: 18, fontWeight: 800, color: FEHLER }}>INFIZIERT</div> : null}
            </div>
            <div style={{ height: k.h - 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 18, backgroundColor: k.hell ? "#e9ecf2" : "#141720" }}>
              <Img src={staticFile(k.logo)} style={{ width: 200, height: 82, objectFit: "contain" }} />
              <div
                style={{
                  marginTop: 12,
                  padding: "6px 14px",
                  borderRadius: 8,
                  backgroundColor: inf > 0.3 ? "rgba(239,68,68,0.16)" : "rgba(0,0,0,0.08)",
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: inf > 0.3 ? "#dc2626" : k.hell ? "#666d7a" : "#7b8190",
                }}
              >
                {inf > 0.3 ? "<script> Schadcode" : "cdn.optimizely.com"}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 640, background: "linear-gradient(180deg, rgba(12,13,18,0) 0%, rgba(12,13,18,0.88) 70%, #050506 100%)" }} />
      <Img
        src={staticFile(`${R}/cut-master.png`)}
        style={{
          position: "absolute",
          right: -40,
          bottom: -25,
          width: 780,
          height: 780,
          objectFit: "contain",
          scale: String(1 + s * 0.014),
        }}
      />
    </BuehneVoll>
  );
};

// Reine Grafik ohne Figur: 188 Programmteile in 178 Organisationen infiziert
export const ZahlenNetzSzene: React.FC<{ snipsAb: number; orgsAb: number }> = ({ snipsAb, orgsAb }) => {
  const s = useSek();
  const c1 = weich(s, snipsAb, 0.4);
  const c2 = weich(s, orgsAb, 0.4);

  // Raster aus 48 stilisierten Webseiten-Knoten, die sich rot färben
  const punkte = Array.from({ length: 48 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const delay = (i * 0.045) % 1.8;
    const aktiv = s >= snipsAb + delay;
    return { x: 115 + col * 120, y: 740 + row * 86, aktiv };
  });

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, rgba(239,68,68,0.16), rgba(5,5,6,0.95) 75%)" }} />

      {/* Zwei fette Kennzahlen-Karten mit viel Platz oben */}
      <div style={{ position: "absolute", top: 210, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            padding: "32px 38px",
            borderRadius: 26,
            backgroundColor: FLAECHE,
            border: `4px solid ${AKZENT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: c1,
            transform: `translateY(${(1 - c1) * 24}px)`,
          }}
        >
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 124, lineHeight: 0.95, color: AKZENT }}>188</div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: "#ffffff", marginTop: 8 }}>infizierte Programmteile</div>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 800, color: AKZENT, padding: "14px 20px", borderRadius: 14, backgroundColor: "rgba(255,138,31,0.12)" }}>{"<script>"}</div>
        </div>

        <div
          style={{
            padding: "32px 38px",
            borderRadius: 26,
            backgroundColor: FLAECHE,
            border: `4px solid ${FEHLER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: c2,
            transform: `translateY(${(1 - c2) * 24}px)`,
          }}
        >
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 124, lineHeight: 0.95, color: FEHLER }}>178</div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: "#ffffff", marginTop: 8 }}>bekannte Organisationen</div>
          </div>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 800, color: FEHLER, padding: "14px 20px", borderRadius: 14, backgroundColor: "rgba(239,68,68,0.14)" }}>BETROFFEN</div>
        </div>
      </div>

      {/* Knoten-Raster darunter */}
      {punkte.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: p.x - 16,
            top: p.y,
            width: 34,
            height: 34,
            borderRadius: 9,
            backgroundColor: p.aktiv ? "rgba(239,68,68,0.22)" : "#16181f",
            border: `3px solid ${p.aktiv ? FEHLER : "#2c303d"}`,
          }}
        />
      ))}
    </BuehneVoll>
  );
};

// Vier große Marken-Logos poppen exakt beim jeweiligen Wort auf (Zoom, BBC, CNN, IKEA)
export const MarkenSpotSzene: React.FC<{ zoomAb: number; bbcAb: number; cnnAb: number; ikeaAb: number }> = ({ zoomAb, bbcAb, cnnAb, ikeaAb }) => {
  const s = useSek();
  const marken = [
    { name: "ZOOM", logo: `${R}/logo-zoom.svg`, ab: zoomAb, hell: true },
    { name: "BBC", logo: `${R}/logo-bbc.svg`, ab: bbcAb, hell: true },
    { name: "CNN", logo: `${R}/logo-cnn.svg`, ab: cnnAb, hell: false },
    { name: "IKEA", logo: `${R}/logo-ikea.svg`, ab: ikeaAb, hell: false },
  ];

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.14), rgba(5,5,6,0.98) 70%)" }} />
      <div style={{ position: "absolute", top: 230, left: 70, right: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
        {marken.map((m) => {
          const sicht = weich(s, m.ab, 0.25);
          return (
            <div
              key={m.name}
              style={{
                height: 410,
                borderRadius: 30,
                backgroundColor: m.hell ? "#f2f4f8" : FLAECHE,
                border: `5px solid ${sicht > 0.3 ? FEHLER : "#2a2d38"}`,
                opacity: sicht,
                scale: String(0.86 + 0.14 * sicht),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 28,
              }}
            >
              <Img src={staticFile(m.logo)} style={{ width: 290, height: 150, objectFit: "contain" }} />
              <div
                style={{
                  marginTop: 28,
                  padding: "8px 18px",
                  borderRadius: 10,
                  backgroundColor: "rgba(239,68,68,0.14)",
                  fontFamily: TEXT_SCHRIFT,
                  fontSize: 24,
                  fontWeight: 800,
                  color: FEHLER,
                }}
              >
                Schadcode geladen
              </div>
            </div>
          );
        })}
      </div>
    </BuehneVoll>
  );
};

const Kachel: React.FC<{
  x: number;
  y: number;
  b: number;
  h: number;
  sicht: number;
  rand: string;
  children: React.ReactNode;
  label?: string;
}> = ({ x, y, b, h, sicht, rand, children, label }) => (
  <div style={{ position: "absolute", left: x - b / 2, top: y - h / 2, width: b, height: h, opacity: sicht, scale: String(0.88 + 0.12 * sicht) }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 28,
        backgroundColor: FLAECHE,
        border: `4px solid ${rand}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
    {label ? (
      <div style={{ position: "absolute", top: h + 14, width: "100%", textAlign: "center", fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: "#9a9eab" }}>
        {label}
      </div>
    ) : null}
  </div>
);

const Angreifer: React.FC<{ x: number; y: number; sicht: number }> = ({ x, y, sicht }) => (
  <svg width={150} height={170} style={{ position: "absolute", left: x - 75, top: y - 85, opacity: sicht }}>
    <path d="M20 165 Q20 95 75 82 Q130 95 130 165 Z" fill="#23252e" />
    <path d="M38 70 Q38 10 75 6 Q112 10 112 70 Q112 96 75 102 Q38 96 38 70 Z" fill="#23252e" />
    <path d="M50 70 Q52 30 75 26 Q98 30 100 70 Q98 88 75 91 Q52 88 50 70 Z" fill="#050506" />
    <rect x={58} y={58} width={13} height={5} rx={2} fill={FEHLER} />
    <rect x={80} y={58} width={13} height={5} rx={2} fill={FEHLER} />
  </svg>
);

const Weg: React.FC<{ d: string; anteil: number; rot?: boolean; laenge?: number }> = ({ d, anteil, rot, laenge = 900 }) => (
  <path
    d={d}
    fill="none"
    stroke={rot ? FEHLER : LINIE}
    strokeWidth={rot ? 7 : 5}
    strokeLinecap="round"
    strokeDasharray={`${laenge}`}
    strokeDashoffset={laenge * (1 - anteil)}
    opacity={anteil > 0 ? 1 : 0}
  />
);

export type OptimizelyKetteZeiten = {
  seiten: number;
  optimizely: number;
  luecke: number;
  infiziert: number;
  browser: number;
};

export const OptimizelyKette: React.FC<{ z: OptimizelyKetteZeiten }> = ({ z }) => {
  const s = useSek();
  const seiten = weich(s, z.seiten, 0.45);
  const opt = weich(s, z.optimizely, 0.45);
  const ang = weich(s, z.luecke, 0.45);
  const brw = weich(s, z.browser, 0.45);
  const istRot = s >= z.infiziert;

  // Etwas tiefer gesetzt, damit oben genug freier Raum bleibt
  const SX = 280;
  const SY = 340;
  const BX = 800;
  const BY = 340;
  const OX = 540;
  const OY = 735;
  const AX = 540;
  const AY = 1105;

  const paketT = s >= z.optimizely + 0.4 ? ((s - z.optimizely - 0.4) % 1.5) / 1.5 : -1;

  return (
    <BuehneVoll>
      <svg width={1080} height={BAND_HOEHE + 760} style={{ position: "absolute", inset: 0 }}>
        <Weg d={`M${OX - 50} ${OY - 95} C ${OX - 50} ${OY - 245}, ${SX} ${SY + 235}, ${SX} ${SY + 95}`} anteil={opt} rot={istRot} />
        <Weg d={`M${SX + 165} ${SY} L${BX - 165} ${BY}`} anteil={brw} rot={istRot} />
        <Weg d={`M${AX} ${AY - 85} L${OX} ${OY + 95}`} anteil={ang} rot />
      </svg>

      <Kachel x={SX} y={SY} b={340} h={195} sicht={seiten} rand={istRot ? FEHLER : "#2a2d38"}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 22, fontWeight: 700, color: "#9a9eab", marginBottom: 6 }}>178 Webseiten</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: "#ffffff", letterSpacing: 1 }}>Zoom · BBC</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 700, color: "#9a9eab", marginTop: 6 }}>CNN · IKEA</div>
      </Kachel>

      <Kachel x={BX} y={BY} b={300} h={195} sicht={brw} rand={istRot ? FEHLER : OK} label="Dein Browser">
        <svg width={88} height={68} viewBox="0 0 88 68">
          <rect x={4} y={4} width={80} height={60} rx={10} fill="none" stroke={istRot ? FEHLER : OK} strokeWidth={5} />
          <line x1={4} y1={20} x2={84} y2={20} stroke={istRot ? FEHLER : OK} strokeWidth={4} />
          <circle cx={16} cy={12} r={3} fill={istRot ? FEHLER : OK} />
          <circle cx={26} cy={12} r={3} fill={istRot ? FEHLER : OK} />
        </svg>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 22, fontWeight: 700, color: istRot ? FEHLER : "#c9ccd4", marginTop: 8 }}>
          {istRot ? "Schadcode aktiv" : "geschützt"}
        </div>
      </Kachel>

      <Kachel x={OX} y={OY} b={410} h={195} sicht={opt} rand={istRot ? FEHLER : AKZENT} label="Optimizely-Server">
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: istRot ? FEHLER : AKZENT }}>
          {istRot ? "Project JS manipuliert" : "Web-Test-Skript"}
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, fontWeight: 700, color: "#9a9eab", marginTop: 10 }}>
          {istRot ? "echtes Zertifikat · vertraut" : "cdn.optimizely.com"}
        </div>
      </Kachel>

      <Angreifer x={AX} y={AY} sicht={ang} />
      {ang > 0.1 ? (
        <div
          style={{
            position: "absolute",
            left: AX - 190,
            top: AY + 92,
            width: 380,
            textAlign: "center",
            fontFamily: TEXT_SCHRIFT,
            fontSize: 28,
            fontWeight: 800,
            color: FEHLER,
            opacity: ang,
          }}
        >
          Lücke in Konto-Anmeldung
        </div>
      ) : null}

      {paketT >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: OX - 75 + (SX - OX + 30) * paketT,
            top: OY - 125 + (SY - OY + 230) * paketT,
            padding: "8px 16px",
            borderRadius: 12,
            backgroundColor: istRot ? FEHLER : AKZENT,
            color: "#050506",
            fontFamily: TEXT_SCHRIFT,
            fontSize: 22,
            fontWeight: 900,
            opacity: Math.sin(paketT * Math.PI) + 0.15,
          }}
        >
          {istRot ? "JS + Malware" : "Skript.js"}
        </div>
      ) : null}
    </BuehneVoll>
  );
};

export type BrowserSchadenZeiten = {
  krypto: number;
  karte: number;
  cookies: number;
  iphone: number;
};

export const BrowserSchaden: React.FC<{ z: BrowserSchadenZeiten }> = ({ z }) => {
  const s = useSek();
  const punkte = [
    {
      ab: z.krypto,
      titel: "Krypto-Adresse getauscht",
      detail: "0x7a...3f  →  0x9f...Angreifer",
      icon: (
        <svg width={56} height={56} viewBox="0 0 56 56">
          <circle cx={28} cy={28} r={22} fill="none" stroke={AKZENT} strokeWidth={4} />
          <path d="M28 14 V42 M20 22 H32 C35 22 36 28 32 28 H20 M20 28 H33 C37 28 38 35 33 35 H20" fill="none" stroke={AKZENT} strokeWidth={3.5} strokeLinecap="round" />
        </svg>
      ),
    },
    {
      ab: z.karte,
      titel: "Kartendaten abgegriffen",
      detail: "Eingaben im Bezahlformular mitgelesen",
      icon: (
        <svg width={56} height={42} viewBox="0 0 56 42">
          <rect x={3} y={3} width={50} height={36} rx={6} fill="none" stroke={FEHLER} strokeWidth={4} />
          <rect x={3} y={11} width={50} height={8} fill={FEHLER} opacity={0.75} />
          <rect x={10} y={26} width={16} height={5} rx={2} fill="#c9ccd4" />
        </svg>
      ),
    },
    {
      ab: z.cookies,
      titel: "Cookies & Screenshots",
      detail: "Sitzungsdaten und Seitenansicht gestohlen",
      icon: (
        <svg width={56} height={56} viewBox="0 0 56 56">
          <circle cx={28} cy={28} r={20} fill="none" stroke={FEHLER} strokeWidth={4} />
          <circle cx={21} cy={22} r={3} fill={FEHLER} />
          <circle cx={34} cy={20} r={2.5} fill={FEHLER} />
          <circle cx={31} cy={34} r={3.5} fill={FEHLER} />
          <circle cx={20} cy={33} r={2} fill={FEHLER} />
        </svg>
      ),
    },
    {
      ab: z.iphone,
      titel: "Ältere iPhones angegriffen",
      detail: "iOS-Exploit-Kits direkt ausgeliefert",
      icon: (
        <svg width={44} height={58} viewBox="0 0 44 58">
          <rect x={4} y={3} width={36} height={52} rx={7} fill="none" stroke={FEHLER} strokeWidth={4} />
          <line x1={16} y1={10} x2={28} y2={10} stroke={FEHLER} strokeWidth={3} strokeLinecap="round" />
          <path d="M22 22 L31 38 H13 Z" fill="none" stroke={AKZENT} strokeWidth={3} strokeLinejoin="round" />
          <line x1={22} y1={28} x2={22} y2={33} stroke={AKZENT} strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <BuehneVoll>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 195,
          width: 940,
          height: 1060,
          borderRadius: 28,
          backgroundColor: "#12141b",
          border: "3px solid #2b2f3c",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 74,
            backgroundColor: "#1b1e28",
            borderBottom: "2px solid #2b2f3c",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            gap: 14,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: FEHLER }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: AKZENT }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: OK }} />
          <div
            style={{
              marginLeft: 18,
              flex: 1,
              height: 42,
              borderRadius: 12,
              backgroundColor: "#0e1016",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              fontFamily: TEXT_SCHRIFT,
              fontSize: 24,
              fontWeight: 700,
              color: "#9a9eab",
            }}
          >
            https://vertraute-webseite.de
          </div>
        </div>

        <div style={{ padding: "34px 40px", display: "flex", flexDirection: "column", gap: 26 }}>
          {punkte.map((p) => {
            const sicht = weich(s, p.ab, 0.35);
            return (
              <div
                key={p.titel}
                style={{
                  opacity: sicht,
                  transform: `translateY(${(1 - sicht) * 22}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "24px 28px",
                  borderRadius: 22,
                  backgroundColor: FLAECHE,
                  border: `3px solid ${sicht > 0.5 ? FEHLER : "#2a2d38"}`,
                }}
              >
                <div style={{ width: 82, height: 82, borderRadius: 18, backgroundColor: "#0e1016", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 36, fontWeight: 800, color: "#ffffff" }}>{p.titel}</div>
                  <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 25, fontWeight: 600, color: "#9a9eab", marginTop: 6 }}>{p.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BuehneVoll>
  );
};

// Ruhige Szene: Lücke binnen 3 Stunden geschlossen + Code entfernt
export const LueckeGeschlossen: React.FC<{ geschlossenAb: number; entferntAb: number }> = ({ geschlossenAb, entferntAb }) => {
  const s = useSek();
  const zu = weich(s, geschlossenAb, 0.5);
  const weg = weich(s, entferntAb, 0.45);
  const farbe = zu > 0.5 ? OK : AKZENT;

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.12), rgba(5,5,6,0.98) 70%)" }} />

      <div
        style={{
          position: "absolute",
          left: 110,
          top: 260,
          width: 860,
          padding: "56px 50px",
          borderRadius: 32,
          backgroundColor: FLAECHE,
          border: `4px solid ${farbe}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <svg width={130} height={150} viewBox="0 0 130 150">
          <path d={`M35 ${68 - (1 - zu) * 18} V45 C35 20 95 20 95 45 V68`} fill="none" stroke={farbe} strokeWidth={12} strokeLinecap="round" />
          <rect x={20} y={68} width={90} height={70} rx={16} fill={FLAECHE} stroke={farbe} strokeWidth={8} />
          <circle cx={65} cy={103} r={10} fill={farbe} />
        </svg>

        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 116, lineHeight: 1, color: farbe, marginTop: 26 }}>3 STUNDEN</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: "#ffffff", marginTop: 14 }}>
          {zu > 0.5 ? "Lücke bei Optimizely geschlossen" : "Angriff erkannt ..."}
        </div>
        <div
          style={{
            marginTop: 28,
            padding: "14px 28px",
            borderRadius: 14,
            backgroundColor: "rgba(34,197,94,0.14)",
            border: `2px solid ${OK}`,
            fontFamily: TEXT_SCHRIFT,
            fontSize: 30,
            fontWeight: 800,
            color: OK,
            opacity: weg,
            transform: `translateY(${(1 - weg) * 16}px)`,
          }}
        >
          Schadcode aus Projekten entfernt
        </div>
      </div>
    </BuehneVoll>
  );
};

// Lehre: Große Webseite öffnet sich und zeigt fremde Drittanbieter-Bausteine (ohne generische Figur davor)
export const WebBausteineSzene: React.FC<{ bausteineAb: number }> = ({ bausteineAb }) => {
  const s = useSek();
  const offen = weich(s, bausteineAb, 0.7);
  const bloecke = [
    { name: "Web-Tests", sub: "Optimizely", y: 400 },
    { name: "Analyse-Skript", sub: "Drittanbieter", y: 615 },
    { name: "Tracking-Code", sub: "externer Server", y: 830 },
  ];

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,138,31,0.14), rgba(5,5,6,0.98) 70%)" }} />

      <div style={{ position: "absolute", left: 110, top: 230, width: 860, height: 860, borderRadius: 30, backgroundColor: "#11131a", border: `3px dashed ${AKZENT}`, padding: "36px 42px" }}>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 34, fontWeight: 800, color: AKZENT }}>Fremde Bausteine im Hintergrund</div>
      </div>

      {bloecke.map((b, i) => {
        const k = weich(s, bausteineAb + i * 0.25, 0.4);
        return (
          <div
            key={b.name}
            style={{
              position: "absolute",
              left: 165,
              top: b.y,
              width: 750,
              height: 175,
              borderRadius: 22,
              backgroundColor: FLAECHE,
              border: `3px solid ${i === 0 ? FEHLER : AKZENT}`,
              padding: "26px 34px",
              opacity: k,
              transform: `translateX(${(1 - k) * -32}px)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 38, fontWeight: 800, color: "#ffffff" }}>{b.name}</div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 26, fontWeight: 700, color: i === 0 ? FEHLER : "#9a9eab", marginTop: 6 }}>{b.sub}</div>
          </div>
        );
      })}

      {/* Glatte Webseite schiebt sich nach rechts weg */}
      <div
        style={{
          position: "absolute",
          left: 110 + offen * 880,
          top: 230,
          width: 860,
          height: 860,
          borderRadius: 30,
          backgroundColor: "#1d212e",
          border: "3px solid #3c4257",
          opacity: 1 - offen * 0.88,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 48, fontWeight: 800, color: "#ffffff" }}>Große Webseite</div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 600, color: "#9a9eab", marginTop: 12 }}>vertraute Oberfläche</div>
      </div>
    </BuehneVoll>
  );
};
