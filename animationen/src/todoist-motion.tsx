import React from "react";
import { evolvePath } from "@remotion/paths";
import {
  AlertTriangle,
  CheckSquare,
  Cloud,
  Database,
  FileWarning,
  KeyRound,
  Lock,
  LockOpen,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VollBuehne } from "./ki-prompts-motion";
import {
  NOIR_GRUEN,
  NOIR_ORANGE,
  NOIR_ROT,
  klemm,
  rein,
  schwung,
  zweier,
} from "./noir-buehne";
import { MarkenLogo } from "./noir-kit";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";

// 1. Hook-Szene (und Basis für Cover): Noir-Figur am Handy + zentrierte Todoist-Alarm-Pill über Hutkrone + Hook-Titel
export const TodoistHookSzene: React.FC<{
  poseBild: string;
  variante?: "A" | "B" | "C";
  schluesselAb?: number;
}> = ({ poseBild, variante = "A", schluesselAb = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);
  const scanEin = rein(s, Math.max(0, schluesselAb - 0.3), 0.35);
  const pulse = 1 + Math.sin(s * 5.5) * 0.03;

  const badgeText =
    variante === "B"
      ? "6 % DATENABFLUSS"
      : variante === "C"
        ? "AUFGABEN DURCHSUCHT!"
        : "SUCHE: PASSWORT & API-KEY";

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#050506", overflow: "hidden" }}>
      {/* Hauptfigur etwas tiefer (top: 300), damit über der Hutkrone Platz für Überschrift & Badge bleibt */}
      <Img
        src={staticFile(poseBild)}
        style={{
          position: "absolute",
          left: -20,
          top: 295,
          width: 1120,
          height: 1120,
          objectFit: "cover",
          objectPosition: "50% 24%",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 75%, transparent 96%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 75%, transparent 96%)",
        }}
      />

      {/* Saubere Vignette oben */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 390,
          background: "linear-gradient(180deg, #050506 28%, rgba(5,5,6,0))",
          pointerEvents: "none",
        }}
      />

      {/* Zentrierte Todoist-Alarm-Pill sauber zwischen Unterzeile und Hutkrone (ohne Berührung) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 278,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "14px 26px",
            borderRadius: 20,
            backgroundColor: "rgba(18, 12, 16, 0.96)",
            border: `3.5px solid ${NOIR_ROT}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `scale(${(0.88 + 0.12 * schwung(z, 0.08)) * pulse})`,
            boxShadow: "0 18px 44px rgba(239,68,68,0.42)",
          }}
        >
          <MarkenLogo name="todoist-icon" size={46} fallbackColor={NOIR_ROT} />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 27, fontWeight: 900, color: "#ffffff", letterSpacing: 1 }}>
              TODOIST GEHACKT
            </span>
            <span style={{ color: "#64748b", fontWeight: 900 }}>·</span>
            <span style={{ fontFamily: TEXT_SCHRIFT, fontSize: 22, fontWeight: 800, color: "#fca5a5", opacity: 0.8 + 0.2 * scanEin }}>
              {badgeText}
            </span>
          </div>
        </div>
      </div>

      {/* Knackige Hook-Überschrift ganz oben */}
      <div style={{ position: "absolute", left: 48, right: 48, top: 112, textAlign: "center", pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: ZAHLEN_SCHRIFT,
            fontSize: 74,
            fontWeight: 900,
            color: NOIR_ORANGE,
            letterSpacing: 1.5,
            lineHeight: 1.04,
            textShadow: "0 8px 28px rgba(0,0,0,0.95)",
          }}
        >
          TO-DO-APP GEHACKT!
        </div>
        <div
          style={{
            fontFamily: TEXT_SCHRIFT,
            fontSize: 31,
            fontWeight: 700,
            color: "#f8fafc",
            marginTop: 10,
            textShadow: "0 4px 18px rgba(0,0,0,0.95)",
          }}
        >
          Hacker suchen in Aufgaben nach Passwörtern
        </div>
      </div>
    </div>
  );
};

