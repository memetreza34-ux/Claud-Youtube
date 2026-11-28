import { BELEG, FIGUR, type PlanInfo, type Szene } from "./typen";

// Prüft einen Szenenplan auf die Regie-Regeln (planung/regie-system.md).
// FEHLER = nur technische Probleme (Lücken, Überlappung, zu früh zu Ende).
// HINWEIS = Denkanstoß, keine Grenze: Jede Szene soll so gut wie möglich sein (Arman, 28.11.2026).
export type Befund = { stufe: "FEHLER" | "HINWEIS"; zeit: number; text: string };

export const pruefePlan = (plan: Szene[], info: PlanInfo): Befund[] => {
  const b: Befund[] = [];
  const kurz = info.format === "9:16";
  const p = [...plan].sort((x, y) => x.ab - y.ab);
  const add = (stufe: Befund["stufe"], zeit: number, text: string) => b.push({ stufe, zeit: Math.round(zeit * 10) / 10, text });
  if (!p.length) return [{ stufe: "FEHLER", zeit: 0, text: "Plan ist leer" }];

  // 1. Lücken und Überlappungen
  if (p[0].ab > 0.05) add("FEHLER", 0, `Lücke am Anfang bis ${p[0].ab} s`);
  for (let i = 1; i < p.length; i++) {
    const d = p[i].ab - p[i - 1].bis;
    if (d > 0.05) add("FEHLER", p[i - 1].bis, `Lücke von ${d.toFixed(2)} s`);
    if (d < -0.05) add("FEHLER", p[i].ab, `Szenen überlappen (${(-d).toFixed(2)} s)`);
  }
  if (p[p.length - 1].bis < info.ende - 0.05) add("FEHLER", p[p.length - 1].bis, `Plan endet vor dem Ton (${info.ende} s)`);
  p.forEach((sz) => {
    if (sz.bis - sz.ab > 6 && !sz.klaenge?.length && !sz.atmo)
      add("HINWEIS", sz.ab, `${(sz.bis - sz.ab).toFixed(1)} s ohne eigenen Klang – gibt es ein Ereignis/Wort, das man hören sollte (klaenge/atmo)?`);
  });

  // 2. Dauer pro Szene
  const [min, max] = kurz ? [1.5, 7] : [2.5, 10];
  p.forEach((s) => {
    const d = s.bis - s.ab;
    if (d < min) add("HINWEIS", s.ab, `${s.typ}: nur ${d.toFixed(1)} s – zu kurz zum Erfassen`);
    if (d > max) add("HINWEIS", s.ab, `${s.typ}: ${d.toFixed(1)} s – zu lang, teilen oder zweite Szene einbauen`);
  });

  // 3. Abwechslung
  for (let i = 1; i < p.length; i++) {
    if (p[i].typ === p[i - 1].typ && p[i].typ !== "eigen") add("HINWEIS", p[i].ab, `zweimal hintereinander „${p[i].typ}“ – ist das wirklich die beste Darstellung?`);
  }
  for (let i = 0; i + 5 <= p.length; i++) {
    const zaehl: Record<string, number> = {};
    p.slice(i, i + 5).forEach((s) => (zaehl[s.typ] = (zaehl[s.typ] ?? 0) + 1));
    Object.entries(zaehl).forEach(([t, n]) => {
      if (n >= 3 && t !== "eigen") add("HINWEIS", p[i].ab, `„${t}“ ${n}× in fünf Szenen – mehr mischen`);
    });
  }
  let belegFolge = 0;
  p.forEach((s) => {
    belegFolge = BELEG.includes(s.typ) ? belegFolge + 1 : 0;
    if (belegFolge === 3) add("HINWEIS", s.ab, "drei Belege hintereinander – Erklärung oder Figur dazwischen");
  });
  const typen = new Set(p.map((s) => s.typ));
  const minTypen = kurz ? 5 : 8;
  if (typen.size < minTypen) add("HINWEIS", 0, `nur ${typen.size} verschiedene Darstellungsarten – reicht die Vielfalt für dieses Video?`);

  // 4. Hook: nie mit stehender Figur anfangen
  if (p[0].typ === "figur") add("HINWEIS", 0, "Video beginnt mit Figur-Bild – Hook sollte die Sache selbst zeigen");

  // 5. Figur und Belege regelmäßig
  const figurZeiten = p.filter((s) => FIGUR.includes(s.typ)).map((s) => s.ab).concat(p.filter((s) => s.reaktion).map((s) => s.reaktion!.ab));
  const belegZeiten = p.filter((s) => BELEG.includes(s.typ)).map((s) => s.ab);
  const abstand = (zeiten: number[], grenze: number, was: string) => {
    const z = [0, ...zeiten.sort((x, y) => x - y), info.ende];
    for (let i = 1; i < z.length; i++) if (z[i] - z[i - 1] > grenze) add("HINWEIS", z[i - 1], `${Math.round(z[i] - z[i - 1])} s ohne ${was}`);
  };
  abstand(figurZeiten, kurz ? 25 : 60, "Figur/Meme/Reaktion");
  abstand(belegZeiten, kurz ? 40 : 90, "echten Beleg");

  return b.sort((x, y) => x.zeit - y.zeit);
};
