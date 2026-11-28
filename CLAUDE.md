# Der Strichermittler — Verbindlicher Arbeitsvertrag

> Gemeinsame Anleitung für alle Agenten (Claude und Codex): [AGENTS.md](AGENTS.md). Ablauf: [PRODUKTION.md](PRODUKTION.md).

## Kanal & Ausrichtung
- Name: **Der Strichermittler** (@Strichermittler)
- Format: YouTube-Videos (16:9) und Reels/Shorts (9:16)
- Thema: News, Politik, KI- & Tech-Skandale, Betrug, Enthüllungen – seriös erklärt (Vorbild: Hood Informatik)
- Sprache: Deutsch, sachlich, investigativ, präzise. Mit Arman auf Deutsch, kurz und klar.

## Skills und Agenten (in `.claude/`)
| Name | Wann |
|---|---|
| Skill `video-produzieren` | ein ganzes Video von Thema bis Ablage (Reel oder lang) |
| Skill `szene-gestalten` | jede einzelne Szene so gut wie möglich bauen und verbessern |
| Skill `vorbild-analyse` | Vorbild-Kanäle auf YouTube auswerten und Techniken übernehmen |
| Agent `video-kritiker` | strenger unabhängiger Blick auf Kontaktbögen vor der Abgabe |

## Wichtigste Regeln
1. **Jede Szene so gut wie möglich, ohne Grenzen** (`planung/regie-system.md`): Bausteine sind Startpunkte, eigene Lösungen erwünscht. Schleife: bauen → `tools/szene.sh` (Standbilder, Bewegung, Ton) → ansehen/`video-kritiker` → besser machen. Klänge mit `tools/klang.py` auf die Wortzeiten. Arman sieht nur das fertige Video.
2. **Autopilot:** Keine Zwischenstopps – außer für Flow-Videoclips (Credits), fremde Downloads und Veröffentlichen: dafür Armans OK.
3. **Figur-Konsistenz:** Jede Flow-Generierung mit dem Detektiv bekommt `figur/master.jpg` als Referenz. Nie Menschengesichter, nie bunte Kinder-Cartoons. Jedes erzeugte Bild selbst ansehen; weicht die Figur ab, verwerfen und neu erzeugen. Memes nur mit eigenen Posen.
4. **Stimme zuerst:** Voiceover mit MLX Qwen3-TTS vor dem Schnitt, Wortzeiten mit `tools/zeitmarken.py`.
5. **Belege:** deutsche Quellen zuerst, kaum zoomen, eine Markierung, ganze Fläche nutzen. Shorts mit Hochformat-Belegen.
6. **Genau EIN Cover**, das mit Text die Story erklärt; Caption mit Tipps, Frage und Quellen.
7. **Untertitel:** Reels ja, lange Videos nein (Überschriften erlaubt).
8. **Alles auf der SSD T7**, öffentliches Repo: nie Stimme, Videos, Posen, Screenshots committen.
9. **Remotion** in `animationen/` (Szenenpläne `src/plaene/`, eigene Szenen `src/szenen/`, Renderer `src/regie/`).
