import type { PlanInfo, Szene } from "../regie/typen";

// Vorführung der 2,5D-Fotos (Tiefenkarte + echte 3D-Kamera), auch mit freigestellter Figur davor.
export const INFO: PlanInfo = { titel: "2,5D-Fotos", format: "16:9", ende: 15 };

export const PLAN: Szene[] = [
  { typ: "foto3d", ab: 0, bis: 5, bild: "demo/serverraum.jpg", tiefe: "demo/serverraum-tiefe.png", bewegung: "rein", titel: "Rechenzentrum (Symbolbild)", atmo: { name: "brummen", laut: 0.12 } },
  { typ: "foto3d", ab: 5, bis: 10, bild: "video-02/szene-2.jpeg", tiefe: "demo/szene-2-tiefe.png", bewegung: "kreisen", fokus: [0.42, 0.45] },
  { typ: "foto3d", ab: 10, bis: 15, bild: "demo/serverraum.jpg", tiefe: "demo/serverraum-tiefe.png", bewegung: "links", hell: 0.7, vorne: { bild: "demo/panik-frei.png", hoehe: 0.8, x: 0.7, y: 1.04 } },
];
