# Was beim Publikum funktioniert

Regeln aus echten Zuschauerdaten (Skill `zuschauer-auswertung`). Nur Erkenntnisse, keine Zahlen – Zahlen liegen privat auf der SSD unter `/Volumes/T7/strichermittler-auswertung/`.

## Aus den Zuschauerdaten
_Noch keine Auswertung. Sobald Arman im eingebauten Browser bei YouTube Studio/Instagram angemeldet ist, hier ergänzen._

## Aus der Produktion
Fehler, die beim Bauen schon einmal passiert sind – nicht wiederholen:
- Langes Video 02: 5,8 s fast stehendes Bild ab 0:26 (Kapitel-Titel auf leerem Schwarz) → jedes Bild > 2 s braucht Bewegung oder ein neues Motiv (`tools/bewegung.py` meldet STILL).
- KI-Stimme sprach „Cloud“ wie „Klaufe“ (Reel 08) → englische Wörter lautgetreu schreiben („Klaud“), `tools/tonpruefung.py` nach jeder Vertonung.
- Reel 08 alt: komischer Einstieg, zu einfache Animation → Hook zeigt die Sache selbst, jedes Schlüsselwort ist ein sichtbares Ereignis.
- Video 02: Belege zu stark gezoomt, mehrere Markierungen, englische Quellen → kaum zoomen, eine Markierung, deutsche Quellen.
