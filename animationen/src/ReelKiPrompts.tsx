import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { BAND_HOEHE, BAND_TOP } from "./band";
import { NoirBegruessung } from "./intro-noir";
import {
  ChinaBandMotion,
  ForscherKarte,
  KeysAngriffMotion,
  PromptWegMotion,
  VollBeleg,
} from "./ki-prompts-motion";
import { NOIR_GRUEN, NOIR_ORANGE, NOIR_ROT, sfx } from "./noir-buehne";
import { BildBuehne } from "./optimizely";
import { TEXT_SCHRIFT, ZAHLEN_SCHRIFT } from "./stil";
import { Untertitel } from "./Untertitel";

// Reel 07: 2 Millionen KI-Prompts als Falle (Dragos-Studie, 25.11.2026)
// Volle Bühne (y = 145 .. 1380) bis direkt über die Untertitel – oben nur minimal Luft,
// keine abgeschnittene Hintergrund-Figur, exaktes Wort-Timing.
export const REEL_KI_PROMPTS_SEK = 58.2;
const R = "reel-ki-prompts";
const f = (s: number) => Math.round(s * 30);

const T = {
  api: 2.68,
  willkommen: 5.92,
  name: 6.6,
  dragos: 7.84,
  zweiMio: 9.46,
  ergebnis: 13.58,
  drei: 14.88,
  weg: 17.0,
  apps: 19.34,
  nichtDirekt: 20.68,
  zwischen: 22.96,
  tuer: 24.48,
  mitgeschnitten: 26.54,
  lockvoegel: 30.48,
  zweihundert: 32.12,
  server: 35.12,
  brisant: 36.5,
  speicherten: 39.85,
  china: 41.25,
  chinaFlagge: 42.94,
  openrouter: 44.2,
  raus: 47.28,
  offen: 48.14,
  schluss: 52.16,
};

const OHNE_UNTERTITEL: [number, number][] = [[T.willkommen * 1000, T.dragos * 1000 - 50]];

