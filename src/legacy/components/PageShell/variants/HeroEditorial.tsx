import { Link } from '../../../router';
import { ProofLine } from '../../ProofLine';
import { usePageShell } from '../PageShell';

/**
 * HeroEditorial — Settings/Help/sub-page hero.
 * Emphasizes: Title + Description + optional CTA.
 * Used by: Settings, HelpSupport, and detail/sub-pages.
 */
export function HeroEditorial() {
  const { hero, contract, layout, heroHeadingId } = usePageShell();
  const showProofLine = hero.showProofLine ?? false;
  const showTransitionCue = hero.showTransitionCue ?? true;

  return (
    <div
      className={layout === 'dashboard' ? 'dashboard-pulse-copy' : 'engine-pulse-copy'}
      data-slot="hero_message"
      data-hero-variant="editorial"
    >
      <p className="entry-kicker hero-editorial-kicker">{hero.kicker}</p>
      <h1 id={heroHeadingId}>{hero.headline}</h1>
      <p className="entry-subline hero-editorial-subline">
        {hero.valueStatement ?? hero.description ?? hero.subline ?? contract.oneScreenMessage}
      </p>

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
        <div className="dashboard-pulse-action hero-editorial-action">
          <span className="dashboard-pulse-action-label">{hero.heroAction.label}</span>
          <span className="dashboard-pulse-action-text">{hero.heroAction.text}</span>
          {hero.heroAction.cta && (
            <Link
              to={hero.heroAction.cta.to}
              className="entry-btn entry-btn--ghost dashboard-pulse-action-cta"
            >
              {hero.heroAction.cta.label}
            </Link>
          )}
        </div>
      )}
      {hero.actionHint && <p className="entry-subline dashboard-pulse-action-hint">{hero.actionHint}</p>}

      {showTransitionCue ? (
        <div className="command-transition-cue hero-editorial-transition" data-slot="transition_cue">
          <span className="command-transition-cue__label">Continue:</span>
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
