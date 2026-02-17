import { DashboardInsightsPanel } from './DashboardInsightsPanel';

interface MorningBriefingProps {
  greeting?: string;
}

export function MorningBriefing({ greeting }: MorningBriefingProps) {
  return <DashboardInsightsPanel variant="morning" headingOverride={greeting} />;
}
