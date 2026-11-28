# Regeln für Reels (und Erklärteile in langen Videos)

Der technische Ablauf steht in `PRODUKTION.md`, diese Datei regelt Stil und Inhalt. **Jede Szene so gut wie möglich, ohne Grenzen (`planung/regie-system.md`)**: Bausteine sind Startpunkte, eigens gebaute Lösungen erwünscht; Plan technisch mit `tools/regie-pruefen.mjs` prüfen. Belege für Reels im Hochformat aufnehmen (`shot.py … --breite 540 --hoehe 960`).

Gelernt aus dem Feedback zu Reel 02–04 und der Analyse von Hood Informatik (Outlook- und Nvidia-Short, 14.11.2026). Diese Datei gilt; ältere Notizen in den Reel-Dateien sind Geschichte.

## Aufbau
1. **Hook (unter 7 s):** Neuigkeit + Grund in einem Satz, dann eine Frage. Beispiel: „Hacker brechen bei einem KI-Anbieter ein, den kaum jemand kennt, und erbeuten Daten von Uber und Notion. Wie geht das?“ Keine gespielte Szene („Du öffnest Outlook …“). **Bild:** ab Frame 1 Bewegung und die Sache selbst (App, Gerät, Logo), nie ein stehendes Figur-Bild mit Titel. Die Figur kommt erst zur Frage als Reaktion (siehe „Motion-Standard 2.0“).
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
- **Standzeit pro Bild & Wort-/Satz-Synchronität (Feedback 24.11.2026):** Reels 2,5–5 s (höchstens 5–7 s für eine dichte Erklärgrafik). **Jeden Satz und jedes wichtige Schlüsselwort sichtbar animieren oder direkt als Bild zeigen:** Keine Szene darf statisch durchlaufen – sobald im Sprechtext ein Land, ein Objekt, eine Zahl oder eine Aktion fällt, wird es **exakt auf das Wort** eingeblendet, hervorgehoben oder als eigenes Bild/Objekt animiert (z. B. Flaggen bei Ländernamen, nachgebaute Kreditkarte/Kasse in Remotion, aufleuchtende Felder, individuelle Flow-Szenen). **Keine langen Text-Kasten-Wände:** Nie 3–4 reine Text-Box-Szenen hintereinander schalten. Nach jeder Grafik folgt ein echtes Foto, ein Beleg, ein animiertes Objekt/Flagge oder eine passende Flow-Szene mit unserer Figur (`figur/master.jpg` als Referenz).
- **Kein AI-Slop, volle Themen-Treue & „Strichermittler 2.0“-Stil (gelernt aus der direkten Video-Analyse von @HoodInformatik, 22.11.2026 & Feedback 24.11.2026):**
  - **0 % generische KI-Szenenbilder („AI-Slop“):** Keine willkürlichen KI-Bilder von „Hackern am Leuchtwürfel“ oder „aufgebrochenen Türen“, wenn es das Thema nicht real abbildet.
  - **Mix aus echten Bildern, Google Flow & lebendiger Animation (Feedback 25.11.2026):**
    - **Keine leeren Text-Box-Diagramme:** Reine Text-Kasten-Ketten wirken langweilig. Stattdessen immer ein Mix aus **echten Fotos**, **echten Beleg-Screenshots**, **individuellen Google-Flow-Szenen (0 Credits, mit `figur/master.jpg`)** und **lebendigen Remotion-Animationen** (Bewegung, Überlagerungen, knackige Einzelzahlen, Pfeile, Soundeffekte) darüber.
    - **Kein 2D-Cartoon-Design** anderer Kanäle kopieren – die **Bewegungsdynamik** und der **Bild-Animation-Mix** werden im eigenen Noir-Stil umgesetzt.
  - **Echte Belege & echte Motive (ca. 30 %):** Echte Meldungen, echte Tool-/Firmen-Webseiten, echte Personen-Portraits (z. B. Forscher/CEO), echte Marken-Logos, echte Fotos. Bei Artikeln: knackige Headline + den einen entscheidenden Satz gelb/rot markieren – keine grauen Fließtextwüsten.
  - **Eigene Signatur („Der Strichermittler“ besser als Hood):** Unsere 3D-Noir-Figur + `NoirBegruessung` als hochwertiges Markenzeichen einsetzen (Hook-Einbindung, Intro, pointierte Reaktion mit Requisite, Schluss) – **nie** als alleinstehenden Lückenfüller vor leerem Grau.
  - **Sauberer Bildaufbau & Animationen:**
    - **Nie die abgeschnittene Hintergrund-Figur (`FigurStill`) hinter Animationen oder Motion Graphics legen!** Erklär-Animationen laufen auf eigenem sauberem dunklen Grund; die Figur erscheint nur gezielt (Hook, `NoirBegruessung`, Schluss oder eigene Pose).
    - **Exaktes Start- und End-Timing:** Jede Animation beginnt exakt zum passenden Satz/Wort und schließt sauber vor dem Szenenwechsel ab (nie mitten im Flug abbrechen oder leer nachlaufen).
    - Oben im Bild nur wenig Schutz-Luft (~140–150 px) lassen und die **komplette Fläche bis direkt über die Untertitel** (~1.200 px Höhe) für Animationen und Belege nutzen – nie alles tief unten auf einen schmalen Streifen quetschen.
