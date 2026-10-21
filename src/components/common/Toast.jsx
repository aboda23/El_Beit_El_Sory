import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        let borderColor = 'border-emerald-500/30';
        let bgGlow = 'bg-emerald-500/10';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
          borderColor = 'border-red-500/30';
          bgGlow = 'bg-red-500/10';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderColor = 'border-amber-500/30';
          bgGlow = 'bg-amber-500/10';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
          borderColor = 'border-blue-500/30';
          bgGlow = 'bg-blue-500/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-bg-card/95 backdrop-blur-md border ${borderColor} shadow-xl text-text-primary text-sm animate-fade-in transition-all`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg ${bgGlow}`}>
                {icon}
              </div>
              <p className="font-medium text-xs sm:text-sm text-text-primary leading-tight">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-cardHover transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
