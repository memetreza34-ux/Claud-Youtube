# Der Strichermittler – Anleitung für KI-Agenten (Codex, Claude & Co.)

Diese Datei ist der Einstieg für **jeden** Agenten, der hier Shorts/Reels oder lange Videos baut. Codex und Antigravity lesen sie automatisch. In Claude gilt `CLAUDE.md`. Mit Arman immer **auf Deutsch**, kurz und klar.

## 1. Zuerst lesen (verbindlich, in dieser Reihenfolge)
1. [`PRODUKTION.md`](PRODUKTION.md) – der komplette Ablauf in 7 Schritten (Autopilot, keine Freigabestopps).
2. [`planung/reel-regeln.md`](planung/reel-regeln.md) – Stil: Hook, Aufbau, Bilder, Untertitel.
3. [`planung/kanal.md`](planung/kanal.md) – Kanal, Themen, Haltung.
4. [`figur/MASTER.md`](figur/MASTER.md) – die Figur und fertige Prompts.
5. [`planung/stimme.md`](planung/stimme.md) – Stimme und Aussprache.
6. [`planung/regie-system.md`](planung/regie-system.md) – **jede Szene so gut wie möglich, ohne Grenzen**; Szenenplan, Werkzeugkasten, Prüfer.
7. [`planung/langvideo-regeln.md`](planung/langvideo-regeln.md) und [`planung/visuelle-techniken.md`](planung/visuelle-techniken.md) – lange Videos, Bildtechniken der Vorbilder.

Widersprüche nicht mit neuen Notizdateien lösen, sondern in diesen Dateien beheben.

In Claude stehen Skills und ein Kritiker-Agent in `.claude/` bereit: `video-produzieren`, `szene-gestalten`, `vorbild-analyse`, Agent `video-kritiker` (Übersicht in `CLAUDE.md`). In Antigravity startet `/strichermittler-video` die Produktion; der [Projekt-Skill](.agents/skills/strichermittler-video/SKILL.md) prüft die Werkzeuge und verweist auf dieselben Anleitungen.

## 2. Speicherorte – alles auf der SSD T7, nie auf dem Mac-Speicher
| Was | Wo |
|---|---|
| Repo (dieses Projekt) | `/Volumes/Mac-Projekte/Home/Strichvermittler` (Sparsebundle auf der T7) |
| Laufwerk fehlt? | `hdiutil attach /Volumes/T7/Mac-Projekte.sparsebundle` (dauert, meldet evtl. „belegt“ und klappt trotzdem) |
| Zwischendateien, Test-Renders, Kontaktbögen, Whisper-Ordner | `/Volumes/T7/strichermittler-tmp/` – **nicht** `/tmp` |
| Flow-Ausgaben | `/Volumes/T7/flow-mcp-out/` |
| Stimm-Modelle | `/Volumes/T7/strichermittler-modelle/` |
| Fertige Reels (nach Woche) | `reels/<Jahr>-KW<WW>/<reel-name>/` im Repo (gitignored) |
| Lange Videos, Cover | `video-<n>/` im Repo (gitignored) |
| Ton, Screenshots, Fotos eines Reels | `animationen/public/reel-<name>/` |

Die T7 ist exFAT: macOS legt `._`-Dateien an. Stören sie (Modell lädt nicht, Renders zeigen Müll): `dot_clean -m <ordner>`.

## 3. Was öffentlich ist und was nicht
Das GitHub-Repo ist **öffentlich**. Nur Code und Texte hochladen. **Nie committen:** eigene Stimme (`vorlage.wav`, `audio.wav`), Videos, Posen, Screenshots, Fotos, Zugangsdaten. `.gitignore` schützt `video-*/` und `figur/posen/`; bei neuen Medienordnern zuerst prüfen, ob sie ignoriert werden.

