---
name: strichermittler-video
description: Produziert Shorts, Reels, Testvideos und längere Videos für Der Strichermittler. Verwende diesen Skill für neue Videos und Überarbeitungen mit der Projektstimme, den vorhandenen Figuren-Assets, Google Flow und Remotion.
---

# Strichermittler-Videoproduktion

1. Arbeite lokal im Projekt auf der T7. Lies [AGENTS.md](../../../AGENTS.md), [PRODUKTION.md](../../../PRODUKTION.md) und die [Reel-Regeln](../../../planung/reel-regeln.md). Führe aus dem Projektordner `bash .agents/skills/strichermittler-video/scripts/preflight.sh` aus. Prüfe `flow_status` vor dem ersten Auftrag an Flow.
2. Folge dem Produktionsablauf von Recherche und Sprechtext bis zum geprüften MP4. Stimme: lokale Qwen3-Stimmvorlage. Wortzeiten aus dem fertigen Ton bestimmen und vor dem Schnitt prüfen. Bei einem kurzen Test darfst du das Thema und die Länge selbst passend wählen.
3. Falls vorhanden, orientiere dich an `video-referenz/parkautomaten-originalstimme.mp4`. Das ist die bevorzugte lokale Fassung mit Noir-Intro, klaren Erkläranimationen und präzisen Untertiteln. Dosiere Belege so, dass sie die konkrete Aussage stützen. Verwende bei Figurenbildern die Master-Referenz und vorhandene Posen zuerst.
4. Baue ein Short in Remotion nach `ReelFireworks`, registriere die Komposition in `animationen/src/Root.tsx` und rendere und prüfe sie. Liefere MP4, Cover, Beschreibung mit Quellen und SRT nach `PRODUKTION.md`. Für Änderungen an einem vorhandenen Video verwende die freigegebene Tonspur weiter, wenn der Auftrag nur den Schnitt betrifft.

Rohmedien, Stimmvorlage und Exporte bleiben lokal. Nutze kostenpflichtige Flow-Clips und veröffentliche Videos jeweils nur nach ausdrücklichem Auftrag.
