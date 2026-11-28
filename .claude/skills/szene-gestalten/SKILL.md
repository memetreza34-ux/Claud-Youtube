---
name: szene-gestalten
description: Gestaltet eine einzelne Szene eines Strichermittler-Videos (Reel/Short 9:16 oder langes Video 16:9) so gut wie überhaupt möglich – ohne Grenzen, mit allen Mitteln (eigene Remotion-Animation, 3D, echte Belege, Flow-Bilder, Figur, Memes, Sound). Verwenden, sobald eine Szene, ein Abschnitt oder ein Moment im Video gebaut, verbessert oder neu gedacht wird („mach die Szene besser“, „wie zeigen wir …“, „die Animation ist zu einfach“).
---

# Szene so gut wie möglich gestalten

**Grundsatz (Arman):** Keine Grenzen. Jede Szene so gut darstellen, wie es überhaupt geht. Fertige Bausteine sind Startpunkte, kein Katalog. Wenn etwas Eigenes besser ist, wird es eigens gebaut.

Zuerst lesen: `planung/regie-system.md` (Ablauf + Werkzeugkasten), `planung/visuelle-techniken.md` (was Top-Dokus machen), `planung/reel-regeln.md` / `planung/langvideo-regeln.md` (Armans Regeln).

## 1. Denken, bevor gebaut wird
Für die Szene schriftlich (im Plan als `notiz`) festhalten:
- **Aussage:** Was soll der Zuschauer nach diesem Moment wissen oder fühlen? Ein Satz.
- **Wörter:** Welche Schlüsselwörter fallen, wann (aus `<video>-zeiten.ts`)? Jedes wird ein sichtbares Ereignis.
- **Stärkste Idee:** Wie würden Simplicissimus, Kurzgesagt, Johnny Harris, Barely Sociable oder ein Kinofilm genau das zeigen? Mindestens zwei Ideen, die bessere nehmen.
- **Held:** Ein Objekt/Bild, das sich in der Szene verwandelt (statt vieler Kästen).

## 2. Mit allem umsetzen (kombinieren erlaubt und erwünscht)
| Mittel | Wie |
|---|---|
| Eigene Animation | Remotion: SVG-Pfade (`@remotion/paths`), CSS-3D (`perspective`, `rotateX/Y`), Masken, Partikel, `spring`/`interpolate`, `@remotion/motion-blur`, `@remotion/transitions` |
| Echtes 3D | `@remotion/three` / `@react-three/fiber` + `drei` (Licht, Bloom, Modelle) |
| Echte Fotos räumlich | `tools/bilder.py` holen → `tools/tiefe.sh` → Szenentyp `foto3d` (3D-Kamerafahrt ins Foto); Objekte/Figur mit `tools/freistellen.sh` ausschneiden und als eigene Ebene davor oder einzeln animieren |
| Echte Belege | `tools/screenshots/shot.py` (deutsche Quellen zuerst; Shorts `--breite 540 --hoehe 960`; ganze Seite `--voll`; `--overlays-weg`), Fotos Wikimedia Commons mit Lizenz |
| Flow-Bilder (0 Credits) | eigens für die Szene, immer `figur/master.jpg` als Referenz. Für Parallaxe: Figur vor reinem Schwarz und Hintergrund ohne Figur getrennt erzeugen, in Ebenen bewegen |
| Flow-Clips | kosten Credits → nur nach Armans OK |
| Figur & Memes | 56 Posen in `animationen/public/posen/` (Kopie von `figur/posen/`), nur eigene Posen, nie fremde Meme-Bilder |
| Bausteine | `animationen/src/doku-bausteine.tsx`, `doku-bausteine2.tsx`, Regie-Typen in `animationen/src/regie/typen.ts` |
| Sound | eigene Klänge mit `tools/klang.py` (whoosh, riser, einschlag, brummen, alarm, tippen, glitch, herzschlag, kasse, spannung …), im Plan `klaenge` (auf Wortzeiten) und `atmo` (Teppich); in eigenen Komponenten `klang("name")` aus `noir-buehne.tsx`. ElevenLabs nur mit OK (kostet Geld) |

Für eine eigene Szene: Komponente schreiben (`animationen/src/szenen/<video>-<szene>.tsx`), Bildfläche über `useFlaeche()` (`src/format.ts`), im Plan als `{ typ: "eigen", komponente: "…" }` eintragen und der `Regie` über `eigeneSzenen` geben.

## 3. Armans feste Regeln (auch ohne Grenzen immer einhalten)
- Ganze Fläche nutzen, kein kleines Objekt in viel Schwarz.
- Belege kaum zoomen (≤ ~1,1), nie seitlich angeschnitten; **eine** Markierung (gelb ODER Rahmen).
- Deutsche Quellen bevorzugen, Unbestätigtes als „laut …“ kennzeichnen.
- Hook zeigt die Sache selbst, keine stehende Figur. Figur nie als Dauer-Hintergrund.
- Lange Videos ohne Untertitel (Überschriften erlaubt), Shorts mit Untertiteln.
- Figur immer on-model (weißer Kugelkopf, Fedora mit orangem Band, hoher Kragen, Handschuhe, oranges Kantenlicht, nie menschlich).

## 4. Bauen → ansehen → besser machen
1. Szene einzeln rendern: `tools/szene.sh <Komposition> <von_s> <bis_s>` → Kontaktbogen **und** Bewegungsbild (`…-bewegung.jpg`, 10 Bilder/s) mit Read ansehen, Bewegungsbericht abarbeiten (STILL, HARTSTART, RUCKELN …). Ton als Bild prüfen: `python3 tools/klang.py --ansehen <ton.wav>`.
2. Selbstkritik gegen die Vorbilder: Ist das die stärkste mögliche Darstellung? **Passt jedes Bild genau zu dem Satz, der in dem Moment fällt?** Lebt jedes Schlüsselwort (Bild **und** Klang)? Ist die Fläche voll? Liest man alles auf dem Handy? Fließt die Bewegung?
3. Für einen unabhängigen Blick den Agenten `video-kritiker` mit Kontaktbogen und Szenen-Aussage starten.
4. Nachbessern, bis die Szene überzeugt. Erst dann zur nächsten.
