import React from 'react';
import { IconSupport } from '../assets/icons/IconSupport';

export interface ComparisonRow {
  feature: string;
  traditional: string | boolean;
  poseidon: string | boolean;
}

interface ComparisonTableProps {
  headers: [string, string];
  rows: ComparisonRow[];
}

const renderValueCell = (value: string | boolean) => {
  if (typeof value === 'boolean') {
    return <IconSupport type={value ? 'check' : 'cross'} size={18} />;
  }
  return <span>{value}</span>;
};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ headers, rows }) => {
  return (
    <div className="comparison-table">
      <div className="comparison-header">
        <span>Feature</span>
        <span>{headers[0]}</span>
        <span className="comparison-highlight">{headers[1]}</span>
      </div>
      <div className="comparison-body">
        {rows.map((row, i) => (
          <div
            className="comparison-row comparison-row-animated"
            key={row.feature}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span>{row.feature}</span>
            <span className="comparison-cell">{renderValueCell(row.traditional)}</span>
            <span className="comparison-cell">{renderValueCell(row.poseidon)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
