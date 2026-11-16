import React from 'react';
import {Composition} from 'remotion';
import {Pilot} from './pilot';
export const RemotionRoot: React.FC = () => <Composition id="Pilot" component={Pilot} durationInFrames={1800} fps={30} width={1920} height={1080}/>;
