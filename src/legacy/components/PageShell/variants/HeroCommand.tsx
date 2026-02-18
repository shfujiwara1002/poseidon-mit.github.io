import { Link } from '../../../router';
import { ProofLine } from '../../ProofLine';
import { FreshnessIndicator } from '../../FreshnessIndicator';
import { MissionMetadataStrip } from '../../MissionMetadataStrip';
import { usePageShell } from '../PageShell';

/**
 * HeroCommand — Dashboard-style hero.
 * Full composition: Kicker + Headline + ProofLine + ActionSlot + MetadataStrip + TransitionCue.
 * Used by: Dashboard, Landing, and pages with the full command-center hero.
 */
export function HeroCommand() {
  const { hero, contract, layout, heroHeadingId } = usePageShell();
  const showProofLine = hero.showProofLine ?? true;
  const showTransitionCue = hero.showTransitionCue ?? true;

  return (
    <div
      className={layout === 'dashboard' ? 'dashboard-pulse-copy' : 'engine-pulse-copy'}
      data-slot="hero_message"
      data-hero-variant="command"
    >
      <p className="entry-kicker">{hero.kicker}</p>
      <h1 id={heroHeadingId}>{hero.headline}</h1>
      <p className="entry-subline">{hero.valueStatement ?? contract.oneScreenMessage}</p>

      {showProofLine && hero.proofLine ? (
        <div data-slot="proof_line">
          <ProofLine
            claim={hero.proofLine.claim}
            evidence={hero.proofLine.evidence}
            source={hero.proofLine.source}
          />
        </div>
      ) : (
        <div data-slot="proof_line" className="slot-placeholder" aria-hidden="true" />
      )}

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
        items={[<FreshnessIndicator key="fresh" timestamp={hero.freshness} />, 'Model v3.2']}
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
