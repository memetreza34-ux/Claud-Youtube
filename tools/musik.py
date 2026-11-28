#!/usr/bin/env python3
"""Hintergrundmusik unter die Stimme legen – sie wird automatisch leiser, sobald gesprochen wird.

  python3 tools/musik.py <musik.mp3|wav> <stimme audio.wav> <ziel musik-fertig.wav> [--laut -24] [--start 0] [--ausblenden 3]

- Musik wird auf die Länge der Stimme gebracht (wiederholt, falls zu kurz), am Ende ausgeblendet.
- Unter der Stimme duckt sie sich zusätzlich (Sidechain), in Sprechpausen kommt sie hoch.
- --laut: Grundlautstärke der Musik in LUFS (−24 bis −28 passt unter Sprache bei −14 LUFS Gesamt).
Ergebnis in der Komposition: <Regie … musik="<ordner>/musik-fertig.wav" />
Musikquellen: /Volumes/T7/strichermittler-musik/ – incompetech/ (Kevin MacLeod, CC BY 4.0: investigations,
hidden-agenda, lightless-dawn, the-descent, darkness-speaks, ossuary-6---air, long-note-four, dark-fog; Nachweis
wird automatisch in bildnachweise.txt geschrieben → Caption), oder eigener Teppich: tools/klang.py spannung --dauer 60.
"""
import argparse
import json
import subprocess


def dauer(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True, check=True).stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("musik")
    ap.add_argument("stimme")
    ap.add_argument("ziel")
    ap.add_argument("--laut", type=float, default=-24)
    ap.add_argument("--start", type=float, default=0, help="ab Sekunde x im Musikstück beginnen")
    ap.add_argument("--ausblenden", type=float, default=3)
    a = ap.parse_args()
    d = dauer(a.stimme)
    f = (f"[0:a]atrim=start={a.start},asetpts=PTS-STARTPTS,aloop=loop=-1:size=2e9,atrim=0:{d:.3f},"
         f"aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I={a.laut}:TP=-3:LRA=11,"
         f"afade=t=in:d=1.5,afade=t=out:st={max(0, d - a.ausblenden):.3f}:d={a.ausblenden}[m];"
         f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo[sc];"
         f"[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=80:release=600:makeup=1[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.musik, "-i", a.stimme, "-filter_complex", f,
                    "-map", "[out]", "-ar", "48000", a.ziel], check=True)
    # Kontrolle: Lautheit von Musik allein und Mix
    mess = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.ziel, "-i", a.stimme, "-filter_complex",
                           "[0:a][1:a]amix=inputs=2:normalize=0,ebur128=framelog=quiet", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    zeile = [z for z in mess.splitlines() if z.strip().startswith("I:")]
    print(f"{a.ziel}  ({d:.1f} s)  Mix mit Stimme: {zeile[-1].strip() if zeile else '?'}")
    # Nachweis (CC BY verlangt Namensnennung in der Caption) neben das Ziel schreiben
    from pathlib import Path
    lizenz = Path(a.musik).with_name("LIZENZ.txt")
    if lizenz.exists():
        for z in lizenz.read_text(encoding="utf-8").splitlines():
            if z.startswith(Path(a.musik).name + ":"):
                with open(Path(a.ziel).with_name("bildnachweise.txt"), "a", encoding="utf-8") as f:
                    f.write("Musik: " + z.split(":", 1)[1].strip() + "\n")
                print("Nachweis: " + z.split(":", 1)[1].strip())


if __name__ == "__main__":
    main()
