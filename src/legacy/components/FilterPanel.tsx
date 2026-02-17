import { useState } from 'react';
import { theme } from '../shared/theme';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  onFilterChange?: (filters: Record<string, any>) => void;
  onReset?: () => void;
}

export function FilterPanel({ groups, onFilterChange, onReset }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (groupId: string, value: any) => {
    const newFilters = { ...filters, [groupId]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onReset?.();
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2"
        style={{
          backgroundColor: activeFilterCount > 0 ? `${theme.colors.info}20` : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${activeFilterCount > 0 ? theme.colors.info : 'rgba(255, 255, 255, 0.1)'}`
        }}
      >
        Filter
        {activeFilterCount > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: theme.colors.info,
              color: '#000'
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute top-full right-0 mt-2 w-80 rounded-lg p-4 z-50"
            style={{
              backgroundColor: 'rgba(10, 14, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter Groups */}
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {group.label}
                  </label>

                  {/* Select */}
                  {group.type === 'select' && (
                    <select
                      value={filters[group.id] || ''}
                      onChange={(e) => handleFilterChange(group.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-white bg-transparent transition-all"
                      style={{
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <option value="">All</option>
                      {group.options?.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Multi-select */}
                  {group.type === 'multiselect' && (
                    <div className="space-y-2">
                      {group.options?.map((option) => {
                        const isSelected = (filters[group.id] || []).includes(option.value);
                        return (
                          <label
                            key={option.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = filters[group.id] || [];
                                const updated = e.target.checked
                                  ? [...current, option.value]
                                  : current.filter((v: any) => v !== option.value);
                                handleFilterChange(group.id, updated);
                              }}
                              className="w-4 h-4 rounded"
                              style={{
                                accentColor: theme.colors.info
                              }}
                            />
                            <span className="text-sm text-gray-300">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Date Range */}
                  {group.type === 'daterange' && (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={filters[group.id]?.start || ''}
                        onChange={(e) =>
                          handleFilterChange(group.id, {
                            ...filters[group.id],
                            start: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-white bg-transparent"
                        style={{
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      />
                      <input
                        type="date"
                        value={filters[group.id]?.end || ''}
                        onChange={(e) =>
                          handleFilterChange(group.id, {
                            ...filters[group.id],
                            end: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-white bg-transparent"
                        style={{
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    </div>
                  )}

                  {/* Range */}
                  {group.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={group.min || 0}
                        max={group.max || 100}
                        value={filters[group.id] || group.min || 0}
                        onChange={(e) => handleFilterChange(group.id, parseInt(e.target.value))}
                        className="w-full"
                        style={{
                          accentColor: theme.colors.info
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{group.min || 0}</span>
                        <span className="font-semibold text-cyan-400">
                          {filters[group.id] || group.min || 0}
                        </span>
                        <span>{group.max || 100}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                style={{
                  backgroundColor: theme.colors.info,
                  border: `1px solid ${theme.colors.info}`
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
