# Video 02 – Hacker heizen Supermärkte auf 50 Grad

**Format:** langes Video 16:9, ca. 8 Min. · **Stand der Fakten:** 28.11.2026 · **Sprechtext:** `sprechtexte/video-02-kuehlanlagen.txt` · **Remotion:** `Video02Kuehlanlagen` · **Ordner:** `video-02/` (FINAL-VIDEO.mp4, cover.png, caption.txt, untertitel.srt)

## Titel
**Wer hat Europas KÜHLREGALE gehackt?** (Alternative: „Hacker heizen Supermärkte auf 50 Grad – die Spur führt in den Iran“)

## Gesicherte Fakten (mit Quelle)
- **1. Welle Frankreich, Nacht 11./12.10.2026:** rund 700 Standorte (Wirtschaftsminister Lescure; frz. Regierung), u. a. Carrefour, Intermarché, Leclerc, Casino, Coopérative U, Metro, dazu Metzgereien, ein Schlachthof. Abtauzyklen ohne Zeitlimit, Alarme der Temperaturfühler abgeschaltet, rund 20 Brände (Pariser Staatsanwaltschaft), Schaden „mehrere zehn Millionen Euro“ (frz. Außenministerium). Quelle: The Hacker News 10.11.2026, SecurityWeek 03.11.2026.
- **Betroffene Technik:** Danfoss AK-SM/AK-SC, Copeland xweb, Dixell xweb (CERT-FR, CERTFR-2026-ALE-012). Danfoss: meist Altgeräte ohne Updates.
- **2. Welle, Nacht 02./03.11.2026:** über 100 Märkte in Belgien, Estland, Irland, Luxemburg, Niederlande, Schweden; Meldungen auch aus Finnland, Italien, Portugal (SecurityWeek). Deutschland: BSI bestätigt; Reisbach bis 50 °C, Lilienthal > 360.000 € Ware (n-tv via Telepolis 04.11.2026); weitere Meldungen Wuppertal, Wetter-Volmarstein, Münsterland, Westpfalz.
- **Blutbank Frankreich:** Zieltemperatur 110 °C, rechtzeitig entdeckt (Telepolis; heise 07.11.2026).
- **Ermittler Deutschland:** BfV („Gegenstand aktueller nachrichtendienstlicher Ermittlungen“), GAZ Hybrid mit BND und MAD (heise 07.11.2026 nach Handelsblatt). Keine Kritis-Betriebe (Schwelle 500.000 Versorgte).
- **Türen:** Werkspasswort öffentlich dokumentiert; Lupovis-Köder sahen ab 20.10. Login-Versuche mit Werksdaten (SecurityWeek). Claroty-Lücken CVE-2025-41450/-41451 im AK-SM 800A (2025 behoben; Nutzung nicht bestätigt, Telepolis). Mind. ein Fall über externen Wartungsdienstleister (heise 07.11.).
- **Erreichbarkeit:** Forescout: 12.976 Sichtungen von Kühlmanagement-Diensten auf 6.017 IPs in 99 Ländern (Telepolis). Censys: Danfoss StoreView in Frankreich 1.825 vor den Angriffen, danach 220 (SecurityWeek).
- **Updates reichen nicht:** Midnight Blue fand in Version 5.3.2 binnen einer Stunde sechs Pre-Auth-RCE-Lücken; BSI kann auch für 5.4.0 Lücken nicht ausschließen (heise 13.11.2026).
- **Täter:** Frankreich (Krisenzentrum C4 mit ANSSI, DGSE, DGSI) nennt am 09.11. die IRGC-Einheit Shahid Kaveh (Tarnnamen CyberAv3ngers, Cyber Isnaad Front). Belege: gleiche Infrastruktur für Aufklärung an Schneider-Electric-Anlagen in kleinen Energie-/Wassererzeugern, Scan-Werkzeug FOFA, Propagandakanal CyberbanNews berichtete am 13.10., Spuren auf Persisch, IP-Adressen im Iran. Ermittlungen gegen Chef und zwei Stellvertreter, internationale Haftbefehle beantragt; „erste offensive Cyberkampagne auf französischem Boden rein zur Sabotage“. Gilt nur für die Oktober-Welle (The Hacker News 10.11.2026). Iran bestreitet.
- **Kein Geldmotiv:** keine Lösegeldforderung, keine Datenabflüsse (20 Minuten).
- **EU:** Agrarkommissar Christophe Hansen: gezielter Versuch, die Lebensmittelkette zu stören und Vertrauen zu erschüttern; Versorgung nicht bedroht (SecurityWeek).

## Quellen
- The Hacker News, 10.11.2026: https://thehackernews.com/2026/11/france-blames-iran-for-sabotage-attack.html
- SecurityWeek, 03.11.2026: https://www.securityweek.com/over-100-european-stores-hit-as-supermarket-fridge-attacks-resume/
- heise, 07.11.2026: https://www.heise.de/news/Supermarkt-Kuehlsysteme-Deutsche-Geheimdienste-ermitteln-nach-Sabotageakten-11516390.html
- heise, 13.11.2026: https://www.heise.de/news/Supermarkt-Angriffe-Danfoss-Kuehlsteuerungen-blieben-trotz-Updates-angreifbar-11524376.html
- Telepolis, 04.11.2026: https://www.telepolis.de/article/50-Grad-im-Tiefkuehlregal-Hacker-heizen-deutschen-Supermaerkten-ein-11511510.html
- G DATA Blog, 03.11.2026: https://blog.gdata.de/2026/11/38500-kuehlanlagen-supermaerkte-cyberangriff
