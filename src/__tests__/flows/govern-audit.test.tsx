import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import GovernTrust from '../../pages/GovernTrust';
import GovernAuditLedger from '../../pages/GovernAuditLedger';
import GovernAuditDetail from '../../pages/GovernAuditDetail';

/**
 * Govern audit flow: GOV01 → GOV02 → GOV03.
 * Decision → Audit → Review chain.
 */
describe('Govern audit flow', () => {
  function renderWithRouter(Component: React.ComponentType) {
    return render(
      <RouterProvider>
        <Component />
      </RouterProvider>,
    );
  }

  describe('GOV01 - Trust Dashboard', () => {
    it('displays trust score', () => {
      renderWithRouter(GovernTrust);
      // "97" appears in hero KPIs + main content — use getAllByText
      expect(screen.getAllByText(/97/).length).toBeGreaterThan(0);
    });

    it('shows trust components', () => {
      renderWithRouter(GovernTrust);
      // These may appear in both hero KPIs and trust components table
      expect(screen.getAllByText(/Accuracy/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Transparency/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fairness/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Compliance/i).length).toBeGreaterThan(0);
    });

    it('has governance contract set', () => {
      const { container } = renderWithRouter(GovernTrust);
      expect(container.querySelector('footer[aria-label="Governance verification footer"]')).not.toBeNull();
    });
  });

  describe('GOV02 - Audit Ledger', () => {
    it('renders audit records', () => {
      renderWithRouter(GovernAuditLedger);
      expect(screen.getAllByText(/Audit ledger/i).length).toBeGreaterThan(0);
    });

    it('shows engine type for records', () => {
      renderWithRouter(GovernAuditLedger);
      expect(screen.getAllByText(/protect/i).length).toBeGreaterThan(0);
    });

    it('has governance contract set', () => {
      const { container } = renderWithRouter(GovernAuditLedger);
      expect(container.querySelector('footer[aria-label="Governance verification footer"]')).not.toBeNull();
    });
  });

  describe('GOV03 - Audit Detail', () => {
    it('shows decision reconstruction', () => {
      renderWithRouter(GovernAuditDetail);
      expect(screen.getAllByText(/Decision reconstruction/i).length).toBeGreaterThan(0);
    });

    it('shows compliance flags', () => {
      renderWithRouter(GovernAuditDetail);
      expect(screen.getAllByText(/GDPR/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/ECOA/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CCPA/i).length).toBeGreaterThan(0);
    });

    it('all compliance flags show compliant', () => {
      renderWithRouter(GovernAuditDetail);
      const compliantElements = screen.getAllByText(/Compliant/i);
      expect(compliantElements.length).toBe(3);
    });

    it('has governance contract set', () => {
      const { container } = renderWithRouter(GovernAuditDetail);
      expect(container.querySelector('footer[aria-label="Governance verification footer"]')).not.toBeNull();
    });
  });
});
