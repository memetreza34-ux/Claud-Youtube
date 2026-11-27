# Reel 08 – Todoist gehackt: Passwörter in Aufgaben gesucht

**Format:** Reel 9:16, ca. 65 s · **Stand der Fakten:** 27.11.2026 · **Remotion:** `ReelTodoist` · **Sprechtext:** `sprechtexte/reel-08-todoist.txt` · **Video:** `reels/2026-KW48/reel-08-todoist/FINAL-VIDEO.mp4`

## Gesicherte Fakten (mit Quelle)
- **Zeitraum (22.–23. November 2026):** Ein Unbekannter nutzte zwischen dem 22. und 23. November einen gestohlenen Entwickler-Zugang zur Versionsverwaltung von Todoist (wahrscheinlich über Infostealer-Malware auf einem Mitarbeitergerät), manipulierte automatisierte Code-Workflows in **drei Repositories** und erbeutete darüber Admin-Zugangsdaten für interne Systeme und die Cloud-Infrastruktur (Todoist Security Advisory, CyberSecurityNews, TechCrunch).
- **Rund 6 % aller Nutzer betroffen (Alt-Hashes):** Der Angreifer lud eine Datei mit Daten älterer Todoist-Konten herunter, deren Passwörter seit über zehn Jahren nicht geändert wurden: E-Mail-Adressen, Erstellungsdatum und veraltete **gesalzene SHA-1-Passwort-Hashes** (Todoist Security Advisory, GBHackers).
- **Gezielte Suche nach Klartext-Passwörtern & API-Keys:** Bei ca. **0,001 %** der Nutzer durchsuchte der Angreifer per manueller Abfrage und automatisiertem Scanner gezielt Aufgaben, Kommentare und Anhänge nach Wörtern und Mustern wie Passwörtern, API-Schlüsseln (GitHub, AWS, OpenAI, Stripe u. a.) sowie Wallet-Daten; weitere **0,003 %** verloren Todoist-/Slack-API-Tokens und bei ca. **0,001 %** wurden über das *Todoist for Outlook*-Add-on Mail-Vorschauen (Betreff, Absender, erste 255 Zeichen) abgegriffen (Todoist Security Advisory).
- **Stand & Reaktion:** Kurz nach Entdeckung durch das Sicherheits-Monitoring blockierte Todoist die Zugangswege, deaktivierte alte SHA-1-Hashes endgültig, kappte das Outlook-Add-on vorübergehend und verschickte direkte Warnmails an Betroffene (`no-reply@notify.todoist.com`).

## Beschreibung (zum Reinkopieren)
Hacker greifen Ende November 2026 die beliebte To-do-App Todoist an: Rund 6 Prozent der Nutzer sind durch gestohlene Alt-Passwort-Hashes betroffen – und in manchen Aufgaben suchten die Täter sogar gezielt nach API-Keys und Passwörtern im Klartext. Wie der Angriff ablief und was du jetzt beachten solltest.

Quellen:
- Todoist Security Advisory (Nov. 2026): https://www.todoist.com/help/todoist/get-started/security-incident-in-november-2026-cG0EIACNU
- CyberSecurityNews (Nov. 2026): https://cybersecuritynews.com/todoist-production-system-breach/
- GBHackers (Nov. 2026): https://gbhackers.com/todoist-data-breach/

Bilder & Visualisierungen:
- Artikel-Belege & Webseiten: Todoist Help Center, Todoist Homepage, CyberSecurityNews (Screenshots)
- Logos & Symbole: Todoist, GitHub, Slack, OpenAI, AWS, Microsoft Icons
- Figur-Posen: eigene Charakter-Posen (Der Strichermittler)

#todoist #cybersecurity #datenschutz #passwoerter #strichermittler
