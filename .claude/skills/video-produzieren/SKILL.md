---
name: video-produzieren
description: Produziert ein komplettes Video für Der Strichermittler von der Themenwahl bis zur fertigen Ablage – Reel/Short (9:16) oder langes YouTube-Video (16:9). Verwenden bei „mach ein Reel/Short/Video“, „neues Video über …“, „such ein Thema und mach …“ oder beim Überarbeiten eines ganzen Videos.
---

# Video produzieren (Reel/Short oder lang)

Verbindlich: `PRODUKTION.md`, `planung/reel-regeln.md`, `planung/langvideo-regeln.md` (lang), `planung/regie-system.md`, `planung/kanal.md`, `figur/MASTER.md`, `planung/stimme.md`. Mit Arman auf Deutsch, kurz und klar. Alles auf der SSD T7 (Zwischendateien `/Volumes/T7/strichermittler-tmp/`). Fehlt `/Volumes/Mac-Projekte`: `hdiutil attach /Volumes/T7/Mac-Projekte.sparsebundle`.

## Ablauf
1. **Thema** (wenn nicht vorgegeben): aktuell, Deutschland-Bezug, klare Frage. Recherche mit WebSearch + eingebautem Browser, mind. 2 unabhängige Quellen, deutsche zuerst. Fakten und Quellen → `skripte/<video>.md`.
2. **Skript** → `skripte/sprechtexte/<video>.txt` (Abschnitte mit `---`). Reel: Hook < 7 s, dann „Willkommen beim Strichermittler.“ Lang: Aufbau nach `langvideo-regeln.md` (Frage-Kette, Brückensätze, Wendung, Appell). Zahlen und Ordnungszahlen ausschreiben, schwierige Namen lautgetreu schreiben.
3. **Stimme** (im Hintergrund, 5–20 Min.): `tools/tts-qwen-mac/qwen_mlx.py` laut `LIES-MICH.txt`, dann `pausen_und_untertitel.py` → `animationen/public/<ordner>/audio.wav` + `untertitel.json`. Abschrift auf Hörfehler prüfen und in der JSON korrigieren.
4. **Zeitmarken:** Liste `skripte/sprechtexte/<video>-marken.txt` → `python3 tools/zeitmarken.py <untertitel.json> <marken.txt> animationen/src/<video>-zeiten.ts`.
5. **Material:** Belege mit `tools/screenshots/shot.py` (Reels im Hochformat), Flow-Bilder mit `figur/master.jpg` (jedes Bild selbst prüfen), Posen aus `animationen/public/posen/`.
6. **Szenenplan:** `animationen/src/plaene/<video>.ts` – jede Szene nach Skill `szene-gestalten` so gut wie möglich (eigene Komponenten unter `animationen/src/szenen/`). Prüfen: `node tools/regie-pruefen.mjs animationen/src/plaene/<video>.ts` (0 Fehler).
7. **Komposition** mit `<Regie plan={PLAN} audio=… untertitel=…/>` (Untertitel nur Reels) in `animationen/src/Root.tsx` eintragen. `cd animationen && npx tsc --noEmit`.
8. **Szene für Szene** mit `tools/szene.sh` prüfen und verbessern, dann `video-kritiker` über das ganze Video laufen lassen.
9. **Rendern:** `npx remotion render <Komposition> /Volumes/T7/strichermittler-tmp/<video>.mp4 --concurrency=3 --timeout=400000` (Timeouts kommen von langsamen Bildern auf der SSD), dann `tools/endkontrolle.sh` (−14 LUFS, keine schwarzen Stellen).
10. **Cover:** genau EIN Cover, Flow-Bild + erklärender Text (wer/was, warum es mich betrifft). **Caption:** Titel, was passiert ist, was es für dich heißt + Tipps, Frage an die Community, (lang: Kapitel-Zeitmarken), Quellen, Bildnachweise, Hashtags.
11. **Ablage:** Reel `reels/<Jahr>-KW<WW>/<name>/`, lang `video-<n>/`: `FINAL-VIDEO.mp4`, `cover.png`, `caption.txt`, `untertitel.srt`, Altes nach `_intern/`. Ordner im Finder öffnen (`open <ordner>`) und Arman zeigen.

## Grenzen, die bleiben
- Flow-Videoclips, Downloads fremder Dateien, Hochladen/Posten nur nach Armans ausdrücklichem OK.
- Öffentliches Repo: nie Stimme, Videos, Posen, Screenshots committen (`.gitignore` prüfen).
