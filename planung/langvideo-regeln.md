# Regeln für lange Videos (16:9, 7–12 Min.)

Ergänzt `reel-regeln.md` (Motion-Standard 2.0 gilt auch hier). Bildtechniken aus der Doku-Analyse (schräge Artikel, Pinnwand, Bauplan-Stil, Karten, Parallaxe): `visuelle-techniken.md`. Abweichend: keine Untertitel, Belege kaum zoomen – siehe „Feedback Arman zu Video 02“ unten. Technischer Ablauf: `PRODUKTION.md`.

Gelernt aus der Analyse von Hood Informatik (28.11.2026): Kanalseite nach „Beliebt“ sortiert, dazu das Video „Warum hat Berlin die 2 Mio € Lösegeld NICHT gezahlt?“ (7:31, 240.000 Aufrufe) mit Transkript und Standbildern.

## Was bei Hood lange Videos erfolgreich macht
- **Themen:** aktueller Fall mit Deutschland-Bezug und einer klaren Frage im Titel („Warum hat Berlin … NICHT gezahlt?“, „Der GTA 6 HACKER kommt aus Deutschland?!“). Die meistgesehenen langen Videos dauern 7–10 Minuten. Erklärserien laufen länger, aber schwächer.
- **Titel:** eine Frage oder Behauptung mit einem Wort in GROSSBUCHSTABEN.
- **Einstieg (0–30 s):** Titelfrage sofort aussprechen, Begrüßung, dann in 20 s der Kern (Datum, Zahl, was passiert ist), dann ein Versprechen („bleib dran, die Antwort ist überraschender als du denkst“).
- **Aufbau als Frage-Kette:**
  1. Ablauf / Chronologie („erzählt schon die halbe Geschichte“)
  2. Schaden auf der persönlichen Ebene, dann „aber es geht noch weiter“ mit einer zweiten, größeren Ebene
  3. Die zentrale Frage offen aussprechen („Was uns zur eigentlichen Frage bringt …“)
  4. Mechanismus einfach erklärt, Fachwörter sofort übersetzt („also …“)
  5. Argumente nacheinander, jedes mit echtem Beispiel (Stadt, Firma, Zahl)
  6. Autorität (BSI, BKA, CCC) als Bestätigung
  7. Wendung: „trotzdem ist das keine Erfolgsgeschichte, denn …“ (das eigentliche Problem)
  8. Persönlicher Appell an den Zuschauer, dann kurzer Schluss
- **Brückensätze alle 30–60 s:** „Aber es geht noch weiter“, „Und genau da …“, „Frag dich mal konkret …“. Halten die Leute im Video.
- **Bild:** ruhig. Ein großes Bild pro Aussage, mittig auf dunklem Grund: echte Screenshots (Darknet-Seite, Leak-Liste, Artikel), einfache Icon-Grafiken, kurz die Kanal-Figur. Untertitel unten (übernehmen wir nicht), Quelle winzig oben links.

## Was wir anders und besser machen
- Gleicher Aufbau, aber im **Motion-Standard 2.0**: Belege mit Kamerafahrt und Markierung (`BelegFahrt`), ein Held pro Kapitel, der sich verwandelt, Zustand über Farbe.
- **Figur als Erzähler:** Intro, Kapitelwechsel und Schluss mit eigenen Posen (Flow, `figur/master.jpg`), nicht als Dauer-Hintergrund.
- **Kapitel-Überschriften** sind im langen Video erlaubt: kurz (2–4 Wörter), 2 s am Kapitelanfang, dann weg. Sie helfen bei 8 Minuten Länge.
- Bildwechsel alle 4–8 s (`PRODUKTION.md`), jedes Schlüsselwort ein sichtbares Ereignis.
- Unbestätigtes klar trennen: „laut Frankreich“, „ist nicht bestätigt“.

## Feedback Arman zu Video 02 (28.11.2026) – gilt ab Video 03
- **Belege kaum zoomen:** Screenshot fast in voller Größe zeigen (Zoom höchstens ~1,1), nie so weit hinein, dass Überschrift oder Zeilen am Rand abgeschnitten wirken. Die Kamera darf nur leicht fahren.
- **Eine Markierung reicht:** Die gelbe Textmarkierung im Screenshot (`shot.py --text`) ist genug. Keinen zusätzlichen Rahmen oder Kasten darüberlegen.
- **Deutsche Quellen bevorzugen:** Belege möglichst von deutschen Seiten (tagesschau, heise, Spiegel, BSI, Polizei, Lokalzeitung). Englische Quellen nur, wenn es keine deutsche gibt.
- **Mehr Bilder, Bilder mit Animation:** Nicht nur Grafiken. Echte Fotos und Flow-Bilder einsetzen und darauf animieren (Pfeile, Markierungen, Zahlen, Bewegung im Bild). Mischung aus Bild und Animation statt reiner Icon-Szenen.
- **Ganze Fläche nutzen:** Kein kleines Objekt in der Mitte mit viel leerem Schwarz drumherum. Held und Belege füllen das Bild.
- **Keine Untertitel im langen YouTube-Video.** Dafür dürfen Überschriften, Kapitel-Titel und kurze Schlagwörter im Bild stehen. (Reels/Shorts behalten ihre Untertitel.)

## Bausteine verpflichtend (Arman, 28.11.2026: „in Zukunft sowas reinbringen“)
Ab Video 03 stehen die Doku-Bausteine aus `animationen/src/doku-bausteine.tsx` (und Folgedateien) als Werkzeugkasten bereit – eingesetzt, wo sie die beste Lösung sind, sonst wird die Szene eigens gebaut (`planung/regie-system.md`): `FilmLook` um das ganze Video, Artikel als `ArtikelSchraeg`, Technik im `Bauplan`-Stil, Belege-Sammlungen als `Pinnwand`, dazu Memes mit eigener Figur. Übersicht und Demo: `planung/visuelle-techniken.md`.
