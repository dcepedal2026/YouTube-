import React from 'react';
import {Composition} from 'remotion';
import {Pilot} from './pilot';
import {Rayos, RAYOS_FPS, RAYOS_FRAMES} from './rayos';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Pilot" component={Pilot} durationInFrames={1800} fps={30} width={1920} height={1080} />
    <Composition id="Rayos" component={Rayos} durationInFrames={RAYOS_FRAMES} fps={RAYOS_FPS} width={1920} height={1080} />
  </>
);
