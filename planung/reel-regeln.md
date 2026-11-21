# Regeln für Reels (und Erklärteile in langen Videos)

Der technische Ablauf steht in `PRODUKTION.md`, diese Datei regelt Stil und Inhalt.

Gelernt aus dem Feedback zu Reel 02–04 und der Analyse von Hood Informatik (Outlook- und Nvidia-Short, 14.11.2026). Diese Datei gilt; ältere Notizen in den Reel-Dateien sind Geschichte.

## Aufbau
1. **Hook (unter 7 s):** Neuigkeit + Grund in einem Satz, dann eine Frage. Beispiel: „Hacker brechen bei einem KI-Anbieter ein, den kaum jemand kennt, und erbeuten Daten von Uber und Notion. Wie geht das?“ Keine gespielte Szene („Du öffnest Outlook …“).
2. **Begrüßung:** „Willkommen beim Strichermittler.“ mit der Noir-Intro (`animationen/src/intro-noir.tsx`): Lampe flackert an, orangefarbener Strich legt den Namen frei. Die Ballon-Animation ist abgelöst.
3. **Fakten:** wann, wer, was betroffen ist.
4. **Das Warum:** Überleitung mit Neugier („Interessant ist …“), Fachwörter sofort im Satz erklären („Das nennt man …“, „also …“), Ursache als Kette.
5. **Stand:** was bestätigt ist, was offen ist.
6. **Was heißt das für dich:** ein Satz direkt an den Zuschauer.
7. **Schluss:** „Ich bleibe dran.“

## Sprache
- Jeder Satz bringt eine neue Info. Kein Füllstoff („Und es wird schnell mehr“, „Bleibt die Frage …“).
- Quelle im Satz nennen („Laut Microsoft …“), nicht im Bild.
- Eigene Worte – Aufbau von Hood übernehmen, nie seine Formulierungen.
- Zahlen und Namen nur mit Beleg. Unbestätigtes als Bericht oder Vorwurf kennzeichnen.

## Bilder
- **Immer Bilder, kein eigener Text im Bild:** keine Quellen-Chips, keine Titelkarten („12. November“, „WELTWEIT GESTÖRT“). Kleine Beschriftungen in Erklärgrafiken sind okay.
- **Standzeit pro Bild:** Reels 4–6 s, lange Videos 4–8 s. Erklär-Animationen dürfen 10–25 s laufen und sich aufbauen. Nicht jedes Wort bebildern, nur das Wichtige.
- **Bildarten:** echte Schlagzeilen und Artikelzeilen mit gelber Markierung und rotem Rahmen, echte Fotos (Wikimedia Commons, Lizenz prüfen), echte Webseiten, App-Icons und Logos.
- **Erklärgrafik schlicht:** dunkler Grund, dünne Linien, Icons, wenig Farbe (Orange = Akzent, Grün = läuft, Rot = Fehler). Bausteine: `animationen/src/ruhig.tsx` (Bühne, Beleg, Foto), `outlook.tsx`, `fireworks.tsx`.
- **Reaktionen:** eigene Posen der Figur statt fremder Memes, ganzflächig (sonst steht die Figur doppelt im Bild). Posen: `figur/posen/` (Stil B passt zur Master-Figur).
- **Nachgestellt** (z. B. Fehlerseite im Browser) nur, wenn es nichts Echtes gibt – in der Beschreibung so benennen.
- **KI-Bilder (Google Flow):** für Posen, Cover und illustrative Szenen ohne echtes Material, immer mit `figur/master.jpg` als Referenz (siehe `PRODUKTION.md`, Schritt 4–5). Fakten und Belege bleiben echt.

## Untertitel
- Klein (60 px), schlichte Schrift (Inter), 1–3 Wörter pro Seite, gesprochenes Wort gelb.
- Während der Begrüßung ausblenden.
- Whisper-Fehler korrigieren (Namen, englische Wörter, Bindestriche).

## Quellen
Alle Quellen und Bildnachweise in die Videobeschreibung (`caption.txt`) und als Text in `skripte/<video>.md`.

## Prüfen vor dem Abgeben
- Fertiges Video alle 2–4 s als Bild prüfen (Kontaktbogen mit ffmpeg), nicht nur einzelne Standbilder.
- Untertitel-Abschrift auf Hörfehler prüfen, die auf undeutliche Aussprache hinweisen.
- Den Klang hört Arman nach der Übergabe an; seine Rückmeldung fließt in diese Regeln.
