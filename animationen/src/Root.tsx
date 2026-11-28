import { Composition, Folder } from "remotion";
import { BkaZahlen } from "./BkaZahlen";
import { McAfeeBalken } from "./McAfeeBalken";
import { SiebzigProzent } from "./SiebzigProzent";
import { Eisberg } from "./Eisberg";
import { AnrufTreppe } from "./AnrufTreppe";
import { DreiWorte } from "./DreiWorte";
import { Codewort } from "./Codewort";
import { ReelCodewort } from "./ReelCodewort";
import { REEL_NVIDIA_SEK, ReelNvidia } from "./ReelNvidia";
import { REEL_OUTLOOK_SEK, ReelOutlook } from "./ReelOutlook";
import { REEL_FIREWORKS_SEK, ReelFireworks } from "./ReelFireworks";
import { REEL_OPTIMIZELY_SEK, ReelOptimizely } from "./ReelOptimizely";
import { REEL_KASSENHACK_SEK, ReelKassenhack } from "./ReelKassenhack";
import { REEL_KI_PROMPTS_SEK, ReelKiPrompts } from "./ReelKiPrompts";
import { REEL_TODOIST_SEK, ReelTodoist } from "./ReelTodoist";
import { CoverTodoist, PROBE_TODOIST_SEK, ProbeTodoist } from "./ProbeTodoist";
import { CoverVideo02, Video02, VIDEO02_SEK } from "./Video02";
import { DOKU_DEMO_SEK, DokuDemo } from "./DokuDemo";
import { DOKU_DEMO2_SEK, DokuDemo2 } from "./DokuDemo2";
import { FOTO3D_DEMO_SEK, Foto3DDemo, MEME_DEMO_SEK, MemeDemo, REGIE_DEMO_LANG_SEK, REGIE_DEMO_SHORT_SEK, RegieDemoLang, RegieDemoShort } from "./RegieDemos";
import { NoirBegruessung } from "./intro-noir";

// Start im Voiceover (voiceover-01-mlx-1.7B-8bit.wav): BkaZahlen 0:36.5, Eisberg 0:47.2, McAfeeBalken 1:08.4,
// SiebzigProzent 1:50.4, AnrufTreppe 2:00.4, DreiWorte 2:51.2, Codewort 3:25.9
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Video01">
        <Composition
          id="BkaZahlen"
          component={BkaZahlen}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="McAfeeBalken"
          component={McAfeeBalken}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SiebzigProzent"
          component={SiebzigProzent}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Eisberg"
          component={Eisberg}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AnrufTreppe"
          component={AnrufTreppe}
          durationInFrames={1290}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DreiWorte"
          component={DreiWorte}
          durationInFrames={225}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Codewort"
          component={Codewort}
          durationInFrames={465}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Reels">
        {/* Reel 01: Codewort (Test) */}
        <Composition id="ReelCodewort" component={ReelCodewort} durationInFrames={1007} fps={30} width={1080} height={1920} />
        {/* Reel 02: Nvidia-Spionage */}
        <Composition id="ReelNvidia" component={ReelNvidia} durationInFrames={Math.round(REEL_NVIDIA_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 03: Outlook-Ausfall */}
        <Composition id="ReelOutlook" component={ReelOutlook} durationInFrames={Math.round(REEL_OUTLOOK_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 04: Fireworks AI (Uber, Notion) */}
        <Composition id="ReelFireworks" component={ReelFireworks} durationInFrames={Math.round(REEL_FIREWORKS_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 05: Optimizely Supply-Chain-Hack (Zoom, BBC, IKEA) */}
        <Composition id="ReelOptimizely" component={ReelOptimizely} durationInFrames={Math.round(REEL_OPTIMIZELY_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 06: Kassenterminal-Hack (CVE-2024-49138) */}
        <Composition id="ReelKassenhack" component={ReelKassenhack} durationInFrames={Math.round(REEL_KASSENHACK_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 07: 2 Millionen KI-Prompts als Falle (Dragos) */}
        <Composition id="ReelKiPrompts" component={ReelKiPrompts} durationInFrames={Math.round(REEL_KI_PROMPTS_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Reel 08: Todoist gehackt – Passwörter in Aufgaben gesucht */}
        <Composition id="ReelTodoist" component={ReelTodoist} durationInFrames={Math.round(REEL_TODOIST_SEK * 30)} fps={30} width={1080} height={1920} />
        {/* Probe: Reel 08 neu (0–35 s) nach Vorbild-Regeln */}
        <Composition id="ProbeTodoist" component={ProbeTodoist} durationInFrames={Math.round(PROBE_TODOIST_SEK * 30)} fps={30} width={1080} height={1920} />
        <Composition id="CoverTodoist" component={CoverTodoist} durationInFrames={1} fps={30} width={1080} height={1920} />
        {/* Video 02 (16:9): Kühlanlagen-Sabotage */}
        <Composition id="Video02Kuehlanlagen" component={Video02} durationInFrames={Math.round(VIDEO02_SEK * 30)} fps={30} width={1920} height={1080} />
        <Composition id="CoverVideo02" component={CoverVideo02} durationInFrames={1} fps={30} width={1920} height={1080} />
        {/* Vorführung der Doku-Bausteine (planung/visuelle-techniken.md) */}
        <Composition id="DokuDemo" component={DokuDemo} durationInFrames={DOKU_DEMO_SEK * 30} fps={30} width={1920} height={1080} />
        <Composition id="DokuDemo2" component={DokuDemo2} durationInFrames={DOKU_DEMO2_SEK * 30} fps={30} width={1920} height={1080} />
        {/* Regie-System: Szenenplan → Video, beide Formate */}
        <Composition id="RegieDemoShort" component={RegieDemoShort} durationInFrames={Math.round(REGIE_DEMO_SHORT_SEK * 30)} fps={30} width={1080} height={1920} />
        <Composition id="RegieDemoLang" component={RegieDemoLang} durationInFrames={Math.round(REGIE_DEMO_LANG_SEK * 30)} fps={30} width={1920} height={1080} />
        <Composition id="MemeDemoShort" component={MemeDemo} durationInFrames={Math.round(MEME_DEMO_SEK * 30)} fps={30} width={1080} height={1920} />
        <Composition id="Foto3DDemoLang" component={Foto3DDemo} durationInFrames={Math.round(FOTO3D_DEMO_SEK * 30)} fps={30} width={1920} height={1080} />
        <Composition id="Foto3DDemoShort" component={Foto3DDemo} durationInFrames={Math.round(FOTO3D_DEMO_SEK * 30)} fps={30} width={1080} height={1920} />
        <Composition id="MemeDemoLang" component={MemeDemo} durationInFrames={Math.round(MEME_DEMO_SEK * 30)} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Bausteine">
        {/* Begrüßung im Noir-Stil, Zeiten wie in Reel 04 */}
        <Composition id="IntroNoir" component={NoirBegruessung} durationInFrames={49} fps={30} width={1080} height={1920} defaultProps={{ nameAb: 0.38, ende: 1.62, bild: "figur/intro-noir.jpg" }} />
      </Folder>
    </>
  );
};
