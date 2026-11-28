"""Zeitmarken für Remotion aus der Whisper-Wortliste (untertitel.json) holen.

  python3 tools/zeitmarken.py animationen/public/video-02/untertitel.json marken.txt animationen/src/video02-zeiten.ts

marken.txt: eine Zeile pro Marke, "name: wort1|wort2" (Alternativen, z. B. Zahl als Wort oder Ziffer).
Die Suche läuft der Reihe nach: jede Marke wird erst NACH der vorigen gesucht.
Mit "name: wort @ab andere_marke" startet die Suche ab einer früheren Marke.
Wörter vergleichen ohne Satzzeichen und Groß/Klein, Treffer = Wort beginnt mit dem Suchwort.
"""
import json
import re
import sys


def norm(w: str) -> str:
    return re.sub(r"[^\wäöüß%-]", "", w.lower()).lstrip("-")


def main():
    worte = json.load(open(sys.argv[1]))
    zeilen = [z.strip() for z in open(sys.argv[2]) if z.strip() and not z.startswith("#")]
    marken: dict[str, float] = {}
    pos = 0
    fehlt = []
    for z in zeilen:
        name, rest = [t.strip() for t in z.split(":", 1)]
        ab = None
        if "@ab" in rest:
            rest, ab = [t.strip() for t in rest.split("@ab")]
        start = pos
        if ab:
            ziel = marken[ab]
            start = next(i for i, w in enumerate(worte) if w["startMs"] / 1000 >= ziel)
        kandidaten = [norm(k) for k in rest.split("|")]
        treffer = None
        for i in range(start, len(worte)):
            w = norm(worte[i]["text"])
            if any(w.startswith(k) for k in kandidaten if k):
                treffer = i
                break
        if treffer is None:
            fehlt.append(name)
            continue
        marken[name] = round(worte[treffer]["startMs"] / 1000, 2)
        pos = treffer + 1
    ende = round(worte[-1]["endMs"] / 1000, 2)
    with open(sys.argv[3], "w") as f:
        f.write("// Automatisch erzeugt mit tools/zeitmarken.py – nicht von Hand ändern\n")
        f.write("export const Z = {\n")
        for k, v in marken.items():
            f.write(f"  {k}: {v},\n")
        f.write(f"  ende: {ende},\n}};\n")
    print(f"{len(marken)} Marken, Ende {ende} s")
    if fehlt:
        print("NICHT GEFUNDEN:", ", ".join(fehlt))


if __name__ == "__main__":
    main()
