import React from 'react';
import {Composition, Still} from 'remotion';
import {MentirasShort, DURATION_S} from './Main';
import {Thumbnail} from './Thumbnail';
import {FPS, W, H} from './fx';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MentirasShort" component={MentirasShort} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Thumbnail" component={Thumbnail} width={W} height={H} />
  </>
);
