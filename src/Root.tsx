import React from 'react';
import {Composition, Still} from 'remotion';
import {MentirasShort, DURATION_S as D_MENTIRAS} from './videos/mentiras/Main';
import {Thumbnail} from './videos/mentiras/Thumbnail';
import {ReflejoShort, ReflejoThumb, DURATION_S as D_REFLEJO} from './videos/reflejo/Main';
import {MentesShort, MentesThumb, DURATION_S as D_MENTES} from './videos/mentes/Main';
import {TierraShort, TierraThumb, DURATION_S as D_TIERRA} from './videos/tierra/Main';
import {CharacterTest} from './tests/CharacterTest';
import {FPS, W, H} from './fx';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MentirasShort" component={MentirasShort} durationInFrames={Math.round(D_MENTIRAS * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Thumbnail" component={Thumbnail} width={W} height={H} />
    <Composition id="ReflejoShort" component={ReflejoShort} durationInFrames={Math.round(D_REFLEJO * FPS)} fps={FPS} width={W} height={H} />
    <Still id="ReflejoThumb" component={ReflejoThumb} width={W} height={H} />
    <Composition id="MentesShort" component={MentesShort} durationInFrames={Math.round(D_MENTES * FPS)} fps={FPS} width={W} height={H} />
    <Still id="MentesThumb" component={MentesThumb} width={W} height={H} />
    <Composition id="TierraShort" component={TierraShort} durationInFrames={Math.round(D_TIERRA * FPS)} fps={FPS} width={W} height={H} />
    <Still id="TierraThumb" component={TierraThumb} width={W} height={H} />
    <Still id="CharacterTest" component={CharacterTest} width={W} height={H} />
  </>
);