// 2. Animierte Zusatz-Badges über dem 6-%-Beleg mit solidem Verlauf darunter (kein durchscheinender Fließtext)
export const DatenAbflussOverlay: React.FC<{ ab: number }> = ({ ab }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  if (s < ab) return null;
  const fadeEin = rein(s, ab, 0.25);

  const items = [
    { icon: Mail, label: "E-Mail-Adressen", offset: 0, color: NOIR_ORANGE },
    { icon: KeyRound, label: "Alte Passwort-Einträge", offset: 0.4, color: NOIR_ROT },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 46,
        right: 46,
        top: 1130,
        height: 240,
        background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.94) 32%, rgba(10,12,18,0.98) 100%)",
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        display: "flex",
        alignItems: "flex-end",
        padding: "0 20px 30px",
        gap: 16,
        opacity: fadeEin,
        pointerEvents: "none",
      }}
    >
      {items.map((it, idx) => {
        const ein = schwung(zweier(s), ab + it.offset);
        const Icon = it.icon;
        if (s < ab + it.offset) return null;
        return (
          <div
            key={idx}
            style={{
              flex: 1,
              padding: "20px 18px",
              borderRadius: 20,
              backgroundColor: "#141824",
              border: `3.5px solid ${it.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transform: `scale(${0.86 + 0.14 * ein})`,
              boxShadow: "0 14px 32px rgba(0,0,0,0.75)",
            }}
          >
            <Icon size={32} color={it.color} strokeWidth={2.5} />
            <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 24, fontWeight: 900, color: "#f8fafc" }}>
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 3. Erklärung Teil 1: Entwickler-Schlüssel -> 3 Code-Abläufe manipuliert -> Admin -> komplett verbundene Cloud-Leitung
export const CodeAblaufAngriffMotion: React.FC<{
  schluesselRel: number;
  dreiReposRel: number;
  adminRel: number;
  cloudRel: number;
}> = ({ schluesselRel, dreiReposRel, adminRel, cloudRel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);

  const reposY = [150, 390, 630];
  const pfadLinks = reposY.map((y) => `M 255 390 C 325 390, 330 ${y}, 392 ${y}`);
  const pfadRechts = reposY.map((y) => `M 664 ${y} C 710 ${y}, 710 390, 755 390`);
  // Senkrechter Pfad geht lückenlos von unterhalb ADMIN-KEY (y=485) bis direkt in TODOIST CLOUD-SERVER (y=905)
  const adminZuCloudPfad = "M 852 485 V 905";
  const cloudStrahl = rein(s, cloudRel - 0.35, 0.45);
  const cloudEvo = evolvePath(cloudStrahl, adminZuCloudPfad);

  const manipuliert = s >= dreiReposRel;
  const adminAktiv = s >= adminRel;
  const cloudAktiv = s >= cloudRel;
  const paketT = cloudAktiv ? ((s - cloudRel) % 0.9) / 0.9 : 0;

  const headline = cloudAktiv
    ? "EINBRUCH IN DIE CLOUD"
    : adminAktiv
      ? "ADMIN-ZUGANG ABGEGRIFFEN"
      : manipuliert
        ? "3 CODE-ABLÄUFE MANIPULIERT"
        : "GESTOHLENER ENTWICKLER-SCHLÜSSEL";
  const sub = cloudAktiv
    ? "Über manipulierte Hintergrund-Skripte bis ins Produktivnetz"
    : manipuliert
      ? "Prüf-Programme heimlich umgeschrieben"
      : "So gelang der Einstieg bei Todoist";

  return (
    <VollBuehne oberzeile={headline} unterzeile={sub} oberfarbe={manipuliert ? NOIR_ROT : NOIR_ORANGE}>
      <svg width={992} height={1085} style={{ position: "absolute", inset: 0 }}>
        {pfadLinks.map((d, i) => {
          const p = rein(s, schluesselRel + i * 0.14, 0.55);
          const evo = evolvePath(p, d);
          return (
            <path
              key={`l-${i}`}
              d={d}
              fill="none"
              stroke={manipuliert ? NOIR_ROT : NOIR_ORANGE}
              strokeWidth={5}
              strokeDasharray={evo.strokeDasharray}
              strokeDashoffset={evo.strokeDashoffset}
            />
          );
        })}
        {pfadRechts.map((d, i) => {
          const p = rein(s, adminRel - 0.35 + i * 0.1, 0.55);
          const evo = evolvePath(p, d);
          return (
            <path
              key={`r-${i}`}
              d={d}
              fill="none"
              stroke={cloudAktiv ? NOIR_ROT : "#ef4444"}
              strokeWidth={5}
              strokeDasharray={evo.strokeDasharray}
              strokeDashoffset={evo.strokeDashoffset}
            />
          );
        })}
        {/* Verbindung Admin-Knoten -> Cloud unten (komplett bis an den Kasten!) */}
        <path
          d={adminZuCloudPfad}
          fill="none"
          stroke={cloudAktiv ? NOIR_ROT : "#343947"}
          strokeWidth={6}
          strokeDasharray={cloudEvo.strokeDasharray}
          strokeDashoffset={cloudEvo.strokeDashoffset}
        />
        {cloudAktiv ? (
          <circle cx={852} cy={490 + paketT * 405} r={10} fill="#fecaca" stroke={NOIR_ROT} strokeWidth={3} />
        ) : null}
      </svg>

      {/* Links: Gestohlener Entwickler-Schlüssel */}
      <div
        style={{
          position: "absolute",
          left: 38,
          top: 295,
          width: 218,
          padding: "22px 16px",
          borderRadius: 24,
          backgroundColor: "#141824",
          border: `3.5px solid ${NOIR_ORANGE}`,
          textAlign: "center",
          transform: `scale(${schwung(z, 0.04)})`,
        }}
      >
        <KeyRound size={64} color="#facc15" strokeWidth={2.3} style={{ margin: "0 auto" }} />
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 12 }}>
          DEV-SCHLÜSSEL
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 19, color: "#fca5a5", marginTop: 4 }}>
          gestohlen
        </div>
      </div>

      {/* Mitte: 3 breitere Code-Projekte mit großem Badge */}
      {reposY.map((cy, idx) => {
        const hit = manipuliert && s >= dreiReposRel + idx * 0.14;
        const wackel = hit && s < dreiReposRel + idx * 0.14 + 0.4 ? Math.sin(s * 55 + idx) * 4 : 0;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: 392 + wackel,
              top: cy - 76,
              width: 272,
              height: 152,
              borderRadius: 22,
              backgroundColor: hit ? "#231015" : "#141824",
              border: `3.5px solid ${hit ? NOIR_ROT : "#343947"}`,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              boxShadow: hit ? "0 0 34px rgba(239,68,68,0.28)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <MarkenLogo name="github-actions" size={42} fallbackColor={NOIR_ORANGE} />
              <span
                style={{
                  fontFamily: ZAHLEN_SCHRIFT,
                  fontSize: 22,
                  fontWeight: 900,
                  color: hit ? "#fecaca" : NOIR_GRUEN,
                  padding: "5px 12px",
                  borderRadius: 8,
                  backgroundColor: hit ? "rgba(239,68,68,0.28)" : "rgba(34,197,94,0.16)",
                }}
              >
                {hit ? "MANIPULIERT" : "PRÜF-SKRIPT"}
              </span>
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
              Projekt {idx + 1} · Workflow
            </div>
          </div>
        );
      })}

      {/* Rechts: Admin-Zugänge */}
      <div
        style={{
          position: "absolute",
          left: 752,
          top: 295,
          width: 202,
          height: 192,
          padding: "20px 14px",
          borderRadius: 24,
          backgroundColor: adminAktiv ? "#281116" : "#141824",
          border: `3.5px solid ${adminAktiv ? NOIR_ROT : "#343947"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${adminAktiv ? schwung(z, adminRel) : 0.94})`,
          opacity: adminAktiv ? 1 : 0.45,
        }}
      >
        <ShieldAlert size={60} color={adminAktiv ? NOIR_ROT : "#64748b"} />
        <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 23, fontWeight: 900, color: "#fff", marginTop: 10 }}>
          ADMIN-KEY
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 19, color: adminAktiv ? "#fecaca" : "#9ca3af", marginTop: 4 }}>
          {adminAktiv ? "abgegriffen" : "gesichert"}
        </div>
      </div>

      {/* Unten: Todoist Cloud Infrastruktur */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 54,
          height: 126,
          padding: "0 32px",
          borderRadius: 26,
          backgroundColor: cloudAktiv ? "rgba(40,14,18,0.98)" : "#141824",
          border: `3.5px solid ${cloudAktiv ? NOIR_ROT : "#343947"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: `scale(${cloudAktiv ? 0.94 + 0.06 * schwung(z, cloudRel) : 0.98})`,
          boxShadow: cloudAktiv ? "0 0 48px rgba(239,68,68,0.34)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Cloud size={56} color={cloudAktiv ? NOIR_ROT : "#64748b"} />
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 32, fontWeight: 900, color: "#ffffff" }}>
              TODOIST CLOUD-SERVER
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 23, color: cloudAktiv ? "#fecaca" : "#9ca3af", marginTop: 4 }}>
              {cloudAktiv ? "Täter übernimmt Mitarbeiter-Konto" : "Interne Produktionsumgebung"}
            </div>
          </div>
        </div>
        {cloudAktiv ? (
          <div style={{ padding: "10px 20px", borderRadius: 12, backgroundColor: NOIR_ROT, color: "#fff", fontFamily: ZAHLEN_SCHRIFT, fontSize: 22, fontWeight: 900 }}>
            ZUGRIFF
          </div>
        ) : null}
      </div>
    </VollBuehne>
  );
};

// 4. Erklärung Teil 2: Lebendige 3-Stufen-Kette ohne Leerraum: Moderne Konten -> >10 Jahre Altlast (Zähler + Fluss) -> Abgeflossene Datei
export const Sha1AltlastMotion: React.FC<{ bruchRel: number }> = ({ bruchRel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);
  const altAktiv = s >= bruchRel;
  const jahre = Math.round(interpolate(s, [0.3, Math.max(2.2, bruchRel - 1.2)], [1, 10], klemm));
  const flussPfad = "M 496 680 V 830";
  const flussProgress = rein(s, bruchRel - 0.4, 0.7);
  const evo = evolvePath(flussProgress, flussPfad);
  const punktT = altAktiv ? ((s - bruchRel) % 0.9) / 0.9 : 0;

  return (
    <VollBuehne
      oberzeile={altAktiv ? "ALTLAST: VERALTETES SHA-1" : "10 JAHRE ALTE KONTEN"}
      unterzeile="Unveränderte Passwörter steckten im alten Speicher-Format"
      oberfarbe={altAktiv ? NOIR_ROT : NOIR_ORANGE}
    >
      <svg width={992} height={1085} style={{ position: "absolute", inset: 0 }}>
        <path
          d={flussPfad}
          fill="none"
          stroke={altAktiv ? NOIR_ROT : NOIR_ORANGE}
          strokeWidth={6}
          strokeDasharray={evo.strokeDasharray}
          strokeDashoffset={evo.strokeDashoffset}
        />
        {altAktiv ? (
          <circle cx={496} cy={685 + punktT * 140} r={10} fill="#fecaca" stroke={NOIR_ROT} strokeWidth={3} />
        ) : null}
      </svg>

      {/* Oben: Moderner Schutz */}
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 54,
          height: 215,
          borderRadius: 24,
          backgroundColor: "#101a16",
          border: `3.5px solid ${NOIR_GRUEN}`,
          padding: "0 34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: `scale(${schwung(z, 0.04)})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, backgroundColor: "rgba(34,197,94,0.16)", border: `3px solid ${NOIR_GRUEN}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={54} color={NOIR_GRUEN} />
          </div>
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 32, fontWeight: 900, color: "#ffffff" }}>
              NEUE PASSWÖRTER
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, color: "#bbf7d0", marginTop: 6 }}>
              Stark verschlüsselt · nicht betroffen
            </div>
          </div>
        </div>
        <Lock size={42} color={NOIR_GRUEN} />
      </div>

      {/* Mitte: Kompakt animierter 10+ Jahre Zähler & Salted SHA-1 Schloss */}
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 320,
          height: 360,
          borderRadius: 28,
          backgroundColor: altAktiv ? "#261015" : "#141824",
          border: `4px solid ${altAktiv ? NOIR_ROT : NOIR_ORANGE}`,
          padding: "30px 38px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: altAktiv ? "0 0 56px rgba(239,68,68,0.28)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 92, fontWeight: 900, color: altAktiv ? NOIR_ROT : NOIR_ORANGE, lineHeight: 0.95 }}>
              &gt; {jahre} JAHRE
            </div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 30, fontWeight: 800, color: "#f8fafc", marginTop: 12 }}>
              Salted SHA-1 Alt-Verfahren
            </div>
          </div>
          <div style={{ width: 130, height: 130, borderRadius: 32, backgroundColor: altAktiv ? "rgba(239,68,68,0.2)" : "rgba(255,138,31,0.12)", border: `3.5px solid ${altAktiv ? NOIR_ROT : NOIR_ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.92 + 0.08 * schwung(z, bruchRel)})` }}>
            {altAktiv ? <LockOpen size={66} color={NOIR_ROT} /> : <Lock size={66} color={NOIR_ORANGE} />}
          </div>
        </div>
        <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 25, color: altAktiv ? "#fecaca" : "#9ca3af", paddingTop: 14, borderTop: "2px solid rgba(255,255,255,0.08)" }}>
          {altAktiv
            ? "Veraltetes Verfahren: über 10 Jahre nicht abgeschaltet"
            : "Konten mit seit über 10 Jahren unverändertem Passwort"}
        </div>
      </div>

      {/* Unten: Abgeflossene Datei (direkt durch rote Leitung verbunden) */}
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 54,
          height: 200,
          borderRadius: 24,
          backgroundColor: altAktiv ? "#1f0e13" : "#12151f",
          border: `3.5px solid ${altAktiv ? NOIR_ROT : "#343947"}`,
          padding: "0 34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: `scale(${altAktiv ? 0.94 + 0.06 * schwung(z, bruchRel) : 0.98})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <FileWarning size={54} color={altAktiv ? NOIR_ROT : NOIR_ORANGE} />
          <div>
            <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 21, fontWeight: 700, color: "#9ca3af" }}>
              ABGEFLOSSENE DATEI (RUND 6 % DER KONTEN)
            </div>
            <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 30, fontWeight: 900, color: altAktiv ? "#fecaca" : "#f8fafc", marginTop: 6 }}>
              E-MAIL + ALTE HASHES + DATUM
            </div>
          </div>
        </div>
      </div>
    </VollBuehne>
  );
};

