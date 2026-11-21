# Reel 03 – Outlook weltweit down (12.–14.11.2026)

**Format:** Reel 9:16, 77 s · **Remotion:** `ReelOutlook` · **Sprechtext:** `sprechtexte/reel-03-outlook.txt` · **Video:** `video-01/reels/reel-03-outlook.mp4`

Erstes Reel nach den heutigen Regeln (`planung/reel-regeln.md`): Hook mit Grund, Erklärung von Health Checks und Load Balancer als Animation, keine Text-Einblendungen. Fassungen 1–2 stehen in der Git-Geschichte.

## Gesicherte Fakten (mit Quelle)
- **Beginn:** Donnerstag 12.11.2026. Microsoft meldet kurz vor 13 Uhr ET (≈ 19 Uhr MEZ) „investigating reports of users experiencing issues“ beim Zugriff auf Postfächer ([ABC News, 13.11., 7:19 ET](https://abcnews.com/US/outlook-down-microsoft-outage-reported-mail/story?id=138088203)). Weekend.at nennt ≈ 18 Uhr MEZ (Artikel KI-generiert, nicht als Beleg nutzen).
- **Betroffen:** Exchange Online/Outlook (Web, Desktop, Mobil, auch Apple Mail), Teams-Kalender und -Planung, SharePoint, Copilot, Planner, To Do, Intune u. a. ([Borncity, 12.11.](https://borncity.com/blog/2026/11/12/outlook-com-und-outlook-exchange-online-gestoert/), Microsoft-Status 23:28 Uhr). Incidents **EX1550543**, **MO1550821**.
- **Microsoft:** „paused all deployments“, „restarting affected servers“, „aggressively pursuing all pathways to reduce impact“ (ABC).
- **Ursache laut Microsoft (vorläufig):** „a core process on the affected servers is becoming overwhelmed“ (Borncity). Server fallen bei Health Checks aus; Konfigurationsänderung wurde geprüft bzw. zurückgerollt; ein Patch an einer „upstream authentication and routing component“ zeigte Wirkung (Borncity, 13.11., 08:24 Uhr). Server werden unter erneuter Last wieder unerreichbar ([Stuttgarter Nachrichten, 13.11., 06:23](https://www.stuttgarter-nachrichten.de/panorama/outlook-down-wie-kommt-man-jetzt-an-seine-mails-79697450.html)).
- **Kein Angriff:** Charles Lamanna (Microsoft-Vizechef): „there is no indication this is the result of malicious or cyber activity“ (ABC, Borncity).
- **Entschuldigung:** Lamanna: „We regret that today's outages caused disruptions for our customers“ (ABC).
- **Freitag 13.11.:** „early stabilization and capacity improvements“; Mail-Warteschlangen werden abgearbeitet, einzelne Probleme möglich (ABC). Endgültige Ursache folgt im „Post-Incident Report“ (Microsoft, laut Borncity).
- **Folgen:** New York City Emergency Management warnte vor Verzögerungen bei städtischen Diensten (ABC).
- **Behoben:** Samstag 14.11. meldet @MSFT365Status: „restored service to the remaining impacted customers and regions“ ([Digital Trends, 14.11.](https://www.digitaltrends.com/computing/microsoft-365-outage-resolved/)).
- **Ursache laut Microsoft:** „introduced by an issue during an earlier network capacity upgrade that surfaced following a recent network change“ (ABC).

## Nicht verwenden (unbelegt oder anderer Vorfall)
- Hacker-Gerüchte, „12 Stunden“, Entschädigungen (nur Kommentare)
- Treffer zu früheren Outlook-Störungen (EX1464935, Azure-Konfig) – anderer Vorfall
- Weekend.at-Details (Japan, Australien, 74 Länder): KI-Artikel, erst gegenprüfen

## Beschreibung (zum Reinkopieren)
Outlook war weltweit über einen Tag lang gestört. Schuld war ausgerechnet ein Schutzsystem: Health Checks und Load Balancer. So hängt das zusammen.

Quellen:
- ABC News, 13.11.2026: https://abcnews.com/US/outlook-down-microsoft-outage-reported-mail/story?id=138088203
- Digital Trends, 14.11.2026 (Entwarnung am Samstag): https://www.digitaltrends.com/computing/microsoft-365-outage-resolved/
- Borncity, 12.11.2026 (betroffene Dienste, Patch): https://borncity.com/blog/2026/11/12/outlook-com-und-outlook-exchange-online-gestoert/

Bilder:
- Microsoft-Campus Redmond: Jiaqian AirplaneFan, CC BY 3.0 (Wikimedia Commons)
- Großraumbüro: Bertrand Soubeyrand, CC BY 4.0 (Wikimedia Commons)
- App-Icons: Microsoft (Wikimedia Commons)
- Fehlerseite: nachgestellt im Browser

#outlook #microsoft #news #tech #strichermittler
