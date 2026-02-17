/**
 * Render VideoMasterV5Flagship (30s flagship for MIT Capstone).
 * Usage: node scripts/render-v5-flagship.mjs
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

const outputPath = join(outputDir, 'poseidon-v5-flagship-30s.mp4');
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

console.log('Rendering VideoMasterV5Flagship -> poseidon-v5-flagship-30s.mp4');
const command = `npx remotion render VideoMasterV5Flagship "${outputPath}" --codec=h264 ${disableSandbox} ${browserExecutable} ${chromeMode} ${extraArgs}`.trim();
execSync(command, { cwd: rootDir, stdio: 'inherit' });

console.log('Flagship video rendered successfully.');
