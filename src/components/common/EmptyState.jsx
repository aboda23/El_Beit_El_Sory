import React from 'react';
import Button from './Button';
import { UtensilsCrossed } from 'lucide-react';

export function EmptyState({
  icon: Icon = UtensilsCrossed,
  title = 'No items found',
  description = 'Try adjusting your search or category filters.',
  actionText = null,
  onAction = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-bg-card/50 border border-border-dark ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-muted border border-border-dark mb-4">
        <Icon className="w-8 h-8 opacity-70" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1.5 font-display">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
