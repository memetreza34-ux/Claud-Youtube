# Reel 03 + 04 – Outlook-Störung (Recherche, Stand 13.11.2026, 16:20 Uhr)

**Plan:** zwei Reels im Aufbau von `ReelNvidia4` (Hook → „Willkommen beim Strichermittler“ mit Ballons → Geschichte → Stand → offene Frage).
- **Reel 03 „Outlook ist down“:** was passiert ist, wer betroffen ist, wie Microsoft reagiert.
- **Reel 04 „Warum?“:** Ursache laut Microsoft (überlasteter Kernprozess, Health Checks, Kettenreaktion), kein Angriff, endgültige Ursache offen. Grafik: Server-Raster, die nacheinander ausfallen.

## Gesicherte Fakten (mit Quelle)
- **Beginn:** Donnerstag 12.11.2026. Microsoft meldet kurz vor 13 Uhr ET (≈ 19 Uhr MEZ) „investigating reports of users experiencing issues“ beim Zugriff auf Postfächer ([ABC News, 13.11., 7:19 ET](https://abcnews.com/US/outlook-down-microsoft-outage-reported-mail/story?id=138088203)). Weekend.at nennt ≈ 18 Uhr MEZ (Artikel KI-generiert, nicht als Beleg nutzen).
- **Betroffen:** Exchange Online/Outlook (Web, Desktop, Mobil, auch Apple Mail), Teams-Kalender und -Planung, SharePoint, Copilot, Planner, To Do, Intune u. a. ([Borncity, 12.11.](https://borncity.com/blog/2026/11/12/outlook-com-und-outlook-exchange-online-gestoert/), Microsoft-Status 23:28 Uhr). Incidents **EX1550543**, **MO1550821**.
- **Microsoft:** „paused all deployments“, „restarting affected servers“, „aggressively pursuing all pathways to reduce impact“ (ABC).
- **Ursache laut Microsoft (vorläufig):** „a core process on the affected servers is becoming overwhelmed“ (Borncity). Server fallen bei Health Checks aus; Konfigurationsänderung wurde geprüft bzw. zurückgerollt; ein Patch an einer „upstream authentication and routing component“ zeigte Wirkung (Borncity, 13.11., 08:24 Uhr). Server werden unter erneuter Last wieder unerreichbar ([Stuttgarter Nachrichten, 13.11., 06:23](https://www.stuttgarter-nachrichten.de/panorama/outlook-down-wie-kommt-man-jetzt-an-seine-mails-79697450.html)).
- **Kein Angriff:** Charles Lamanna (Microsoft-Vizechef): „there is no indication this is the result of malicious or cyber activity“ (ABC, Borncity).
- **Entschuldigung:** Lamanna: „We regret that today's outages caused disruptions for our customers“ (ABC).
- **Freitag 13.11.:** „early stabilization and capacity improvements“; Mail-Warteschlangen werden abgearbeitet, einzelne Probleme möglich (ABC). Endgültige Ursache folgt im „Post-Incident Report“ (Microsoft, laut Borncity).
- **Folgen:** New York City Emergency Management warnte vor Verzögerungen bei städtischen Diensten (ABC).

## Nicht verwenden (unbelegt oder anderer Vorfall)
- Hacker-Gerüchte, „12 Stunden“, Entschädigungen (nur Kommentare)
- Treffer zu früheren Outlook-Störungen (EX1464935, Azure-Konfig) – anderer Vorfall
- Weekend.at-Details (Japan, Australien, 74 Länder): KI-Artikel, erst gegenprüfen

## Offen
- Aktueller Stand (behoben?) auf status.cloud.microsoft/m365 bzw. @MSFT365Status prüfen
- Screenshots: ABC (Zitate), Borncity (Kernprozess), Stuttgarter Nachrichten (Tipps), Microsoft-Status
- Sprechtexte, Stimme, Untertitel, Szenen, Prüfung, Rendern

## Reel 03 – Version 1 (14.11.2026)
Sprechtext: `tools/tts-qwen-mac/reel-03-outlook-sprechtext.txt` · Remotion: `ReelOutlook` (61 s) · Grafiken: `animationen/src/outlook.tsx`
- **Neu bestätigt:** Microsoft (@MSFT365Status) meldet am Samstag 14.11.: „restored service to the remaining impacted customers and regions“ ([Digital Trends, 14.11.](https://www.digitaltrends.com/computing/microsoft-365-outage-resolved/))
- Ursache laut Microsoft (für Reel 04): „introduced by an issue during an earlier network capacity upgrade that surfaced following a recent network change“ (ABC)
- Belege: ABC News (Meldung, Updates gestoppt, New York, „no indication“, Entschuldigung). Borncity (403), Digital Trends (Login) und Stuttgarter Nachrichten (Zustimm-Seite) lieferten keine Screenshots; dort eigene Grafiken mit Quellenangabe.

## Reel 03 – Version 2 (14.11.2026): Hook-Formel, zeigen statt erzählen
Sprechtext: `tools/tts-qwen-mac/reel-03-outlook-v2-sprechtext.txt` · Remotion: `ReelOutlook2` (57 s) · Bausteine: `animationen/src/outlook2.tsx`
- Hook: Datum → „Outlook funktioniert nicht“ → „Was ist passiert?“ → Begrüßung
- Szenen je ca. 3–4 s: Datum mit Fehlerkarten, Weltkarte mit Wellen, Campus-Foto mit Meldung, Mindmap, Geräte, Rechenzentrum mit Last-Anzeige, New York mit Eilmeldung, Hacker durchgestrichen, Zeitleiste Do–Sa
- Fotos (Wikimedia Commons): [Microsoft Building 92, Jiaqian AirplaneFan, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Building_92_of_Microsoft_Redmond_Campus_-_panoramio.jpg) · [Rechenzentrum, BalticServers.com, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:BalticServers_data_center.jpg) · [New York, Diliff, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:New_York_Midtown_Skyline_at_night_-_Jan_2006_edit1.jpg) · [Computerraum, Bertrand Soubeyrand, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Une_salle_de_coding_de_l%27%C3%A9cole_1337_Khouribga.jpg) · [Weltkarte, gemeinfrei](https://commons.wikimedia.org/wiki/File:BlankMap-World-Equirectangular.svg)
