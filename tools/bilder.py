#!/usr/bin/env python3
"""Echte Fotos und Videoclips mit freier Lizenz suchen und holen – mit Bildnachweis.

  python3 tools/bilder.py suche "<begriff>" [--quelle wikimedia|pexels|pixabay|alle] [--video] [--anzahl 8]
  python3 tools/bilder.py hole <nr> --ziel animationen/public/<ordner>/<name>.jpg

Ablauf: `suche` zeigt Treffer (Nummer, Größe, Lizenz, Urheber) und legt eine Vorschau-Übersicht
(/Volumes/T7/strichermittler-tmp/bilder/vorschau.jpg) zum Ansehen an. `hole` lädt den gewählten Treffer
in voller Größe und schreibt den Nachweis in <ordner>/bildnachweise.txt (für die Caption).

Quellen:
  wikimedia  ohne Schlüssel. Lizenz je Bild (CC0/CC BY/CC BY-SA): Nachweis Pflicht bei BY/BY-SA.
  pexels     Schlüssel in /Volumes/T7/strichermittler-schluessel/pexels.txt (kostenloses Konto). Pexels-Lizenz, Nachweis freiwillig.
  pixabay    Schlüssel in /Volumes/T7/strichermittler-schluessel/pixabay.txt. Pixabay-Lizenz, Nachweis freiwillig.
Downloads nur von diesen Quellen und nur Bilder/Videos (Armans Dauer-OK vom 28.11.2026).
Keine Menschengesichter in Großaufnahme als Hauptmotiv (Kanalregel) – Orte, Technik, Gebäude, Hände, Objekte.
"""
import argparse
import io
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

TMP = Path("/Volumes/T7/strichermittler-tmp/bilder")
SCHLUESSEL = Path("/Volumes/T7/strichermittler-schluessel")
UA = {"User-Agent": "StrichermittlerBildsuche/1.0 (Recherche-Werkzeug)"}


