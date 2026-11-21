# Der Strichermittler — Verbindlicher Arbeitsvertrag

> Gemeinsame Anleitung für alle Agenten (Claude und Codex): [AGENTS.md](AGENTS.md).

> **Verbindlicher 1-Phasen-Vollautopilot mit Google Flow:** Siehe [PRODUKTION.md](file:///Volumes/Mac-Projekte/Home/Strichvermittler/PRODUKTION.md). Der Agent führt Produktionen von Skript, lokaler Stimme (`tools/tts-qwen-mac/`), Flow MCP-Bilderzeugung mit `figur/master.jpg` als Referenz, Cover-Auswahl und Bildkontrolle bis zum finalen Render komplett autonom in einem durchgehenden Lauf aus.

## Kanal & Ausrichtung
- Name: **Der Strichermittler** (@Strichermittler)
- Format: YouTube-Videos (16:9) und Social-Media-Reels/Shorts (9:16)
- Thema: Investigativer Journalismus, KI- & Tech-Skandale, Betrugsmaschen, Urteile, Enthüllungen (Vorbild: Hood Informatik)
- Sprache: Deutsch, sachlich, investigativ, präzise

## Wichtigste Regeln
1. **Keine manuellen Zwischenstopps:** Keine getrennten Phasen, kein Warten auf Nutzer-Freigaben.
2. **Figur-Konsistenz:** Jede Bildgenerierung mit dem Detektiv übergibt zwingend `figur/master.jpg` als Bildreferenz an Flow MCP. Niemals Menschengesichter, niemals bunte Kinder-Cartoons.
3. **Stimme zuerst:** Voiceover wird vor dem Schnitt mit MLX Qwen3-TTS erzeugt.
4. **Autonome Cover-Wahl:** 3 Kandidaten generieren → Agent wählt das beste Cover → löscht die Verlierer sofort.
5. **Autonome Bildkontrolle:** Agent prüft generierte Bilder selbst; fehlerhafte Bilder werden sofort gelöscht und neu generiert.
6. **Remotion Render:** Schnitt und Rendering über `animationen/`.
