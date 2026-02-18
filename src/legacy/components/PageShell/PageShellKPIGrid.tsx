import { KPIContractCard } from '../KPIContractCard';
import { usePageShell } from './PageShell';

/**
 * PageShellKPIGrid — Auto-layout KPI grid (0-6 cards).
 * Renders the data-slot="kpi_grid" container with adaptive grid classes.
 *
 * Grid auto-layout:
 * 0 cards → hidden (empty div for slot contract)
 * 1 card  → single column
 * 2 cards → 2-col
 * 3 cards → 3-col
 * 4 cards → 2x2
 * 5-6 cards → 3x2
 */
export function PageShellKPIGrid() {
  const { hero, layout } = usePageShell();
  const { kpis } = hero;

  const baseClass = layout === 'dashboard' ? 'dashboard-pulse-kpis' : 'engine-pulse-kpis';
  const countClass =
    kpis.length === 0
      ? 'kpi-layout--0'
      : kpis.length <= 2
        ? 'kpi-layout--1-2'
        : kpis.length === 3
          ? 'kpi-layout--3'
          : kpis.length === 4
            ? 'kpi-layout--4'
            : kpis.length === 5
              ? 'kpi-layout--5'
              : 'kpi-layout--6';

  return (
    <div
      className={[baseClass, countClass].join(' ')}
      data-slot="kpi_grid"
      data-kpi-count={kpis.length}
      aria-hidden={kpis.length === 0}
    >
      {kpis.map((kpi) => (
        <KPIContractCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta}
          definition={kpi.definition}
          accent={kpi.accent}
          sparklineData={kpi.sparklineData}
          sparklineColor={kpi.sparklineColor}
        />
      ))}
    </div>
  );
}
