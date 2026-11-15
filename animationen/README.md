# Animationen (Remotion)

Alle Animationen und Reels des Strichermittlers, gebaut mit [Remotion](https://www.remotion.dev).

## Befehle
```bash
npm i --loglevel=error   # einmalig: Pakete installieren
npm run dev              # Vorschau im Browser (Remotion Studio)
npm run lint             # Code prüfen (ESLint + TypeScript)
npx remotion render ReelFireworks ../video-01/reels/reel-04-fireworks.mp4 --concurrency=2
```

## Kompositionen
| Ordner im Studio | ID | Wofür |
|---|---|---|
| Video01 | `BkaZahlen`, `McAfeeBalken`, `SiebzigProzent`, `Eisberg`, `AnrufTreppe`, `DreiWorte`, `Codewort` | Einblendungen für „Enkeltrick 2.0“ |
| Reels | `ReelCodewort` | Reel 01 (Test) |
| Reels | `ReelNvidia` | Reel 02 Nvidia (älterer Stil mit Quellen-Chips) |
| Reels | `ReelOutlook` | Reel 03 Outlook |
| Reels | `ReelFireworks` | Reel 04 Fireworks AI – **Vorlage für neue Reels** |

## Bausteine
| Datei | Inhalt |
|---|---|
| `stil.tsx` | Farben, Schriften, Hintergrund |
| `band.tsx` | Maße des Bands (`BAND_TOP`, `BAND_HOEHE`) und kleines Etikett (`Chip`) |
| `ruhig.tsx` | Figur als Hintergrund, `Bühne` (ganze Fläche), `Beleg` (Screenshot mit Markierung), `BildFahrt` (Foto ohne Text), dazu die Nvidia-Grafiken |
| `begruessung.tsx` | Ballon-Begrüßung „Willkommen beim Strichermittler“ |
| `Untertitel.tsx` | Untertitel aus Whisper-Wortzeiten |
| `outlook.tsx` | Handy mit Fehlerseite, Cloud mit Diensten, Health Checks/Load Balancer, Verfügbarkeitskurve |
| `fireworks.tsx` | Lieferketten-Grafik, Pose ganzflächig |

Stilregeln: `../planung/reel-regeln.md`.

## Medien
Ton, Untertitel-JSON, Screenshots und Fotos liegen in `public/reel-*/`. Der Ordner ist absichtlich nicht im Repo, weil das Repo öffentlich ist (eigene Stimme, fremde Inhalte).

## Lizenz
Remotion ist für Einzelpersonen und kleine Teams kostenlos. Für größere Firmen braucht es eine Firmenlizenz: [Bedingungen](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
