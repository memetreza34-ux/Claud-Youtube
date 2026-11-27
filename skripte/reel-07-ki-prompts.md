# Reel 07 – 2 Millionen KI-Prompts als Falle: Hacker lesen heimlich mit

**Format:** Reel 9:16, ca. 60–65 s · **Stand der Fakten:** 25.11.2026 · **Remotion:** `ReelKiPrompts` · **Sprechtext:** `sprechtexte/reel-07-ki-prompts.txt` · **Video:** `reels/2026-KW48/reel-07-ki-prompts/FINAL-VIDEO.mp4`

## Gesicherte Fakten (mit Quelle)
- **Studie (Juli–November 2026):** Sicherheitsforscher von **Dragos** (unter Leitung von HD Moore) schickten rund **2 Millionen Test-Prompts** mit eindeutigen Canary-Tokens (spezielle URLs und gefälschte AWS-API-Schlüssel) an bekannte KI-Dienste und Inference-Provider (Dragos Blog, SecurityWeek, The Hacker News).
- **Ergebnis:** Mindestens **drei KI-Inference-Anbieter** waren heimlich von Angreifern kompromittiert, ohne es selbst zu wissen. Die Täter lasen Anfragen direkt am Eingang („front door“) mit, noch bevor sie an ein KI-Modell weitergereicht wurden (SecurityWeek, The Hacker News).
- **Gestohlene Schlüssel:** Aus den Lockvogel-Prompts wurden rund **200 gefälschte AWS-Schlüssel** abgegriffen; innerhalb weniger Stunden starteten Angreifer damit zehntausende automatisierte API-Aufrufe (u. a. S3-Bucket-Scans und Versuche, IAM-/Bedrock-Zugänge anzulegen) (The Hacker News, SecurityWeek).
- **Zero-Data-Retention & China-Abfluss:** Auch bei Anfragen, die explizit als „Zero Data Retention“ (keine Speicherung) markiert waren, wurden Links ausgelesen; bei manchen US-Anbietern wurden Prompts an Organisationen in **China** weitergeleitet und Monate später abgerufen (Dragos, GitGuardian).
- **Stand:** Plattformen wie **OpenRouter** entfernten die betroffenen Reseller/Anbieter nach der Meldung umgehend (The Decoder, The Hacker News). Wie viele echte Unternehmensdaten und API-Keys zuvor abgeflossen sind, ist nicht bekannt.

## Beschreibung (zum Reinkopieren)
Sicherheitsforscher von Dragos schicken 2 Millionen Lockvogel-Prompts an KI-Dienste – und decken auf, dass mindestens drei Anbieter heimlich von Hackern mitgelesen wurden. Wie der Angriff über Zwischenhändler funktionierte und warum du niemals echte Passwörter oder API-Keys in KI-Chats schreiben solltest.

Quellen:
- Dragos (Nov. 2026): https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens
- The Hacker News (Nov. 2026): https://thehackernews.com/2026/11/openrouter-drops-3-providers-after.html
- The Decoder (Nov. 2026): https://the-decoder.com/security-researchers-show-how-cheap-ai-inference-providers-steal-keys-and-snoop-on-users/

Bilder & Visualisierungen:
- Artikel-Belege & Webseiten: Dragos Blog, The Hacker News, OpenRouter (Screenshots)
- Fotos (Wikimedia Commons): HD Moore (CC BY-SA 4.0), NERSC Data Center Server Rack (CC0)
- Figur-Szenen: eigene Bilder via Google Flow (Der Strichermittler)

#ki #datenschutz #cybersecurity #openrouter #strichermittler
