# Der Strichermittler (Claud-Youtube) — Verbindlicher 1-Phasen-Vollautopilot mit Google Flow

## Ziel & Format
Investigativer YouTube- und Erklärkanal für **News, Politik, KI, Tech-Skandale, Betrugsfälle und Enthüllungen** als **16:9-Videos (1920×1080)** und **9:16-Reels/Shorts (1080×1920)**.
Es gibt **keine getrennten Nutzer-Phasen, keine manuellen Zwischenfragen und keine Freigabestopps mehr**. Der Agent führt jedes Video in **einem einzigen, durchgehenden Autopilot-Durchlauf** von der Themenwahl bis zur fertigen MP4-Datei komplett autonom aus und trifft alle kreativen und technischen Entscheidungen (Thema, Bildwelt, Referenzen, Cover-Auswahl, Bild-Nachbesserung, Schnitt) selbstständig.

**Stil und Inhalt** (Hook, Aufbau, Bildregeln, Untertitel) stehen verbindlich in `planung/reel-regeln.md`. Kanal, Figur und Themen: `planung/kanal.md`.

---

## Die verbindliche 7-Schritte-Chronologie (1 durchgehender Lauf)

### 1. Thema, Recherche & Klick-Konzept (Autonom)
- Der Agent wählt ein brisantes, hochaktuelles Enthüllungsthema mit starkem Hook (Vorbild: Hood Informatik).
- Fakten, Urteile, Primärquellen und Screenshots werden recherchiert und belegt (mindestens zwei unabhängige Quellen, Datum notieren).
- Vor dem Schreiben stehen der klickstärkste YouTube-/Reel-Titel und das Thumbnail-Konzept fest.
- Notizen und Quellen: `skripte/<video>.md`.

### 2. Skript & Szenen-Regieplan
- **Hook unter 7 Sekunden** (Neuigkeit + Grund + Frage), **danach** „Willkommen beim Strichermittler.“, dann logische Beweisführung, Fallbeispiele und Pointierung (Details: `planung/reel-regeln.md`).
- Szenen-Einteilung:
  - **Reels (9:16):** Ø 4–6 Sekunden pro Bild (~12–18 Szenen). Erklär-Animationen dürfen 10–25 s laufen und sich aufbauen.
  - **Longform (16:9):** Ø 4–8 Sekunden pro Bild.
- Trennung zwischen Detektiv-Posen, echten Beleg-Screenshots und illustrativen Szenen.
- Sprechtext: `skripte/sprechtexte/<video>.txt`, Abschnitte mit `---` trennen.

### 3. Geklonte Master-Stimme zuerst (`tools/tts-qwen-mac/`)
- Der Agent erzeugt **vor** der Bildproduktion das finale Voiceover über die lokale MLX Qwen3-TTS Engine (Anleitung `tools/tts-qwen-mac/LIES-MICH.txt`):
  ```bash
  cd tools/tts-qwen-mac
  HF_HOME=/Volumes/T7/strichermittler-modelle HF_HUB_OFFLINE=1 .venv-mlx/bin/python qwen_mlx.py --modell 1.7B-8bit --text ../../skripte/sprechtexte/<video>.txt --ziel ergebnis/<video>.wav
  ```
- Pausen kürzen und Wortzeiten per Whisper ermitteln (`pausen_und_untertitel.py`), Abschrift auf Hörfehler prüfen (Namen, englische Wörter).
- Damit steht die exakte Dauer jedes Satzes vor dem Schnitt unverrückbar fest.

### 4. Bildwelt-Anker & Autonome Cover-Entscheidung in Google Flow (`flow-mcp`)
- **Verbindliche Master-Referenz:**
  - Jede Szene mit der Figur MUSS zwingend `figur/master.jpg` als Referenz an Flow übergeben:
    `references: [{image: "/Volumes/Mac-Projekte/Home/Strichvermittler/figur/master.jpg", name: "Strichermittler"}]`
  - **Stil-Signatur:** Glatter weißer Kugel-Kopf (Sphere), schwarze ovale Augen, schwarzer Fedora mit glänzendem orangefarbenem Band, hoher schwarzer Mantelkragen, schwarze Handschuhe, tiefschwarzer Hintergrund mit starkem orangefarbenem Kantenlicht (Rim Light). **NIEMALS ein Mensch, niemals kitschiger Cartoon.**
  - Fertige Posen liegen schon in `figur/posen/` (Stil B passt zur Master-Figur) – erst dort suchen, dann neu erzeugen.
- Der Agent öffnet über **Flow MCP** (`flow_new_project`) ein Projekt in Google Flow:
  1. **3 Cover-Kandidaten (`A`, `B`, `C`) → Autonome Auswahl:** Der Agent generiert 3 Cover-Varianten mit dem Strichermittler, **schaut sie sich selbst per `read_file` an**, wählt eigenständig das klickstärkste Cover als finales `cover.png` aus und **löscht die 2 anderen Kandidaten sofort und restlos**.

