# Regie – jede Szene so gut wie möglich

Gilt für **alle** Videos: lange Videos (16:9) und Reels/Shorts (9:16).

**Grundsatz (Arman, 28.11.2026): Es gibt keine Grenzen.** Jede einzelne Szene wird so gut dargestellt, wie es überhaupt möglich ist. Die fertigen Bausteine sind ein **Werkzeugkasten**, kein Katalog, aus dem man wählen *muss*. Wenn eine Szene mit etwas Eigenem besser wird, wird es eigens gebaut.

## Für jede Szene diese Fragen beantworten
1. **Was ist die eine Aussage dieses Moments?** (Was soll der Zuschauer danach wissen oder fühlen?)
2. **Was wäre die stärkste denkbare Darstellung?** Ohne an vorhandene Bausteine zu denken: Wie würden Simplicissimus, Kurzgesagt, Johnny Harris, Barely Sociable oder ein Kinofilm genau diesen Moment zeigen?
3. **Womit lässt sich das am besten umsetzen?** Alles ist erlaubt und wird kombiniert:
   - eigene Animation in Remotion (SVG, CSS-3D, `@remotion/three` für echtes 3D, Partikel, Pfade, Masken)
   - echtes Material: Fotos, Screenshots, Dokumente, Karten, Videoclips (Download nur nach OK)
   - Google-Flow-Bilder (0 Credits): eigens für die Szene erzeugt, auch in Ebenen für Parallaxe
   - Flow-Videoclips (kosten Credits, nur nach OK)
   - die Figur, Memes mit eigenen Posen, Reaktionen
   - Sounddesign passend zur Bewegung
   - fertige Bausteine als Startpunkt, angepasst oder kombiniert
4. **Bauen, ansehen, besser machen:** Szene einzeln rendern, kritisch gegen die besten Vorbilder vergleichen und nachbessern, bis sie überzeugt.

## Werkzeugkasten (Startpunkte, keine Pflicht)
| Baustein | gut für … |
|---|---|
| `zahl` | überraschende Zahl, gern mit Bild dahinter |
| `artikel` | Quelle bestätigt etwas (schräge Seite, scharfe Zeile) |
| `browser` | echte Seite „live“ zeigen |
| `pinnwand` | mehrere Spuren, Ermittlungsgefühl |
| `bauplan` | Technik erklären (orange Striche, Datenfluss) |
| `terminal` | was der Täter tut (erfundene, harmlose Befehle) |
| `chat` | Menschen schreiben sich (nachgestellt) |
| `akte` | Täter, Ermittlung, Geheimes |
| `karte` | Orte, Länder, Wege |
| `meme`, `memeZwei`, `reaktion` | Humor, falsch gegen richtig, kurze Reaktion |
| `figur` | Begrüßung, Wendepunkt, Schluss |
| `eigen` | **alles andere: die eigens gebaute, beste Lösung für genau diese Szene** |

Code: `animationen/src/regie/` (Typen, Renderer `Regie`, Prüfer), Bausteine `animationen/src/doku-bausteine*.tsx`, Pläne `animationen/src/plaene/<video>.ts`. Eigene Szenen werden der Regie über `eigeneSzenen` übergeben.

## Technische Prüfung
`node tools/regie-pruefen.mjs animationen/src/plaene/<video>.ts`
- **FEHLER** (muss behoben werden): Lücken oder Überlappungen, Plan endet vor dem Ton.
- **HINWEISE** (nur zum Nachdenken, keine Grenze): sehr lange oder sehr kurze Szenen, gleiche Darstellung oft hintereinander, lange ohne Figur oder Beleg, Video beginnt mit stehender Figur.

## Format
- Alles passt sich über `useFlaeche()` (`animationen/src/format.ts`) an 16:9 oder 9:16 an.
- Shorts: Belege im Hochformat aufnehmen (`shot.py … --breite 540 --hoehe 960`, im Plan `verhaeltnis: 9 / 16`), Untertitel an. Lange Videos ohne Untertitel.
