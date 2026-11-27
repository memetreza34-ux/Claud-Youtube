import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { NoirBegruessung } from "./intro-noir";
import { VollBeleg } from "./ki-prompts-motion";
import { NOIR_GRUEN, NOIR_ORANGE, NOIR_ROT, sfx } from "./noir-buehne";
import {
  AltDatenOffenMotion,
  AufgabenScannerMotion,
  CodeAblaufAngriffMotion,
  DatenAbflussOverlay,
  Sha1AltlastMotion,
  TodoistHookSzene,
  TodoistSchlussSzene,
} from "./todoist-motion";
import { Untertitel } from "./Untertitel";

// Reel 08: Todoist gehackt – Passwörter in Aufgaben gesucht (27.11.2026)
export const REEL_TODOIST_SEK = 65.5;
const R = "reel-todoist";
const f = (s: number) => Math.round(s * 30);

const T = {
  passwoerter: 5.56,
  willkommen: 8.02,
  name: 8.66,
  fakten: 9.74,
  todoist: 14.2,
  prozent6: 15.08,
  zahl6: 16.64,
  mailBadges: 18.4,
  warum: 21.4,
  devKey: 23.56,
  dreiRepos: 26.3,
  admin: 32.1,
  cloud: 34.0,
  altlast: 35.04,
  sha1: 40.78,
  brisant: 42.64,
  scanner: 46.2,
  outlook: 47.8,
  stand: 50.02,
  gesperrt: 52.86,
  offen: 55.86,
  schluss: 59.92,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.fakten * 1000 - 50]];

