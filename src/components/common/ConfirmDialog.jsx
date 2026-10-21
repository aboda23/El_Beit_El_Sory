import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) {
  const icons = {
    danger: <AlertCircle className="w-8 h-8 text-red-400" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-400" />,
    info: <Info className="w-8 h-8 text-blue-400" />
  };

  const buttonVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={!loading}>
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3.5 rounded-2xl bg-bg-secondary border border-border-dark mb-4">
          {icons[type] || icons.danger}
        </div>
        <h4 className="text-lg font-bold text-text-primary mb-2">
          {title}
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            fullWidth
            onClick={() => {
              onConfirm?.();
            }}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
