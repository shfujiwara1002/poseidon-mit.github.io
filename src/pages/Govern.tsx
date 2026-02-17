/**
 * Govern — Thin orchestrator for the Governance engine page.
 *
 * All data, types, and section-level UI live in ./govern/*.
 */
import { useRouter } from '../router';
import { useViewMode } from '../hooks/useViewMode';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GovernHero } from './govern/GovernHero';
import { DecisionLedger } from './govern/DecisionLedger';
import { GovernSidebar } from './govern/GovernSidebar';
import { GovernGlance } from './govern/GovernGlance';

export function Govern() {
  usePageTitle('Govern');
  const { navigate } = useRouter();
  const [viewMode, setViewMode] = useViewMode();

  return (
    <div className="relative min-h-screen w-full" data-view-mode={viewMode} style={{ background: '#0B1221' }}>
      <AuroraPulse color="#3B82F6" />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#3B82F6', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <GovernHero navigate={navigate} viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === 'glance' ? (
          <GovernGlance />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 lg:w-2/3">
              <DecisionLedger navigate={navigate} viewMode={viewMode} />
            </div>
            <GovernSidebar viewMode={viewMode} />
          </div>
        )}

        <GovernFooter auditId="GV-2026-0216-GOV" pageContext="governance decisions" />
      </div>
    </div>
  );
}

export default Govern;
