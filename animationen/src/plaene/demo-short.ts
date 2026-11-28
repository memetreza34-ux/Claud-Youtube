import type { PlanInfo, Szene } from "../regie/typen";

// Demo-Short (9:16) für das Regie-System: jede Szene ein anderer Baustein, passend zur Aussage.
export const INFO: PlanInfo = { titel: "Regie-Demo Short – Kühlregale", format: "9:16", ende: 34 };
const V = "video-02";

export const PLAN: Szene[] = [
  { typ: "zahl", ab: 0, bis: 3.5, wert: 700, label: "SUPERMÄRKTE IN EINER NACHT GEHACKT", bild: `${V}/szene-1.jpeg`, rot: true, notiz: "Hook: die Zahl, nicht die Figur" },
  { typ: "artikel", ab: 3.5, bis: 7, bild: `${V}/beleg-deutschland-hoch.png`, verhaeltnis: 9 / 16, quelle: "Telepolis, 04.11.2026", fokusY: 0.6, notiz: "deutscher Beleg, im Hochformat aufgenommen" },
  {
    typ: "bauplan",
    ab: 7,
    bis: 11,
    titel: "SCHEMA · KÜHLSTEUERUNG",
    knoten: [
      { id: "k", label: "KÜHLREGALE", icon: "Store", x: 0.27, y: 0.3, ab: 7.2, alarmAb: 9.8 },
      { id: "s", label: "STEUERUNG", icon: "Cpu", x: 0.73, y: 0.3, ab: 7.6, alarmAb: 9.8 },
      { id: "i", label: "INTERNET", icon: "Globe", x: 0.27, y: 0.6, ab: 8.0 },
      { id: "a", label: "ANGREIFER", icon: "Skull", x: 0.73, y: 0.6, ab: 8.6, rot: true },
    ],
    linien: [
      { von: "k", nach: "s", ab: 7.5, daten: [8.2, 9.6] },
      { von: "s", nach: "i", ab: 7.9 },
      { von: "a", nach: "i", ab: 8.9, rot: true, daten: [9.3, 11] },
    ],
    messwert: { ab: 7.4, text: "−18 °C", rotAb: 9.8, rotText: "+50 °C" },
    notiz: "Technik im Bauplan-Stil",
  },
  { typ: "meme", ab: 11, bis: 14.5, pose: "a-18-facepalm-enttaeuscht.jpg", oben: "Admin-Passwort der Kühltruhe:", unten: "12345", untenAb: 12.6, notiz: "Meme mit eigener Figur" },
  {
    typ: "terminal",
    ab: 14.5,
    bis: 19.5,
    zeilen: [
      { ab: 14.8, text: 'suche "Kühlsteuerung"', befehl: true },
      { ab: 15.9, text: "1.825 Geräte offen" },
      { ab: 16.4, text: "login --pass ●●●●●", befehl: true },
      { ab: 17.4, text: "Zugang gewährt" },
      { ab: 17.9, text: "abtauen=an alarm=aus", befehl: true },
      { ab: 19.0, text: "Temperatur steigt …", rot: true },
    ],
  },
  {
    typ: "karte",
    ab: 19.5,
    bis: 24,
    mitte: [15, 48],
    massstab: 36,
    orte: [
      { name: "Paris", lon: 2.35, lat: 48.86, ab: 19.8 },
      { name: "Reisbach", lon: 12.63, lat: 48.57, ab: 20.2 },
      { name: "Teheran", lon: 51.39, lat: 35.69, ab: 21.4, rot: true },
    ],
    routen: [{ von: 2, nach: 0, ab: 21.9 }],
    kamera: [
      [19.5, 8, 49, 1.3],
      [21.0, 8, 49, 1.3],
      [22.2, 28, 43, 0.75],
      [24, 28, 43, 0.75],
    ],
  },
  {
    typ: "akte",
    ab: 24,
    bis: 28.5,
    aktenzeichen: "02-KÜHL",
    titel: "Sabotage an Kühlanlagen",
    zeilen: [
      { text: "Täter: Shahid Kaveh" },
      { text: "Auftrag: Revolutionsgarde" },
      { text: "Ziel: rund 700 Märkte" },
      { text: "Kontakt: geheim", schwaerzen: [[9, 16, 25.6]] },
    ],
    stempel: { text: "LAUT FRANKREICH", ab: 27.2 },
  },
  { typ: "memeZwei", ab: 28.5, bis: 31, nein: { pose: "b-daumen-runter.jpg", text: "Werkspasswort lassen" }, ja: { pose: "b-daumen-hoch-lachen.jpg", text: "Sofort ändern", ab: 29.6 } },
  { typ: "figur", ab: 31, bis: 34, bild: `${V}/szene-4.jpeg`, zoomVon: 1.0, zoomBis: 1.12, notiz: "Schluss: Figur zeigt auf dich" },
];
