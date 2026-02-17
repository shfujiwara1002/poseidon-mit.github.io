/**
 * Protect Engine — Threat Detection page (thin orchestrator).
 *
 * Layout and visuals are delegated to subcomponents in ./protect/.
 */

import { motion } from 'framer-motion'
import { useRouter } from '../router'
import { usePageTitle } from '../hooks/use-page-title'
import { useViewMode } from '../hooks/useViewMode'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { staggerContainer, staggerContainerPresentation } from '@/lib/motion-presets'
import { ProtectHero } from './protect/ProtectHero'
import { ThreatTable } from './protect/ThreatTable'
import { ProtectSidebar } from './protect/ProtectSidebar'
import { ProtectGlance } from './protect/ProtectGlance'

export const Protect: React.FC = () => {
  usePageTitle('Protect')
  const { navigate } = useRouter()
  const [viewMode, setViewMode] = useViewMode()
  const { isPresentation } = usePresentationMode()

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0A1628' }}
      data-view-mode={viewMode}
    >
      <AuroraPulse color="#22C55E" />

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#22C55E', color: '#0A1628' }}
      >
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 lg:px-8"
        variants={isPresentation ? staggerContainerPresentation : staggerContainer}
        initial="hidden"
        animate="visible"
        role="main"
        aria-label="Protect Engine - Threat Detection"
      >
        <ProtectHero viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* Conditional content based on view mode */}
        {viewMode === 'glance' ? (
          <ProtectGlance />
        ) : (
          /* detail + deep: Two-column content */
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
            <ThreatTable navigate={navigate} viewMode={viewMode} />
            <ProtectSidebar viewMode={viewMode} />
          </div>
        )}

        <GovernFooter auditId="GV-2026-0215-PRT-SIG" pageContext="threat signals" />
      </motion.main>
    </div>
  )
}

export default Protect
