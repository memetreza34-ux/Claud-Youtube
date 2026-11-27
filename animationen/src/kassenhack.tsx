import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BuehneVoll } from "./optimizely";
import { CLAMP, TEXT_SCHRIFT, WEICH, ZAHLEN_SCHRIFT } from "./stil";

// Reel 06: Bildhafte Remotion-Objekte (Flaggen, nachgebautes Kassenterminal, nachgebaute Kreditkarte)
const LINIE = "#343947";
const FLAECHE = "rgba(18, 20, 28, 0.92)";
const FEHLER = "#ef4444";
const AKZENT = "#ff8a1f";
const TEXT_GRAU = "#9ca3af";
const R = "reel-kassenhack";

const useSek = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const weich = (s: number, a: number, dauer = 0.4) =>
  interpolate(s, [a, a + dauer], [0, 1], { ...CLAMP, easing: WEICH });

// Saubere SVG-Flaggen (Deutschland, Brasilien)
const FlaggeDE: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 5 3" style={{ borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
    <rect width="5" height="1" y="0" fill="#111111" />
    <rect width="5" height="1" y="1" fill="#dd0000" />
    <rect width="5" height="1" y="2" fill="#ffce00" />
  </svg>
);

const FlaggeBR: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 20 14" style={{ borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
    <rect width="20" height="14" fill="#009c3b" />
    <polygon points="10,1.7 18.3,7 10,12.3 1.7,7" fill="#ffdf00" />
    <circle cx="10" cy="7" r="3.5" fill="#002776" />
    <path d="M6.8,6.4 Q10,5.2 13.3,7.3" stroke="#ffffff" strokeWidth="0.65" fill="none" />
  </svg>
);

// 1. Hook-Szene: Flow-Szene (Strichermittler an der Kasse) + Flaggen-Badges + 1 Mio.+ Zähler
export const HookKassenSzene: React.FC<{ deAb: number; millionAb: number }> = ({
  deAb,
  millionAb,
}) => {
  const s = useSek();
  const deEin = weich(s, deAb, 0.35);
  const counterEin = weich(s, millionAb, 0.45);
  const kartenZahl = Math.round(
    interpolate(s, [millionAb, millionAb + 1.4], [120000, 1000000], CLAMP),
  );

  return (
    <BuehneVoll>
      {/* Individuelles Flow-Bild: Strichermittler am Kassenterminal */}
      <Img
        src={staticFile(`${R}/flow-hook.png`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 42%",
          scale: String(1.02 + s * 0.015),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,5,6,0.78) 0%, rgba(5,5,6,0.18) 42%, rgba(5,5,6,0.72) 100%)",
        }}
      />

      {/* Oben: 20+ Länder & Deutschland-Flagge */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 145, display: "flex", gap: 18 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: FLAECHE,
            border: `2.5px solid ${FEHLER}`,
            borderRadius: 20,
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 18, color: FEHLER, fontWeight: 800 }}>
              ● INFIZIERT
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 32, fontWeight: 800, color: "#fff" }}>
              20+ Länder
            </div>
          </div>
          <FlaggeBR size={64} />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: FLAECHE,
            border: `3px solid ${deEin > 0.3 ? AKZENT : LINIE}`,
            borderRadius: 20,
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: 0.2 + 0.8 * deEin,
            transform: `scale(${0.94 + 0.06 * deEin})`,
          }}
        >
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 18, color: AKZENT, fontWeight: 800 }}>
              ● AUCH HIER
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 800, color: "#fff" }}>
              Deutschland
            </div>
          </div>
          <FlaggeDE size={64} />
        </div>
      </div>

      {/* Unten: Live-Zähler 1.000.000+ */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 50,
          padding: "20px 28px",
          borderRadius: 22,
          backgroundColor: FLAECHE,
          border: `3px solid ${AKZENT}`,
          opacity: counterEin,
          transform: `translateY(${(1 - counterEin) * 18}px)`,
        }}
      >
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 22, color: TEXT_GRAU, fontWeight: 700 }}>
          GESTOHLENE KARTENDATEN
        </div>
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 62, fontWeight: 800, color: AKZENT }}>
          {kartenZahl.toLocaleString("de-DE")}+
        </div>
      </div>
    </BuehneVoll>
  );
};

