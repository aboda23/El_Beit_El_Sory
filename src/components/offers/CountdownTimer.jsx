import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

export function CountdownTimer({ endsAt, className = '' }) {
  const { formatted, isExpired } = useCountdown(endsAt);

  if (isExpired) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>Offer Expired</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-accent tracking-wide ${className}`}>
      <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>Ends in {formatted}</span>
    </span>
  );
}

export default CountdownTimer;
