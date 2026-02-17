import React from 'react';

interface GovernVerifiedBadgeProps {
  auditId?: string;
  modelVersion?: string;
  /** Explanation template version, e.g. "xai-2.1" */
  explanationVersion?: string;
}

/**
 * W-V3-XAI04: GovernVerifiedBadge
 * Semantic Charter Rule 6: "Govern controls are visible on the same screen"
 * Indicates that an AI output has passed governance verification.
 */
export const GovernVerifiedBadge: React.FC<GovernVerifiedBadgeProps> = ({
  auditId = 'GV-2026-0211-4821',
  modelVersion = 'v3.2',
  explanationVersion,
}) => {
  return (
    <span className="mission-govern-badge audit-chip audit-chip-verified" data-widget="GovernVerifiedBadge">
      <span className="mission-govern-badge-dot" />
      <span>Govern-Verified</span>
      <span className="mission-govern-badge-sep">|</span>
      <span className="mission-govern-badge-audit">{auditId}</span>
      <span className="mission-govern-badge-model">{modelVersion}</span>
      {explanationVersion && (
        <span className="mission-govern-badge-xai">{explanationVersion}</span>
      )}
    </span>
  );
};

