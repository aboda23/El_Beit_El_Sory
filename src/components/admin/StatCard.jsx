import React from 'react';

export function StatCard({
  title,
  value,
  change = null,
  isPositive = true,
  icon: Icon,
  subtitle = null,
  className = '',
}) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-bg-card border border-border-dark shadow-card space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-text-secondary">
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-bg-secondary text-accent border border-border-dark">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;
