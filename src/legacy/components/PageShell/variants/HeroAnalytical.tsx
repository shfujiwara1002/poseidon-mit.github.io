import { Link } from '../../../router';
import { ProofLine } from '../../ProofLine';
import { FreshnessIndicator } from '../../FreshnessIndicator';
import { MissionMetadataStrip } from '../../MissionMetadataStrip';
import { usePageShell } from '../PageShell';

/**
 * HeroAnalytical — Execute/Govern hub hero.
 * Emphasizes: Title + StatSummary + KPIGrid.
 * Visually the same DOM as HeroCommand but styled for analytical workflows.
 * Used by: Execute hub, Govern hub, and their sub-pages.
 */
export function HeroAnalytical() {
  const { hero, contract, layout, heroHeadingId } = usePageShell();
  const showTransitionCue = hero.showTransitionCue ?? true;

  return (
    <div
      className={layout === 'dashboard' ? 'dashboard-pulse-copy' : 'engine-pulse-copy'}
      data-slot="hero_message"
      data-hero-variant="analytical"
    >
      <p className="entry-kicker">{hero.kicker}</p>
      <h1 id={heroHeadingId}>{hero.headline}</h1>
      <p className="entry-subline">{hero.valueStatement ?? hero.subline ?? contract.oneScreenMessage}</p>

      <div className="hero-analytical-summary" role="status" aria-label="Analytical summary">
        <strong>Stat summary</strong>
        <span>{hero.statSummary ?? `${hero.kpis.length} KPI signals active`}</span>
      </div>

      <dl className="hero-analytical-table" aria-label="Analytical breakdown">
        <div>
          <dt>Signals</dt>
          <dd>{hero.kpis.length}</dd>
        </div>
        <div>
          <dt>Evidence</dt>
          <dd>{hero.proofLine?.source ?? 'Live stream'}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>Comparative</dd>
        </div>
      </dl>

      <div data-slot="proof_line">
        <ProofLine
          claim={hero.proofLine?.claim ?? 'Analytical mode'}
          evidence={hero.proofLine?.evidence ?? 'Comparative signal and trend view enabled'}
          source={hero.proofLine?.source ?? 'Analytical hero'}
        />
      </div>

      {hero.heroAction && (
        <div className="dashboard-pulse-action">
          <span className="dashboard-pulse-action-label">{hero.heroAction.label}</span>
          <span className="dashboard-pulse-action-text">{hero.heroAction.text}</span>
          {hero.heroAction.cta && (
            <Link
              to={hero.heroAction.cta.to}
              className="entry-btn entry-btn--primary dashboard-pulse-action-cta"
            >
              {hero.heroAction.cta.label}
            </Link>
          )}
        </div>
      )}
      {hero.actionHint && <p className="entry-subline dashboard-pulse-action-hint">{hero.actionHint}</p>}

      <MissionMetadataStrip
        compact
        items={[<FreshnessIndicator key="fresh" timestamp={hero.freshness} />, 'Analytical lens']}
      />

      {showTransitionCue ? (
        <div className="command-transition-cue" data-slot="transition_cue">
          <span className="command-transition-cue__label">Next:</span>
          <span className="command-transition-cue__text">{contract.transitionCue}</span>
          <Link to={contract.transitionTo} className="entry-link-minor">
            Open
          </Link>
        </div>
      ) : (
        <div data-slot="transition_cue" className="slot-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
