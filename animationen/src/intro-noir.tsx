import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON_SCHRIFT, CLAMP, TEXT_SCHRIFT } from "./stil";

// Begrüßung „Willkommen beim Strichermittler“ im Film-noir-Stil:
// Lampe flackert an, langsame Kamerafahrt auf die Figur, ein orangefarbener Strich
// zieht durchs Bild und legt den Namen frei (der „Strich“ im Strichermittler).
// Zeiten in Sekunden relativ zum Beginn der Begrüßung.

const ORANGE = "#ff7410";

// Flackern der Lampe beim Einschalten: aus, kurz an, fast aus, an
const lampe = (t: number) => interpolate(t, [0, 0.06, 0.1, 0.16, 0.24], [0, 0.9, 0.25, 1, 1], CLAMP);

const Koernung: React.FC<{ seed: number }> = ({ seed }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.35 }}>
    <filter id={`korn-${seed}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#korn-${seed})`} />
  </svg>
);

export const NoirBegruessung: React.FC<{ nameAb: number; ende: number; bild?: string }> = ({
  nameAb,
  ende,
  bild = "figur/master.jpg",
}) => {
  const frame = useCurrentFrame();
  const t = frame / useVideoConfig().fps;

  const licht = lampe(t);
  const fahrt = interpolate(t, [0, ende], [1.0, 1.07], CLAMP);
  const abblende = interpolate(t, [ende - 0.18, ende], [1, 0], CLAMP);

  const kopfzeile = interpolate(t, [0.12, 0.4], [0, 1], { easing: Easing.out(Easing.cubic), ...CLAMP });
  const sperrung = interpolate(t, [0.12, 0.6], [26, 12], { easing: Easing.out(Easing.cubic), ...CLAMP });

  // Strich zieht von links nach rechts und gibt den Namen hinter sich frei
  const strich = interpolate(t, [nameAb - 0.05, nameAb + 0.45], [0, 1], { easing: Easing.inOut(Easing.cubic), ...CLAMP });
  const STRICH_L = 70;
  const STRICH_B = 940;
  const spitze = STRICH_L + STRICH_B * strich;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", opacity: abblende }}>
      <AbsoluteFill style={{ opacity: licht, transform: `scale(${fahrt})`, transformOrigin: "50% 38%" }}>
        <Img src={staticFile(bild)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Vignette und dunkler Boden für die Schrift */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.92) 78%, #000 100%)" }} />

      {/* Letterbox wie im Kino */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "#000" }} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center" }}>
        <div
          style={{
            fontFamily: TEXT_SCHRIFT,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: sperrung,
            color: "#e9e4da",
            opacity: kopfzeile,
            paddingLeft: sperrung,
          }}
        >
          WILLKOMMEN BEIM
        </div>

        <div style={{ position: "relative", height: 170, marginTop: 14 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              fontFamily: ANTON_SCHRIFT,
              fontSize: 128,
              lineHeight: "150px",
              letterSpacing: 3,
              color: "#fff",
              textShadow: "0 0 30px rgba(255,116,16,0.35)",
              clipPath: `inset(0 ${1080 - spitze}px 0 0)`,
            }}
          >
            STRICHERMITTLER
          </div>
          {/* der Strich: Kante leuchtet, bleibt als Unterstrich stehen */}
          <div
            style={{
              position: "absolute",
              left: STRICH_L,
              top: 158,
              width: STRICH_B * strich,
              height: 10,
              borderRadius: 5,
              background: ORANGE,
              boxShadow: `0 0 18px ${ORANGE}, 0 0 40px rgba(255,116,16,0.6)`,
              opacity: strich > 0 ? 1 : 0,
            }}
          />
          {strich > 0 && strich < 1 ? (
            <div
              style={{
                position: "absolute",
                left: spitze - 3,
                top: 0,
                width: 6,
                height: 168,
                background: `linear-gradient(180deg, rgba(255,116,16,0) 0%, ${ORANGE} 60%, #fff 100%)`,
                boxShadow: `0 0 24px ${ORANGE}`,
              }}
            />
          ) : null}
        </div>
      </div>

      <Koernung seed={frame % 12} />
    </AbsoluteFill>
  );
};
