#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

const TARGET_ROUTE_FILES = [
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

const INLINE_STYLE_REGEX = /style=\{\{/g;
const HEX_LITERAL_REGEX = /#[0-9A-Fa-f]{3,6}\b/g;

function readJson(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: required file is missing.`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    failures.push(`${file}: invalid JSON (${error instanceof Error ? error.message : String(error)}).`);
    return null;
  }
}

function readText(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: target page file is missing.`);
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function countMatches(source, regex) {
  return [...source.matchAll(regex)].length;
}

function isActiveException(exception, today) {
  return exception.expiresOn >= today;
}

const exceptionFile = 'docs/baselines/inline-style-hex-exceptions.json';
const exceptionSpec = readJson(exceptionFile);

const exceptionsByFile = new Map();
if (exceptionSpec) {
  const { maxExceptions, exceptions } = exceptionSpec;
  if (!Number.isInteger(maxExceptions) || maxExceptions <= 0) {
    failures.push(`${exceptionFile}: maxExceptions must be a positive integer.`);
  }
  if (!Array.isArray(exceptions)) {
    failures.push(`${exceptionFile}: exceptions must be an array.`);
  } else {
    if (exceptions.length > maxExceptions) {
      failures.push(
        `${exceptionFile}: exceptions count ${exceptions.length} exceeds maxExceptions ${maxExceptions}.`,
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    for (const exception of exceptions) {
      const { file, allow, owner, reason, expiresOn } = exception;

      if (!file || !Array.isArray(allow) || !owner || !reason || !expiresOn) {
        failures.push(
          `${exceptionFile}: each exception requires file, allow[], owner, reason, expiresOn.`,
        );
        continue;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(expiresOn)) {
        failures.push(`${exceptionFile}: invalid expiresOn format for ${file}; expected YYYY-MM-DD.`);
        continue;
      }

      if (!TARGET_ROUTE_FILES.includes(file)) {
        failures.push(`${exceptionFile}: ${file} is not a target route page file.`);
      }

      if (!isActiveException(exception, today)) {
        failures.push(`${exceptionFile}: exception expired for ${file} (expiresOn: ${expiresOn}).`);
      }

      const invalidAllow = allow.filter((item) => item !== 'inline-style' && item !== 'hex-literal');
      if (invalidAllow.length > 0) {
        failures.push(
          `${exceptionFile}: ${file} has invalid allow values: ${invalidAllow.join(', ')}.`,
        );
      }

      exceptionsByFile.set(file, new Set(allow));
    }
  }
}

let totalInline = 0;
let totalHex = 0;
let filesWithViolations = 0;

for (const file of TARGET_ROUTE_FILES) {
  const source = readText(file);
  if (!source) continue;

  const inlineCount = countMatches(source, INLINE_STYLE_REGEX);
  const hexCount = countMatches(source, HEX_LITERAL_REGEX);
  const allow = exceptionsByFile.get(file) ?? new Set();

  const hasViolation = inlineCount > 0 || hexCount > 0;
  if (hasViolation) filesWithViolations += 1;
  totalInline += inlineCount;
  totalHex += hexCount;

  if (inlineCount > 0 && !allow.has('inline-style')) {
    failures.push(`${file}: inline style usage detected (${inlineCount}) without active exception.`);
  }
  if (hexCount > 0 && !allow.has('hex-literal')) {
    failures.push(`${file}: hex literal usage detected (${hexCount}) without active exception.`);
  }

  if (inlineCount === 0 && allow.has('inline-style')) {
    warnings.push(`${file}: inline-style exception can be removed (no violations detected).`);
  }
  if (hexCount === 0 && allow.has('hex-literal')) {
    warnings.push(`${file}: hex-literal exception can be removed (no violations detected).`);
  }
}

if (warnings.length > 0) {
  console.warn('Inline style/hex check warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error('Inline style/hex checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Inline style/hex checks passed (filesWithViolations=${filesWithViolations}, inlineCount=${totalInline}, hexCount=${totalHex}).`,
);
