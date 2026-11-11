import { loadFont as ladeBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as ladeInter } from "@remotion/google-fonts/Inter";
import { loadFont as ladeAnton } from "@remotion/google-fonts/Anton";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";

// Kanal-Stil "Der Strichermittler": dunkel, Gelb für Zahlen, Rot für Warnungen
export const FARBE = {
  hintergrund: "#0b0b0e",
  gelb: "#ffd400",
  rot: "#e63946",
  weiss: "#f5f5f5",
  grau: "#9a9aa3",
  balkenLeer: "#24242b",
};

export const { fontFamily: ZAHLEN_SCHRIFT } = ladeBebas("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
export const { fontFamily: TEXT_SCHRIFT } = ladeInter("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const { fontFamily: ANTON_SCHRIFT } = ladeAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const WEICH = Easing.bezier(0.16, 1, 0.3, 1);
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Hintergrund: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: FARBE.hintergrund,
      backgroundImage: "radial-gradient(ellipse at 50% 45%, #1c1c24 0%, #0b0b0e 70%)",
      fontFamily: TEXT_SCHRIFT,
      color: FARBE.weiss,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Quelle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Quelle"
      style={{
        position: "absolute",
        left: 120,
        bottom: 90,
        fontSize: 30,
        fontWeight: 500,
        color: FARBE.grau,
        opacity: interpolate(frame, [10, 30], [0, 1], { ...CLAMP, easing: WEICH }),
      }}
    >
      Quelle: {text}
    </Interactive.Div>
  );
};
