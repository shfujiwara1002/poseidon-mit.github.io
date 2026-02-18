import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/use-page-title';
import { useViewMode } from '@/hooks/useViewMode';
import { usePresentationMode } from '@/hooks/usePresentationMode';
import { GovernFooter, AuroraPulse, BentoGrid, BentoItem } from '@/components/poseidon';
import { staggerContainer, staggerContainerPresentation } from '@/lib/motion-presets';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { EngineHealthStrip } from '@/components/dashboard/EngineHealthStrip';
import { PrimaryFeed } from '@/components/dashboard/PrimaryFeed';
import { DecisionRail } from '@/components/dashboard/DecisionRail';
import { DashboardGlance } from '@/components/dashboard/DashboardGlance';

export function Dashboard() {
  usePageTitle('Dashboard');
  const [viewMode, setViewMode] = useViewMode();
  const { isPresentation } = usePresentationMode();

  return (
    <div className="command-center relative overflow-hidden">
      <AuroraPulse color="var(--engine-dashboard)" />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <motion.main
        id="main-content"
        className="command-center__main"
        variants={isPresentation ? staggerContainerPresentation : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <HeroSection viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === 'glance' ? (
          <DashboardGlance />
        ) : (
          <BentoGrid className="px-4 md:px-6 lg:px-8 py-4">
            <BentoItem colSpan={3}>
              <KpiGrid />
            </BentoItem>
            <BentoItem colSpan={3}>
              <EngineHealthStrip />
            </BentoItem>
            <BentoItem colSpan={2} rowSpan={2}>
              <PrimaryFeed />
            </BentoItem>
            <BentoItem colSpan={1} rowSpan={2}>
              <DecisionRail />
            </BentoItem>
          </BentoGrid>
        )}

        <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
      </motion.main>
    </div>
  );
}

export default Dashboard;
