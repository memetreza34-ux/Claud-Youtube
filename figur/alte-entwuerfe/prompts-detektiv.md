# Prompts: Detektiv-Figur (Google Flow / Gemini)

Prompts auf Englisch → bessere Ergebnisse.

## Schritt 1: Haupt-Figur (Master-Bild)
Mehrmals generieren, das beste Bild auswählen und speichern.

```
3D stylized cartoon character, mysterious detective mascot for a YouTube channel about scams, hacks and scandals. Black fedora hat with a bright orange band, round mirrored sunglasses reflecting orange light so the eyes are never visible, confident smirk with a toothpick in the corner of the mouth, slight stubble. Dark charcoal trench coat with upturned collar, white shirt, bright orange tie. Holding a magnifying glass. Pixar-like 3D render style, clean shapes, soft cinematic rim light in orange, front view, half body, plain dark grey background, high detail, consistent character design sheet quality.
```

## Schritt 2: Posen (mit Master-Bild als Referenz)
Master-Bild als Referenz/Zutat hochladen, dann jeweils:

```
Same character as the reference image, same outfit and style, [POSE], plain dark grey background, half body.
```

**[POSE] ersetzen durch:**
1. `pointing to the right side with one finger, explaining something`
2. `shocked expression, mouth open, toothpick falling, hands raised`
3. `thinking, hand on chin, looking up, magnifying glass in other hand`
4. `laughing, head tilted back`
5. `holding up an orange case folder labeled "AKTE", serious look`
6. `looking through the magnifying glass at the viewer, one huge magnified lens`
7. `arms crossed, skeptical look, one eyebrow raised above the glasses`
8. `facepalm, disappointed`

## Schritt 3: Für Thumbnails
```
Same character as the reference image, [POSE], transparent background, cutout, no background.
```
Falls kein transparenter Hintergrund geht: einfarbig grün (`plain green screen background`), später freistellen.

## Tipps
- Immer dasselbe Master-Bild als Referenz nehmen → Figur bleibt gleich
- Wenn sich Details ändern (Hut, Farbe Krawatte): im Prompt nochmal genau beschreiben
- Bilder in den Ordner `figur/` legen, dann baue ich daraus Thumbnails + Animationen
- Kurze Clips (Figur nickt, Brille blitzt) kannst du in Flow auch als Video machen
