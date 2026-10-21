import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const variants = {
    default: 'bg-bg-subtle text-text-secondary border border-border-dark',
    accent: 'bg-accent/15 text-accent border border-accent/30',
    discount: 'bg-red-500/20 text-red-400 border border-red-500/30 font-semibold',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    outOfStock: 'bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium',
    popular: 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-sm',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-xl gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium select-none ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
