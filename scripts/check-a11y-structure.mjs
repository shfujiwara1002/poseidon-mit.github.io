#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: required file is missing.`);
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

const targetRouteFiles = [
  'src/pages/Landing.tsx',
  'src/pages/Pricing.tsx',
  'src/pages/Signup.tsx',
  'src/pages/Login.tsx',
  'src/pages/Onboarding.tsx',
  'src/pages/OnboardingGoals.tsx',
  'src/pages/OnboardingConsent.tsx',
  'src/pages/OnboardingComplete.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Protect.tsx',
  'src/pages/ProtectAlertDetail.tsx',
  'src/pages/Grow.tsx',
  'src/pages/GrowGoalDetail.tsx',
  'src/pages/GrowScenarios.tsx',
  'src/pages/Execute.tsx',
  'src/pages/ExecuteHistory.tsx',
  'src/pages/Govern.tsx',
  'src/pages/GovernAuditLedger.tsx',
  'src/pages/Settings.tsx',
  'src/pages/NotFound.tsx',
];

for (const file of targetRouteFiles) {
  const source = read(file);
  if (!source) continue;

  const hasMainId = source.includes('id="main-content"');
  const hasMainRole = source.includes('role="main"') || /<(?:motion\.)?main[\s>]/.test(source);

  if (!hasMainId || !hasMainRole) {
    failures.push(`${file}: must include main landmark with id="main-content".`);
  }
}

const appNav = read('src/components/layout/AppNavShell.tsx');
if (appNav) {
  if (!/aria-label="Main navigation"/.test(appNav)) {
    failures.push('src/components/layout/AppNavShell.tsx: main nav aria label is required.');
  }
  if (!/aria-label="Breadcrumb"/.test(appNav)) {
    failures.push('src/components/layout/AppNavShell.tsx: breadcrumb aria label is required.');
  }
}

if (failures.length > 0) {
  console.error('A11y structure checks failed:');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('A11y structure checks passed.');
