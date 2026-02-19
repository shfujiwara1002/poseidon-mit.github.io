# Vite-Only Frontend Architecture

## Status

- Effective date: 2026-02-19
- Frontend runtime/build/test toolchain: **Vite + Vitest**
- Package manager: **npm**

## Canonical Directory Map

- Route screens: `src/pages/**`
- Shared app components: `src/components/**`
- Router: `src/router/**`
- Contracts/tests/check scripts: `src/**` and `scripts/**`

## Script Contract

- `npm run dev` -> `vite`
- `npm run build` -> `vite build` (outputs `dist/`)
- `npm run preview` -> `vite preview`
- `npm run test:run` -> `vitest run`
- `npm run guard:vite-only` -> architecture drift guard

## Package Manager Policy

- Use `npm` commands only for active workflows.
- `package-lock.json` is the lockfile source of truth.
- `package.json` declares `"packageManager": "npm@11.6.2"`.

## Archived Next Assets

Next.js artifacts are retained only for historical reference and are not part of active CI/runtime:

- `legacy/next/app/**`
- `legacy/next/components/**`
- `legacy/next/next.config.mjs`
- `legacy/next/next-env.d.ts`

Do not import from `next/*` in active app code under `src/**`.
