import type { PlanInfo, Szene } from "../regie/typen";

// Demo im Querformat (16:9) für das Regie-System
export const INFO: PlanInfo = { titel: "Regie-Demo lang – Kühlregale", format: "16:9", ende: 30 };
const V = "video-02";

export const PLAN: Szene[] = [
  { typ: "zahl", ab: 0, bis: 4, wert: 700, label: "SUPERMÄRKTE IN EINER NACHT", bild: `${V}/szene-1.jpeg`, rot: true, kapitel: { nr: "1", text: "DIE NACHT" } },
  { typ: "artikel", ab: 4, bis: 9, bild: `${V}/beleg-geheimdienste.png`, quelle: "heise online, 07.11.2026", fokusY: 0.47 },
  {
    typ: "bauplan",
    ab: 9,
    bis: 15,
    titel: "FALL 02 · KÜHLSTEUERUNG · SCHEMA",
    knoten: [
      { id: "k", label: "KÜHLREGALE", icon: "Store", x: 0.16, y: 0.56, ab: 9.2, alarmAb: 13 },
      { id: "s", label: "STEUERUNG", icon: "Cpu", x: 0.47, y: 0.56, ab: 9.8, alarmAb: 13 },
      { id: "i", label: "INTERNET", icon: "Globe", x: 0.78, y: 0.56, ab: 10.4 },
      { id: "a", label: "ANGREIFER", icon: "Skull", x: 0.63, y: 0.22, ab: 11.2, rot: true },
    ],
    linien: [
      { von: "k", nach: "s", ab: 9.6, daten: [10.6, 12.4] },
      { von: "s", nach: "i", ab: 10.2, daten: [10.6, 12.4] },
      { von: "a", nach: "i", ab: 11.6, rot: true, daten: [12.2, 15] },
    ],
    messwert: { ab: 9.4, text: "−18 °C", rotAb: 13, rotText: "+50 °C" },
    reaktion: { pose: "b-schockiert-mund.jpg", ab: 13.2, bis: 14.8, text: "Was?!" },
  },
  {
    typ: "pinnwand",
    ab: 15,
    bis: 20,
    elemente: [
      { ab: 15.2, x: 0.25, y: 0.3, breite: 0.29, drehung: -3, bild: `${V}/beleg-deutschland.png`, ausschnittY: 0.3 },
      { ab: 15.9, x: 0.6, y: 0.28, breite: 0.27, drehung: 2.5, bild: `${V}/szene-1.jpeg` },
      { ab: 16.6, x: 0.82, y: 0.6, breite: 0.16, drehung: 4, zettel: "Wer war das?" },
      { ab: 17.3, x: 0.31, y: 0.7, breite: 0.31, drehung: 1.5, bild: `${V}/beleg-iran.png`, ausschnittY: 0.45 },
    ],
    faeden: [
      [0, 1, 17.8],
      [1, 2, 18.3],
      [2, 3, 18.8],
    ],
  },
  { typ: "meme", ab: 20, bis: 24, pose: "a-18-facepalm-enttaeuscht.jpg", oben: "Admin-Passwort der Kühltruhe:", unten: "12345", untenAb: 21.5 },
  { typ: "browser", ab: 24, bis: 30, bild: `${V}/heise-lang.png`, bildHoehe: 4200, url: "heise.de/news/Supermarkt-Kuehlsysteme-…", scrollBis: 1400 },
];
