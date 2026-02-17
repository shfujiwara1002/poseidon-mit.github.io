import React, { useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Mobile bottom-sheet overlay.
 * On desktop, renders children in a centered modal instead.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  const isMobile = useIsMobile();
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  const panelClass = isMobile ? 'bottom-sheet' : 'modal';

  return (
    <div className="overlay overlay--sheet" onClick={onClose} role="presentation">
      <div
        ref={sheetRef}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile && <div className="bottom-sheet__handle" />}
        {title && <h2 className="bottom-sheet__title">{title}</h2>}
        <div className="bottom-sheet__body">{children}</div>
      </div>
    </div>
  );
};
