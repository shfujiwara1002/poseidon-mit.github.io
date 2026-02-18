#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const STRICT = process.argv.includes('--strict');

const ACTIVE_PAGES = new Set([
  'Landing',
  'Signup',
  'Onboarding',
  'Dashboard',
  'Protect',
  'Grow',
  'Execute',
  'Govern',
  'Settings',
]);

// Baseline from the legacy-system investigation report.
const BASELINE = {
  Dashboard: { styles: 3, utility: 0 },
  EngineWorkspace: { styles: 0, utility: 1 },
  Engines: { styles: 5, utility: 21 },
  Execute: { styles: 15, utility: 0 },
  ExecuteV2: { styles: 12, utility: 53 },
  Govern: { styles: 20, utility: 0 },
  GovernV2: { styles: 9, utility: 54 },
  Grow: { styles: 19, utility: 0 },
  GrowV2: { styles: 9, utility: 46 },
  Landing: { styles: 6, utility: 3 },
  Login: { styles: 3, utility: 18 },
  NotFound: { styles: 5, utility: 1 },
  Onboarding: { styles: 2, utility: 4 },
  OnboardingV2: { styles: 14, utility: 49 },
  Protect: { styles: 19, utility: 3 },
  ProtectV2: { styles: 6, utility: 29 },
  Settings: { styles: 0, utility: 0 },
  Signup: { styles: 1, utility: 1 },
  V3Hub: { styles: 1, utility: 11 },
};

const STYLE_RE = /style=\{\{/g;
const CLASSNAME_RE = /className="([^"]*)"/g;
const SHELL_RE = /CommandCenterShell|EnginePageShell|AppNavShell/g;

function isUtilityToken(token) {
  return (
    token === 'flex' ||
    token.startsWith('flex-') ||
    token === 'grid' ||
    token.startsWith('grid-') ||
    token.startsWith('text-') ||
    token.startsWith('bg-') ||
    token.startsWith('p-') ||
    token.startsWith('pt-') ||
    token.startsWith('pr-') ||
    token.startsWith('pb-') ||
    token.startsWith('pl-') ||
    token.startsWith('px-') ||
    token.startsWith('py-') ||
    token.startsWith('m-') ||
    token.startsWith('mt-') ||
    token.startsWith('mr-') ||
    token.startsWith('mb-') ||
    token.startsWith('ml-') ||
    token.startsWith('mx-') ||
    token.startsWith('my-') ||
    token.startsWith('rounded') ||
    token.startsWith('border') ||
    token.startsWith('space-y-') ||
    token.startsWith('gap-') ||
    token.startsWith('items-') ||
    token.startsWith('justify-') ||
    token.startsWith('w-') ||
    token.startsWith('h-')
  );
}

function countUtilityClassStrings(source) {
  let count = 0;
  for (const match of source.matchAll(CLASSNAME_RE)) {
    const classNames = match[1] || '';
    const tokens = classNames.split(/\s+/).filter(Boolean);
    if (tokens.some(isUtilityToken)) {
      count += 1;
    }
  }
  return count;
}

function metricsFor(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  return {
    styles: (source.match(STYLE_RE) || []).length,
    utility: countUtilityClassStrings(source),
    shell: (source.match(SHELL_RE) || []).length,
  };
}

const files = fs
  .readdirSync(PAGES_DIR)
  .filter((name) => name.endsWith('.tsx') && !name.includes('__tests__'))
  .sort();

let hasError = false;

console.log(`[visual-system] Mode: ${STRICT ? 'strict' : 'baseline'}`);

for (const file of files) {
  const pageName = file.replace('.tsx', '');
  const fullPath = path.join(PAGES_DIR, file);
  const metrics = metricsFor(fullPath);
  const baseline = BASELINE[pageName];

  if (!baseline) {
    console.error(`[visual-system] Missing baseline entry: ${pageName}`);
    hasError = true;
    continue;
  }

  if (ACTIVE_PAGES.has(pageName) && metrics.shell === 0) {
    console.error(`[visual-system] Active page missing shell contract: ${pageName}`);
    hasError = true;
  }

  if (STRICT) {
    const maxStyles = ACTIVE_PAGES.has(pageName) ? 0 : baseline.styles;
    const maxUtility = ACTIVE_PAGES.has(pageName) ? 0 : baseline.utility;
    if (metrics.styles > maxStyles) {
      console.error(`[visual-system] Strict style violation: ${pageName} (got ${metrics.styles}, max ${maxStyles})`);
      hasError = true;
    }
    if (metrics.utility > maxUtility) {
      console.error(`[visual-system] Strict utility violation: ${pageName} (got ${metrics.utility}, max ${maxUtility})`);
      hasError = true;
    }
  } else {
    if (metrics.styles > baseline.styles) {
      console.error(`[visual-system] Style regression: ${pageName} (got ${metrics.styles}, baseline ${baseline.styles})`);
      hasError = true;
    }
    if (metrics.utility > baseline.utility) {
      console.error(`[visual-system] Utility regression: ${pageName} (got ${metrics.utility}, baseline ${baseline.utility})`);
      hasError = true;
    }
  }

  console.log(
    `[visual-system] ${pageName.padEnd(14)} styles=${String(metrics.styles).padEnd(2)} utility=${String(metrics.utility).padEnd(2)} shell=${metrics.shell}`,
  );
}

if (hasError) {
  process.exit(1);
}

console.log('[visual-system] Page visual-system checks passed.');