## 4. Werkzeuge
### Bilder und Clips: Google Flow (MCP-Server `flow`)
- In Codex eingetragen in `~/.codex/config.toml` unter `[mcp_servers.flow]`, in Claude unter `~/.claude.json`. Programm: `~/flow-mcp/dist/index.js`, Ausgabe über `FLOW_MCP_OUTPUT=/Volumes/T7/flow-mcp-out`.
- Erst `flow_status` aufrufen. Ist Flow nicht angemeldet: Arman Bescheid sagen und stoppen.
- **Bilder kosten 0 Credits → selbstständig erzeugen**, wann immer sie ein Video besser machen. **Videoclips kosten Credits → vorher Arman fragen** (Omni Flash ≈ 7–12, Veo Fast 20, Veo Quality 100).
- Wichtige Werkzeuge: `flow_generate` (einzelne Bilder/Clips, `reference_images`), `flow_agent_images` (viele Bilder auf einmal, `references`), `flow_wait` (bis `finished: true` wiederholen), `flow_download` (`quality: "upscaled"` für 2K, kostenlos), `flow_assets`.
- **Jedes Bild mit der Figur bekommt `figur/master.jpg` als Referenz** (absoluter Pfad `/Volumes/Mac-Projekte/Home/Strichvermittler/figur/master.jpg`). Fertige Prompts: `figur/MASTER.md`. Erst in `figur/posen/` nach einer passenden Pose suchen.
- Jedes Bild selbst ansehen. Weicht die Figur ab (Mensch, falscher Hut, kein oranges Kantenlicht): verwerfen und neu erzeugen.
- Flow hat **eine** Warteschlange und **ein** Chrome-Profil für alle Agenten. Läuft schon ein Auftrag eines anderen Agenten, einfach hinten anstellen und in der Zeit am Code weiterarbeiten – nichts abbrechen, was man nicht selbst gestartet hat.

### Stimme: Qwen3-TTS lokal (`tools/tts-qwen-mac/`)
Anleitung: `tools/tts-qwen-mac/LIES-MICH.txt`. Kurz:
```bash
cd tools/tts-qwen-mac
HF_HOME=/Volumes/T7/strichermittler-modelle HF_HUB_OFFLINE=1 .venv-mlx/bin/python qwen_mlx.py \
  --modell 1.7B-8bit --text ../../skripte/sprechtexte/<video>.txt --ziel ergebnis/<video>.wav
```
Danach `pausen_und_untertitel.py` für Pausen und Wortzeiten, Whisper-Abschrift auf Hörfehler prüfen. Läuft 5–20 Minuten: im Hintergrund starten.