// 2. Fakten-Panel: 1 Mio.+ Karten & ~800 Kassen
export const FaktenServerSzene: React.FC<{ kartenAb: number; kassenAb: number }> = ({
  kartenAb,
  kassenAb,
}) => {
  const s = useSek();
  const kartenEin = weich(s, kartenAb, 0.4);
  const kassenEin = weich(s, kassenAb, 0.4);

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", left: 70, right: 70, top: 210 }}>
        <div
          style={{
            backgroundColor: FLAECHE,
            border: `2.5px solid ${LINIE}`,
            borderRadius: 22,
            padding: "22px 28px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 22, color: AKZENT }}>
              OFFENER SERVER // CARDING-PANEL
            </span>
            <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 20, color: FEHLER }}>
              [EXPOSED]
            </span>
          </div>
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 36, fontWeight: 800, color: "#fff", marginTop: 8 }}>
            „VINY JUNIOR TRILHAS“
          </div>
        </div>

        <div style={{ display: "flex", gap: 22, marginTop: 28 }}>
          <div
            style={{
              flex: 1,
              backgroundColor: FLAECHE,
              border: `3px solid ${kartenEin > 0.2 ? AKZENT : LINIE}`,
              borderRadius: 22,
              padding: "30px 26px",
              opacity: kartenEin,
              transform: `translateY(${(1 - kartenEin) * 18}px)`,
            }}
          >
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 64, fontWeight: 800, color: AKZENT }}>
              1 Mio.+
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 26, color: "#e5e7eb", marginTop: 8 }}>
              Kredit- & Debitkarten
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: FLAECHE,
              border: `3px solid ${kassenEin > 0.2 ? FEHLER : LINIE}`,
              borderRadius: 22,
              padding: "30px 26px",
              opacity: kassenEin,
              transform: `translateY(${(1 - kassenEin) * 18}px)`,
            }}
          >
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 64, fontWeight: 800, color: FEHLER }}>
              ~800
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 26, color: "#e5e7eb", marginTop: 8 }}>
              Windows-Kassen
            </div>
          </div>
        </div>
      </div>
    </BuehneVoll>
  );
};

// 3. Animierte Weltkarte mit ECHTEN Flaggen: Brasilien (677) -> Deutschland (4)
export const WeltkarteDESzene: React.FC<{ deAb: number }> = ({ deAb }) => {
  const s = useSek();
  const brEin = weich(s, 0.1, 0.4);
  const deEin = weich(s, deAb, 0.4);
  const flug = interpolate(s, [0.2, deAb + 0.6], [0, 1], CLAMP);
  const puls = 1 + 0.18 * Math.sin(s * 7);

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", left: 60, right: 60, top: 155 }}>
        <div
          style={{
            backgroundColor: FLAECHE,
            border: `2.5px solid ${LINIE}`,
            borderRadius: 24,
            padding: 18,
            position: "relative",
            height: 490,
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 900 460" style={{ width: "100%", height: "100%" }}>
            <g stroke="#1e2330" strokeWidth="1.5">
              <line x1="0" y1="115" x2="900" y2="115" />
              <line x1="0" y1="230" x2="900" y2="230" />
              <line x1="0" y1="345" x2="900" y2="345" />
              <line x1="225" y1="0" x2="225" y2="460" />
              <line x1="450" y1="0" x2="450" y2="460" />
              <line x1="675" y1="0" x2="675" y2="460" />
            </g>

            {/* Kontinente */}
            <path d="M120,80 L260,70 L280,155 L210,205 L140,165 Z" fill="#1b202c" stroke="#2d3446" strokeWidth="2" />
            <path d="M230,225 L330,240 L355,320 L285,425 L240,395 L220,290 Z" fill="#1e2433" stroke="#3b4257" strokeWidth="2.5" />
            <path d="M470,65 L640,55 L660,160 L560,180 L480,150 Z" fill="#1e2433" stroke="#3b4257" strokeWidth="2.5" />
            <path d="M485,190 L620,195 L635,325 L555,385 L490,300 Z" fill="#1b202c" stroke="#2d3446" strokeWidth="2" />

            {/* Verbindungslinie Brasilien -> Deutschland */}
            <path
              d="M295,305 Q410,150 550,115"
              fill="none"
              stroke={AKZENT}
              strokeWidth="4.5"
              strokeDasharray="10 8"
              pathLength={1}
              strokeDashoffset={1 - flug}
            />
            <circle cx="295" cy="305" r={22 * puls} fill={FEHLER} fillOpacity={0.25 * brEin} />
            <circle cx="295" cy="305" r="11" fill={FEHLER} opacity={brEin} />
            <circle cx="550" cy="115" r={24 * puls} fill={AKZENT} fillOpacity={0.3 * deEin} />
            <circle cx="550" cy="115" r="12" fill={AKZENT} opacity={deEin} />
          </svg>
        </div>

        {/* Zwei große Flaggen-Karten darunter */}
        <div style={{ display: "flex", gap: 20, marginTop: 22 }}>
          <div
            style={{
              flex: 1,
              backgroundColor: FLAECHE,
              border: `2.5px solid ${FEHLER}`,
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: brEin,
            }}
          >
            <FlaggeBR size={80} />
            <div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, color: "#fff", fontWeight: 700 }}>
                Brasilien
              </div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 34, color: FEHLER, fontWeight: 800 }}>
                677 Kassen
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: FLAECHE,
              border: `3px solid ${AKZENT}`,
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: deEin,
              transform: `scale(${0.94 + 0.06 * deEin})`,
            }}
          >
            <FlaggeDE size={80} />
            <div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, color: AKZENT, fontWeight: 800 }}>
                Deutschland
              </div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 34, color: "#fff", fontWeight: 800 }}>
                4 Geräte
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuehneVoll>
  );
};

