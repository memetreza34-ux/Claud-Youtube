# Reel 02 – Wurde der Nvidia-Chef ausspioniert?

**Format:** Reel/Short, 1080×1920, ca. 60 s · **Stand der Fakten:** 10.11.2026
**Dreh:** Der Strichermittler sortiert den Fall: Was wir wissen, was nicht. Alles Unbestätigte ist als Bericht oder Vorwurf gekennzeichnet.

## Rechtliche Leitplanken
- Die verdächtigte Managerin wird **nicht namentlich genannt und nicht gezeigt**. Sie ist eine Privatperson, und gegen sie liegt nur ein Verdacht vor.
- Gegen niemanden gibt es eine Anklage. Das sagen wir ausdrücklich.
- Die Gegenseite kommt vor: Nvidias Verwaltungsrat sieht bisher keinen Hinweis auf abgeflossene Geheimnisse, China spricht von Verleumdung.
- Foto Jensen Huang: Wikimedia Commons, „Jensen Huang (cropped) (2024).jpg“, Peter DaSilva, **CC BY 4.0**. Namensnennung im Bild.

## Sprechtext und Bild
| Sprechtext | Bild | Beleg |
|---|---|---|
| Wurde der Chef von Nvidia ausspioniert? Das fragt sich gerade die ganze Tech-Welt. Schauen wir uns an, was wir wissen. Und was nicht. | Figur groß, Titel „Wurde der Nvidia-Chef ausspioniert?“ | – |
| Ende Oktober berichtet die New York Times: US-Geheimdienste halten eine Managerin der Firma Megaspeed aus Singapur für eine Quelle Pekings. Sie soll engen Kontakt zu Nvidia-Chef Jensen Huang gehabt haben. | Foto Jensen Huang, Stempel „BERICHT: New York Times“ | Al Jazeera 9.11.2026, ORF 9.11.2026 |
| Und Megaspeed ist kein kleiner Kunde. Laut New York Times hat die Firma für rund 4,8 Milliarden Dollar bei Nvidia eingekauft. Und US-Behörden prüfen seit 2024, ob über Megaspeed verbotene KI-Chips nach China gelangt sind. | Zahl „4,8 Mrd. $“, darunter „Chips nach China? Prüfung seit 2024“ | Al Jazeera (NYT-Zahl, Untersuchung seit 2024) |
| Am 8. November dann die Wende. In einer E-Mail an die Mitarbeiter schreibt Huang: Ich war meiner Frau untreu. Vorher war nur von normalem Kundenkontakt die Rede. | Screenshot ORF, markiert „Ich war meiner Frau untreu“ | ORF |
| Nvidias Verwaltungsrat prüft jetzt, ob Huang Ziel eines Geheimdienstes war. Laut Trump ermittelt das FBI. Die Aktie fiel zeitweise um fast 9 Prozent. China nennt das alles Verleumdung. | Screenshot ORF Verwaltungsrat, dann drei Karten: FBI · Aktie −8,7 % · China | ORF (FBI laut Trump, −8,74 % zeitweise, China), Al Jazeera |
| Was wir wissen: Huang hat die Affäre zugegeben, und es wird ermittelt. Was wir nicht wissen: ob wirklich Informationen nach Peking geflossen sind. Laut Verwaltungsrat gibt es dafür bisher keinen Hinweis. Angeklagt ist niemand. Ich bleibe dran. | Ermittler-Tafel: links BESTÄTIGT, rechts OFFEN. Am Ende Figur „Ich bleibe dran.“ | ORF, Al Jazeera |

## Version 2 (11.11.2026): Nachrichten-Schnitt
Sprechtext: `tools/tts-qwen-mac/reel-02-nvidia-v2-sprechtext.txt` · Remotion: `ReelNvidia2` · Bausteine: `animationen/src/beweise.tsx`
- **Einstieg mitten in der Szene** („Sonntag, 8. November … Ich war meiner Frau untreu“) mit echtem Foto ab Sekunde 0, dann ORF-Zitat mit rotem Kreis, dann Kurs-Grafik
- **Jede Szene ein echter Beleg oder echte Zahl**: Nvidia-Erklärung, Kongress-Pressemitteilung mit Brief, ORF, Kurs (−8,74 % zeitweise, −4,3 % Schluss), Zeitleiste, 4,8 Mrd. $
- Untertitel 1–3 Wörter, groß; Figur nur an zwei Wendepunkten
- Nicht verwendet: Kursdaten von Stooq/Yahoo (Bot-Sperre), AP/ADN (Zustimmungs-Wand), ITV (Verbindungsfehler)

