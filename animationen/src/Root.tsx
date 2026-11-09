import { Composition, Folder } from "remotion";
import { BkaZahlen } from "./BkaZahlen";
import { McAfeeBalken } from "./McAfeeBalken";
import { SiebzigProzent } from "./SiebzigProzent";
import { Eisberg } from "./Eisberg";
import { AnrufTreppe } from "./AnrufTreppe";
import { DreiWorte } from "./DreiWorte";
import { Codewort } from "./Codewort";

// Start im Voiceover (voiceover-01-mlx-1.7B-8bit.wav): BkaZahlen 0:36.5, Eisberg 0:47.2, McAfeeBalken 1:08.4,
// SiebzigProzent 1:50.4, AnrufTreppe 2:00.4, DreiWorte 2:51.2, Codewort 3:25.9
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Video01">
      <Composition id="BkaZahlen" component={BkaZahlen} durationInFrames={330} fps={30} width={1920} height={1080} />
      <Composition id="McAfeeBalken" component={McAfeeBalken} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="SiebzigProzent" component={SiebzigProzent} durationInFrames={210} fps={30} width={1920} height={1080} />
      <Composition id="Eisberg" component={Eisberg} durationInFrames={135} fps={30} width={1920} height={1080} />
      <Composition id="AnrufTreppe" component={AnrufTreppe} durationInFrames={1290} fps={30} width={1920} height={1080} />
      <Composition id="DreiWorte" component={DreiWorte} durationInFrames={225} fps={30} width={1920} height={1080} />
      <Composition id="Codewort" component={Codewort} durationInFrames={465} fps={30} width={1920} height={1080} />
    </Folder>
  );
};
