import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-bg-card border border-border-dark rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all duration-250 animate-fade-in my-auto ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-dark/80 bg-bg-secondary/40">
            <div>
              {title && (
                <h3 className="text-lg font-bold text-text-primary tracking-tight font-display">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-text-secondary mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-cardHover border border-transparent hover:border-border-dark transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
