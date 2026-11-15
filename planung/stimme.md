# Stimme

## Aktuell (seit 08.11.2026)
- **Eigene Stimme**, nachgebaut mit **Qwen3-TTS 1.7B** (MLX, 8 bit, Apache 2.0 → kommerziell erlaubt), lokal auf dem Mac, ohne Konto.
- Vorlage: `tools/tts-qwen-mac/vorlage.wav` (15,7 s, Text in `vorlage-text.txt`). Liegt **nur lokal**, nicht im öffentlichen Repo.
- Einstellungen „Variante A“: Temperatur 0,6, gekürzte Pausen, Lautstärke -16 LUFS.
- Modell auf der SSD T7 (`strichermittler-modelle`). Die SSD ist exFAT: macOS legt dort `._`-Dateien an, die beim Laden stören können – dann löschen.
- Bedienung: `tools/tts-qwen-mac/LIES-MICH.txt`. Den Klang beurteilt Arman.

## Aussprache-Tipps
- Zahlen ausschreiben („zweitausendsechsundzwanzig“), Ordnungszahlen auch („am zwölften November“).
- Englische Namen und Abkürzungen nach dem Vertonen in der Whisper-Abschrift prüfen (z. B. „API“ kam als „AP“ an, „Notion“, „Copilot“). Klingt etwas falsch: Schreibweise im Sprechtext anpassen und den Abschnitt neu erzeugen.

## Verworfen (kurz)
Chatterbox, Piper/Thorsten, Kartoffelbox, Qwen3 über PyTorch und Windows-Versuche (Okt.–Nov. 2026): zu robotisch, zu langsam oder nur mit Konto. Details stehen in der Git-Geschichte.

## Regeln
- Nur die eigene Stimme oder Stimmen mit schriftlicher Erlaubnis, nie Promis oder fremde Stimmen.
- YouTube erlaubt KI-Stimmen; Skripte bleiben eigen, Videos nicht massenhaft gleich.
