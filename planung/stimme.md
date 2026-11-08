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

## Neustart (02.11.2026): Warum alles „komisch“ klang
- Qwen3-TTS und Chatterbox sind **mehrsprachige** Modelle, vor allem auf Chinesisch/Englisch trainiert → Deutsch klingt leicht fremd (Betonung, Melodie).
- Dazu waren die Stimmen **von der KI erfunden** → doppelt künstlich.
- **Neuer Ansatz:** Modell, das auf **deutschen Muttersprachlern** nachtrainiert ist + **echte deutsche Stimme** als Vorlage.

### Kandidat: Kartoffelbox (SebastianBodza, MIT, Basis Chatterbox, deutsch nachtrainiert)
- Online-Demo: https://huggingface.co/spaces/SebastianBodza/Kartoffelbox
- Skript: `tools/tts-qwen/kartoffelbox.py`
- Vorlage: echte Thorsten-Aufnahmen (CC BY 4.0) oder eigene Stimme
- Problem: kostenloses Online-Kontingent ohne Konto schnell leer → kostenloses Hugging-Face-Konto nötig

Weitere: Kokoro German Martin (Apache 2.0, sehr klein, aber auf synthetischen Daten trainiert), Kartoffel-Orpheus 3B (Llama-Lizenz, zu schwer lokal).

## Aktueller Plan (06.11.2026): eigene Stimme nachbauen
Stimme ist **noch nicht fertig**. Entscheidung: keine Thorsten-Vorlage mehr, sondern die eigene Stimme.
1. Text aus `planung/aufnahme-text.md` einlesen (offen).
2. Beste Stellen zurechtschneiden.
3. Stimme zuerst mit Kartoffelbox nachbauen (`tools/tts-qwen/kartoffelbox.py`).
4. Hörprobe mit dem Hook aus Video 01 erstellen (`tools/tts-qwen/texte/01-hook.txt`).
5. Klingt es nicht gut genug: anderes Open-Source-Modell mit derselben Aufnahme testen.

Weiterarbeit erfolgt ab jetzt auf einem anderen Rechner statt auf dem Mac. Die Mac-Angaben oben (MPS, 16 GB RAM, Tempo) gelten dort nicht unbedingt, die Python-Umgebungen und Modelle müssen dort neu eingerichtet werden.


## Stand 07.11.2026: Qwen3-TTS mit der eigenen Stimme, weiter auf dem Mac
Die Aufnahme ist gemacht. Das Windows-Notebook (i3, 7,8 GB) ist zu langsam, deshalb geht es auf dem Mac (M4, 16 GB) weiter. Damit ist die Notiz oben zum „anderen Rechner“ überholt.
- **Gewählt:** Qwen3-TTS 0.6B (Apache 2.0, lokal, ohne Konto), Variante A: Vorlage `vorlage.wav`, Temperatur 0,6, gekürzte Pausen, Lautstärke -16 LUFS. Urteil des Nutzers zur ersten Probe: richtige Richtung, aber noch unpassend. Danach hat er Variante A gewählt.
- **Abgelehnt:** Piper + OpenVoice, MOSS-TTS-Nano. Kartoffelbox klang gut („Passt so“), die Online-Demo braucht aber ein Konto und das Modell eine Zugangsfreigabe.
- **Ursache für „unpassend“:** Grundton und Klangfarbe passten, Qwen machte aber zu lange Pausen und schwankte stärker in der Tonhöhe.
- **Weiter:** `tools/tts-qwen-mac/LIES-MICH.txt`. Erst Test mit 0.6B und 1.7B, dann volles Voiceover aus `voiceover-01-sprechtext.txt`. Das Paket ist auf einem Mac noch ungetestet.
- **Stimmaufnahmen:** Das Repo ist öffentlich, deshalb liegen `vorlage.wav` und die Aufnahme nicht hier. Sie kommen per USB-Stick auf den Mac.
- **Windows-Skripte der Versuche:** `tools/stimme-windows/`.
- **Noch offen:** Der weinende Anruf am Videoanfang braucht eine eigene Aufnahme oder Stimme mit Erlaubnis. Der Satz „Fake-Shop-Video kommt als Nächstes“ muss bei Veröffentlichung stimmen. `planung/produktion.md` ist veraltet. „dreihundert Millionen“ im Aufnahme-Text ist ungeprüfter Übungstext und steht nicht im Sprechtext.

## Stand 08.11.2026: Voiceover 01 fertig (MLX auf dem Mac)
- **Neue Vorlage:** Auf dem Mac neu aufgenommen (15,7 s, Text aus `vorlage-text.txt`), die alte Vorlage liegt auf einem USB-Stick, den der Mac nicht erkennt. Nicht im Repo.
- **Test PyTorch (`start.sh`):** 0.6B und 1.7B liefen, der Nutzer fand **1.7B besser**. Zu langsam: 1.7B brauchte etwa 8 Minuten zum Laden und etwa 3 s Rechenzeit pro Sekunde Audio.
- **Gewählt: MLX** (`qwen_mlx.py`, Modell `mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit`, Apache 2.0, ohne Konto). Hook in 72 s statt 556 s. Der Nutzer fand den Klang gleich gut.
- **Voiceover 01:** 4:45 min, in knapp 8 min berechnet, -16,9 LUFS, alle 39 Stücke per Abschrift geprüft. Vom Nutzer als „passt“ abgenommen. Die Datei liegt nur lokal unter `tools/tts-qwen-mac/ergebnis/`.
- **Modelle** liegen auf der externen SSD T7 (`/Volumes/T7/strichermittler-modelle`, Aufruf mit `HF_HOME=...`). Die SSD ist exFAT: macOS legt dort `._`-Dateien an, die mlx-audio als Modelldateien liest und dann scheitert („Speech tokenizer not loaded“). Abhilfe: `dot_clean -m` auf den Modellordner.
- **Aufruf:** `HF_HOME=/Volumes/T7/strichermittler-modelle .venv-mlx/bin/python qwen_mlx.py --modell 1.7B-8bit --text <text> --ziel ergebnis/<name>.wav` (Umgebung: `uv venv --python 3.12 .venv-mlx` und `uv pip install mlx-audio==0.6.4 soundfile`). Bis zu 12 GB Arbeitsspeicher.