// 4. Nachgebautes Kassenterminal + Trojaner-Übernahme (statt nur Textzeilen)
export const KassenExploitSzene: React.FC<{ trojanerAb: number }> = ({ trojanerAb }) => {
  const s = useSek();
  const gehackt = weich(s, trojanerAb, 0.4);
  const farbe = gehackt > 0.4 ? FEHLER : AKZENT;

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        {/* Nachgebautes POS-Kassenterminal */}
        <div
          style={{
            width: 440,
            backgroundColor: "#1b1f2a",
            border: `4px solid ${farbe}`,
            borderRadius: 36,
            padding: 28,
            boxShadow: `0 0 50px ${gehackt > 0.4 ? "rgba(239,68,68,0.28)" : "rgba(255,138,31,0.18)"}`,
          }}
        >
          {/* Terminal-Display */}
          <div
            style={{
              backgroundColor: "#090b10",
              borderRadius: 18,
              padding: "22px 24px",
              border: `2px solid ${farbe}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: ZAHLEN_SCHRIFT, fontSize: 18, color: TEXT_GRAU }}>
              <span>WINDOWS POS</span>
              <span style={{ color: farbe, fontWeight: 800 }}>
                {gehackt > 0.4 ? "● SYSTEM-ZUGRIFF" : "● CLFS-LÜCKE"}
              </span>
            </div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 30, fontWeight: 800, color: "#fff", marginTop: 14 }}>
              {gehackt > 0.4 ? "TROJANER AKTIV" : "ADMIN-RECHTE"}
            </div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 20, color: farbe, marginTop: 6 }}>
              {gehackt > 0.4 ? "rat_sniffer.exe → LÄUFT" : "clfs.sys → SYSTEM"}
            </div>
          </div>

          {/* Tastenfeld des Terminals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 26 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                style={{
                  height: 58,
                  borderRadius: 12,
                  backgroundColor: "#262b38",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: ZAHLEN_SCHRIFT,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#d1d5db",
                }}
              >
                {n}
              </div>
            ))}
          </div>

          {/* Kartenschlitz unten */}
          <div
            style={{
              marginTop: 26,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#07080c",
              border: `2px solid ${farbe}`,
            }}
          />
        </div>
      </div>
    </BuehneVoll>
  );
};

// 5. Nachgebaute animierte Kreditkarte: Kartennummer, Ablaufdatum & Bankdaten leuchten auf & wandern zum Server
export const KreditkarteAbgriffSzene: React.FC<{
  nummerAb: number;
  ablaufAb: number;
  bankAb: number;
  serverAb: number;
}> = ({ nummerAb, ablaufAb, bankAb, serverAb }) => {
  const s = useSek();
  const numEin = weich(s, nummerAb, 0.35);
  const ablEin = weich(s, ablaufAb, 0.35);
  const bankEin = weich(s, bankAb, 0.35);
  const srvEin = weich(s, serverAb, 0.4);
  const datenFlug = interpolate(s, [nummerAb, serverAb + 1.2], [0, 1], CLAMP);

  return (
    <BuehneVoll>
      <div style={{ position: "absolute", left: 70, right: 70, top: 155 }}>
        {/* Nachgebaute Kreditkarte */}
        <div
          style={{
            height: 410,
            borderRadius: 28,
            background: "linear-gradient(135deg, #1c2436 0%, #0f131d 100%)",
            border: `3px solid ${AKZENT}`,
            padding: "34px 38px",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          }}
        >
          {/* Bankname oben rechts */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Goldener EMV-Chip */}
            <div
              style={{
                width: 78,
                height: 58,
                borderRadius: 12,
                background: "linear-gradient(135deg, #facc15, #ca8a04)",
                border: "2px solid #fde047",
              }}
            />
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: bankEin > 0.3 ? "rgba(239,68,68,0.22)" : "transparent",
                border: `2.5px solid ${bankEin > 0.3 ? FEHLER : "transparent"}`,
                fontFamily: ZAHLEN_SCHRIFT,
                fontSize: 26,
                fontWeight: 800,
                color: bankEin > 0.3 ? "#fff" : "#9ca3af",
              }}
            >
              MUSTERBANK · VISA
            </div>
          </div>

          {/* Kartennummer */}
          <div
            style={{
              marginTop: 64,
              padding: "12px 18px",
              borderRadius: 14,
              backgroundColor: numEin > 0.3 ? "rgba(239,68,68,0.22)" : "transparent",
              border: `2.5px solid ${numEin > 0.3 ? FEHLER : "transparent"}`,
              fontFamily: ZAHLEN_SCHRIFT,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 4,
              color: "#ffffff",
            }}
          >
            4532  8810  4912  7734
          </div>

          {/* Ablaufdatum */}
          <div style={{ marginTop: 34, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                backgroundColor: ablEin > 0.3 ? "rgba(239,68,68,0.22)" : "transparent",
                border: `2.5px solid ${ablEin > 0.3 ? FEHLER : "transparent"}`,
              }}
            >
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 16, color: TEXT_GRAU }}>
                GÜLTIG BIS
              </div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 32, fontWeight: 800, color: "#fff" }}>
                08 / 28
              </div>
            </div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 22, color: AKZENT, fontWeight: 700 }}>
              ● MITGESCHNITTEN
            </div>
          </div>
        </div>

        {/* Animierte Datenleitung nach unten zum Täter-Kontrollfeld */}
        <div style={{ display: "flex", justifyContent: "center", height: 74, position: "relative" }}>
          <div style={{ width: 4, height: "100%", backgroundColor: LINIE }} />
          <div
            style={{
              position: "absolute",
              top: `${Math.round(datenFlug * 56)}px`,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: FEHLER,
              boxShadow: `0 0 18px ${FEHLER}`,
            }}
          />
        </div>

        {/* Täter-Kontrollfeld */}
        <div
          style={{
            backgroundColor: FLAECHE,
            border: `3px solid ${srvEin > 0.3 ? FEHLER : LINIE}`,
            borderRadius: 22,
            padding: "22px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: 0.3 + 0.7 * srvEin,
          }}
        >
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 20, color: AKZENT, fontWeight: 700 }}>
              KONTROLLFELD DER TÄTER
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, color: "#fff", fontWeight: 800 }}>
              VINY JUNIOR TRILHAS
            </div>
          </div>
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 24, color: FEHLER, fontWeight: 800 }}>
            ● GESPEICHERT
          </div>
        </div>
      </div>
    </BuehneVoll>
  );
};