- **Motion-Standard 2.0 (Reel 08 neu gebaut, 28.11.2026 – gilt ab jetzt, Vorlage: `animationen/src/ProbeTodoist.tsx` + `probe-todoist-teil2.tsx`):** Gelernt aus Armans Kritik an Reel 08 („Einstieg komisch, Animation zu einfach, KI-Slop“) und den Vorbildern des Denkwürfel-Kanals (schraffuren, scroll.engineer).
  - **Ein Held pro Abschnitt, der sich verwandelt:** z. B. das Handy mit der App (Riss → Scanner → Funde springen heraus) oder ein Schlüssel, der durchs Bild reist (gestohlen → Code-Abläufe → Admin → Cloud). Lieber eine Bühne mit Verwandlung als fünf Kästen nacheinander.
  - **Jedes Schlüsselwort = ein sichtbares Ereignis, genau auf dem Wort** (Wortzeiten aus `untertitel.json`, ±3 Frames).
  - **Zustand über Farbe, Größe, Lage zeigen, nicht über Text:** Rot = betroffen, Grün = gesichert, Gold = Admin; Unwichtiges wird dunkel, das Wichtige springt heraus.
  - **Keine Dashboard-Kästen mit Glow-Rand** und keine kleinen Erklärtexte darin. Objekte mit Licht, Verlauf und Tiefe (Zahnräder, Schlösser, Geräte, Wolke).
  - **Kamera fährt mit:** große Welt (z. B. 1080 × 3200), Kamera folgt dem Helden und zoomt auf das, worüber gesprochen wird; kurz eine Gesamtübersicht, dann nah ran.
  - **Belege groß mit Kamerafahrt (`BelegFahrt`):** Screenshot füllt das Bild, Kamera fährt sanft zur gesprochenen Stelle. **Nur so weit zoomen, dass nichts abgeschnitten wirkt** (Überschrift und Zeile bleiben ganz im Bild). **Eine Markierung reicht:** entweder die gelbe Markierung aus dem Screenshot oder ein Rahmen auf dem Wort, nie beides (Arman, 28.11.2026). Bei der Pointe („beim Täter“) wird alles dunkel bis auf die markierte Zeile. Keine Überschrift über dem Beleg, Quelle winzig unten links. **Deutsche Quellen bevorzugen**, englische nur ohne deutsche Alternative.
  - **Text im Bild:** höchstens eine große Zahl pro Abschnitt (z. B. Jahreszahl 2016) und kleine Beschriftungen in Großbuchstaben (~30 px). Keine Dauer-Überschrift oben über den Szenen.
  - **Rückgriff statt neuer Bilder:** Der Held vom Hook kommt später wieder (Handy bei der Schlüssel-Suche und beim Schluss-Tipp). Das gibt dem Reel einen roten Faden.
  - **Figur gezielt:** Reaktion auf die Hook-Frage (schneller Zoom), Begrüßung, Schluss-Appell und „Ich bleibe dran“. Nie als Dauer-Hintergrund.
