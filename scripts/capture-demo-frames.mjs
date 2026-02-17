#!/usr/bin/env node
/**
 * capture-demo-frames.mjs
 *
 * Captures screenshots of Poseidon.AI engine pages for use as Remotion video backgrounds.
 * Usage: node scripts/capture-demo-frames.mjs [--skip-build]
 *
 * Output: remotion/public/assets/screenshots/demo/*.png (1920×1080)
 */

import { execSync, spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outDir = join(rootDir, 'remotion', 'public', 'assets', 'screenshots', 'demo');
const BASE_URL = 'http://127.0.0.1:4175';

const PAGES = [
  { route: '/protect',   file: 'protect.png',   waitFor: '.glass-surface, [class*="glass"]' },
  { route: '/grow',      file: 'grow.png',       waitFor: '.glass-surface, [class*="glass"]' },
  { route: '/execute',   file: 'execute.png',    waitFor: '.glass-surface, [class*="glass"]' },
  { route: '/govern',    file: 'govern.png',     waitFor: '.glass-surface, [class*="glass"]' },
  { route: '/dashboard', file: 'dashboard.png',  waitFor: '.glass-surface, [class*="glass"]' },
];

const skipBuild = process.argv.includes('--skip-build');

// Ensure output directory
mkdirSync(outDir, { recursive: true });

// Step 1: Build Vite app (unless skipped)
if (!skipBuild) {
  console.log('📦  Building Vite app...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} else {
  console.log('⏭️   Skipping build (--skip-build)');
}

// Step 2: Start preview server
console.log('🚀  Starting preview server at port 4175...');
const serverProc = spawn('npm', ['run', 'preview', '--', '--port', '4175'], {
  cwd: rootDir,
  stdio: 'pipe',
  detached: false,
});

// Wait for server to be ready
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error('Preview server did not start within 15s'));
  }, 15000);

  const checkReady = async () => {
    try {
      const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
      if (res.ok || res.status < 500) {
        clearTimeout(timeout);
        resolve();
        return;
      }
    } catch {
      // not ready yet
    }
    setTimeout(checkReady, 500);
  };
  // Small initial delay before first check
  setTimeout(checkReady, 1500);
});
console.log('✅  Preview server is ready.');

// Step 3: Capture screenshots with Playwright
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  serverProc.kill();
  console.error('❌  Playwright not installed. Run: npm install -D playwright && npx playwright install chromium');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

// Disable transitions and animations for cleaner screenshots
await page.addInitScript(() => {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-delay: 0.01ms !important;
      transition-duration: 0.01ms !important;
      transition-delay: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
});

try {
  for (const { route, file } of PAGES) {
    const url = `${BASE_URL}${route}`;
    const outputPath = join(outDir, file);

    console.log(`📸  Capturing ${route} → ${file}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Extra settle time for Framer Motion animations
    await page.waitForTimeout(1500);

    // Hide overlays only — keep sidebar and nav visible for authentic app screenshots
    await page.evaluate(() => {
      const hideSelectors = ['.boot-splash', '[data-boot-splash]', '.chatbot'];
      for (const sel of hideSelectors) {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = 'none';
        });
      }
    });

    await page.screenshot({
      path: outputPath,
      fullPage: false,  // viewport only — 1920×1080
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    console.log(`   ✓ Saved: ${outputPath}`);
  }
} finally {
  await browser.close();
  serverProc.kill();
}

console.log(`\n✅  All ${PAGES.length} screenshots captured to:\n   ${outDir}`);
