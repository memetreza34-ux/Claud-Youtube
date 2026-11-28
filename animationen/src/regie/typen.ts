// Regie-System: jedes Video ist ein Szenenplan aus Daten. Jede Szene wählt EINEN Baustein,
// passend zu dem, was in diesem Moment gesagt wird. Alle Zeiten in Sekunden (absolut).
// Positionen in Bauplan/Pinnwand sind relativ (0 … 1 der Bildbreite/-höhe), damit der Plan in 16:9 und 9:16 funktioniert.

export type Format = "16:9" | "9:16";

export type Kapitel = { nr: string; text: string };
export type Reaktion = { pose: string; ab: number; bis: number; text?: string };

type Basis = {
  ab: number;
  bis: number;
  kapitel?: Kapitel; // Kapitel-Titel am Szenenanfang (nur lange Videos)
  reaktion?: Reaktion; // Figur springt kurz rein (ReaktionsPop)
  notiz?: string; // warum diese Szene (für den Prüfer/Menschen)
  klaenge?: Klang[]; // eigene Klänge genau auf Wortzeiten/Ereignisse (Dateien in public/klang/, siehe tools/klang.py)
  atmo?: { name: string; laut?: number }; // Klangteppich unter der ganzen Szene, läuft in Schleife (brummen, spannung, raum)
  stumm?: boolean; // automatischen Standard-Klang beim Szenenwechsel weglassen
};

export type Klang = { name: string; ab: number; laut?: number };

export type BauplanKnoten = { id: string; label: string; icon: string; x: number; y: number; ab: number; alarmAb?: number; rot?: boolean };
export type BauplanLinie = { von: string; nach: string; ab: number; rot?: boolean; daten?: [ab: number, bis: number] };
export type PinRel = { ab: number; x: number; y: number; breite: number; drehung?: number; bild?: string; zettel?: string; verhaeltnis?: number; ausschnittY?: number };

export type Szene = Basis &
  (
    | { typ: "artikel"; bild: string; quelle: string; fokusY?: number; richtung?: 1 | -1; verhaeltnis?: number } // verhaeltnis = Breite/Höhe des Screenshots (Shorts: 9/16)
    | { typ: "browser"; bild: string; bildHoehe: number; url: string; scrollBis?: number }
    | { typ: "pinnwand"; elemente: PinRel[]; faeden?: [a: number, b: number, ab: number][]; fokus?: [t: number, index: number | null][] }
    | { typ: "bauplan"; titel?: string; knoten: BauplanKnoten[]; linien: BauplanLinie[]; messwert?: { ab: number; text: string; rotAb?: number; rotText?: string } }
    | { typ: "meme"; pose: string; oben?: string; unten?: string; untenAb?: number }
    | { typ: "memeZwei"; nein: { pose: string; text: string }; ja: { pose: string; text: string; ab: number } }
    | { typ: "chat"; titel: string; nachrichten: { ab: number; text: string; ich?: boolean; name?: string }[] }
    | { typ: "terminal"; titel?: string; zeilen: { ab: number; text: string; befehl?: boolean; rot?: boolean }[] }
    | { typ: "akte"; aktenzeichen: string; titel: string; zeilen: { text: string; schwaerzen?: [von: number, bis: number, ab: number][] }[]; stempel?: { text: string; ab: number }; lupe?: { ab: number; bis: number; zeile: number } }
    | { typ: "karte"; mitte: [lon: number, lat: number]; massstab: number; orte: { name: string; lon: number; lat: number; ab: number; rot?: boolean }[]; routen?: { von: number; nach: number; ab: number }[]; kamera?: [t: number, lon: number, lat: number, zoom: number][] }
    | { typ: "figur"; bild: string; ursprung?: string; zoomVon?: number; zoomBis?: number }
    | { typ: "zahl"; wert: number; vorsilbe?: string; einheit?: string; label: string; bild?: string; rot?: boolean }
    | { typ: "eigen"; komponente: string } // videospezifischer Held (z. B. Kühltruhe), wird über eigeneSzenen übergeben
  );

export type SzenenTyp = Szene["typ"];

export type PlanInfo = { titel: string; format: Format; ende: number };

// Kategorien für die Abwechslungsregeln
export const BELEG: SzenenTyp[] = ["artikel", "browser", "pinnwand"];
export const FIGUR: SzenenTyp[] = ["figur", "meme", "memeZwei"];