- **Bildarten:** echte Schlagzeilen und Artikelzeilen mit gelber Markierung und rotem Rahmen, echte Fotos (Wikimedia Commons, Lizenz prüfen), echte Webseiten, App-Icons und Logos.
- **Erklärgrafik schlicht:** dunkler Grund, wenig Farbe (Orange = Akzent, Grün = gesichert, Rot = betroffen/Fehler), Objekte statt Kästen (siehe Motion-Standard 2.0). Bausteine: `animationen/src/ProbeTodoist.tsx` (Hook-Handy, `BelegFahrt`, Schlüssel-Weg), `probe-todoist-teil2.tsx` (Altlast-Karten, Suche, offene Frage, Schluss); ältere: `ruhig.tsx`, `outlook.tsx`, `fireworks.tsx`.
- **Reaktionen und Memes:** Memes sind erwünscht (Arman, 28.11.2026), aber nur mit eigenen Posen der Figur, nie mit fremden Meme-Bildern. Bausteine: `MemeKlassisch`, `MemeZweiFelder`, `ReaktionsPop` (`animationen/src/doku-bausteine2.tsx`). Ganzflächig, sonst steht die Figur doppelt im Bild. Posen: `figur/posen/` (Stil B passt zur Master-Figur).
- **Nachgestellt** (z. B. Fehlerseite im Browser) nur, wenn es nichts Echtes gibt – in der Beschreibung so benennen.
- **KI-Bilder (Google Flow):** für Posen, Cover und illustrative Szenen ohne echtes Material, immer mit `figur/master.jpg` als Referenz (siehe `PRODUKTION.md`, Schritt 4–5). Fakten und Belege bleiben echt.

## Untertitel
- Klein (60 px), schlichte Schrift (Inter), 1–3 Wörter pro Seite, gesprochenes Wort gelb.
- Während der Begrüßung ausblenden.
- Whisper-Fehler korrigieren (Namen, englische Wörter, Bindestriche).

## Quellen
Alle Quellen und Bildnachweise in die Videobeschreibung (`caption.txt`) und als Text in `skripte/<video>.md`.

## Prüfen vor dem Abgeben (Kontinuierliche Selbstverbesserung)
- **Visuelle Selbstkritik vor jeder Übergabe:** Den Kontaktbogen (alle 2–4 s) nicht nur auf technische Fehler prüfen, sondern kritisch gegen die bisherigen Reels vergleichen:
  - Wirkt jede einzelne Szene lebendig und genau auf die Aussage zugeschnitten – oder gibt es statische Lücken, langweilige Standard-Ausschnitte oder „AI-Slop“?
  - Lassen sich **Animationen, Motion-Effekte, Licht/Tiefe, Kamerafahrten und Übergänge** in Remotion noch klarer und hochwertiger umsetzen?
  - Schwache, generische oder unruhige Szenen **sofort eigenständig überarbeiten und neu rendern**, bevor das Video übergeben wird.
- **Lern-Kreislauf über alle Videos:** Neue Erkenntnisse zu visuellen Methoden, Motion-Bausteinen und Schnitt-Timing werden direkt hier in `reel-regeln.md` und in `animationen/src/` festgehalten, damit jedes Video sichtbar besser wird als das vorherige.
- Untertitel-Abschrift auf Hörfehler prüfen, die auf undeutliche Aussprache hinweisen.
- Den Klang und die visuelle Wirkung beurteilt Arman nach der Übergabe; seine Rückmeldung fließt sofort in diese Regeln ein.
