---
name: vorbild-analyse
description: Analysiert YouTube-Videos von Vorbild-Kanälen (Hood Informatik, Simplicissimus, Barely Sociable, Johnny Harris u. a.) auf Aufbau, Skript und Bildsprache und überträgt das Gelernte auf den Strichermittler. Verwenden bei „schau dir an, wie X das macht“, „was können wir von … lernen“, „analysier das Video/den Kanal“.
---

# Vorbild-Analyse

Nur die **Machart** übernehmen, nie Bilder, Sätze, Logos oder Namen.

## Vorgehen im eingebauten Browser (`mcp__Claude_Browser__*`)
1. **Kanal:** `https://www.youtube.com/@<kanal>/videos`, Reiter „Beliebt“ klicken. Liste per JavaScript auslesen: `[...document.querySelectorAll('ytd-rich-item-renderer')].map(e=>e.innerText)` → Titel, Länge, Aufrufe.
2. **Video öffnen.** Werbung abwarten/überspringen per JS-Schleife (`.ad-showing`, `.ytp-skip-ad-button`), dann `video.muted=true; video.pause()`. Player-Position mit `#movie_player.getBoundingClientRect()` holen.
3. **Transkript:** Beschreibung ausklappen (`#expand`), Knopf „Transkript“ klicken, Segmente aus `ytd-transcript-segment-renderer` / `transcript-segment-view-model` lesen.
4. **Standbilder:** in einem `browser_batch` abwechselnd `video.currentTime = t` (+ 2 s warten) und `computer` → `zoom` auf den Player-Bereich (Koordinaten im 800×600-Rahmen des letzten Screenshots). 6–10 Zeitpunkte über das ganze Video verteilen.
5. **Auswerten:** Aufbau (Hook, Kapitel, Brückensätze, Schluss), Satzlänge, Bildwechsel-Takt, Bildsprache (Material, Grafikstil, Farben, Kamera, Übergänge), was davon wir im Noir-Stil können.

## Ergebnis festhalten
- Neue Techniken → `planung/visuelle-techniken.md` (Tabelle „Was die Kanäle machen“ + Umsetzung bei uns).
- Neue Regeln für Aufbau → `planung/langvideo-regeln.md` bzw. `planung/reel-regeln.md`.
- Lohnende Techniken gleich als Baustein bauen (`animationen/src/doku-bausteine*.tsx`) und mit einem kurzen Demo zeigen.
