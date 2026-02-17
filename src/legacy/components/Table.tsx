import React from 'react';

type Column = {
  key: string;
  label: string;
};

type TableProps = {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  highlightRow?: number;
};

export const Table: React.FC<TableProps> = ({ columns, rows, highlightRow }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className={highlightRow === index ? 'table-row-highlight' : ''}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
