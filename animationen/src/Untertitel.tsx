import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import { FARBE, TEXT_SCHRIFT } from "./stil";

const WECHSEL_MS = 1200;

const Seite: React.FC<{ page: TikTokPage; top: number }> = ({ page, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jetztMs = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill style={{ top, bottom: "auto", height: 300, alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div
        style={{
          fontFamily: TEXT_SCHRIFT,
          fontSize: 78,
          fontWeight: 800,
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

export const Untertitel: React.FC<{ datei: string; top: number }> = ({ datei, top }) => {
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

  const pages = useMemo(
    () => (captions ? createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: WECHSEL_MS }).pages : []),
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const von = Math.round((page.startMs / 1000) * fps);
        const bis = Math.round(Math.min(next ? (next.startMs / 1000) * fps : Infinity, von + (page.durationMs / 1000 + 0.4) * fps));
        if (bis - von <= 0) return null;
        return (
          <Sequence key={i} from={von} durationInFrames={bis - von}>
            <Seite page={page} top={top} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
