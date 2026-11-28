// Prüft einen Szenenplan gegen die Regie-Regeln (planung/regie-system.md).
//   node tools/regie-pruefen.mjs animationen/src/plaene/<video>.ts
// Der Plan muss `export const PLAN` und `export const INFO` haben. Exit-Code 1 bei FEHLERN.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const hier = path.dirname(fileURLToPath(import.meta.url));
const anim = path.join(hier, "..", "animationen");
const require = createRequire(path.join(anim, "package.json"));
const esbuild = require("esbuild");

const datei = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
  console.error("Aufruf: node tools/regie-pruefen.mjs <plan.ts>");
  process.exit(2);
}
const pruefer = path.join(anim, "src", "regie", "pruefen.ts");
const ergebnis = esbuild.buildSync({
  stdin: {
    contents: `import { PLAN, INFO } from ${JSON.stringify(datei)}; import { pruefePlan } from ${JSON.stringify(pruefer)}; export const out = { info: INFO, plan: PLAN, befunde: pruefePlan(PLAN, INFO) };`,
    resolveDir: anim,
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  logLevel: "silent",
});
const mod = { exports: {} };
new Function("module", "exports", "require", ergebnis.outputFiles[0].text)(mod, mod.exports, require);
const { info, plan, befunde } = mod.exports.out;

// Klang-Dateien müssen existieren, sonst bricht das Rendern ab
const fs = require("node:fs");
plan.forEach((s) => {
  const namen = [...(s.klaenge ?? []).map((k) => k.name), ...(s.atmo ? [s.atmo.name] : [])];
  namen.forEach((n) => {
    if (!fs.existsSync(path.join(anim, "public", "klang", `${n}.wav`)))
      befunde.push({ stufe: "FEHLER", zeit: s.ab, text: `Klang „${n}“ fehlt in public/klang/ (tools/klang.py ${n} …)` });
  });
  (s.klaenge ?? []).forEach((k) => {
    if (k.ab < s.ab - 0.05 || k.ab > s.bis) befunde.push({ stufe: "HINWEIS", zeit: k.ab, text: `Klang „${k.name}“ liegt außerhalb seiner Szene` });
  });
});
befunde.sort((a, b) => a.zeit - b.zeit);

const zeit = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${(t % 60).toFixed(1).padStart(4, "0")}`;
console.log(`\n${info.titel} (${info.format}, ${info.ende.toFixed(1)} s) – ${plan.length} Szenen\n`);
const typen = {};
plan.forEach((s) => (typen[s.typ] = (typen[s.typ] ?? 0) + 1));
console.log("Bausteine:", Object.entries(typen).map(([t, n]) => `${t} ×${n}`).join(", "));
console.log("");
plan.forEach((s) => console.log(`  ${zeit(s.ab)}–${zeit(s.bis)}  ${s.typ.padEnd(9)} ${s.kapitel ? `[Kapitel ${s.kapitel.nr}] ` : ""}${s.reaktion ? "[+Reaktion] " : ""}${s.notiz ?? ""}`));
console.log("");
if (!befunde.length) console.log("✅ Keine Befunde – der Plan hält alle Regie-Regeln ein.");
befunde.forEach((b) => console.log(`${b.stufe === "FEHLER" ? "❌" : "⚠️ "} ${zeit(b.zeit)}  ${b.text}`));
const fehler = befunde.filter((b) => b.stufe === "FEHLER").length;
console.log(`\n${fehler} Fehler, ${befunde.length - fehler} Hinweise`);
process.exit(fehler ? 1 : 0);
