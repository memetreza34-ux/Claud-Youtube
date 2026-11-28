# Visuelle Techniken – was wir von Doku-Kanälen lernen

Analyse vom 28.11.2026: Standbilder aus je einem Video von Hood Informatik („Der GTA 6 HACKER kommt aus Deutschland?!“), Simplicissimus („Der schlimmste Hack in der Geschichte der USA“), Barely Sociable („Inside The Illicit World Of iPhone Trafficking“) und Johnny Harris („Why Egypt Guards This River With an Army“). Nur die **Machart** übernehmen, nie Bilder, Sätze, Logos oder Namen.

Ergänzt `reel-regeln.md` (Motion-Standard 2.0) und `langvideo-regeln.md`.

## Was die Kanäle machen

| Kanal | Bildsprache | Was auffällt |
|---|---|---|
| **Hood Informatik** | Collage aus echtem Material auf dunklem, rauem Papier-Grund | Tweets, Spielszenen, Aktienkurs, Dokument-Screenshots, Memes, ausgeschnittene Figuren nebeneinander. Fast alles echt, groß, kaum gezoomt. |
| **Simplicissimus** | Einheitliche blaue „Bauplan“-Grafik (dünne leuchtende Linien, Rahmen-Ecken, Raster) + echte Filmaufnahmen + Interviews | Technik wird nie mit bunten Icons erklärt, sondern immer im selben Linien-Stil (Funkwellen, Gehirn aus Linien, Router-Ringe). Wirkt wie aus einem Guss. |
| **Barely Sociable** | Artikel als **schräg liegende Seite mit Tiefenunschärfe**, echte Bildschirmaufnahmen (E-Mail, Webseite) im Browser-Fenster, Archivfotos | Ein Artikel wirkt nie „abgeschnitten“: Die Seite liegt schräg im Raum, der Rand verschwimmt, nur die Schlagzeile ist scharf. |
| **Johnny Harris** | 3D-Reliefkarten mit leuchtender Linie (Route, Fluss), Tiefenunschärfe wie bei einem Modell, Papierkarten, Aufnahmen vor Ort | Eine Karte ist ein Schauplatz, über den die Kamera fliegt, keine flache Grafik. |

## Was wir übernehmen (Noir-Version, nach Wirkung sortiert)

### 1. Artikel als schräge Seite mit Tiefenunschärfe *(löst das Zoom-Problem)*
- Screenshot liegt leicht gekippt im Raum (`perspective`, `rotateX` 8–15°, `rotateY` −10°), die Kamera gleitet langsam darüber.
- Unschärfe zum Rand hin: gleiche Seite zweimal übereinander, die obere geschärft, die untere mit `blur(6px)`, dazwischen eine Verlaufsmaske. Nur die gelb markierte Zeile ist ganz scharf.
- Seite bleibt immer vollständig im Bild, nichts wirkt abgeschnitten. Zusätzlich echter Schatten unter dem „Papier“.
- Baustein-Idee: `ArtikelSchraeg` (ersetzt `Beleg16` / `BelegFahrt` für Artikel).

### 2. Collage-Pinnwand aus echtem Material (Hood)
- Mehrere echte Elemente fallen nacheinander aufs Bild, leicht gedreht, mit Schatten: Schlagzeile, Foto, Social-Post, Logo, Dokument.
- Jedes Element kommt auf sein Wort. Am Ende bleibt eine volle, „ermittelte“ Wand stehen. Das passt perfekt zum Detektiv.
- Rote Fäden (wie in Flow-Szene 3 von Video 02) verbinden die Elemente, wenn ein Zusammenhang erklärt wird.
- Baustein-Idee: `Pinnwand` mit Liste aus {bild, ab, x, y, drehung}.

### 3. Eigener einheitlicher Technik-Stil: „Noir-Bauplan“ (Simplicissimus)
- Technik (Netzwerk, Server, Steuerung, Datenfluss) **immer** im selben Stil: dünne orange leuchtende Linien auf Schwarz, Rahmen-Ecken, feines Raster, kleine Messbeschriftungen. Keine bunten gefüllten Icon-Kugeln mehr für Technik.
- Linien zeichnen sich selbst (`@remotion/paths` → `evolvePath`), Datenpakete laufen als Lichtpunkte entlang.
- Ergibt sofort eine Marke: Wer den Stil sieht, weiß „Strichermittler“ (passt zum Namen: Striche!).
- Baustein-Idee: `Bauplan` (Raster, Ecken, Glühlinien), `GluehLinie`, `DatenPaket`.

### 4. Karten als Schauplatz (Johnny Harris)
- Europa- und Deutschlandkarte (Natural Earth, liegt im Denkwürfel-Repo: `land-110m.json`, `deutschland.json`) gekippt im Raum, Tiefenunschärfe an den Rändern, Kamera fliegt von Land zu Land.
- Angriffswege und Spuren als leuchtende Linien, Orte als pulsierende Punkte mit echten Fotos daneben.
- Baustein-Idee: `KarteRaum` (Karte + Kamera + Glühroute + Foto-Pins).

