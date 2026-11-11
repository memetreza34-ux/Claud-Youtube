"""Screenshot einer Webseite mit echtem Chrome (ohne Fenster), Kernsatz gelb markiert.

  shot.py URL ZIEL.png [--text "Satz zum Hinscrollen und Markieren"] [--breite 1920 --hoehe 1080] [--voll]

Für Reels: --breite 540 --hoehe 960 ergibt 1080x1920 (Faktor 2).
Cookie-Banner werden nur abgelehnt oder mit allen Schaltern auf "aus" gespeichert, nie akzeptiert.
Seiten mit "Zustimmen oder Abo" oder Bot-Sperre (403) liefern kein brauchbares Bild: Bild prüfen und dann verwerfen.
"""
import argparse
import re
import time

from playwright.sync_api import sync_playwright

ABLEHNEN = re.compile(
    r"^\s*(alle ablehnen|ablehnen|nur notwendige|nur erforderliche|nur essenzielle|reject all|reject|decline|"
    r"necessary only|only necessary|verweigern|nicht zustimmen)",
    re.I,
)
EINSTELLUNGEN = re.compile(r"^\s*(einstellungen|anpassen|optionen|mehr optionen|cookie-einstellungen|manage)\s*$", re.I)
SPEICHERN = re.compile(r"^\s*(auswahl speichern|einstellungen speichern|auswahl bestätigen|speichern|save|save settings)\s*$", re.I)


def klicke(page, muster):
    for frame in page.frames:
        try:
            for el in frame.locator("button, a, [role=button]").all():
                txt = (el.inner_text(timeout=300) or "").strip()
                if txt and muster.search(txt) and el.is_visible():
                    el.click(timeout=2000)
                    time.sleep(1.5)
                    return txt
        except Exception:
            continue
    return None


def banner_ablehnen(page):
    txt = klicke(page, ABLEHNEN)
    if txt:
        print("Banner abgelehnt:", txt[:40])
        return
    txt = klicke(page, SPEICHERN)
    if txt:
        print("Nur Voreinstellung gespeichert (nichts zugestimmt):", txt[:40])
        return
    if klicke(page, EINSTELLUNGEN):
        txt = klicke(page, ABLEHNEN) or klicke(page, SPEICHERN)
        if txt:
            print("Über Einstellungen abgelehnt/gespeichert:", txt[:40])


MARKIEREN = """(t) => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    const i = n.data.indexOf(t);
    if (i >= 0) {
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + t.length);
      const m = document.createElement('mark');
      m.style.cssText = 'background:#ffe14d;color:#000;padding:0 2px';
      r.surroundContents(m); m.scrollIntoView({block:'center'}); return true;
    }
  } return false; }"""


def main():
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("ziel")
    p.add_argument("--text")
    p.add_argument("--voll", action="store_true")
    p.add_argument("--breite", type=int, default=1920)
    p.add_argument("--hoehe", type=int, default=1080)
    a = p.parse_args()
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", headless=True)
        ctx = browser.new_context(viewport={"width": a.breite, "height": a.hoehe}, device_scale_factor=2, locale="de-DE")
        page = ctx.new_page()
        antwort = page.goto(a.url, wait_until="domcontentloaded", timeout=60000)
        print("HTTP", antwort.status if antwort else "?", page.title()[:80])
        time.sleep(3)
        banner_ablehnen(page)
        time.sleep(3)
        banner_ablehnen(page)  # manche Banner erscheinen erst verzögert
        if a.text:
            print("Text gefunden:", page.evaluate(MARKIEREN, a.text))
            time.sleep(1)
        page.screenshot(path=a.ziel, full_page=a.voll)
        print("gespeichert:", a.ziel)
        browser.close()


if __name__ == "__main__":
    main()
