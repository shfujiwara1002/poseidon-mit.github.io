/**
 * ProductDemo30s — master 30-second product demo composition.
 * MIT CTO Capstone 2026 | Slide07 embedded video.
 *
 * Timeline (30fps):
 *   S1 HOOK     0–90    (0–3s)    — $133/mo problem hook
 *   S2 PROTECT  90–300  (3–10s)   — Fraud detection + approve
 *   S3 GROW     300–480 (10–16s)  — Forecast chart + goal bar
 *   S4 EXECUTE  480–630 (16–21s)  — Approval queue + send
 *   S5 GOVERN   630–810 (21–27s)  — Audit trail + compliance
 *   S6 CLOSE    810–900 (27–30s)  — 4-engine loop close
 */
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { S1Hook } from './scenes/demo/S1Hook';
import { S2Protect } from './scenes/demo/S2Protect';
import { S3Grow } from './scenes/demo/S3Grow';
import { S4Execute } from './scenes/demo/S4Execute';
import { S5Govern } from './scenes/demo/S5Govern';
import { S6LoopClose } from './scenes/demo/S6LoopClose';

export const ProductDemo30s: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#020410' }}>
      {/* S1: HOOK — 0–3s */}
      <Sequence from={0} durationInFrames={90} name="S1-Hook">
        <S1Hook />
      </Sequence>

      {/* S2: PROTECT — 3–10s */}
      <Sequence from={90} durationInFrames={210} name="S2-Protect">
        <S2Protect />
      </Sequence>

      {/* S3: GROW — 10–16s */}
      <Sequence from={300} durationInFrames={180} name="S3-Grow">
        <S3Grow />
      </Sequence>

      {/* S4: EXECUTE — 16–21s */}
      <Sequence from={480} durationInFrames={150} name="S4-Execute">
        <S4Execute />
      </Sequence>

      {/* S5: GOVERN — 21–27s */}
      <Sequence from={630} durationInFrames={180} name="S5-Govern">
        <S5Govern />
      </Sequence>

      {/* S6: LOOP CLOSE — 27–30s */}
      <Sequence from={810} durationInFrames={90} name="S6-LoopClose">
        <S6LoopClose />
      </Sequence>
    </AbsoluteFill>
  );
};