export const ReelTodoist: React.FC<{
  coverOhneUntertitel?: boolean;
  coverPose?: "A" | "B" | "C";
}> = ({ coverOhneUntertitel = false, coverPose = "A" }) => {
  const hookPose =
    coverPose === "B" ? `${R}/pose-brand.jpg` : `${R}/pose-handy.jpg`;

  return (
    <div style={{ position: "relative", width: 1080, height: 1920, backgroundColor: "#050506", overflow: "hidden" }}>
      <Audio src={staticFile(`${R}/audio.wav`)} />

      {/* Punktgenaue Soundeffekte */}
      <Sequence from={f(T.passwoerter)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.35} /></Sequence>
      <Sequence from={f(T.todoist)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.35} /></Sequence>
      <Sequence from={f(T.mailBadges)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      <Sequence from={f(T.dreiRepos)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>
      <Sequence from={f(T.admin)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
      <Sequence from={f(T.cloud)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.3} /></Sequence>
      <Sequence from={f(T.sha1)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
      <Sequence from={f(T.scanner)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.32} /></Sequence>
      <Sequence from={f(T.gesperrt)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>
      <Sequence from={f(T.schluss)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.35} /></Sequence>

      {/* 1. Hook (0.00 - 8.02 s): Strichermittler am Smartphone + Todoist Alarmkarte */}
      <Sequence from={0} durationInFrames={f(T.willkommen)} layout="none">
        <TodoistHookSzene poseBild={hookPose} variante={coverPose} schluesselAb={2.5} />
      </Sequence>

      {/* 2. Noir-Begrüßung (8.02 - 9.74 s) */}
      <Sequence from={f(T.willkommen)} durationInFrames={f(T.fakten) - f(T.willkommen)} layout="none">
        <NoirBegruessung nameAb={T.name - T.willkommen} ende={T.fakten - T.willkommen} bild="figur/intro-noir.jpg" />
      </Sequence>

      {/* 3a. Fakten Teil 1: GBHackers Artikel „Todoist Data Breach“ (9.74 - 15.08 s) */}
      <Sequence from={f(T.fakten)} durationInFrames={f(T.prozent6) - f(T.fakten)} layout="none">
        <VollBeleg
          bild={`${R}/beleg-gbhackers.png`}
          oberzeile="TODOIST SERVER GEHACKT"
          unterzeile="Vorfall vom 22. und 23. November"
          oberfarbe={NOIR_ORANGE}
          markierung={[48, 1005, 830, 1122]}
          kreisAb={T.todoist - T.fakten - 1.5}
          mitteY={690}
        />
      </Sequence>

      {/* 3b. Fakten Teil 2: Todoist Security Advisory „Affected approximately 6%“ + animierte Daten-Badges (15.08 - 21.40 s) */}
      <Sequence from={f(T.prozent6)} durationInFrames={f(T.warum) - f(T.prozent6)} layout="none">
        <VollBeleg
          bild={`${R}/beleg-todoist-6pct.png`}
          oberzeile="RUND 6 % DER KONTEN"
          unterzeile="Offizielle Todoist-Meldung bestätigt Abfluss"
          oberfarbe={NOIR_ROT}
          markierung={[96, 799, 922, 995]}
          kreisAb={T.zahl6 - T.prozent6}
          mitteY={1040}
        />
        <DatenAbflussOverlay ab={T.mailBadges - T.prozent6} />
      </Sequence>

      {/* 4. Erklärung Teil 1: Gestohlener Dev-Key -> 3 Workflows manipuliert -> Admin -> Cloud (21.40 - 35.04 s) */}
      <Sequence from={f(T.warum)} durationInFrames={f(T.altlast) - f(T.warum)} layout="none">
        <CodeAblaufAngriffMotion
          schluesselRel={T.devKey - T.warum}
          dreiReposRel={T.dreiRepos - T.warum}
          adminRel={T.admin - T.warum}
          cloudRel={T.cloud - T.warum}
        />
      </Sequence>

      {/* 5a. Altlast SHA-1 > 10 Jahre (35.04 - 42.64 s) */}
      <Sequence from={f(T.altlast)} durationInFrames={f(T.brisant) - f(T.altlast)} layout="none">
        <Sha1AltlastMotion bruchRel={T.sha1 - T.altlast} />
      </Sequence>

      {/* 5b. Beleg Suche nach Credentials in Todoist (42.64 - 46.20 s) */}
      <Sequence from={f(T.brisant)} durationInFrames={f(T.scanner) - f(T.brisant)} layout="none">
        <VollBeleg
          bild={`${R}/beleg-todoist-suche.png`}
          oberzeile="SCHLÜSSEL-SUCHE BELEGT"
          unterzeile="Gezielte Abfragen in Aufgaben & Kommentaren"
          oberfarbe={NOIR_ROT}
          markierung={[96, 975, 892, 1025]}
          kreisAb={0.8}
          mitteY={1180}
        />
      </Sequence>

      {/* 5c. Aufgaben- & Outlook-Scanner Motion (46.20 - 50.02 s) */}
      <Sequence from={f(T.scanner)} durationInFrames={f(T.stand) - f(T.scanner)} layout="none">
        <AufgabenScannerMotion outlookRel={T.outlook - T.scanner} />
      </Sequence>

      {/* 6a. Stand: Todoist sperrt Zugang & warnt Betroffene (50.02 - 55.86 s) */}
      <Sequence from={f(T.stand)} durationInFrames={f(T.offen) - f(T.stand)} layout="none">
        <VollBeleg
          bild={`${R}/beleg-todoist-top.png`}
          oberzeile="ZUGANG SOFORT BLOCKIERT"
          unterzeile="Alte SHA-1-Verfahren abgeschaltet & Warnmails raus"
          oberfarbe={NOIR_GRUEN}
          markierung={[98, 712, 696, 846]}
          kreisAb={0.4}
          mitteY={760}
          stempelText="ZUGANG BLOCKIERT"
          stempelAb={T.gesperrt - T.stand}
          stempelFarbe={NOIR_GRUEN}
        />
      </Sequence>

      {/* 6b. Offene Frage: Alt-Hashes geknackt? (55.86 - 59.92 s) */}
      <Sequence from={f(T.offen)} durationInFrames={f(T.schluss) - f(T.offen)} layout="none">
        <AltDatenOffenMotion />
      </Sequence>

      {/* 7. Schluss-Warnung an Zuschauer (59.92 - 65.50 s) */}
      <Sequence from={f(T.schluss)} durationInFrames={f(REEL_TODOIST_SEK) - f(T.schluss)} layout="none">
        <TodoistSchlussSzene poseBild={`${R}/pose-zeige.jpg`} />
      </Sequence>

      {coverOhneUntertitel ? null : (
        <Untertitel
          datei={`${R}/untertitel.json`}
          top={BAND_TOP + BAND_HOEHE + 40}
          wechselMs={1080}
          groesse={60}
          saetze
          ohne={OHNE_UNTERTITEL}
        />
      )}
    </div>
  );
};
