import { theme } from '../shared/theme';

interface DayData {
  date: Date;
  amount: number;
}

export interface SavingsHeatmapCalendarProps {
  data: DayData[];
  monthsToShow?: number;
}

export function SavingsHeatmapCalendar({ data, monthsToShow = 3 }: SavingsHeatmapCalendarProps) {
  // Calculate max amount for color scaling
  const maxAmount = Math.max(...data.map(d => d.amount), 1);

  // Create a map for quick lookup
  const dataMap = new Map(
    data.map(d => [d.date.toDateString(), d.amount])
  );

  // Generate months
  const now = new Date();
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1 - i), 1);
    return date;
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getColorForAmount = (amount: number) => {
    if (amount === 0) return 'rgba(255, 255, 255, 0.03)';

    const intensity = amount / maxAmount;

    if (intensity < 0.2) return `${theme.colors.success}20`;
    if (intensity < 0.4) return `${theme.colors.success}40`;
    if (intensity < 0.6) return `${theme.colors.success}60`;
    if (intensity < 0.8) return `${theme.colors.success}80`;
    return theme.colors.success;
  };

  const cellSize = 32;
  const cellGap = 4;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-8 p-4">
        {months.map((monthDate, monthIndex) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const daysInMonth = getDaysInMonth(year, month);
          const firstDayOfWeek = getFirstDayOfWeek(year, month);

          return (
            <div key={monthIndex}>
              {/* Month header */}
              <h3 className="text-sm font-semibold text-white mb-3">
                {monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </h3>

              <div className="flex gap-4">
                {/* Day of week labels */}
                <div className="flex flex-col gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-400 flex items-center justify-end"
                      style={{ height: `${cellSize}px`, width: '20px' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil((daysInMonth + firstDayOfWeek) / 7)}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(7, ${cellSize}px)`,
                    gap: `${cellGap}px`
                  }}
                >
                  {Array.from({ length: firstDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const amount = dataMap.get(date.toDateString()) || 0;
                    const color = getColorForAmount(amount);

                    const isToday =
                      date.getDate() === now.getDate() &&
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear();

                    return (
                      <div
                        key={day}
                        className="group relative cursor-pointer rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          border: isToday ? `2px solid ${theme.colors.info}` : '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={`${date.toLocaleDateString('en-US')}: $${amount.toFixed(2)}`}
                      >
                        <span className="text-xs text-white/70 group-hover:text-white">
                          {day}
                        </span>

                        {/* Tooltip */}
                        {amount > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div
                              className="px-3 py-2 rounded text-xs whitespace-nowrap"
                              style={{
                                backgroundColor: 'rgba(10, 14, 26, 0.95)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <div className="font-semibold text-white mb-1">
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div style={{ color: theme.colors.success }}>
                                ${amount.toFixed(2)} saved
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          <span className="text-xs text-gray-400">Savings:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Low</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: getColorForAmount(maxAmount * intensity)
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">High</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div
              className="w-4 h-4 rounded"
              style={{
                border: `2px solid ${theme.colors.info}`,
                backgroundColor: 'transparent'
              }}
            />
            <span className="text-xs text-gray-400">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
