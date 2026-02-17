import React from 'react';

interface DefinitionLineStructuredProps {
  /** Metric name */
  metric: string;
  /** Calculation formula */
  formula: string;
  /** Unit of measurement */
  unit?: string;
  /** Measurement window, e.g. "30 days rolling" */
  period: string;
  /** Target threshold, e.g. "> 0.90" */
  threshold?: string;
  text?: never;
}

interface DefinitionLineLegacyProps {
  /** Legacy plain-text mode (backward compatibility) */
  text: string;
  metric?: never;
  formula?: never;
  unit?: never;
  period?: never;
  threshold?: never;
}

type DefinitionLineProps = DefinitionLineStructuredProps | DefinitionLineLegacyProps;

/**
 * W-V3-EVD02: DefinitionLine — explains a numeric value by showing its formula,
 * unit, and measurement period. Implements "No magic numbers" rule.
 */
export const DefinitionLine: React.FC<DefinitionLineProps> = (props) => {
  // Legacy mode: plain text
  if ('text' in props && props.text) {
    return (
      <div className="stat-definition" data-widget="DefinitionLine">
        {props.text}
      </div>
    );
  }

  // Structured mode
  const { metric, formula, unit, period, threshold } = props as DefinitionLineStructuredProps;

  return (
    <div className="stat-definition stat-definition--structured" data-widget="DefinitionLine">
      <span className="stat-definition-metric">{metric}</span>
      <span className="stat-definition-formula">{formula}</span>
      {unit && <span className="stat-definition-unit">{unit}</span>}
      <span className="stat-definition-period">{period}</span>
      {threshold && <span className="stat-definition-threshold">{threshold}</span>}
    </div>
  );
};

