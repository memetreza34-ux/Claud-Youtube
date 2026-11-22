# Der Strichermittler – Anleitung für KI-Agenten (Codex, Claude & Co.)

Diese Datei ist der Einstieg für **jeden** Agenten, der hier Shorts/Reels oder lange Videos baut. Codex und Antigravity lesen sie automatisch. In Claude gilt `CLAUDE.md`. Mit Arman immer **auf Deutsch**, kurz und klar.

## 1. Zuerst lesen (verbindlich, in dieser Reihenfolge)
1. [`PRODUKTION.md`](PRODUKTION.md) – der komplette Ablauf in 7 Schritten (Autopilot, keine Freigabestopps).
2. [`planung/reel-regeln.md`](planung/reel-regeln.md) – Stil: Hook, Aufbau, Bilder, Untertitel.
3. [`planung/kanal.md`](planung/kanal.md) – Kanal, Themen, Haltung.
4. [`figur/MASTER.md`](figur/MASTER.md) – die Figur und fertige Prompts.
5. [`planung/stimme.md`](planung/stimme.md) – Stimme und Aussprache.

Widersprüche nicht mit neuen Notizdateien lösen, sondern in diesen Dateien beheben.

In Antigravity kannst du die Produktion mit `/strichermittler-video` im lokalen Projekt starten. Der [Projekt-Skill](.agents/skills/strichermittler-video/SKILL.md) prüft die Werkzeuge und verweist auf die Stilreferenz.

## 2. Speicherorte – alles auf der SSD T7, nie auf dem Mac-Speicher
| Was | Wo |
|---|---|
| Repo (dieses Projekt) | `/Volumes/Mac-Projekte/Home/Strichvermittler` (Sparsebundle auf der T7) |
| Laufwerk fehlt? | `hdiutil attach /Volumes/T7/Mac-Projekte.sparsebundle` (dauert, meldet evtl. „belegt“ und klappt trotzdem) |
| Zwischendateien, Test-Renders, Kontaktbögen, Whisper-Ordner | `/Volumes/T7/strichermittler-tmp/` – **nicht** `/tmp` |
| Flow-Ausgaben | `/Volumes/T7/flow-mcp-out/` |
| Stimm-Modelle | `/Volumes/T7/strichermittler-modelle/` |
| Fertige Videos, Cover | `video-<n>/` im Repo (gitignored) |
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
- Neue Reels nach Vorlage `animationen/src/ReelFireworks.tsx` bauen und in `src/Root.tsx` eintragen. Bausteine: `animationen/README.md`.
- **Begrüßung:** `NoirBegruessung` aus `src/intro-noir.tsx` (Bild `public/figur/intro-noir.jpg`). Die alte Ballon-Animation nicht mehr verwenden.
- Prüfen: `cd animationen && npx tsc --noEmit`
- Rendern: `npx remotion render <Composition> ../video-<n>/FINAL-VIDEO.mp4 --concurrency=2`
- Einzelbild: `npx remotion still <Composition> /Volumes/T7/strichermittler-tmp/bild.png --frame=<n>`

### Belege: Screenshots (`tools/screenshots/shot.py`)
```bash
tools/screenshots/.venv/bin/python tools/screenshots/shot.py URL ZIEL.png --breite 540 --hoehe 960 --text "Kernsatz"
```
Seiten mit Bot-Sperre, Login oder Zustimm-Wand verwerfen. Fotos nur von Wikimedia Commons mit Lizenz.

## 5. Ein Short von A bis Z (Kurzfassung von `PRODUKTION.md`)
1. Thema recherchieren (mind. 2 Quellen) → `skripte/reel-<nr>-<name>.md`
2. Sprechtext mit Hook unter 7 s → `skripte/sprechtexte/reel-<nr>-<name>.txt`
3. Stimme erzeugen, Wortzeiten holen → `animationen/public/reel-<name>/audio.wav` + `untertitel.json`
4. Cover (3 Kandidaten, besten behalten) und fehlende Posen/Szenen mit Flow
5. Echte Belege als Screenshots
6. Komposition in Remotion bauen, rendern
7. Endkontrolle: Kontaktbogen alle 2–4 s, -14 LUFS, Untertitel gegenlesen → Ablage in `video-<n>/` (`FINAL-VIDEO.mp4`, `cover.png`, `caption.txt`, `untertitel.srt`)

## 6. Git
- Vor der Arbeit `git pull`, damit Codex und Claude nicht gegeneinander arbeiten.
- Kleine, klare Commits auf Deutsch („Reel 05 …: …“). Nur Code und Texte.
- Hochladen/Posten auf YouTube, TikTok oder Instagram nur, wenn Arman es ausdrücklich sagt.
