import { useTheme } from '../contexts/ThemeContext';
import { theme } from '../shared/theme';

export function ThemeToggle() {
  const { mode, effectiveTheme, setMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Theme Mode Selector */}
      <div
        className="flex items-center rounded-lg p-1"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <button
          onClick={() => setMode('light')}
          className="px-3 py-1.5 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: mode === 'light' ? theme.colors.warning : 'transparent',
            color: mode === 'light' ? '#000' : '#999'
          }}
          title="Light Mode"
        >
          ☀️
        </button>
        <button
          onClick={() => setMode('system')}
          className="px-3 py-1.5 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: mode === 'system' ? theme.colors.info : 'transparent',
            color: mode === 'system' ? '#000' : '#999'
          }}
          title="System"
        >
          💻
        </button>
        <button
          onClick={() => setMode('dark')}
          className="px-3 py-1.5 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: mode === 'dark' ? theme.colors.neutral : 'transparent',
            color: mode === 'dark' ? '#fff' : '#999'
          }}
          title="Dark Mode"
        >
          🌙
        </button>
      </div>

      {/* Current Theme Indicator */}
      <span className="text-xs text-gray-400">
        {effectiveTheme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </div>
  );
}