### 5. Flow-Bilder in Ebenen (2,5D-Parallaxe)
- Statt nur langsam ins Flow-Bild zu zoomen: Figur und Hintergrund getrennt erzeugen (Figur vor reinem Schwarz/Grün, Hintergrund ohne Figur) und in Remotion in Ebenen gegeneinander bewegen. Dazu Rauch, Funken, Lichtflackern als eigene Ebene.
- Wirkt wie eine Filmszene, kostet 0 Credits.

### 6. Echte Fotos + Animation darauf
- Echtes Foto (frei lizenziert, z. B. Wikimedia Commons, Pressefotos der Behörde) groß, darauf handgezeichnete Kreise, Pfeile und Zahlen (`rough-notation` ist schon installiert).
- Pro Kapitel mindestens ein echtes Foto (Ort, Gerät, Person, Gebäude).

### 7. Bildschirmaufnahme im Browser-Fenster (Barely Sociable)
- Echte Webseite scrollt in einem stilisierten Browser-Fenster (Adresszeile sichtbar = Glaubwürdigkeit). Aufnahme mit Playwright (`record_video`), wie `tools/screenshots/shot.py`, nur als Video.

### 8. Film-Look über allem
- Feines Filmkorn, leichte Vignette, ab und zu ein Lichtschein beim Szenenwechsel (`@remotion/light-leaks`), Bewegungsunschärfe bei schnellen Fahrten (`@remotion/motion-blur`). Beide Pakete sind schon installiert.
- Hintergrund nie flach schwarz: dunkles, raues Papier bzw. Noir-Rauch, kaum sichtbar.

### 9. Kurze echte Videoclips (B-Roll)
- 2–4 s echte Aufnahmen (z. B. Supermarkt-Kühlregal, Serverraum) aus freien Quellen (Pexels/Pixabay-Lizenz). **Vor jedem Download Datei, Größe und Lizenz nennen und Armans OK holen.**

## Quellen-Regel dazu
Deutsche Belege zuerst: tagesschau.de, heise, Spiegel, Zeit, BR/WDR/NDR, Lokalzeitungen, BSI, BKA, Polizei-Pressestellen (presseportal.de). Englisch nur, wenn es keine deutsche Quelle gibt.

## Stand der Bausteine
**Gebaut (28.11.2026)** in `animationen/src/doku-bausteine.tsx`, Vorführung: Komposition `DokuDemo` (`animationen/src/DokuDemo.tsx`):
1. `ArtikelSchraeg` – schräge Seite, scharfer Streifen um `fokusY`, Rest unscharf, immer ganz im Bild.
2. `BauplanGrund`, `BauplanBox`, `GluehLinie`, `DatenPaket` – Noir-Bauplan in Orange, Alarm-Zustand in Rot. Icons aus `lucide-react` mit `strokeWidth` 1,4 (nur Striche).
3. `Pinnwand` – Bilder/Screenshots/Zettel fallen auf die Wand, rote Fäden, Kamera darf kurz auf ein Element (Zoom ≤ 1,15).
4. `FilmLook` + `RauerGrund` – Korn, Vignette, Lichtschein bei Szenenwechseln (`lichtschein={[…Zeiten]}`), um die ganze Komposition legen.

**Gebaut, Teil 2 (28.11.2026)** in `animationen/src/doku-bausteine2.tsx`, Vorführung: Komposition `DokuDemo2`:
5. `MemeZweiFelder` (Nein/Ja mit zwei Posen), `MemeKlassisch` (Pose + Text oben/unten), `ReaktionsPop` (runde Figur-Reaktion über jeder Szene). **Nur eigene Posen** aus `public/posen` (Kopie von `figur/posen`), keine fremden Meme-Bilder.
6. `ChatVerlauf` – nachgestellter Chat mit Tipp-Punkten, Hinweis „nachgestellt“ oben links.
7. `Terminal` – Befehle tippen sich, Antworten erscheinen, blinkender Cursor. Nur erfundene, harmlose Befehle und Adressen aus dem Doku-Bereich (192.0.2.x).
8. `Fallakte` – Mappe klappt auf, Zeilen werden geschwärzt, Stempel knallt drauf, Lupe fährt über eine Zeile.
9. `KarteRaum` + `ladeLand` – gekippte Karte (Natural Earth `public/karten/land-110m.json`), Orte als pulsierende Punkte mit Namen, leuchtende Bögen als Spur, Kamerafahrt.
10. `BrowserFenster` – ganze Seite (`shot.py --voll`) scrollt in einem Browser-Rahmen mit Adresszeile.

**Noch offen:** Parallaxe aus getrennten Flow-Ebenen (Figur und Hintergrund getrennt erzeugen), kurze echte Videoclips (nur nach OK für den Download).
