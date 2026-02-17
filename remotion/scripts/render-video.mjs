/**
 * Render canonical videos using Remotion.
 * Usage: node scripts/render-video.mjs
 */

import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, '..', 'output', 'video');

mkdirSync(outputDir, { recursive: true });

console.log('Copying assets into remotion/public/assets ...');
execSync('node scripts/copy-assets.mjs', { cwd: rootDir, stdio: 'inherit' });

const renders = [
  { id: 'VideoMaster30sRebuild', file: 'poseidon-flow-v6.mp4', width: 1920, height: 1080 },
];

renders.forEach((render, index) => {
  console.log(`[${index + 1}/${renders.length}] Rendering ${render.id} -> ${render.file}`);
  const outputPath = join(outputDir, render.file);
  const disableSandbox = process.env.REMOTION_DISABLE_CHROMIUM_SANDBOX === '1'
    ? '--disable-chromium-sandbox'
    : '';
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE
    ? `--browser-executable="${process.env.REMOTION_BROWSER_EXECUTABLE}"`
    : '';
  const chromeMode = process.env.REMOTION_CHROME_MODE
    ? `--chrome-mode=${process.env.REMOTION_CHROME_MODE}`
    : '';
  const extraArgs = process.env.REMOTION_RENDER_ARGS ?? '';
  const command = `npx remotion render ${render.id} "${outputPath}" --codec=h264 --quiet ${disableSandbox} ${browserExecutable} ${chromeMode} ${extraArgs}`.trim();
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
});

console.log('✅ Canonical videos rendered successfully.');
