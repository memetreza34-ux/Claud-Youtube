import { Composition, Folder } from "remotion";
import { BkaZahlen } from "./BkaZahlen";
import { McAfeeBalken } from "./McAfeeBalken";
import { SiebzigProzent } from "./SiebzigProzent";

// Start im Voiceover (voiceover-01-mlx-1.7B-8bit.wav): BkaZahlen 0:36.5, McAfeeBalken 1:08.4, SiebzigProzent 1:50.4
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Video01">
      <Composition id="BkaZahlen" component={BkaZahlen} durationInFrames={330} fps={30} width={1920} height={1080} />
      <Composition id="McAfeeBalken" component={McAfeeBalken} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="SiebzigProzent" component={SiebzigProzent} durationInFrames={210} fps={30} width={1920} height={1080} />
    </Folder>
  );
};
