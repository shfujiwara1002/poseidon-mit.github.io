import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Inbox,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';

export interface TransactionColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string;
}

type SortDir = 'asc' | 'desc' | null;

export interface TransactionTableProps<T extends { id: string | number }> {
  columns: TransactionColumn<T>[];
  data: T[];
  pageSize?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TransactionTable<T extends { id: string | number }>({
  columns, data, pageSize = 10, loading = false,
  emptyTitle = 'No data found', emptyDescription = 'There are no records to display.',
}: TransactionTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [data.length]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(null); setSortDir(null); }
    } else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const from = sorted.length === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, sorted.length);

  if (loading) {
    return (
      <div className="engine-card overflow-hidden p-0">
        <div className="flex flex-col">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b px-4 py-4 md:px-6"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {columns.map((col) => (
                <div key={col.key} className="h-3 flex-1 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="engine-card flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Inbox className="h-8 w-8" style={{ color: 'var(--muted-2)' }} />
        </div>
        <h3 className="mt-4 text-base font-semibold" style={{ color: 'var(--text)' }}>{emptyTitle}</h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-2)' }}>{emptyDescription}</p>
      </div>
    );
  }

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey === colKey && sortDir === 'asc') return <ChevronUp className="h-3.5 w-3.5" style={{ color: 'var(--accent-teal)' }} />;
    if (sortKey === colKey && sortDir === 'desc') return <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--accent-teal)' }} />;
    return <ChevronsUpDown className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />;
  };

  return (
    <div className="engine-card overflow-hidden p-0">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {columns.map((col) => (
                <th key={col.key}
                  className={cn('h-11 px-6 text-left text-xs font-semibold uppercase tracking-wider', col.sortable && 'cursor-pointer select-none', col.className)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7280' }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}>
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-6 py-3.5 text-sm', col.className)} style={{ color: 'var(--muted)' }}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {paginated.map((row) => (
          <div key={row.id} className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex flex-col gap-2.5">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>{col.mobileLabel ?? col.label}</span>
                  <span className="text-right text-sm" style={{ color: 'var(--muted)' }}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t px-4 py-3 md:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          Showing <span className="font-medium" style={{ color: 'var(--muted-2)' }}>{from}</span>-<span className="font-medium" style={{ color: 'var(--muted-2)' }}>{to}</span> of <span className="font-medium" style={{ color: 'var(--muted-2)' }}>{sorted.length}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
            <Button key={i} variant={i === page ? 'primary' : 'ghost'} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`} aria-current={i === page ? 'page' : undefined}>
              {i + 1}
            </Button>
          ))}
          <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
