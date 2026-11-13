# Der Strichermittler (Claud-Youtube)

YouTube- und Social-Media-Kanal: **News, Politik, KI, Tech-Skandale und aktuelle Fälle**, seriös erklärt von einer anonymen Detektiv-Figur. Vorbild für den Aufbau ist Hood Informatik.

## Stand (13.11.2026)
| Punkt | Status |
|---|---|
| Ausrichtung | ✅ breiter, seriöser Erklär- und News-Kanal – `planung/nische.md` |
| Name und Figur | ✅ **Der Strichermittler** (@Strichermittler), Stickman-Detektiv – `figur/master.jpg` |
| Stimme | ✅ eigene Stimme, lokal geklont mit Qwen3-TTS auf dem Mac – `tools/tts-qwen-mac/` |
| Video 01 „Enkeltrick 2.0“ | ⏳ Voiceover, Belege und Animationen fertig; offen: weinender Anruf, Schnitt, Thumbnail |
| Reel 01 „Codewort“ | ✅ Test-Reel |
| Reel 02 „Nvidia-Spionage“ | ✅ Version 4 – `skripte/reel-02-nvidia-spionage.md` |

## Ordner
| Ordner | Inhalt |
|---|---|
| `planung/` | Kanal-Plan, Ausrichtung, Video-Ideen, Produktion, Stimme |
| `skripte/` | Skripte und Bildlisten mit Quellen |
| `figur/` | Master-Bild der Figur, Posen-Prompts, alte Entwürfe |
| `animationen/` | Remotion-Projekt: Animationen für Video 01 und alle Reels |
| `tools/tts-qwen-mac/` | **aktuell:** Stimme auf dem Mac (MLX, Qwen3-TTS 1.7B) |
| `tools/screenshots/` | **aktuell:** Screenshots echter Artikel mit Markierung und Verpixeln |
| `tools/tts/`, `tools/tts-qwen/`, `tools/stimme-windows/` | alt: frühere Stimm-Versuche (Piper, Windows, PyTorch), nicht mehr genutzt |

## So entsteht ein Reel
1. **Sprechtext** schreiben: Hook → „Willkommen beim Strichermittler“ → Geschichte → Stand → offene Frage. Abschnitte mit `---` trennen.
2. **Stimme** erzeugen (die Modelle liegen auf der SSD T7):
   ```bash
   cd tools/tts-qwen-mac
   HF_HOME=/Volumes/T7/strichermittler-modelle HF_HUB_OFFLINE=1 .venv-mlx/bin/python qwen_mlx.py --modell 1.7B-8bit --text TEXT.txt --ziel ergebnis/NAME.wav
   ```
3. **Pausen kürzen und Wortzeiten holen** (Whisper), Ergebnis nach `animationen/public/reel-…/`:
   ```bash
   cd ../..   # zurück ins Hauptverzeichnis
   python3 tools/tts-qwen-mac/pausen_und_untertitel.py tools/tts-qwen-mac/ergebnis/NAME.wav animationen/public/reel-…/audio.wav animationen/public/reel-…/untertitel.json /tmp/whisper
   ```
4. **Belege** sammeln: `tools/screenshots/shot.py URL ZIEL.png --breite 540 --hoehe 960 --text "Kernsatz"` (Namen von Privatpersonen mit `--verpixeln` unkenntlich machen).
5. **Szenen** in Remotion bauen. Vorlage: `animationen/src/ReelNvidia4.tsx` mit `ruhig.tsx` (Belege, Fotos, Grafiken) und `begruessung.tsx` (Ballon-Begrüßung).
6. **Rendern:**
   ```bash
   cd animationen && npx remotion render ReelNvidia4 ../video-01/reels/reel-02-nvidia-v4.mp4
   ```

Die Stilregeln stehen in `skripte/reel-02-nvidia-spionage.md` (Abschnitt „Version 4“).

## Was nicht ins Repo kommt
Das Repo ist **öffentlich**. Deshalb liegen hier nur Code und Texte.
- **Eigene Stimme und Tonaufnahmen:** nur lokal (`*.wav` wird in `tools/tts-qwen-mac/` ignoriert)
- **Videos, Screenshots fremder Seiten, Reel-Daten:** nur lokal (`video-01/`, `animationen/public/reel-*/`)
- **KI-Modelle und Python-Umgebungen:** lokal auf dem Mac bzw. der SSD

## Speicherorte
- **Code und Texte:** dieses Repo (GitHub)
- **Medien (Audio, Bilder, Videos):** Google Drive → `Meine Ablage/Der Strichermittler/` (audio/, bilder/, videos/)
- **KI-Modelle:** SSD `T7` → `strichermittler-modelle/`
