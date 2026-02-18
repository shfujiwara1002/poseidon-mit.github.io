import { useTimeContext } from '../../hooks/useTimeContext';
import { DashboardInsightsPanel as InsightsPanel } from '../DashboardInsightsPanel';

export function DashboardInsightsPanel() {
  const { isMorningBriefing } = useTimeContext();
  return <InsightsPanel variant={isMorningBriefing ? 'morning' : 'evening'} />;
}
