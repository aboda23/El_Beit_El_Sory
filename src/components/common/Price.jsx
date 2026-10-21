import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export function Price({
  price,
  originalPrice = null,
  currency = 'EGP',
  size = 'md',
  className = '',
  discountPercent = null
}) {
  const hasDiscount = originalPrice !== null && originalPrice > price;

  const sizeStyles = {
    sm: {
      current: 'text-sm font-semibold text-accent',
      original: 'text-xs line-through text-text-muted',
      badge: 'text-[10px] px-1.5 py-0.2',
    },
    md: {
      current: 'text-base font-bold text-accent',
      original: 'text-xs line-through text-text-muted',
      badge: 'text-[11px] px-1.5 py-0.5',
    },
    lg: {
      current: 'text-xl font-extrabold text-accent',
      original: 'text-sm line-through text-text-muted',
      badge: 'text-xs px-2 py-0.5',
    },
    xl: {
      current: 'text-2xl font-extrabold text-accent',
      original: 'text-base line-through text-text-muted',
      badge: 'text-xs px-2 py-0.5',
    }
  };

  const style = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`inline-flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={style.current}>
        {formatCurrency(price, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className={style.original}>
            {formatCurrency(originalPrice, currency)}
          </span>
          {discountPercent ? (
            <span className={`rounded font-semibold bg-red-500/20 text-red-400 border border-red-500/30 ${style.badge}`}>
              -{discountPercent}%
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Price;
