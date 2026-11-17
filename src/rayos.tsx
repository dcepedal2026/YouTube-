import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const RAYOS_FPS = 30;
export const RAYOS_FRAMES = 285;

export const Rayos: React.FC = () => {
  const frame = useCurrentFrame();
  const discharge = interpolate(frame, [209, 214, 223, 238], [0, 1, 0.65, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chargeSeparation = interpolate(frame, [20, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#14263a', color: '#f7f0df', fontFamily: 'Arial, sans-serif'}}>
      <Audio src={staticFile('audio/rayos.mp3')} />
      <div style={{position: 'absolute', left: 105, top: 130, fontSize: 89, fontWeight: 800, width: 720}}>
        ¿Cómo se forma un rayo?
      </div>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M0 917 Q468 850 910 916 T1920 891 V1080 H0Z" fill="#263f50" />
        <path d="M960 466 Q917 364 1027 326 Q1070 239 1200 272 Q1309 165 1430 252 Q1562 230 1600 332 Q1704 351 1676 459 L1636 508 H1015Z" fill="#4e6576" />
        <g fill="#98dcd6" fontSize="54" fontWeight="bold" opacity={chargeSeparation}>
          <text x="1110" y="302">+</text><text x="1320" y="298">+</text><text x="1490" y="326">+</text>
        </g>
        <g fill="#f8c15f" fontSize="54" fontWeight="bold" opacity={chargeSeparation}>
          <text x="1120" y="466">−</text><text x="1320" y="469">−</text><text x="1530" y="456">−</text>
        </g>
        <path d="M1380 500 L1240 700 H1330 L1230 921 L1488 644 H1392 L1503 500Z" fill="#ffdc81" opacity={discharge} />
      </svg>
    </AbsoluteFill>
  );
};
