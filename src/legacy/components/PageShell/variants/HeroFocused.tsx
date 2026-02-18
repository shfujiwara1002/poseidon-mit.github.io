import { Link } from '../../../router';
import { ProofLine } from '../../ProofLine';
import { FreshnessIndicator } from '../../FreshnessIndicator';
import { EngineIconBadge, type EngineKey } from '../../EngineIconBadge';
import { usePageShell } from '../PageShell';

/**
 * HeroFocused — Engine monitor hero for Protect/Grow.
 * Signature: status bar at top (engine badge + freshness + mode),
 * then headline → subline → proof → action → transition cue.
 * Visually distinct from HeroCommand (which uses an uppercase kicker).
 */
export function HeroFocused() {
  const { hero, contract, layout, heroHeadingId, slug } = usePageShell();
  const showTransitionCue = hero.showTransitionCue ?? true;
  const slugToEngine: Record<string, EngineKey> = {
    protect: 'Protect',
    grow: 'Grow',
    execute: 'Execute',
    govern: 'Govern',
  };
  const engine = hero.engineBadge ?? slugToEngine[slug] ?? 'Protect';

  return (
    <div
      className={layout === 'dashboard' ? 'dashboard-pulse-copy' : 'engine-pulse-copy'}
      data-slot="hero_message"
      data-hero-variant="focused"
    >
      {/* 1. Status bar — the focused variant signature */}
      <div className="hero-focused-status-bar" role="status" aria-label={`${engine} engine status`}>
        <EngineIconBadge engine={engine} size={14} />
        <span className="hero-focused-status-engine">{engine} engine</span>
        <span className="hero-focused-status-sep" aria-hidden="true" />
        <FreshnessIndicator timestamp={hero.freshness} />
        <span className="hero-focused-status-sep" aria-hidden="true" />
        <span className="hero-focused-status-mode">Continuous monitoring</span>
      </div>

      {/* 2. Headline */}
      <h1 id={heroHeadingId}>{hero.headline}</h1>

      {/* 3. Subline — operational detail */}
      <p className="entry-subline hero-focused-subline">
        {hero.subline ?? hero.valueStatement ?? contract.oneScreenMessage}
      </p>

      {/* 4. Proof line */}
      <div data-slot="proof_line" className="hero-focused-proof">
        <ProofLine
          claim={hero.proofLine?.claim ?? 'Operational focus'}
          evidence={hero.proofLine?.evidence ?? 'Primary signal stream highlighted'}
          source={hero.proofLine?.source ?? 'Focused hero'}
        />
      </div>

      {/* 5. Action slot */}
      {!!hero.heroAction && (
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

      {/* 6. Transition cue */}
      {showTransitionCue ? (
        <div className="command-transition-cue hero-focused-transition" data-slot="transition_cue">
          <span className="command-transition-cue__label">Focus next:</span>
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
