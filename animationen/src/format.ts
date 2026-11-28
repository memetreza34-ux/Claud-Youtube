import { useVideoConfig } from "remotion";

// Bildfläche der laufenden Komposition: 16:9 (lange Videos) oder 9:16 (Reels/Shorts).
// Alle Doku-Bausteine richten sich danach, damit dieselben Szenen in beiden Formaten funktionieren.
export const useFlaeche = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, hoch: height > width };
};
