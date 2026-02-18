import React from 'react';
import { Link } from '../router';

interface Swatch { label: string; token: string; oklch: string }

const groups: { title: string; swatches: Swatch[] }[] = [
  { title: 'Engine Colors', swatches: [
    { label: 'Protect',  token: '--engine-protect', oklch: 'oklch(0.70 0.18 155)' },
    { label: 'Grow',     token: '--engine-grow',    oklch: 'oklch(0.58 0.22 285)' },
    { label: 'Execute',  token: '--engine-execute', oklch: 'oklch(0.80 0.16 95)' },
    { label: 'Govern',   token: '--engine-govern',  oklch: 'oklch(0.62 0.18 250)' },
  ]},
  { title: 'Accent Colors', swatches: [
    { label: 'Cyan',   token: '--accent-cyan',   oklch: 'oklch(0.85 0.18 195)' },
    { label: 'Teal',   token: '--accent-teal',   oklch: 'oklch(0.70 0.18 155)' },
    { label: 'Violet', token: '--accent-violet', oklch: 'oklch(0.58 0.22 285)' },
    { label: 'Amber',  token: '--accent-amber',  oklch: 'oklch(0.80 0.16 95)' },
    { label: 'Blue',   token: '--accent-blue',   oklch: 'oklch(0.62 0.18 250)' },
    { label: 'Red',    token: '--accent-red',    oklch: 'oklch(0.63 0.24 28)' },
  ]},
  { title: 'State Colors', swatches: [
    { label: 'Healthy',  token: '--state-healthy',  oklch: '#14B8A6' },
    { label: 'Warning',  token: '--state-warning',  oklch: '#F59E0B' },
    { label: 'Critical', token: '--state-critical', oklch: '#EF4444' },
    { label: 'Primary',  token: '--state-primary',  oklch: 'var(--engine-govern)' },
  ]},
  { title: 'Surface / Glass', swatches: [
    { label: 'Surface BG',     token: '--ds-surface-bg',     oklch: 'oklch(0.18 0.02 250 / 0.6)' },
    { label: 'Surface Border', token: '--ds-surface-border', oklch: 'oklch(1 0 0 / 0.08)' },
  ]},
];

const SwatchCard: React.FC<{ s: Swatch }> = ({ s }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
    <div
      style={{
        width: 40, height: 40, borderRadius: 8,
        background: `var(${s.token})`,
        border: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
      <div style={{ fontSize: 12, opacity: 0.5, fontFamily: 'monospace' }}>{s.token}</div>
      <div style={{ fontSize: 11, opacity: 0.4, fontFamily: 'monospace' }}>{s.oklch}</div>
    </div>
  </div>
);

export const DesignSystemTokensColors: React.FC = () => (
  <div style={{ minHeight: '100vh', padding: '48px 24px', color: 'rgba(255,255,255,0.92)' }}>
    <header style={{ maxWidth: 720, margin: '0 auto 40px' }}>
      <Link to="/design-system/tokens" style={{ fontSize: 13, opacity: 0.5, textDecoration: 'none', color: 'inherit' }}>
        Tokens
      </Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>Color Tokens</h1>
    </header>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gap: 32 }}>
      {groups.map((g) => (
        <section key={g.title}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
            {g.title}
          </h2>
          {g.swatches.map((s) => <SwatchCard key={s.token} s={s} />)}
        </section>
      ))}
    </div>
  </div>
);

export default DesignSystemTokensColors;
