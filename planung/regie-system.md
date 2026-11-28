# Regie – jede Szene so gut wie möglich

Gilt für **alle** Videos: lange Videos (16:9) und Reels/Shorts (9:16).

**Grundsatz (Arman, 28.11.2026): Es gibt keine Grenzen.** Jede einzelne Szene wird so gut dargestellt, wie es überhaupt möglich ist. Die fertigen Bausteine sind ein **Werkzeugkasten**, kein Katalog, aus dem man wählen *muss*. Wenn eine Szene mit etwas Eigenem besser wird, wird es eigens gebaut.

## Für jede Szene diese Fragen beantworten
1. **Was ist die eine Aussage dieses Moments?** (Was soll der Zuschauer danach wissen oder fühlen?)
2. **Was wäre die stärkste denkbare Darstellung?** Ohne an vorhandene Bausteine zu denken: Wie würden Simplicissimus, Kurzgesagt, Johnny Harris, Barely Sociable oder ein Kinofilm genau diesen Moment zeigen?
3. **Womit lässt sich das am besten umsetzen?** Alles ist erlaubt und wird kombiniert:
   - eigene Animation in Remotion (SVG, CSS-3D, `@remotion/three` für echtes 3D, Partikel, Pfade, Masken)
   - echtes Material: Fotos, Screenshots, Dokumente, Karten, Videoclips (Download nur nach OK)
   - Google-Flow-Bilder (0 Credits): eigens für die Szene erzeugt, auch in Ebenen für Parallaxe
   - Flow-Videoclips (kosten Credits, nur nach OK)
   - die Figur, Memes mit eigenen Posen, Reaktionen
   - Sounddesign passend zur Bewegung
   - fertige Bausteine als Startpunkt, angepasst oder kombiniert
4. **Bauen, ansehen, besser machen:** Szene einzeln rendern, kritisch gegen die besten Vorbilder vergleichen und nachbessern, bis sie überzeugt.

## Werkzeugkasten (Startpunkte, keine Pflicht)
| Baustein | gut für … |
|---|---|
| `zahl` | überraschende Zahl, gern mit Bild dahinter |
| `artikel` | Quelle bestätigt etwas (schräge Seite, scharfe Zeile) |
| `browser` | echte Seite „live“ zeigen |
| `pinnwand` | mehrere Spuren, Ermittlungsgefühl |
| `bauplan` | Technik erklären (orange Striche, Datenfluss) |
| `terminal` | was der Täter tut (erfundene, harmlose Befehle) |
| `chat` | Menschen schreiben sich (nachgestellt) |
| `akte` | Täter, Ermittlung, Geheimes |
| `karte` | Orte, Länder, Wege |
| `meme`, `memeZwei`, `reaktion` | Humor, falsch gegen richtig, kurze Reaktion |
| `memeStufen` | Eskalation/„Galaxy Brain“: 3–4 Stufen, jede glüht stärker (vom Harmlosen zum Absurden) |
| `memeErwartung` | Erwartung vs. Realität: Erwartung füllt erst alles, dann knallt die Realität rein |
| `memeChaos` | „Alles in Ordnung“: ruhige Pose, drumherum Feuer (`art: "feuer"`) oder Störung (`"glitch"`) |
| `memeZoom` | dramatischer Dreifach-Zoom aufs Gesicht als Reaktion auf eine Enthüllung (dazu `klaenge` einschlag) |
| `figur` | Begrüßung, Wendepunkt, Schluss |
| `eigen` | **alles andere: die eigens gebaute, beste Lösung für genau diese Szene** |

Code: `animationen/src/regie/` (Typen, Renderer `Regie`, Prüfer), Bausteine `animationen/src/doku-bausteine*.tsx`, Pläne `animationen/src/plaene/<video>.ts`. Eigene Szenen werden der Regie über `eigeneSzenen` übergeben.

