import React from 'react';
import { cn } from '@/lib/utils';

interface AuditChipProps {
  label?: string;
  auditId?: string;
  verified?: boolean;
  className?: string;
}

export const AuditChip: React.FC<AuditChipProps> = ({ label, auditId, verified = false, className }) => {
  const text = label ?? (verified ? 'Govern-Verified' : 'Pending');
  return (
    <span className={cn('audit-chip', verified && 'audit-chip-verified', className)}>
      {text}{auditId ? ` \u2014 Audit ID ${auditId}` : ''}
    </span>
  );
};
