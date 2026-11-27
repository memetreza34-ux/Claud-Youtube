# Reel 06 – Millionen Kartendaten von Windows-Kassenterminals gestohlen (auch in Deutschland)

**Format:** Reel 9:16, ca. 65–75 s · **Stand der Fakten:** 24.11.2026 · **Remotion:** `ReelKassenhack` · **Sprechtext:** `sprechtexte/reel-06-kassenhack.txt` · **Video:** `reels/2026-KW48/reel-06-kassenhack/FINAL-VIDEO.mp4`

## Gesicherte Fakten (mit Quelle)
- **Entdeckung (August / Berichte November 2026):** Sicherheitsforscher von **Cybernews** entdeckten im August 2026 einen offen zugänglichen Server der Angreifer mit Malware-Quellcode, Exploit-Werkzeugen und einem Carding-Panel namens **„VINY JUNIOR TRILHAS“** (Cybernews, IT-Finanzmagazin, Golem.de).
- **Ausmaß:** Auf dem Server lagen Datensätze von **über einer Million Kredit- und Debitkarten** (Kartennummern/PANs, Ablaufdaten, BINs und Bankdaten) von rund **780 bis 800 kompromittierten Windows-Kassenterminals (POS)** in **über 20 Ländern** (Cybernews, TechRadar, IT-Finanzmagazin).
- **Betroffene Länder (inkl. Deutschland):** Die meisten infizierten Terminals standen in **Brasilien** (rund 677 Systeme), weitere u. a. in den USA, Russland – und auch **in Deutschland** (rund 4 Terminals im untersuchten Datensatz laut Golem.de / MS-Aktuell / Cybernews).
- **Ursache / Ablauf:** Die Angreifer nutzten die Windows-Schwachstelle **CVE-2024-49138** im **Common Log File System (CLFS)**-Treiber aus (Privilege Escalation), für die Microsoft bereits im **Dezember 2024** einen Patch veröffentlicht hatte (IT-Finanzmagazin, Golem.de). Viele Kassenterminals blieben fast zwei Jahre lang ungepatcht. Mit den erlangten Systemrechten installierten die Täter einen **Remote-Access-Trojaner (RAT)**, der laufende Transaktionen mitschnitt und an den Server übertrug (IT-Finanzmagazin).
- **Stand & Offenes:** Der offene Angreifer-Server wurde entdeckt und die Kampagne öffentlich dokumentiert. Ob alle betroffenen Kassensysteme weltweit inzwischen gepatcht wurden und wer genau hinter „VINY JUNIOR TRILHAS“ steckt, ist offen (Täter werden aufgrund des Schwerpunkts und der Sprache in Brasilien vermutet).

## Beschreibung (zum Reinkopieren)
Hacker greifen über eine fast zwei Jahre alte Windows-Lücke Millionen Kredit- und Debitkartendaten direkt an Kassenterminals in über 20 Ländern ab – auch in Deutschland. Wie der Angriff über CVE-2024-49138 funktionierte.

Quellen:
- Golem.de (Nov. 2026): https://www.golem.de/news/auch-in-deutschland-hacker-greifen-millionen-bezahlkartendaten-von-terminals-ab-2611-215408.html
- IT-Finanzmagazin (Nov. 2026): https://www.it-finanzmagazin.de/cve-2024-49138-ungepatchte-pos-terminals-254361/
- Cybernews / TechRadar (Nov. 2026): https://cybernews.com / https://www.techradar.com

Bilder & Visualisierungen:
- Artikel-Beleg: IT-Finanzmagazin (Screenshot)
- Zahlungsterminal-Foto: Wikimedia Commons – „Paying with a Credit Card“ (Hloom, CC BY 2.0)
- Erklärgrafiken, Weltkarte & Terminal-Animationen: eigene Remotion-Animationen (Der Strichermittler)
- Figur & Posen: eigene Bilder (Der Strichermittler)

#kassenterminal #kartendaten #cybersecurity #windows #strichermittler