## Klang – jede Szene wird auch gehört
Ich höre nicht, darum: Klänge auf exakte Wortzeiten setzen und das Ergebnis als Bild prüfen.
- **Eigene Klänge** (kostenlos, eigene Rechte): `python3 tools/klang.py --liste`, dann z. B. `python3 tools/klang.py brummen --dauer 8 --name kuehlregal`. Arten: whoosh, riser, einschlag, brummen, alarm, piepen, klick, tippen, glitch, herzschlag, kasse, spannung, raum, zischen, papier, kamera, stempel. Regler: `--dauer`, `--hoehe` (Tonhöhe), `--hall`, `--seed` (andere Variante). Alle Klänge sind gleich laut eingepegelt (−20 dBFS Mittel), `laut` im Plan bedeutet also überall dasselbe.
- **Im Plan:** `klaenge: [{ name: "einschlag", ab: <Wortzeit>, laut: 0.4 }]` für Ereignisse, `atmo: { name: "brummen", laut: 0.12 }` als Teppich unter der ganzen Szene (Schleife, weich ein/aus), `stumm: true` schaltet den automatischen Wechsel-Klang ab.
- **Faustregeln:** Klang auf das Wort, nicht davor. Atmo leise (0,08–0,15), Ereignisse 0,25–0,5, harte Klänge (alarm, glitch) eher 0,2–0,3. Nicht jede Sekunde klingeln: ein starker Klang pro Aussage.
- **Prüfen:** Ton der gerenderten Szene als Bild: `ffmpeg -i <szene.mp4> -vn <ton.wav>` und `python3 tools/klang.py --ansehen <ton.wav>` (Wellenform + Spektrum: sitzt der Klang an der richtigen Stelle, übertönt er die Stimme?). Am Ende `tools/endkontrolle.sh` (−14 LUFS).
- **ElevenLabs** (`generate_sound_effect`) klingt realistischer, **kostet aber Geld** → nur mit Armans OK.

## Memes
Nur eigene Posen (`animationen/public/posen/`, 56 Stück, z. B. `b-kaffee-alles-brennt`, `b-mind-blown`, `b-panik`, `b-mic-drop`, `b-aktie-steigt`). Bekannte Meme-**Formate** nachbauen ist erlaubt, fremde Meme-**Bilder** nie (Urheberrecht, echte Gesichter). Fehlt eine Pose: mit Flow (0 Credits, `figur/master.jpg` als Referenz) eine neue erzeugen, selbst prüfen, nach `figur/posen/` und `animationen/public/posen/`. Vorführung: Kompositionen `MemeDemoShort`/`MemeDemoLang`.

## Echte Fotos, Clips und Musik
- **Fotos/Clips:** `python3 tools/bilder.py suche "<begriff>" [--video]` → Vorschau ansehen → `python3 tools/bilder.py hole <nr> --ziel animationen/public/<ordner>/<name>.jpg` (Nachweis landet in `bildnachweise.txt` → Caption). Wikimedia ohne Schlüssel; Pexels/Pixabay mit kostenlosem Schlüssel in `/Volumes/T7/strichermittler-schluessel/`. Nur Orte, Technik, Gebäude, Objekte – keine Gesichter als Hauptmotiv. Downloads nur von diesen Quellen und nur mit Armans (Dauer-)OK.
- **Musik:** `python3 tools/musik.py <stück> <stimme audio.wav> animationen/public/<ordner>/musik.wav` → Musik passt sich der Länge an und wird unter der Stimme automatisch leiser; in der Komposition `<Regie … musik="<ordner>/musik.wav" />`. Stücke: YouTube Audio Library (Arman lädt nach `/Volumes/T7/strichermittler-musik/`) oder eigener Teppich `tools/klang.py spannung --dauer 60`.

## Bewegung prüfen
`tools/szene.sh` erstellt neben dem Kontaktbogen automatisch `…-bewegung.jpg` (10 Bilder je Sekunde + Kurve der bewegten Fläche) und einen Bericht (`python3 tools/bewegung.py <video> [--von --bis]` geht auch für ganze Videos):
- **STILL** – Bild steht > 2 s → Kamera-Drift, Akzent oder neues Bild.
- **HARTSTART / HARTSTOPP** – Bewegung ohne Anlauf/Auslauf → `spring`/Easing.
- **SPRUNG** – 1–3 Bilder komplett neu → nur ok als geplanter Schnitt.
- **SCHWENK** – schneller Übergang → Tempo passend zum Satz?
- **HEKTIK** – zu viel Bewegung, Text nicht lesbar. **RUCKELN** – Werte springen statt zu gleiten.
Das sind Hinweise: Jede Stelle im Bewegungsbild ansehen und entscheiden.

## Technische Prüfung
`node tools/regie-pruefen.mjs animationen/src/plaene/<video>.ts`
- **FEHLER** (muss behoben werden): Lücken oder Überlappungen, Plan endet vor dem Ton, Klang-Datei fehlt.
- **HINWEISE** (nur zum Nachdenken, keine Grenze): sehr lange oder sehr kurze Szenen, gleiche Darstellung oft hintereinander, lange ohne Figur oder Beleg, Video beginnt mit stehender Figur.

## Format
- Alles passt sich über `useFlaeche()` (`animationen/src/format.ts`) an 16:9 oder 9:16 an.
- Shorts: Belege im Hochformat aufnehmen (`shot.py … --breite 540 --hoehe 960`, im Plan `verhaeltnis: 9 / 16`), Untertitel an. Lange Videos ohne Untertitel.
