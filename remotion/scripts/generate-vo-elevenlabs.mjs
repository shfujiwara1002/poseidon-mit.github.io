/**
 * VO generation scaffold for ElevenLabs API.
 * Usage: ELEVENLABS_API_KEY=xxx node scripts/generate-vo-elevenlabs.mjs
 *
 * Generates VO audio for the V5 Flagship video.
 * Adam voice, stability: 0.5, similarity_boost: 0.75
 * Output: public/audio/poseidon-vo-v7.mp3
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputPath = join(rootDir, 'public', 'audio', 'poseidon-vo-v7.mp3');

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Error: Set ELEVENLABS_API_KEY environment variable');
  process.exit(1);
}

const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam
const SCRIPT = `Your financial AI makes decisions every day. Can you explain a single one?
Black-box AI breaks trust. You need an architecture you can see.
Threats detected in under 100 milliseconds. 99.7% accuracy on your behavioral patterns.
Every action logged. Every decision explainable.
Deterministic models compute. GenAI explains. Humans approve.
Poseidon. AI your money can trust.`;

async function generateVO() {
  console.log('Generating VO with ElevenLabs (Adam voice)...');
  console.log(`Script: ${SCRIPT.length} characters, ~60 words`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: SCRIPT,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`ElevenLabs API error (${response.status}): ${error}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`VO saved to: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log('Next: verify duration (target: 26-28s) and update V5_VO_MARKERS in config.ts');
}

generateVO().catch((err) => {
  console.error('VO generation failed:', err);
  process.exit(1);
});
