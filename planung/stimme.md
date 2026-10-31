# Stimme – kostenlos & Open Source

Problem: keine passende eigene Stimme, kein Geld ausgeben.
Wichtig: Kanal soll Geld verdienen → Lizenz muss **kommerzielle Nutzung** erlauben.

## Empfehlung
| Tool | Lizenz | Qualität | Stimmen klonen | Wofür |
|---|---|---|---|---|
| **Chatterbox Multilingual** (Resemble AI) ⭐ | MIT ✅ kommerziell | sehr gut, Emotion steuerbar | ja, aus wenigen Sekunden Audio | Hauptstimme für Videos |
| **Piper + Thorsten** | Piper: MIT/GPL, Stimme Thorsten: CC0 ✅ | okay, etwas roboterhaft | nein | schnelle Tests, Notlösung |

## Nicht nehmen (nur nicht-kommerziell)
- XTTS-v2 (Coqui) – CPML, nicht kommerziell
- F5-TTS – Modell CC-BY-NC
- Fish Speech / OpenAudio – CC-BY-NC-SA

## Welche Stimme klonen?
Nur Stimmen, die man nutzen **darf**:
- **Thorsten-Voice-Aufnahmen** (CC0, frei nutzbar) → natürliche deutsche Männerstimme
- Freund/Familie mit **schriftlicher Erlaubnis**
- NIE Promis, YouTuber oder fremde Stimmen

## Hinweise
- Chatterbox setzt ein unhörbares Wasserzeichen (Perth) – kein Problem.
- YouTube erlaubt KI-Stimmen. Monetarisierung bleibt möglich, solange Skripte eigen und Videos nicht massenhaft gleich sind („inauthentic content“-Regel).
- Läuft lokal auf dem Mac, kostet nichts. Langsamer als Cloud, für 10 Min. Video aber okay.

## Quellen
- Chatterbox Multilingual (MIT, 23 Sprachen inkl. Deutsch): https://deepinfra.com/ResembleAI/chatterbox-multilingual
- Thorsten-Voice (CC0): https://github.com/thorstenMueller/Thorsten-Voice
- Piper Thorsten (CC0): https://huggingface.co/Trelis/piper-de-de-thorsten-medium

## Stand 31.10.2026
- Chatterbox läuft lokal: `tools/tts/` (`sprechen.py`), Referenz = Thorsten (CC0)
- Auf **CPU** (MPS lief bei 16 GB RAM voll und wurde beendet). Tempo: ~35 s Rechenzeit pro Satzblock, 23 s Audio in ~100 s.
- Test: `tools/tts/ausgabe/01-hook-test.wav` – gut verständlich
- Aussprache-Tipp: „KI“ als **„Ka-I“** schreiben, sonst liest er „Kie“.

## Neuer Plan: Qwen3-TTS (Alibaba, Apache 2.0) ⭐
Chatterbox klang zu schlecht (v1 robotisch, v2 schlechter).
- Lizenz **Apache 2.0** (offizielle Modellkarte) → kommerziell erlaubt
- Kann Deutsch, 0.6B/1.7B Modelle (kleiner als Chatterbox)
- **VoiceDesign**: Stimme aus einer Beschreibung erfinden → keine fremde Stimme nötig, gehört uns
- Erst kostenlos im Browser testen: https://huggingface.co/spaces/Qwen/Qwen3-TTS-Voice-Design
- Deutsche Klon-Anleitung macOS: https://github.com/yauh/qwen3-tts-german-clones

### Stimm-Beschreibung (VoiceDesign)
A deep, calm, mysterious male narrator voice, around 35 years old, speaking German with a clear standard German accent, slightly raspy and warm, like a true-crime documentary storyteller, confident and intriguing, medium-slow pace with dramatic pauses.

Andere Kandidaten: Kartoffel-Orpheus 3B (deutsch, Lizenz unklar, 3B = zu schwer für 16 GB), IndexTTS 2.5 German (Bilibili-Lizenz, nicht frei).
