import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
};

/**
 * Modal — centered dialog overlay.
 * Delegates to Radix Dialog for a11y, focus trapping, and scroll lock.
 */
export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose?.(); }}>
      <DialogContent className="modal">
        <div className="modal-handle" aria-hidden="true" />
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div style={{ marginTop: title ? 0 : 12 }}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