## Version 3 (11.11.2026): Geschichte im Hood-Informatik-Aufbau
Sprechtext: `tools/tts-qwen-mac/reel-02-nvidia-v3-sprechtext.txt` · Remotion: `ReelNvidia3` (93 s) · Layout: `animationen/src/band.tsx`
- Einstieg mit der Bar-Szene in Taipeh 2024 (NYT, laut Yahoo/Bloomberg), chronologisch bis zum Kongress-Termin
- Figur als Hintergrund, Belege im Band, Untertitel in Anton mit Kontur; Sprechpausen gekürzt (`reel-nvidia-schnitte.ts`)
- Name der Managerin in allen Screenshots verpixelt (`shot.py --verpixeln`)
- Weggelassen, weil nicht belegt: „Unmasking“, fehlende Warnung an Huang

## Version 4 (11.11.2026): Hook, Begrüßung, ruhiger Schnitt
Sprechtext: `tools/tts-qwen-mac/reel-02-nvidia-v4-sprechtext.txt` · Remotion: `ReelNvidia4` (96 s) · Bausteine: `animationen/src/ruhig.tsx`
- Hook: Huangs Brief „Ich war meiner Frau untreu“ (ORF) + Memo „recruited by China“ (TechCrunch), dann „Willkommen beim Strichermittler“
- 14 Bilder statt 30, jedes bleibt bis zur nächsten Szene stehen; kein Zoom, keine Text-Titelkarten, harte Schnitte
- Neue Grafiken: Steckbrief Megaspeed, Lieferweg Nvidia → Megaspeed → China?, Kursbalken
- Begrüßung: Ballons in den Farben der Figur (Orange, Weiß, Schwarz) tragen das Schild „Willkommen beim Strichermittler“ herein und fliegen vor dem Schnitt nach oben weg (`animationen/src/begruessung.tsx`); Untertitel dort ausgeblendet
- Schluss ohne Band, nur die Figur

## Quellen
- [ORF, 9.11.2026: Affäre um Nvidia-Chef lässt Aktie fallen](https://orf.at/stories/3447708/) (Screenshots `video-01/screenshots-nvidia/`)
- [Al Jazeera, 9.11.2026: Why is Nvidia's Jensen Huang at the centre of a US-China spy scandal?](https://www.aljazeera.com/news/2026/11/9/why-is-nvidias-jensen-huang-at-the-centre-of-a-us-china-spy-scandal)
- [Nvidia: Statement from NVIDIA Board of Directors, 8.11.2026](https://nvidianews.nvidia.com/news/statement-from-nvidia-board-of-directors)
- [US-Repräsentantenhaus (Foreign Affairs): Chairmen Mast, Moolenaar, and Crawford Request Jensen Huang Brief Congress](https://foreignaffairs.house.gov/news/press-releases/chairmen-mast-moolenaar-and-crawford-request-jensen-huang-brief-congress-on-link-to-chinese-intelligence-asset)
- [TechCrunch, 10.11.2026: Timeline](https://techcrunch.com/2026/11/10/nvidia-ceo-jensen-huangs-affair-with-alleged-chinese-spy-a-timeline/) (Trump „did not act“, US/Singapur-Prüfung Okt. 2025, 4,8 Mrd. $)
- [TechCrunch, 7.11.2026: Memo](https://techcrunch.com/2026/11/07/chinese-exec-was-recruited-to-spy-on-nvidia-ceo-according-to-us-intelligence-memo/)
- [Yahoo Finance/Bloomberg: Bar-Szene, „completely normal“](https://finance.yahoo.com/technology/ai/articles/nvidia-ceo-affair-admission-counters-051608985.html)
- Fotos: [Revolver Bar Taipeh, 4300streetcar, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Revolver_bar_in_Taipei_April_2026.jpg) (Symbolbild) · [Donald Trump, Daniel Torok/Weißes Haus, gemeinfrei](https://commons.wikimedia.org/wiki/File:Donald_Trump_official_portrait,_2025_(cropped_headshot).jpg)
- Ursprünglicher Bericht: New York Times, Ende Oktober 2026 (Bezahlschranke, nicht selbst gelesen)
- [Foto: Wikimedia Commons, Peter DaSilva, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Jensen_Huang_(cropped)_(2024).jpg)
