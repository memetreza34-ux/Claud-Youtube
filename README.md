# Der Strichermittler (Claud-Youtube)

YouTube- und Social-Media-Kanal: **News, Politik, KI, Tech-Skandale und aktuelle Fälle**, seriös erklärt von einer anonymen Detektiv-Figur. Vorbild für den Aufbau ist Hood Informatik.

## Wo anfangen
| Datei | Wofür |
|---|---|
| **`PRODUKTION.md`** | **Verbindlicher Ablauf:** 1-Phasen-Vollautopilot mit Google Flow, von der Themenwahl bis zum fertigen MP4 |
| `planung/reel-regeln.md` | Stil und Inhalt: Hook, Aufbau, Bildregeln, Untertitel, Prüfung |
| `planung/kanal.md` | Kanal, Name, Figur, Themen, Formate |
| `planung/stimme.md` | Eigene Stimme (Qwen3-TTS, lokal) und Aussprache-Tipps |
| `planung/video-ideen.md` | Themen-Ideen |
| `figur/MASTER.md` | Figur, Posen, Prompts |

## Stand (15.11.2026)
| Video | Status |
|---|---|
| Reel 01 „Codewort“ | ✅ Test-Reel (`ReelCodewort`) |
| Reel 02 „Nvidia-Spionage“ | ✅ `ReelNvidia` – `skripte/reel-02-nvidia.md` |
| Reel 03 „Outlook down“ | ✅ `ReelOutlook` – `skripte/reel-03-outlook.md` |
| Reel 04 „Fireworks AI: Uber und Notion“ | ✅ `ReelFireworks` – `skripte/reel-04-fireworks.md` |
| Video 01 „Enkeltrick 2.0“ | ⏳ Voiceover, Belege und Animationen fertig; offen: Szenenbilder (Flow), weinender Anruf, Schnitt, Cover |

## Ordner
| Ordner | Inhalt |
|---|---|
| `planung/` | Regeln, Kanal, Stimme, Ideen |
| `skripte/` | Recherche, Quellen und Beschreibung pro Video; `sprechtexte/` = vertonte Texte |
| `figur/` | Master-Figur, Profilbilder, Posen (Posen nur lokal) |
| `animationen/` | Remotion-Projekt: alle Reels und Einblendungen für Video 01 |
| `tools/tts-qwen-mac/` | Stimme auf dem Mac (MLX, Qwen3-TTS 1.7B) |
| `tools/screenshots/` | Screenshots echter Artikel mit Markierung und Verpixeln |

## Was nicht ins Repo kommt
Das Repo ist **öffentlich**. Deshalb liegen hier nur Code und Texte.
- **Eigene Stimme und Tonaufnahmen:** nur lokal (`*.wav` in `tools/tts-qwen-mac/` wird ignoriert)
- **Videos, Cover, Screenshots fremder Seiten, Reel-Daten:** nur lokal (`video-*/`, `animationen/public/reel-*/`)
- **Posen der Figur, KI-Modelle, Python-Umgebungen:** nur lokal bzw. auf der SSD T7

Speicherorte im Detail: `PRODUKTION.md`, Abschnitt „Wo was liegt“.
