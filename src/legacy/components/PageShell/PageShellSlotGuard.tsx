import { useEffect, useRef } from 'react';
import type { RequiredSlot } from '../../contracts/screen-contract';
import { usePageShell } from './PageShell';

/**
 * PageShellSlotGuard — Validates that all required data-slot DOM nodes
 * are present within the PageShell container.
 *
 * In development: logs console.warn for missing optional slots,
 * console.error for missing interactive slots (consent_scope,
 * action_preview, factors_dropdown, decision_rail).
 *
 * This component renders nothing — it's a side-effect-only validator.
 */

const INTERACTIVE_SLOTS: ReadonlySet<RequiredSlot> = new Set([
  'consent_scope',
  'action_preview',
  'factors_dropdown',
  'decision_rail',
]);

export function PageShellSlotGuard() {
  const { contract, slug } = usePageShell();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (import.meta.env.PROD) return;
    const debugEnabled = import.meta.env.VITE_DEBUG_SLOT_GUARD === '1';
    if (!debugEnabled) return;

    // Walk up to find the entry-screen container
    const root = containerRef.current?.closest('.entry-screen');
    if (!root) return;

    const policyBySlot = new Map(
      (contract.interactiveSlotPolicy ?? []).map((policy) => [policy.slot, policy]),
    );

    const allSlots = contract.requiredSlots;
    for (const slot of allSlots) {
      const node = root.querySelector(`[data-slot="${slot}"]`);
      if (!node) {
        const isInteractive = INTERACTIVE_SLOTS.has(slot) || policyBySlot.has(slot);
        const msg = `[PageShell/${slug}] Missing data-slot="${slot}"${isInteractive ? ' (interactive — required)' : ''}`;
        if (isInteractive) {
          console.error(msg);
        } else {
          console.warn(msg);
        }
        continue;
      }

      if (INTERACTIVE_SLOTS.has(slot) || policyBySlot.has(slot)) {
        const slotPolicy = policyBySlot.get(slot);
        const hasText = (node.textContent ?? '').trim().length > 0;
        const hasInteractiveChild = Boolean(
          node.querySelector('button,a,input,select,textarea,[role="button"],[role="link"]'),
        );
        const minimumInteractive = slotPolicy?.minInteractiveChildren ?? 0;
        const interactiveChildren = node.querySelectorAll(
          'button,a,input,select,textarea,[role="button"],[role="link"]',
        ).length;
        const mustBeNonEmpty = slotPolicy?.mustBeNonEmpty ?? true;

        if (mustBeNonEmpty && !hasText && !hasInteractiveChild) {
          console.error(`[PageShell/${slug}] Empty interactive slot data-slot="${slot}"`);
        }
        if (minimumInteractive > 0 && interactiveChildren < minimumInteractive) {
          console.error(
            `[PageShell/${slug}] data-slot="${slot}" requires at least ${minimumInteractive} interactive child nodes`,
          );
        }
      }
    }
  }, [contract.interactiveSlotPolicy, contract.requiredSlots, slug]);

  return <div ref={containerRef} style={{ display: 'none' }} aria-hidden="true" />;
}
