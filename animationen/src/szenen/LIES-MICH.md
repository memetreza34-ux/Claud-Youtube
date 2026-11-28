# Eigene Szenen

Hier liegen Szenen, die eigens für ein Video gebaut werden, weil sie so besser sind als jeder fertige Baustein
(Grundsatz „ohne Grenzen“, `planung/regie-system.md`, Skill `szene-gestalten`).

- Dateiname: `<video>-<szene>.tsx`, z. B. `video03-tresor.tsx`
- Export: eine Komponente `(props: { s: number; ab: number; bis: number }) => JSX`
- Bildfläche immer über `useFlaeche()` aus `../format` (läuft dann in 16:9 und 9:16)
- Im Plan: `{ typ: "eigen", komponente: "tresor", ab, bis }` und in der Komposition
  `<Regie plan={PLAN} eigeneSzenen={{ tresor: (s, sz) => <Tresor s={s} ab={sz.ab} bis={sz.bis} /> }} />`
- Gelungene eigene Szenen, die wiederverwendbar sind, später in die Bausteine übernehmen.