def hole_json(url, kopf=None):
    req = urllib.request.Request(url, headers={**UA, **(kopf or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def schluessel(name):
    p = SCHLUESSEL / f"{name}.txt"
    return p.read_text().strip() if p.exists() else None


def wikimedia(begriff, anzahl, video):
    typ = "video" if video else "bitmap"
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
        "gsrsearch": f"{begriff} filetype:{typ}", "gsrlimit": anzahl, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata|mime", "iiurlwidth": 480})
    d = hole_json("https://commons.wikimedia.org/w/api.php?" + q)
    out = []
    for p in sorted(d.get("query", {}).get("pages", {}).values(), key=lambda x: x.get("index", 0)):
        ii = (p.get("imageinfo") or [{}])[0]
        m = ii.get("extmetadata", {})
        wert = lambda k: (m.get(k, {}) or {}).get("value", "")
        import re
        urheber = re.sub(r"<[^>]+>", "", wert("Artist")).strip() or "unbekannt"
        out.append({
            "quelle": "Wikimedia Commons", "titel": p.get("title", "").replace("File:", ""),
            "voll": ii.get("url"), "vorschau": ii.get("thumburl"), "breite": ii.get("width"), "hoehe": ii.get("height"),
            "lizenz": wert("LicenseShortName") or "?", "urheber": urheber,
            "seite": ii.get("descriptionurl"), "video": video})
    return out


def pexels(begriff, anzahl, video):
    k = schluessel("pexels")
    if not k:
        print("  (pexels: kein Schlüssel in /Volumes/T7/strichermittler-schluessel/pexels.txt)")
        return []
    q = urllib.parse.urlencode({"query": begriff, "per_page": anzahl, "locale": "de-DE"})
    if video:
        d = hole_json("https://api.pexels.com/videos/search?" + q, {"Authorization": k})
        out = []
        for v in d.get("videos", []):
            dateien = sorted([f for f in v["video_files"] if f.get("width")], key=lambda f: f["width"])
            beste = next((f for f in dateien if f["width"] >= 1920), dateien[-1] if dateien else None)
            if beste:
                out.append({"quelle": "Pexels", "titel": f"Video {v['id']}", "voll": beste["link"], "vorschau": v.get("image"),
                            "breite": beste["width"], "hoehe": beste["height"], "lizenz": "Pexels-Lizenz",
                            "urheber": v.get("user", {}).get("name", "?"), "seite": v.get("url"), "video": True})
        return out
    d = hole_json("https://api.pexels.com/v1/search?" + q, {"Authorization": k})
    return [{"quelle": "Pexels", "titel": p.get("alt") or f"Foto {p['id']}", "voll": p["src"]["original"], "vorschau": p["src"]["medium"],
             "breite": p["width"], "hoehe": p["height"], "lizenz": "Pexels-Lizenz", "urheber": p.get("photographer", "?"),
             "seite": p.get("url"), "video": False} for p in d.get("photos", [])]


def pixabay(begriff, anzahl, video):
    k = schluessel("pixabay")
    if not k:
        print("  (pixabay: kein Schlüssel in /Volumes/T7/strichermittler-schluessel/pixabay.txt)")
        return []
    q = urllib.parse.urlencode({"key": k, "q": begriff, "per_page": max(3, anzahl), "lang": "de", "safesearch": "true"})
    if video:
        d = hole_json("https://pixabay.com/api/videos/?" + q)
        return [{"quelle": "Pixabay", "titel": h.get("tags", ""), "voll": (h["videos"].get("large") or h["videos"]["medium"])["url"],
                 "vorschau": h["videos"]["tiny"].get("thumbnail"), "breite": (h["videos"].get("large") or h["videos"]["medium"])["width"],
                 "hoehe": (h["videos"].get("large") or h["videos"]["medium"])["height"], "lizenz": "Pixabay-Lizenz",
                 "urheber": h.get("user", "?"), "seite": h.get("pageURL"), "video": True} for h in d.get("hits", [])]
    d = hole_json("https://pixabay.com/api/?" + q)
    return [{"quelle": "Pixabay", "titel": h.get("tags", ""), "voll": h.get("largeImageURL"), "vorschau": h.get("webformatURL"),
             "breite": h.get("imageWidth"), "hoehe": h.get("imageHeight"), "lizenz": "Pixabay-Lizenz", "urheber": h.get("user", "?"),
             "seite": h.get("pageURL"), "video": False} for h in d.get("hits", [])]


def vorschau_bogen(treffer):
    from PIL import Image, ImageDraw, ImageFont
    kb, kh, sp = 360, 240, 4
    zeilen = (len(treffer) + sp - 1) // sp
    bogen = Image.new("RGB", (sp * kb, zeilen * (kh + 30)), (16, 16, 18))
    dr = ImageDraw.Draw(bogen)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except OSError:
        font = ImageFont.load_default()
    for i, t in enumerate(treffer):
        x, y = (i % sp) * kb, (i // sp) * (kh + 30)
        try:
            req = urllib.request.Request(t["vorschau"], headers=UA)
            im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGB")
            im.thumbnail((kb - 6, kh - 6))
            bogen.paste(im, (x + 3, y + 3))
        except Exception:
            dr.text((x + 10, y + 100), "keine Vorschau", fill=(200, 80, 80), font=font)
        dr.text((x + 6, y + kh + 4), f"#{i + 1}  {t['breite']}×{t['hoehe']}  {t['lizenz'][:18]}", fill=(240, 240, 240), font=font)
    ziel = TMP / "vorschau.jpg"
    bogen.save(ziel, quality=85)
    return ziel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("befehl", choices=["suche", "hole"])
    ap.add_argument("wert")
    ap.add_argument("--quelle", default="alle")
    ap.add_argument("--video", action="store_true")
    ap.add_argument("--anzahl", type=int, default=8)
    ap.add_argument("--ziel")
    ap.add_argument("--minbreite", type=int, default=1200, help="kleinere Treffer ausblenden (Standard 1200 px)")
    a = ap.parse_args()
    TMP.mkdir(parents=True, exist_ok=True)
    liste = TMP / "letzte-suche.json"

    if a.befehl == "suche":
        treffer = []
        quellen = ["wikimedia", "pexels", "pixabay"] if a.quelle == "alle" else [a.quelle]
        for q in quellen:
            try:
                treffer += {"wikimedia": wikimedia, "pexels": pexels, "pixabay": pixabay}[q](a.wert, a.anzahl, a.video)
            except Exception as e:
                print(f"  ({q}: {e})")
        treffer = [t for t in treffer if t.get("voll") and t.get("vorschau") and max(t.get("breite") or 0, t.get("hoehe") or 0) >= a.minbreite]
        liste.write_text(json.dumps(treffer, ensure_ascii=False, indent=1))
        for i, t in enumerate(treffer, 1):
            print(f"#{i:<3} {t['quelle']:<17} {t['breite']}×{t['hoehe']:<6} {t['lizenz']:<16} {t['urheber'][:28]:<28} {t['titel'][:60]}")
        if treffer:
            print(f"Vorschau: {vorschau_bogen(treffer)}")
        return

    treffer = json.loads(liste.read_text())
    t = treffer[int(a.wert) - 1]
    if not a.ziel:
        sys.exit("--ziel fehlt (z. B. animationen/public/video-03/foto-serverraum.jpg)")
    ziel = Path(a.ziel)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(t["voll"], headers=UA)
    ziel.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    nachweis = f"{ziel.name}: „{t['titel']}“ von {t['urheber']}, {t['lizenz']}, {t['quelle']} – {t['seite']}\n"
    with open(ziel.parent / "bildnachweise.txt", "a", encoding="utf-8") as f:
        f.write(nachweis)
    print(f"{ziel}  ({ziel.stat().st_size // 1024} KB)\nNachweis: {nachweis.strip()}")


if __name__ == "__main__":
    main()
