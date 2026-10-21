import React, { useState } from 'react';
import { Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

export function CartItem({ item }) {
  const { updateCartQuantity, removeFromCart, settings } = useApp();
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  const isOutOfStock = item.isAvailable === false;

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl bg-bg-card border transition-all ${
        isOutOfStock
          ? 'border-red-500/40 bg-red-950/10'
          : 'border-border-dark hover:border-border-light'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-bg-secondary shrink-0">
          <img
            src={imgError ? fallbackImage : (item.image || fallbackImage)}
            alt={item.name}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-text-primary truncate">
                {item.name}
              </h4>
              {/* Extras list */}
              {item.extras && item.extras.length > 0 && (
                <p className="text-xs text-text-secondary mt-0.5 truncate">
                  + {item.extras.map((e) => e.name).join(', ')}
                </p>
              )}
              {/* Optional customer note */}
              {item.notes && (
                <p className="text-[11px] text-accent italic mt-0.5 truncate">
                  "{item.notes}"
                </p>
              )}
            </div>

            {/* Remove / Trash Button */}
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="text-text-muted hover:text-red-400 p-1 rounded-lg hover:bg-bg-cardHover transition-colors shrink-0"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Out of stock. Please remove before checkout.</span>
            </div>
          )}

          {/* Price & Quantity Controls */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-dark/50">
            <div>
              <span className="font-extrabold text-sm sm:text-base text-accent">
                {formatCurrency(item.price * item.quantity, settings?.currency || 'EGP')}
              </span>
              {item.quantity > 1 && (
                <span className="block text-[11px] text-text-muted">
                  {formatCurrency(item.price, settings?.currency || 'EGP')} each
                </span>
              )}
            </div>

            {/* Quantity +/- Buttons */}
            <div className="flex items-center bg-bg-secondary border border-border-dark rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => updateCartQuantity(item.id, -1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-text-primary">
                {item.quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => updateCartQuantity(item.id, 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-card disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
