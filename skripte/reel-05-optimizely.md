# Reel 05 – Schadcode auf Zoom, BBC und IKEA durch Optimizely-Hack

**Format:** Reel 9:16, ca. 76 s · **Stand der Fakten:** 19.11.2026 (Update Optimizely Advisory) · **Remotion:** `ReelOptimizely` · **Sprechtext:** `sprechtexte/reel-05-optimizely.txt` · **Video:** `reels/2026-KW47/reel-05-optimizely/FINAL-VIDEO.mp4`

## Gesicherte Fakten (mit Quelle)
- **Vorfall am 16.11.2026:** Über die Plattform **Optimizely Web Experimentation** (A/B-Tests und Personalisierung) wurde schädlicher JavaScript-Code auf Webseiten bekannter Unternehmen ausgeliefert (Report URI, The Record, Optimizely Advisory).
- **Ausmaß:** Sicherheitsforscher von **Report URI** (Scott Helme) untersuchten 1.611 Optimizely-Snippets und fanden Schadcode in **188 Snippets bei 178 Organisationen**, darunter **Zoom, BBC, CNN, Salesforce, GitLab, IKEA, HSBC, Equifax, Air France-KLM, Ledger und Peacock** (Report URI). Laut **The Record** waren darunter **32 Finanz- bzw. Bank-Webseiten** (The Record). Optimizely selbst spricht von weniger als 5 % seiner Web-Experimentation-Kunden (Optimizely Advisory).
- **Ursache / Ablauf:** Webseiten binden über Optimizelys CDN (`cdn.optimizely.com`) ein Projekt-Skript ein, das ein Feld für eigenen Code (**Project JavaScript**) enthält (Report URI). Laut Optimizely nutzten Angreifer eine Schwachstelle im **Account Signup Flow** (Konto-Anmeldung) aus, gaben sich als Nutzer betroffener Firmenkonten aus und schrieben den Schadcode direkt in deren Projekte (Optimizely Advisory). Da das Skript weiter über Optimizelys reguläre Domain und mit gültigem Zertifikat geladen wurde, fiel es Standardsicherungen kaum auf (Report URI).
- **Schadfunktion:** Der eingeschleuste Loader lud ein Mehrzweck-Toolkit nach: Es tauschte Krypto-Wallet-Adressen gegen Angreifer-Adressen (mindestens 7.000 US-Dollar nachgewiesen laut The Record / Report URI), griff Zahlungskartendaten ab, stahl Browser-Cookies sowie Bildschirmfotos und lieferte auf iPhones und iPads die iOS-Exploit-Kits **Coruna** und **DarkSword** aus (Report URI, The Record).
- **Stand & Offenes:** Optimizely schloss die Lücke nach eigenen Angaben binnen drei Stunden nach Entdeckung und entfernte den Schadcode aus allen betroffenen Projekten (Optimizely Advisory). Die Täter sind nicht bekannt, und laut Scott Helme lässt sich nicht beziffern, wie viele Kreditkarten, Cookies oder iOS-Geräte in diesem Zeitfenster betroffen waren (The Record).

## Beschreibung (zum Reinkopieren)
Hacker schleusen Schadcode auf Webseiten von Zoom, der BBC und IKEA ein – ohne diese Firmen selbst zu knacken. Wie der Angriff über Optimizely funktionierte und was dahintersteckt.

Quellen:
- Report URI (Scott Helme, 16.11.2026): https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/
- Optimizely Security Advisory (Update 19.11.2026): https://support.optimizely.com/hc/en-us/articles/50521849710605-Security-Advisory-Web-Experimentation-Security-Incident-Updated-November-19-2026
- The Record: https://therecord.media/optimizely-malicious-code-customer-sites

Bilder:
- Portrait Scott Helme & Report-URI-Grafik: Scott Helme / Report URI (blog.report-uri.com)
- Fotos (Wikimedia Commons): Paying with a Credit Card (Hloom, CC BY 2.0)
- Logos: Zoom, BBC, CNN, IKEA (Wikimedia Commons)
- Figur, Cover und thematische Szenenbilder: eigene Bilder (Der Strichermittler)

#optimizely #cybersecurity #supplychain #browser #strichermittler
