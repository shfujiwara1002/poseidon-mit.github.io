import React from 'react';

type PaginationProps = {
  total: number;
  current: number;
  onChange?: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({ total, current, onChange }) => {
  return (
    <nav className="pagination" aria-label="Pagination">
      {Array.from({ length: total }).map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            type="button"
            className={`page${current === page ? ' active' : ''}`}
            aria-current={current === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
            onClick={() => onChange?.(page)}
          >
            {page}
          </button>
        );
      })}
    </nav>
  );
};
