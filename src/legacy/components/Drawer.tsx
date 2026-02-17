import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type DrawerProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
};

/**
 * Drawer — slide-in side panel.
 * Delegates to Radix Dialog for a11y, focus trapping, and scroll lock.
 */
export const Drawer: React.FC<DrawerProps> = ({ open, title, onClose, children }) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) onClose?.(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'drawer fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-[var(--surface-primary)] p-0 shadow-lg duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          )}
        >
          <div className="engine-meta-row" style={{ padding: '16px' }}>
            <strong>{title}</strong>
            <DialogPrimitive.Close asChild>
              <button className="btn btn-ghost btn-icon" type="button" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div style={{ padding: '0 16px 16px' }}>{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
