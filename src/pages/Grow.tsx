/**
 * Grow — Thin orchestrator for the Grow engine page.
 *
 * Composes: GrowHero (hero + KPI grid), GoalsSection, GrowSidebar,
 * GrowGlance (glance mode), and the shared GovernFooter.
 *
 * Supports 3-tier view mode: glance / detail / deep.
 */

import { useRouter } from '../router'
import { usePageTitle } from '../hooks/use-page-title'
import { useViewMode } from '../hooks/useViewMode'
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { HeroSection, KpiGrid } from './grow/GrowHero'
import { GoalsSection } from './grow/GoalsSection'
import { GrowSidebar } from './grow/GrowSidebar'
import { GrowGlance } from './grow/GrowGlance'

export function Grow() {
  usePageTitle('Grow')
  const { navigate } = useRouter()
  const [viewMode, setViewMode] = useViewMode()

  return (
    <div className="relative min-h-screen w-full" data-view-mode={viewMode} style={{ background: '#0B1221' }}>
      <AuroraPulse color="#8B5CF6" />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#8B5CF6', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <HeroSection navigate={navigate} viewMode={viewMode} onViewModeChange={setViewMode} />
        <KpiGrid viewMode={viewMode} />

        {viewMode === 'glance' ? (
          <GrowGlance />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 lg:w-2/3">
              <GoalsSection navigate={navigate} viewMode={viewMode} />
            </div>
            <GrowSidebar viewMode={viewMode} />
          </div>
        )}

        <GovernFooter auditId="GV-2026-0216-GROW" pageContext="growth projections" />
      </div>
    </div>
  )
}

export default Grow
