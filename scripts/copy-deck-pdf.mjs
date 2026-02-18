#!/usr/bin/env node
/**
 * Copy the deck PDF from remotion/out/ to public/ so the site can serve it
 * at /CTO-Group7-Poseidon.pdf (and the in-app /deck viewer can load it).
 *
 * Run before build when you want the deck available on the deployed site:
 *   node scripts/copy-deck-pdf.mjs
 *   npm run build
 *
 * Or: npm run copy:deck-pdf && npm run build
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'remotion', 'out', 'CTO-Group7-Poseidon.pdf');
const dest = join(root, 'public', 'CTO-Group7-Poseidon.pdf');

if (!existsSync(src)) {
  console.warn(
    `[copy-deck-pdf] Source not found: remotion/out/CTO-Group7-Poseidon.pdf\n` +
      `  Skipping copy. The /deck page will show an error until the PDF is in public/.`
  );
  process.exit(0);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log('[copy-deck-pdf] Copied deck PDF to public/CTO-Group7-Poseidon.pdf');