### 5. Vollautomatische Szenen-Produktion & Strenge Eigenkontrolle (`flow-mcp`)
- Der Agent übergibt alle benötigten Posen und illustrativen Szenen mit der angehängten Referenz `figur/master.jpg` an Flow MCP (`flow_agent_images` / `flow_generate`) und lädt sie per `flow_download` herunter. Bilder kosten 0 Credits; Videoclips kosten Credits und brauchen vorher die Zustimmung von Arman.
- Fakten werden nie mit KI-Bildern belegt: dafür echte Screenshots, Fotos und Logos (Schritt 6).
- **Verbindliche Sicht- & Qualitätskontrolle durch den Agenten:**
  - Der Agent prüft jedes heruntergeladene Bild selbst visuell.
  - Weicht die Figur ab (z. B. menschliches Gesicht, falscher Hut, fehlendes Rim Light) oder passt die Pose nicht zur Aussage, **löscht der Agent dieses Bild sofort und generiert die Szene automatisch neu**, bis alle Bilder 100 % on-model sind.

### 6. Screenshots, Remotion-Schnitt & Finaler Render
- Echte Belege und Artikel-Screenshots werden per `tools/screenshots/shot.py` erzeugt und formatiert (Privatdaten verpixeln):
  `tools/screenshots/.venv/bin/python tools/screenshots/shot.py URL ZIEL.png --breite 540 --hoehe 960 --text "Kernsatz"`. Seiten mit Bot-Sperre, Login oder Zustimm-Wand verwerfen.
- Freie Fotos von Wikimedia Commons (Urheber und Lizenz notieren).
- Animationen und Szenen werden in Remotion montiert (`animationen/`, Vorlage `src/ReelFireworks.tsx`, Bausteine in `src/ruhig.tsx`).
- Render-Befehl ausführen (`cd animationen && npx remotion render <Composition> <Ziel.mp4> --concurrency=2`).

### 7. Endkontrolle & Saubere Übergabe
- Der Agent prüft das fertige MP4: Kontaktbogen alle 2–4 s, Lautstärke um -14 LUFS, Bild-Ton-Synchronität, Lesbarkeit der Belege.
- Saubere Dateiablage im Zielordner (**nur lokal**, `video-*/` ist in `.gitignore`, weil das Repo öffentlich ist):
```text
video-<n>/
  FINAL-VIDEO.mp4       (Fertig gerendertes & geprüftes Video)
  cover.png             (Vom Agenten ausgewähltes Sieger-Cover, Verlierer gelöscht)
  caption.txt           (Titel, Beschreibung, Quellen, Bildnachweise, Hashtags)
  untertitel.srt        (Exakte deutsche Untertitel)
  _intern/              (Unsichtbar: Rohaufnahmen, Einzelbilder, Prompts)
```
- Recherche, Sprechtext und Quellen bleiben zusätzlich als Text im Repo (`skripte/`).

---

## Wo was liegt
| Was | Wo |
|---|---|
| Code und Texte | dieses Repo (öffentlich) |
| Ton, Untertitel, Screenshots, Fotos eines Reels | `animationen/public/reel-…/` (nur lokal) |
| Fertige Videos | `video-<n>/` (nur lokal); Reels 01–04 in `video-01/reels/`, alte Fassungen in `video-01/archiv/` |
| Posen der Figur | `figur/posen/` (nur lokal) |
| Stimm-Vorlage und Modelle | `tools/tts-qwen-mac/vorlage.wav` (nur lokal), SSD T7 `strichermittler-modelle/` |
| Flow-Ausgaben | `/Volumes/T7/flow-mcp-out/` (`~/flow-mcp-out` ist nur ein Verweis dorthin) |
| Test-Renders, Kontaktbögen, Zwischendateien | `/Volumes/T7/strichermittler-tmp/` |
| Medien-Sicherung | Google Drive, `Meine Ablage/Der Strichermittler/` |

**Alles auf der SSD T7, nie auf dem Mac-Speicher** – auch Zwischendateien und Test-Renders.

Das Projekt liegt im Laufwerk „Mac-Projekte“ (`/Volumes/T7/Mac-Projekte.sparsebundle`). Ist es nicht eingebunden: `hdiutil attach /Volumes/T7/Mac-Projekte.sparsebundle`.

## Rechtliches (kurz, keine Rechtsberatung)
- **Screenshots** von News: als Zitat erlaubt (§ 51 UrhG), wenn sie besprochen werden, die Quelle genannt ist und nur so viel gezeigt wird wie nötig.
- **Fotos:** nur mit freier Lizenz, Urheber und Lizenz in `caption.txt`.
- **Logos und App-Icons:** nur zur Kennzeichnung der Firma im Bericht.
- **Keine** fremden YouTube-Videos, TV-Clips oder bekannten Memes – Reaktionen mit eigenen Posen.
- **Personen:** Opfer und verdächtige Privatpersonen nie erkennbar zeigen.