### Schnitt und Render: Remotion (`animationen/`)
- Videos entstehen als **Szenenplan** (`src/plaene/<video>.ts`) und werden mit `<Regie>` (`src/regie/Regie.tsx`) gerendert – Reels und lange Videos. Jede Szene so gut wie möglich; eigene Szenen in `src/szenen/`, Werkzeugkasten `src/doku-bausteine*.tsx`. Plan prüfen: `node tools/regie-pruefen.mjs <plan>`. Ältere Reels (`ReelFireworks.tsx` usw.) sind nur noch Nachschlagewerk.
- Alle Bausteine passen sich über `useFlaeche()` (`src/format.ts`) an 16:9 und 9:16 an.
- **Begrüßung:** `NoirBegruessung` aus `src/intro-noir.tsx` (9:16) bzw. `Begruessung16` in `src/video02-teil1.tsx` (16:9).
- Prüfen: `cd animationen && npx tsc --noEmit`
- Rendern: `npx remotion render <Composition> ../video-<n>/FINAL-VIDEO.mp4 --concurrency=2`
- Einzelbild: `npx remotion still <Composition> /Volumes/T7/strichermittler-tmp/bild.png --frame=<n>`
- **Eine Szene schnell prüfen:** `tools/szene.sh <Composition> <von_s> <bis_s>` (Video + Kontaktbogen + Bewegungsbild/-bericht)
- **Bewegung prüfen:** `python3 tools/bewegung.py <video.mp4> [--von S --bis S]` (Stillstand, harte Starts, Sprünge, Ruckeln)
- **Eigene Klänge:** `python3 tools/klang.py --liste` / `python3 tools/klang.py <art> [--name --dauer --hoehe --hall]` → `animationen/public/klang/`, im Szenenplan `klaenge`/`atmo`; Ton ansehen mit `--ansehen <wav>`
- **Kontaktbogen:** `tools/kontaktbogen.sh <video.mp4> [alle_s] [spalten]`
- **Tonprüfung:** `python3 tools/tonpruefung.py <video.mp4> <sprechtext.txt> [--stimme audio.wav]` (Whisper-Abschrift gegen Skript: Aussprache, überdeckte Wörter)
- **Fotos/Clips mit Lizenz:** `python3 tools/bilder.py suche "<begriff>" [--video] [--quelle wikimedia|pexels|pixabay]`, dann `hole <nr> --ziel …` (schreibt `bildnachweise.txt`)
- **2,5D-Foto:** `tools/tiefe.sh <foto>` (Tiefenkarte) → Szenentyp `foto3d` / `<Foto3D>` (`animationen/src/foto3d.tsx`)
- **Freistellen:** `tools/freistellen.sh <bild> <ziel.png> --zuschneiden` (macOS Vision)
- **Musik unter die Stimme:** `python3 tools/musik.py <stück> <audio.wav> <ziel.wav> [--laut -24]` (automatisches Ducking), in `<Regie musik=…>`
- **Faktencheck:** Agent `faktenpruefer` (Claude) – jede Behauptung des Skripts gegen Quellen, vor der Vertonung
- **Endkontrolle:** `tools/endkontrolle.sh <video.mp4>` (Auflösung, Länge, −14 LUFS, schwarze/stille Stellen)
- **Zeitmarken:** `python3 tools/zeitmarken.py <untertitel.json> <marken.txt> <zeiten.ts>`
- Rendern bricht mit Zeitüberschreitung ab? `--concurrency=3 --timeout=400000` (Bilder laden langsam von der SSD).

### Belege: Screenshots (`tools/screenshots/shot.py`)
```bash
tools/screenshots/.venv/bin/python tools/screenshots/shot.py URL ZIEL.png --breite 540 --hoehe 960 --text "Kernsatz" --overlays-weg
```
Reels: `--breite 540 --hoehe 960`, lange Videos: `--breite 960 --hoehe 540`, ganze Seite: `--voll`. `--overlays-weg` blendet übrig gebliebene Banner nur aus (keine Zustimmung). Deutsche Quellen zuerst. Seiten mit Bot-Sperre, Login oder Zustimm-Wand verwerfen. Fotos nur von Wikimedia Commons mit Lizenz.

## 5. Ein Short von A bis Z (Kurzfassung von `PRODUKTION.md`)
1. Thema recherchieren (mind. 2 Quellen) → `skripte/reel-<nr>-<name>.md`
2. Sprechtext mit Hook unter 7 s → `skripte/sprechtexte/reel-<nr>-<name>.txt`
3. Stimme erzeugen, Wortzeiten holen → `animationen/public/reel-<name>/audio.wav` + `untertitel.json`
4. Zeitmarken, echte Belege (Hochformat), fehlende Bilder/Ebenen mit Flow
5. Szenenplan: jede Szene so gut wie möglich (Skill `szene-gestalten`), `tools/regie-pruefen.mjs`
6. Szene für Szene mit `tools/szene.sh` prüfen und verbessern, `video-kritiker`, dann rendern
7. Endkontrolle mit `tools/endkontrolle.sh`, genau EIN Cover mit erklärendem Text, Caption mit Tipps und Frage → Ablage in `reels/<Jahr>-KW<WW>/<name>/` bzw. `video-<n>/` (`FINAL-VIDEO.mp4`, `cover.png`, `caption.txt`, `untertitel.srt`)

## 6. Git
- Vor der Arbeit `git pull`, damit Codex und Claude nicht gegeneinander arbeiten.
- Kleine, klare Commits auf Deutsch („Reel 05 …: …“). Nur Code und Texte.
- Hochladen/Posten auf YouTube, TikTok oder Instagram nur, wenn Arman es ausdrücklich sagt.
