---
name: zuschauer-auswertung
description: Wertet die echten Zuschauerdaten des Strichermittlers aus (YouTube Studio, Instagram) – Zuschauerbindung pro Sekunde, Absprungstellen, Klickrate von Cover/Titel, beste Themen – und leitet Regeln für die nächsten Videos ab. Verwenden bei „was kommt gut an“, „wie lief das Video“, „wo springen die Leute ab“, vor der Themenwahl und eine Woche nach jeder Veröffentlichung.
---

# Zuschauer-Auswertung

Ziel: nicht raten, sondern aus echten Zahlen lernen. **Nur lesen** – nie Einstellungen, Titel, Videos oder Kommentare ändern, nichts veröffentlichen.

## Zugang
Im eingebauten Browser (`mcp__Claude_Browser__*`). Arman muss dort einmal angemeldet sein (studio.youtube.com bzw. instagram.com). Ist eine Anmeldeseite zu sehen: Arman bitten, sich im Browser-Fenster selbst anzumelden – nie Passwörter eingeben.

## YouTube Studio
1. `https://studio.youtube.com` → **Analytics** → Zeitraum „Letzte 28 Tage“ und „Lebensdauer“.
2. **Inhalte**-Liste: je Video Aufrufe, Impressionen, **Klickrate (CTR)**, **durchschnittliche Wiedergabedauer**, Abonnenten. Per `get_page_text` auslesen.
3. Je Video → **Analytics des Videos** → **Interaktion** → Kurve **„Zuschauerbindung“** und **„Wichtige Momente“**: Anfangsbindung nach 30 s (lang) bzw. „Weiterschauen statt Wegwischen“ (Shorts), Abfall-Stellen, Spitzen (Wiederholungen). Kurve per Screenshot/zoom ablesen, Zeitpunkte notieren.
4. **Zielgruppe/Traffic-Quellen**: woher kommen die Zuschauer (Shorts-Feed, Suche, Vorgeschlagen)?

## Instagram (Reels)
Profil → Professional Dashboard / „Insights“ → je Reel: Aufrufe, durchschnittliche Wiedergabezeit, Rate „bis zum Ende gesehen“, Shares, Saves, Follower durch das Reel.

## Auswerten (Absprung → Ursache)
Für jede Abfall-Stelle das Video an genau dieser Sekunde ansehen (`tools/kontaktbogen.sh`, Skript, Szenenplan) und die Ursache benennen: zu lange Begrüßung, Stillstand (vgl. `tools/bewegung.py`), Erklär-Text zu lang, Thema verliert Bezug, Ton/Bild passen nicht. Für jede Spitze: was hat hier funktioniert (Meme, Enthüllung, Zahl)?
Themen und Cover vergleichen: welche Themen/Cover-Texte haben die höchste CTR und Bindung?

## Ergebnis festhalten
- **Zahlen** (privat, nicht ins öffentliche Repo): `/Volumes/T7/strichermittler-auswertung/<datum>.md`.
- **Gelernte Regeln ohne Zahlen** (z. B. „Begrüßung nach dem Hook unter 2 s“, „Memes nach Sekunde 20 halten die Bindung“): `planung/kanal-lernen.md` – dort liest der Skill `video-produzieren` vor jedem neuen Video nach.
- Arman kurz berichten: die 3 wichtigsten Erkenntnisse und was sich am nächsten Video ändert.
