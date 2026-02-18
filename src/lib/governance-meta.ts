/**
 * Governance metadata for all App Shell routes.
 *
 * Single source of truth for GovernFooter props, AuroraPulse color,
 * and engine association per route. Keeps per-page boilerplate minimal.
 */
import type { EngineName } from './engine-tokens'
import { engineTokens } from './engine-tokens'

export interface GovernanceMeta {
  auditId: string
  pageContext: string
  engine: EngineName
  auroraColor: string
}

/**
 * Governance metadata keyed by route path.
 * Covers all 27 App Shell routes.
 */
export const GOVERNANCE_META: Record<string, GovernanceMeta> = {
  // ─── Dashboard (cyan) ──────────────────────────────────────────────────────
  '/dashboard': {
    auditId: 'GV-2026-0216-DASH',
    pageContext: 'financial overview',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/dashboard/alerts': {
    auditId: 'GV-2026-0216-ALRT',
    pageContext: 'alert monitoring',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/dashboard/insights': {
    auditId: 'GV-2026-0216-INSI',
    pageContext: 'insight feed',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/dashboard/timeline': {
    auditId: 'GV-2026-0216-TMLN',
    pageContext: 'activity timeline',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/dashboard/notifications': {
    auditId: 'GV-2026-0216-NOTF',
    pageContext: 'notifications',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },

  // ─── Protect (green) ──────────────────────────────────────────────────────
  '/protect': {
    auditId: 'GV-2026-0215-PRT-SIG',
    pageContext: 'threat signals',
    engine: 'protect',
    auroraColor: engineTokens.protect.color,
  },
  '/protect/alert-detail': {
    auditId: 'GV-2026-0216-PRT-DET',
    pageContext: 'alert investigation',
    engine: 'protect',
    auroraColor: engineTokens.protect.color,
  },
  '/protect/dispute': {
    auditId: 'GV-2026-0216-PRT-DSP',
    pageContext: 'dispute resolution',
    engine: 'protect',
    auroraColor: engineTokens.protect.color,
  },

  // ─── Grow (violet) ────────────────────────────────────────────────────────
  '/grow': {
    auditId: 'GV-2026-0216-GROW',
    pageContext: 'growth projections',
    engine: 'grow',
    auroraColor: engineTokens.grow.color,
  },
  '/grow/goal': {
    auditId: 'GV-2026-0216-GROW-GL',
    pageContext: 'goal tracking',
    engine: 'grow',
    auroraColor: engineTokens.grow.color,
  },
  '/grow/scenarios': {
    auditId: 'GV-2026-0216-GROW-SC',
    pageContext: 'scenario analysis',
    engine: 'grow',
    auroraColor: engineTokens.grow.color,
  },
  '/grow/recommendations': {
    auditId: 'GV-2026-0216-GROW-RC',
    pageContext: 'growth recommendations',
    engine: 'grow',
    auroraColor: engineTokens.grow.color,
  },

  // ─── Execute (amber) ──────────────────────────────────────────────────────
  '/execute': {
    auditId: 'GV-2026-0216-EXEC',
    pageContext: 'this execution batch',
    engine: 'execute',
    auroraColor: engineTokens.execute.color,
  },
  '/execute/approval': {
    auditId: 'GV-2026-0216-EXEC-APR',
    pageContext: 'approval queue',
    engine: 'execute',
    auroraColor: engineTokens.execute.color,
  },
  '/execute/history': {
    auditId: 'GV-2026-0216-EXEC-HIST',
    pageContext: 'execution history',
    engine: 'execute',
    auroraColor: engineTokens.execute.color,
  },

  // ─── Govern (blue) ────────────────────────────────────────────────────────
  '/govern': {
    auditId: 'GV-2026-0216-GOV',
    pageContext: 'governance decisions',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/trust': {
    auditId: 'GV-2026-0216-GOV-TRS',
    pageContext: 'trust metrics',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/audit': {
    auditId: 'GV-2026-0216-GOV-AUD',
    pageContext: 'audit ledger',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/audit-detail': {
    auditId: 'GV-2026-0216-GOV-ADT',
    pageContext: 'audit detail',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/registry': {
    auditId: 'GV-2026-0216-GOV-REG',
    pageContext: 'model registry',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/oversight': {
    auditId: 'GV-2026-0216-GOV-OVR',
    pageContext: 'human oversight queue',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },
  '/govern/policy': {
    auditId: 'GV-2026-0216-GOV-POL',
    pageContext: 'policy controls',
    engine: 'govern',
    auroraColor: engineTokens.govern.color,
  },

  // ─── Settings (dashboard engine) ──────────────────────────────────────────
  '/settings': {
    auditId: 'GV-2026-0216-SETT',
    pageContext: 'settings overview',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/settings/ai': {
    auditId: 'GV-2026-0216-SETT-AI',
    pageContext: 'AI configuration',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/settings/integrations': {
    auditId: 'GV-2026-0216-SETT-INT',
    pageContext: 'integrations',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
  '/settings/rights': {
    auditId: 'GV-2026-0216-SETT-RTS',
    pageContext: 'data rights',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },

  // ─── Help ────────────────────────────────────────────────────────────────
  '/help': {
    auditId: 'GV-2026-0216-HELP',
    pageContext: 'help system',
    engine: 'dashboard',
    auroraColor: engineTokens.dashboard.color,
  },
}

/** Get governance metadata for a route, with fallback for unknown routes. */
export function getGovernanceMeta(path: string): GovernanceMeta | undefined {
  return GOVERNANCE_META[path]
}