export const ReelKiPrompts: React.FC<{ coverOhneUntertitel?: boolean }> = ({
  coverOhneUntertitel = false,
}) => (
  <div style={{ position: "relative", width: 1080, height: 1920, backgroundColor: "#050506", overflow: "hidden" }}>
    <Audio src={staticFile(`${R}/audio.wav`)} />

    {/* Soundeffekte synchron zu Einblendungen & Animationen */}
    <Sequence from={f(T.api)} durationInFrames={30}><Audio src={sfx("ding")} volume={0.35} /></Sequence>
    <Sequence from={f(T.drei)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>
    <Sequence from={f(T.apps)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.3} /></Sequence>
    <Sequence from={f(T.tuer)} durationInFrames={30}><Audio src={sfx("pop")} volume={0.4} /></Sequence>
    <Sequence from={f(T.zweihundert)} durationInFrames={30}><Audio src={sfx("minus")} volume={0.4} /></Sequence>
    <Sequence from={f(T.speicherten)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.35} /></Sequence>
    <Sequence from={f(T.china + 0.15)} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.35} /></Sequence>
    <Sequence from={f(T.raus)} durationInFrames={30}><Audio src={sfx("stempel")} volume={0.4} /></Sequence>

    {/* 1. Hook (0.00 - 5.92 s): Individuelle Flow-Szene + knackige Hook-Überschrift ganz oben */}
    <Sequence from={0} durationInFrames={f(T.willkommen)} layout="none">
      <BildBuehne bild={`${R}/flow-hook.png`} fokus={[50, 48]} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 360,
          background: "linear-gradient(180deg, rgba(5,5,6,0.92) 35%, rgba(5,5,6,0))",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", left: 48, right: 48, top: 115, textAlign: "center", pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: ZAHLEN_SCHRIFT,
            fontSize: 74,
            fontWeight: 900,
            color: NOIR_ORANGE,
            letterSpacing: 1.5,
            lineHeight: 1.05,
            textShadow: "0 6px 24px rgba(0,0,0,0.9)",
          }}
        >
          KI-CHATS MITGELESEN!
        </div>
        <div
          style={{
            fontFamily: TEXT_SCHRIFT,
            fontSize: 32,
            fontWeight: 700,
            color: "#f8fafc",
            marginTop: 10,
            textShadow: "0 4px 16px rgba(0,0,0,0.9)",
          }}
        >
          Hacker stehlen API-Schlüssel aus Anfragen
        </div>
      </div>
    </Sequence>

    {/* 2. Noir-Begrüßung (5.92 - 7.84 s) */}
    <Sequence from={f(T.willkommen)} durationInFrames={f(T.dragos) - f(T.willkommen)} layout="none">
      <NoirBegruessung nameAb={T.name - T.willkommen} ende={T.dragos - T.willkommen} bild="figur/intro-noir.jpg" />
    </Sequence>

    {/* 3a. Fakten: HD Moore Portrait scharf im Querformat-Rahmen (7.84 - 9.80 s) */}
    <Sequence from={f(T.dragos)} durationInFrames={f(T.zweiMio) + 10 - f(T.dragos)} layout="none">
      <ForscherKarte
        bild={`${R}/foto-hdmoore.jpg`}
        oberzeile="HD MOORE"
        unterzeile="Chef-Sicherheitsforscher · Dragos"
        rolle="DRAGOS THREAT RESEARCH"
        quelle="Studie vom 19. November 2026"
      />
    </Sequence>

    {/* 3b. Fakten: Dragos-Blog Beleg „nearly two million AI prompts“ (9.80 - 13.58 s) */}
    <Sequence from={f(T.zweiMio) + 10} durationInFrames={f(T.ergebnis) - (f(T.zweiMio) + 10)} layout="none">
      <VollBeleg
        bild={`${R}/beleg-dragos.png`}
        oberzeile="2.000.000 TEST-ANFRAGEN"
        unterzeile="Mit Lockvogel-Schlüsseln bestückt"
        oberfarbe={NOIR_ORANGE}
        markierung={[24, 1054, 1684, 1795]}
        kreisAb={0.2}
        mitteY={1290}
      />
    </Sequence>

    {/* 4. Ergebnis: Dragos-Blog Beleg „Three compromised companies“ (13.58 - 17.00 s) */}
    <Sequence from={f(T.ergebnis)} durationInFrames={f(T.weg) - f(T.ergebnis)} layout="none">
      <VollBeleg
        bild={`${R}/beleg-dragos.png`}
        oberzeile="ERGEBNIS: 3 ANBIETER GEHACKT"
        unterzeile="Unbemerkt mitgelesen"
        oberfarbe={NOIR_ROT}
        markierung={[22, 480, 638, 690]}
        kreisAb={T.drei - T.ergebnis}
        mitteY={690}
      />
    </Sequence>

    {/* 5. Erklärung Teil 1: Volle Bühne „App -> nicht direkt -> Zwischenhändler -> Haustür“ (17.00 - 30.48 s) */}
    <Sequence from={f(T.weg)} durationInFrames={f(T.lockvoegel) - f(T.weg)} layout="none">
      <PromptWegMotion
        appsRel={T.apps - T.weg}
        nichtDirektRel={T.nichtDirekt - T.weg}
        zwischenRel={T.zwischen - T.weg}
        tuerRel={T.tuer - T.weg}
        mitschnittRel={T.mitgeschnitten - T.weg}
      />
    </Sequence>

    {/* 6. Erklärung Teil 2: Volle Bühne „~200 Keys -> 3x3 Server-Raster“ (30.48 - 36.50 s) */}
    <Sequence from={f(T.lockvoegel)} durationInFrames={f(T.brisant) - f(T.lockvoegel)} layout="none">
      <KeysAngriffMotion
        keysRel={T.zweihundert - T.lockvoegel}
        serverRel={T.server - T.lockvoegel}
      />
    </Sequence>

    {/* 7a. Beleg: Zero Data Retention + „DOCH GESPEICHERT“-Stempel (36.50 - 41.25 s) */}
    <Sequence from={f(T.brisant)} durationInFrames={f(T.china) - f(T.brisant)} layout="none">
      <VollBeleg
        bild={`${R}/beleg-thn-clean.png`}
        oberzeile="LÖSCH-VERSPRECHEN IGNORIERT"
        unterzeile="Zero Data Retention ausgehebelt"
        oberfarbe={NOIR_ORANGE}
        markierung={[400, 750, 892, 974]}
        kreisAb={1.6}
        mitteY={840}
        stempelText="DOCH GESPEICHERT"
        stempelAb={T.speicherten - T.brisant}
      />
    </Sequence>

    {/* 7b. China-Abfluss: Volle Bühne mit fliegendem Paket zwischen US und China (41.25 - 44.20 s) */}
    <Sequence from={f(T.china)} durationInFrames={f(T.openrouter) - f(T.china)} layout="none">
      <ChinaBandMotion />
    </Sequence>

    {/* 8a. Stand: Bereinigter THN-Beleg „OpenRouter Drops 3 Providers“ ohne Werbebanner (44.20 - 48.14 s) */}
    <Sequence from={f(T.openrouter)} durationInFrames={f(T.offen) - f(T.openrouter)} layout="none">
      <VollBeleg
        bild={`${R}/beleg-thn-clean.png`}
        oberzeile="OPENROUTER WIRFT 3 ANBIETER RAUS"
        unterzeile="Sofort von der Plattform entfernt"
        oberfarbe={NOIR_GRUEN}
        markierung={[38, 1025, 340, 460]}
        kreisAb={T.raus - T.openrouter}
        mitteY={560}
      />
    </Sequence>

    {/* 8b. Stand: Echte OpenRouter-Webseite komplett sichtbar mit Hinweis-Stempel (48.14 - 52.16 s) */}
    <Sequence from={f(T.offen)} durationInFrames={f(T.schluss) - f(T.offen)} layout="none">
      <VollBeleg
        bild={`${R}/beleg-openrouter.png`}
        oberzeile="AUSMASS BISHER OFFEN"
        unterzeile="Wie viele Firmen-Keys abflossen, ist unklar"
        oberfarbe={NOIR_ORANGE}
        markierung={[30, 1050, 100, 1180]}
        ohneKreis
        mitteY={580}
        stempelText="AUSMASS UNKLAR"
        stempelAb={1.8}
      />
    </Sequence>

    {/* 9. Schluss (52.16 - 58.20 s): Individuelle Flow-Szene Stopp-Geste mit goldenem Schlüssel */}
    <Sequence from={f(T.schluss)} durationInFrames={f(REEL_KI_PROMPTS_SEK) - f(T.schluss)} layout="none">
      <BildBuehne bild={`${R}/flow-schluss.png`} fokus={[50, 42]} />
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
