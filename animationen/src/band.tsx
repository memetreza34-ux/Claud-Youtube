import { FARBE, TEXT_SCHRIFT } from "./stil";

// Layout der Reels (1080x1920): Figur als Hintergrund, Band in der Mitte, Untertitel darunter
export const BAND_TOP = 760;
export const BAND_HOEHE = 620;

// Kleines Etikett, z. B. „Stand: …“ am Ende eines Reels (keine Quellen-Chips mehr, siehe planung/reel-regeln.md)
export const Chip: React.FC<{ text: string; farbe?: string; textFarbe?: string; links?: number; oben?: number }> = ({
  text,
  farbe = "rgba(5,5,6,0.85)",
  textFarbe = FARBE.weiss,
  links = 24,
  oben = 22,
}) => (
  <div
    style={{
      position: "absolute",
      top: oben,
      left: links,
      padding: "8px 18px",
      borderRadius: 8,
      backgroundColor: farbe,
      color: textFarbe,
      fontFamily: TEXT_SCHRIFT,
      fontSize: 28,
      fontWeight: 700,
      zIndex: 5,
    }}
  >
    {text}
  </div>
);
