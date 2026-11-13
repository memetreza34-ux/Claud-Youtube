# Animationen (Remotion)

Alle Animationen und Reels des Strichermittlers, gebaut mit [Remotion](https://www.remotion.dev).

## Befehle
```bash
npm i --loglevel=error   # einmalig: Pakete installieren
npm run dev              # Vorschau im Browser (Remotion Studio)
npm run lint             # Code prüfen (ESLint + TypeScript)
npx remotion render ReelNvidia4 ../video-01/reels/reel-02-nvidia-v4.mp4
```

## Kompositionen
| Ordner im Studio | ID | Wofür |
|---|---|---|
| Video01 | `BkaZahlen`, `McAfeeBalken`, `SiebzigProzent`, `Eisberg`, `AnrufTreppe`, `DreiWorte`, `Codewort` | Einblendungen für „Enkeltrick 2.0“ |
| Reels | `ReelCodewort` | Reel 01 (Test) |
| Reels | `ReelNvidia4` | **Reel 02, aktuelle Version** |
| Reels | `ReelNvidia`, `ReelNvidia2`, `ReelNvidia3` | ältere Fassungen von Reel 02, nur zum Vergleich |

## Bausteine
| Datei | Inhalt |
|---|---|
| `stil.tsx` | Farben, Schriften, Hintergrund |
| `ruhig.tsx` | Vorlage für Reels: Figur als Hintergrund, Belege mit rotem Rahmen, Fotos mit Nachweis, Steckbrief, Lieferweg, Kursbalken |
| `begruessung.tsx` | Ballon-Begrüßung „Willkommen beim Strichermittler“ |
| `band.tsx` | Band in der Bildmitte und Quellen-Chip |
| `Untertitel.tsx` | Untertitel aus Whisper-Wortzeiten, Wechsel am Satzende |

## Medien
Ton, Untertitel-JSON und Screenshots liegen in `public/reel-*/`. Der Ordner ist absichtlich nicht im Repo, weil das Repo öffentlich ist (eigene Stimme, fremde Inhalte). Erzeugt werden sie mit `tools/tts-qwen-mac/` und `tools/screenshots/`.

## Lizenz
Remotion ist für Einzelpersonen und kleine Teams kostenlos. Für größere Firmen braucht es eine Firmenlizenz: [Bedingungen](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
