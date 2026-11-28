import type { PlanInfo, Szene } from "../regie/typen";

// Vorführung der Meme-Formate (nur eigene Posen). Läuft als 9:16 (MemeDemoShort) und 16:9 (MemeDemoLang).
export const INFO: PlanInfo = { titel: "Meme-Formate", format: "9:16", ende: 18 };

export const PLAN: Szene[] = [
  {
    typ: "memeStufen", ab: 0, bis: 5, notiz: "Eskalation: von harmlos zu absurd",
    stufen: [
      { pose: "a-2-nachdenklich-kinn-halten.jpg", text: "Passwort in eine Notiz schreiben", ab: 0.2 },
      { pose: "b-gluehbirne-idee.jpg", text: "Notiz „Passwörter“ nennen", ab: 1.4 },
      { pose: "b-mind-blown.jpg", text: "Notiz mit allen Kollegen teilen", ab: 2.6 },
    ],
    klaenge: [{ name: "einschlag", ab: 2.6, laut: 0.35 }],
  },
  {
    typ: "memeErwartung", ab: 5, bis: 9.5,
    erwartung: { pose: "a-1-cool-arme-verschraenkt.jpg", text: "Unsere Daten sind sicher" },
    realitaet: { pose: "b-panik.jpg", text: "6 % aller Konten offen", ab: 6.8 },
    klaenge: [{ name: "glitch", ab: 6.8, laut: 0.3 }],
  },
  { typ: "memeChaos", ab: 9.5, bis: 13.5, pose: "b-kaffee-alles-brennt.jpg", oben: "Firma nach dem Hack:", unten: "Alles unter Kontrolle", untenAb: 11, atmo: { name: "spannung", laut: 0.1 } },
  { typ: "memeZoom", ab: 13.5, bis: 18, pose: "b-schockiert-mund.jpg", text: "Moment mal …", klaenge: [{ name: "einschlag", ab: 13.85, laut: 0.25 }, { name: "einschlag", ab: 14.2, laut: 0.3 }, { name: "einschlag", ab: 14.55, laut: 0.4 }] },
];
