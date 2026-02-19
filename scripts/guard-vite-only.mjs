#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const disallowedPaths = [
  'src/_pages_vite',
  'next.config.mjs',
  'next-env.d.ts',
  'app',
  'components/shell',
  'components/landing',
];

for (const relPath of disallowedPaths) {
  if (fs.existsSync(path.join(root, relPath))) {
    failures.push(`Disallowed active path present: ${relPath}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const scripts = packageJson.scripts ?? {};
if (typeof scripts.dev === 'string' && scripts.dev.includes('next')) {
  failures.push('package.json scripts.dev must not reference Next.js.');
}
if (typeof scripts.build === 'string' && scripts.build.includes('next')) {
  failures.push('package.json scripts.build must not reference Next.js.');
}

function walk(dirPath, exts, acc = []) {
  if (!fs.existsSync(dirPath)) return acc;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, exts, acc);
      continue;
    }
    if (exts.some((ext) => entry.name.endsWith(ext))) {
      acc.push(fullPath);
    }
  }
  return acc;
}

const scanFiles = [
  ...walk(path.join(root, 'src'), ['.ts', '.tsx', '.mjs', '.js']),
  ...walk(path.join(root, 'scripts'), ['.ts', '.tsx', '.mjs', '.js']),
  ...walk(path.join(root, '.github', 'workflows'), ['.yml', '.yaml']),
  path.join(root, 'package.json'),
  path.join(root, 'tsconfig.json'),
  path.join(root, 'vite.config.ts'),
  path.join(root, 'vitest.config.ts'),
];

const allowedPagesImportPrefixes = [
  path.join(root, 'src', '__tests__', 'flows') + path.sep,
  path.join(root, 'src', 'contracts', '__tests__') + path.sep,
];

for (const fullPath of scanFiles) {
  if (!fs.existsSync(fullPath) || fullPath.includes(`${path.sep}legacy${path.sep}`)) continue;
  const relPath = path.relative(root, fullPath).split(path.sep).join('/');
  const source = fs.readFileSync(fullPath, 'utf8');

  if (
    relPath !== 'scripts/guard-vite-only.mjs' &&
    (source.includes('src/_pages_vite') || source.includes('../_pages_vite/') || source.includes('/_pages_vite/'))
  ) {
    failures.push(`${relPath}: contains stale _pages_vite reference.`);
  }

  if (source.match(/from ['"]next(?:\/[^'"]*)?['"]/g) || source.match(/import\(['"]next(?:\/[^'"]*)?['"]\)/g)) {
    failures.push(`${relPath}: contains Next.js import in active surface.`);
  }

  if (relPath !== 'scripts/guard-vite-only.mjs' && source.includes('../../pages/')) {
    const allowed = allowedPagesImportPrefixes.some((prefix) => fullPath.startsWith(prefix));
    if (!allowed) {
      failures.push(`${relPath}: ../../pages import is only allowed in sanctioned contract/flow tests.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Vite-only guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Vite-only guard passed.');
