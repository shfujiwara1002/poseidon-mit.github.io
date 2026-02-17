import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../poseidon/glass-card';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <p>Card content</p>
      </GlassCard>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies glass morphism styles', () => {
    const { container } = render(
      <GlassCard>
        <p>Content</p>
      </GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.style.backdropFilter).toBe('blur(24px)');
    expect(card.style.background).toContain('rgba');
  });

  it('applies borderColor as left border accent', () => {
    const { container } = render(
      <GlassCard borderColor="#8B5CF6">
        <p>Content</p>
      </GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.style.borderLeftWidth).toBe('2px');
    // jsdom normalizes hex to rgb
    expect(card.style.borderLeftColor).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlassCard className="custom-card-class">
        <p>Content</p>
      </GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-card-class');
  });

  it('has rounded border classes', () => {
    const { container } = render(
      <GlassCard>
        <p>Content</p>
      </GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('rounded-2xl');
    expect(card.className).toContain('border');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <GlassCard data-testid="glass-test" aria-label="test card">
        <p>Content</p>
      </GlassCard>
    );
    const card = screen.getByTestId('glass-test');
    expect(card).toHaveAttribute('aria-label', 'test card');
  });
});
