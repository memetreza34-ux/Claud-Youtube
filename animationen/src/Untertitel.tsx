import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import { ANTON_SCHRIFT, FARBE, TEXT_SCHRIFT } from "./stil";


// Seiten, die nie über ein Satz- oder Komma-Ende hinweg laufen (Ordnungszahlen wie „8.“ zählen nicht)
const ENDE = /[.,!?:;]["“”„]?$/;
const ORDNUNGSZAHL = /^\d+\.$/;
const satzSeiten = (captions: Caption[], wechselMs: number): TikTokPage[] => {
  const seiten: TikTokPage[] = [];
  let aktuell: Caption[] = [];
  const abschliessen = () => {
    if (!aktuell.length) return;
    const start = aktuell[0].startMs;
    const ende = aktuell[aktuell.length - 1].endMs;
    const tokens = aktuell.map((c, i) => ({ text: i === 0 ? c.text.trimStart() : c.text, fromMs: c.startMs, toMs: c.endMs }));
    seiten.push({ text: tokens.map((t) => t.text).join(""), startMs: start, durationMs: ende - start, tokens });
    aktuell = [];
  };
  for (const c of captions) {
    if (aktuell.length && c.startMs - aktuell[0].startMs >= wechselMs) abschliessen();
    aktuell.push(c);
    const wort = c.text.trim();
    if (ENDE.test(wort) && !ORDNUNGSZAHL.test(wort)) abschliessen();
  }
  abschliessen();
  return seiten;
};

const Seite: React.FC<{ page: TikTokPage; top: number; groesse: number; comic: boolean }> = ({ page, top, groesse, comic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jetztMs = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill style={{ top, bottom: "auto", height: 300, alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div
        style={{
          fontFamily: comic ? ANTON_SCHRIFT : TEXT_SCHRIFT,
          fontSize: groesse,
          fontWeight: comic ? 400 : 800,
          textTransform: comic ? "uppercase" : "none",
          WebkitTextStroke: comic ? "14px #000" : undefined,
          paintOrder: comic ? "stroke fill" : undefined,
          letterSpacing: comic ? 1 : 0,
          lineHeight: 1.15,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          color: FARBE.weiss,
          textShadow: "0 4px 18px rgba(0,0,0,0.9)",
        }}
      >
        {page.tokens.map((t, i) => (
          <span key={`${t.fromMs}-${i}`} style={{ color: t.fromMs <= jetztMs && t.toMs > jetztMs ? FARBE.gelb : FARBE.weiss }}>
            {t.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const KEINE: [number, number][] = [];

export const Untertitel: React.FC<{
  datei: string;
  top: number;
  wechselMs?: number;
  groesse?: number;
  comic?: boolean;
  saetze?: boolean;
  // Zeitbereiche in ms ohne Untertitel (z. B. wenn ein Schild denselben Text zeigt)
  ohne?: [number, number][];
}> = ({ datei, top, wechselMs = 1200, groesse = 78, comic = false, saetze = false, ohne = KEINE }) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const laden = useCallback(async () => {
    try {
      const res = await fetch(staticFile(datei));
      setCaptions(await res.json());
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [datei, continueRender, cancelRender, handle]);

  useEffect(() => {
    laden();
  }, [laden]);

  const pages = useMemo(() => {
    if (!captions) return [];
    const sichtbar = captions.filter((c) => !ohne.some(([a, b]) => c.startMs >= a && c.startMs < b));
    return saetze ? satzSeiten(sichtbar, wechselMs) : createTikTokStyleCaptions({ captions: sichtbar, combineTokensWithinMilliseconds: wechselMs }).pages;
  }, [captions, wechselMs, saetze, ohne]);

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const von = Math.round((page.startMs / 1000) * fps);
        const bis = Math.round(Math.min(next ? (next.startMs / 1000) * fps : Infinity, von + (page.durationMs / 1000 + 0.4) * fps));
        if (bis - von <= 0) return null;
        return (
          <Sequence key={i} from={von} durationInFrames={bis - von}>
            <Seite page={page} top={top} groesse={groesse} comic={comic} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
