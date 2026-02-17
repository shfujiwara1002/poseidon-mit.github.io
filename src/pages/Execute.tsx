/**
 * Execute — Thin orchestrator for the Execute engine page.
 *
 * Composes ExecuteHero, ActionQueue, ExecuteSidebar, and GovernFooter.
 */

import { useRouter } from '../router'
import { usePageTitle } from '../hooks/use-page-title'
import { useViewMode } from '../hooks/useViewMode'
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { ExecuteHero } from './execute/ExecuteHero'
import { ActionQueue } from './execute/ActionQueue'
import { ExecuteSidebar } from './execute/ExecuteSidebar'
import { ExecuteGlance } from './execute/ExecuteGlance'

export function Execute() {
  usePageTitle('Execute')
  const { navigate } = useRouter()
  const [viewMode, setViewMode] = useViewMode()

  return (
    <div className="relative min-h-screen w-full" data-view-mode={viewMode} style={{ background: '#0B1221' }}>
      <AuroraPulse color="#EAB308" />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#EAB308', color: '#0B1221' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <ExecuteHero navigate={navigate} viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === 'glance' ? (
          <ExecuteGlance />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 lg:w-2/3">
              <ActionQueue viewMode={viewMode} />
            </div>
            <ExecuteSidebar viewMode={viewMode} />
          </div>
        )}

        <GovernFooter auditId="GV-2026-0216-EXEC" pageContext="this execution batch" />
      </div>
    </div>
  )
}

export default Execute
