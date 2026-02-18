import { usePageTitle } from '@/hooks/use-page-title';
import { useViewMode } from '@/hooks/useViewMode';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { EngineHealthStrip } from '@/components/dashboard/EngineHealthStrip';
import { PrimaryFeed } from '@/components/dashboard/PrimaryFeed';
import { DecisionRail } from '@/components/dashboard/DecisionRail';
import { DashboardGlance } from '@/components/dashboard/DashboardGlance';

export function Dashboard() {
  usePageTitle('Dashboard');
  const [viewMode, setViewMode] = useViewMode();

  return (
    <div className="command-center relative overflow-hidden">
      <AuroraPulse color="#00F0FF" />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="command-center__main">
        <HeroSection viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === 'glance' ? (
          <DashboardGlance />
        ) : (
          <>
            <KpiGrid />
            <EngineHealthStrip />
            <div className="command-center__columns">
              <PrimaryFeed />
              <DecisionRail />
            </div>
          </>
        )}

        <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
      </main>
    </div>
  );
}

export default Dashboard;
