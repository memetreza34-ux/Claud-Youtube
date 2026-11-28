import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmLook } from "./doku-bausteine";
import { BrowserFenster, ChatVerlauf, Fallakte, KarteRaum, ladeLand, MemeKlassisch, MemeZweiFelder, ReaktionsPop, Terminal } from "./doku-bausteine2";
import { NOIR_ROT } from "./noir-buehne";

// Vorführung Teil 2: Memes, Chat, Terminal, Fallakte, Karte, Browser
export const DOKU_DEMO2_SEK = 50;

export const DokuDemo2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const [land, setLand] = React.useState<[number, number][][] | null>(null);
  React.useEffect(() => {
    fetch(staticFile("karten/land-110m.json")).then((r) => r.json()).then((t) => setLand(ladeLand(t)));
  }, []);

  let szene: React.ReactNode;
  if (s < 6) {
    szene = <MemeZweiFelder s={s} ab={0.2} nein={{ pose: "b-daumen-runter.jpg", text: "Passwort auf dem To-do-Zettel" }} ja={{ pose: "b-daumen-hoch-lachen.jpg", text: "Passwort-Manager", ab: 2.6 }} />;
  } else if (s < 11) {
    szene = <MemeKlassisch s={s} ab={6} pose="a-18-facepalm-enttaeuscht.jpg" oben="Admin-Passwort der Kühltruhe:" unten="12345" untenAb={8} />;
  } else if (s < 19) {
    szene = (
      <>
        <ChatVerlauf
          s={s}
          ab={11}
          titel="Filiale · Nachtschicht"
          nachrichten={[
            { ab: 11.6, text: "Chef, die Truhen zeigen +50 Grad 😳", name: "Lena" },
            { ab: 13.2, text: "Wer hat das eingestellt??", ich: true },
            { ab: 14.6, text: "Keiner von uns. Die Fernwartung war die ganze Nacht offen.", name: "Lena" },
          ]}
        />
        <ReaktionsPop s={s} ab={16.2} bis={18.6} pose="b-schockiert-mund.jpg" text="Was?!" />
      </>
    );
  } else if (s < 27) {
    szene = (
      <Terminal
        s={s}
        ab={19}
        zeilen={[
          { ab: 19.4, text: 'suche "Kühlsteuerung" --land FR', befehl: true },
          { ab: 20.9, text: "1.825 Geräte offen im Netz gefunden" },
          { ab: 21.6, text: "login 192.0.2.17 --user admin --pass ●●●●●", befehl: true },
          { ab: 23.5, text: "Zugang gewährt (Werkspasswort)" },
          { ab: 24.1, text: "setze abtauen=an dauer=unbegrenzt alarm=aus", befehl: true },
          { ab: 26.0, text: "OK – Temperatur steigt …", farbe: NOIR_ROT },
        ]}
      />
    );
  } else if (s < 36) {
    szene = (
      <Fallakte
        s={s}
        ab={27}
        aktenzeichen="02-KÜHL"
        titel="Sabotage an Kühlanlagen"
        zeilen={[
          { text: "Täter: Einheit Shahid Kaveh" },
          { text: "Auftraggeber: Revolutionsgarde (Iran)" },
          { text: "Ziel: rund 700 Supermärkte" },
          { text: "Kontakt: V-Person Paris, Tel. 0170 …", schwaerzen: [[9, 33, 29.6]] },
          { text: "Zugang: Werkspasswort / Wartungsfirma" },
          { text: "Quelle: frz. Krisenzentrum C4", schwaerzen: [[8, 30, 30.1]] },
        ]}
        lupe={{ ab: 31.0, bis: 33.2, zeile: 0 }}
        stempel={{ text: "LAUT FRANKREICH", ab: 34.0 }}
      />
    );
  } else if (s < 44) {
    szene = (
      <KarteRaum
        s={s}
        ab={36}
        land={land}
        mitte={[12, 50]}
        massstab={42}
        orte={[
          { name: "Paris", lon: 2.35, lat: 48.86, ab: 36.6 },
          { name: "Brüssel", lon: 4.35, lat: 50.85, ab: 37.0 },
          { name: "Stockholm", lon: 18.07, lat: 59.33, ab: 37.4 },
          { name: "Reisbach", lon: 12.63, lat: 48.57, ab: 37.8 },
          { name: "Teheran", lon: 51.39, lat: 35.69, ab: 39.6, farbe: NOIR_ROT },
        ]}
        routen={[
          { von: 4, nach: 0, ab: 40.4 },
          { von: 4, nach: 3, ab: 41.2, farbe: "#ff9a3c" },
        ]}
        kamera={[
          [36, 10, 51, 1.15],
          [38.6, 10, 51, 1.15],
          [40.0, 27, 45, 0.72],
          [44, 27, 45, 0.72],
        ]}
      />
    );
  } else {
    szene = <BrowserFenster s={s} ab={44} bis={50} bild="video-02/heise-lang.png" bildHoehe={4200} url="heise.de/news/Supermarkt-Kuehlsysteme-Deutsche-Geheimdienste-…" scrollBis={1400} />;
  }

  return (
    <FilmLook s={s} lichtschein={[6, 11, 19, 27, 36, 44]}>
      <AbsoluteFill style={{ backgroundColor: "#050506" }}>{szene}</AbsoluteFill>
    </FilmLook>
  );
};