// 5. Aufgaben- & Outlook-Scanner (keine tote Leere in der Mitte + klares rotes Outlook-Leuchten auf Stichwort!)
export const AufgabenScannerMotion: React.FC<{ outlookRel: number }> = ({ outlookRel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);
  const scanY = interpolate((s % 2.2) / 2.2, [0, 1], [60, 960], klemm);
  const outlookAktiv = s >= outlookRel;

  const eintraege = [
    { titel: "Einkaufsliste & Termine", sub: "Unkritischer Alltagstext", brisant: false, hitAt: 0.2 },
    { titel: "Server-Admin Passwort: X9!...", sub: "Treffer bei Stichwort-Suche", brisant: true, hitAt: 0.35 },
    { titel: "OpenAI & AWS API-Schlüssel", sub: "Klartext-Key im Kommentar", brisant: true, hitAt: 0.75 },
  ];

  return (
    <VollBuehne
      oberzeile={outlookAktiv ? "AUFGABEN & OUTLOOK DURCHSUCHT" : "GEZIELTE SUCHE IN TO-DO-LISTEN"}
      unterzeile="Manuelle Abfragen & Scanner suchten nach geheimen Schlüsseln"
      oberfarbe={NOIR_ROT}
    >
      {/* Komplette Fläche gleichmäßig ausgefüllt von y=44 bis bottom=44 */}
      <div style={{ position: "absolute", left: 52, right: 52, top: 44, bottom: 44, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "2px solid #242938" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <MarkenLogo name="todoist-icon" size={48} fallbackColor={NOIR_ROT} />
              <span style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 30, fontWeight: 900, color: "#fff" }}>
                PRIVATE AUFGABEN & KOMMENTARE
              </span>
            </div>
            <Search size={34} color={NOIR_ROT} />
          </div>

          {eintraege.map((e, i) => {
            const markiert = e.brisant && s >= e.hitAt;
            return (
              <div
                key={i}
                style={{
                  padding: "28px 30px",
                  borderRadius: 22,
                  backgroundColor: markiert ? "#2a1015" : "#141824",
                  border: `3.5px solid ${markiert ? NOIR_ROT : "#2c3244"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: `scale(${markiert ? 1 + (1 - rein(s, e.hitAt, 0.3)) * 0.03 : 1})`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {e.brisant ? (
                    <AlertTriangle size={42} color={markiert ? NOIR_ROT : NOIR_ORANGE} />
                  ) : (
                    <CheckSquare size={42} color={NOIR_GRUEN} />
                  )}
                  <div>
                    <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 800, color: markiert ? "#fecaca" : "#e5e7eb" }}>
                      {e.titel}
                    </div>
                    <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 21, color: markiert ? "#fca5a5" : "#9ca3af", marginTop: 4 }}>
                      {e.sub}
                    </div>
                  </div>
                </div>
                {markiert ? (
                  <span style={{ padding: "8px 16px", borderRadius: 12, backgroundColor: NOIR_ROT, color: "#fff", fontFamily: ZAHLEN_SCHRIFT, fontSize: 21, fontWeight: 900 }}>
                    ABGEGRIFFEN
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Unten: Outlook-Postfach Kasten (leuchtet beim Wort „Outlook-Postfächer“ deutlich rot auf!) */}
        <div
          style={{
            padding: "28px 30px",
            borderRadius: 24,
            backgroundColor: outlookAktiv ? "#331218" : "#141824",
            border: `4px solid ${outlookAktiv ? NOIR_ROT : "#343947"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${outlookAktiv ? 0.94 + 0.06 * schwung(z, outlookRel) : 0.98})`,
            boxShadow: outlookAktiv ? "0 0 50px rgba(239,68,68,0.45)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <MarkenLogo name="microsoft-icon" size={52} fallbackColor={NOIR_ORANGE} />
            <div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 29, fontWeight: 900, color: "#fff" }}>
                OUTLOOK-ADD-ON BETROFFEN
              </div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 22, color: outlookAktiv ? "#fecaca" : "#9ca3af", marginTop: 6 }}>
                Betreff, Absender & 255 Zeichen Vorschau ausgelesen
              </div>
            </div>
          </div>
          {outlookAktiv ? (
            <span style={{ padding: "10px 18px", borderRadius: 12, backgroundColor: NOIR_ROT, color: "#fff", fontFamily: ZAHLEN_SCHRIFT, fontSize: 20, fontWeight: 900 }}>
              AUSGELESEN
            </span>
          ) : (
            <Mail size={42} color="#64748b" />
          )}
        </div>
      </div>

      {/* Roter Laser-Scannerbalken läuft bis über Outlook */}
      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          top: scanY,
          height: 6,
          backgroundColor: NOIR_ROT,
          boxShadow: "0 0 26px 8px rgba(239,68,68,0.55)",
          pointerEvents: "none",
        }}
      />
    </VollBuehne>
  );
};

// 6. Stand: Offene Frage „Alt-Hashes geknackt?“ (füllt Bühne ausgewogen mit pulsierendem Scan)
export const AltDatenOffenMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const z = zweier(s);
  const pulse = 1 + Math.sin(s * 6) * 0.035;
  const statusP = rein(s, 1.1, 0.5);

  return (
    <VollBuehne
      oberzeile="ALT-DATEN: SCHADEN OFFEN"
      unterzeile="Unklar, ob alte SHA-1-Passwörter schon geknackt wurden"
      oberfarbe={NOIR_ORANGE}
    >
      <div style={{ position: "absolute", inset: "56px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28 }}>
        <div
          style={{
            flex: 1.2,
            padding: "36px 40px",
            borderRadius: 28,
            backgroundColor: "#141824",
            border: `4px solid ${NOIR_ORANGE}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            transform: `scale(${schwung(z, 0.05) * pulse})`,
            boxShadow: "0 0 55px rgba(255,138,31,0.24)",
          }}
        >
          <Database size={84} color={NOIR_ORANGE} />
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 84, fontWeight: 900, color: NOIR_ORANGE, marginTop: 16, lineHeight: 1 }}>
            ~6 % KONTO-DATEN
          </div>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 28, fontWeight: 700, color: "#e5e7eb", marginTop: 14 }}>
            E-Mail-Adressen + gesalzene SHA-1-Hashes beim Täter
          </div>
        </div>

        <div
          style={{
            padding: "34px 36px",
            borderRadius: 26,
            backgroundColor: "#241810",
            border: `3.5px solid ${NOIR_ORANGE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Terminal size={48} color={NOIR_ORANGE} />
            <div>
              <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 32, fontWeight: 900, color: "#fef3c7" }}>
                PASSWÖRTER SCHON GEKNACKT?
              </div>
              <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 23, color: "#fde68a", marginTop: 4 }}>
                Todoist: Bisher keine Hinweise auf Login-Missbrauch
              </div>
            </div>
          </div>
          <span
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              backgroundColor: NOIR_ORANGE,
              color: "#050506",
              fontFamily: ZAHLEN_SCHRIFT,
              fontSize: 24,
              fontWeight: 900,
              opacity: 0.4 + 0.6 * statusP,
            }}
          >
            OFFEN
          </span>
        </div>
      </div>
    </VollBuehne>
  );
};

// 7. Schluss-Warnung mit Strichermittler-Figur (zeigt direkt auf Zuschauer + klare Handlungsregel)
export const TodoistSchlussSzene: React.FC<{ poseBild: string }> = ({ poseBild }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const ein = schwung(zweier(s), 0.12);

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#050506", overflow: "hidden" }}>
      <Img
        src={staticFile(poseBild)}
        style={{
          position: "absolute",
          left: -30,
          top: 250,
          width: 1140,
          height: 1140,
          objectFit: "cover",
          objectPosition: "50% 24%",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 75%, transparent 97%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 75%, transparent 97%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 138,
          padding: "24px 30px",
          borderRadius: 24,
          backgroundColor: "rgba(22, 12, 16, 0.94)",
          border: `3.5px solid ${NOIR_ROT}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          transform: `scale(${0.86 + 0.14 * ein})`,
          boxShadow: "0 18px 42px rgba(239,68,68,0.32)",
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: NOIR_ROT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <X size={42} color="#fff" strokeWidth={3.2} />
        </div>
        <div>
          <div style={{ fontFamily: ZAHLEN_SCHRIFT, fontSize: 38, fontWeight: 900, color: "#ffffff", lineHeight: 1.08 }}>
            KEINE PASSWÖRTER IN NOTIZEN!
          </div>
          <div style={{ fontFamily: TEXT_SCHRIFT, fontSize: 24, fontWeight: 700, color: "#fca5a5", marginTop: 4 }}>
            API-Keys & Codes niemals im Klartext speichern
          </div>
        </div>
      </div>
    </div>
  );
};
