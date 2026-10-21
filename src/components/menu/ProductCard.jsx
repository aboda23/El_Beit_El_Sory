import React, { useState } from 'react';
import { Plus, Star, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProductPrice } from '../../utils/offerUtils';
import { formatCurrency } from '../../utils/formatCurrency';

export function ProductCard({
  product,
  onOpenDetails,
  className = '',
}) {
  const { activeOffers, addToCart, settings, t } = useApp();
  const [imageError, setImageError] = useState(false);

  const priceCalc = calculateProductPrice(product, activeOffers);
  const isOutOfStock = !product.isAvailable;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // If product has optional extras, open the modal to let user choose!
    if (product.addons && product.addons.length > 0) {
      onOpenDetails?.(product);
    } else {
      addToCart(product, 1, []);
    }
  };

  // Safe fallback placeholder if external food image fails to load
  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  return (
    <div
      onClick={() => onOpenDetails?.(product)}
      className={`group relative bg-bg-card hover:bg-bg-cardHover border border-border-dark hover:border-border-light rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-card select-none ${
        isOutOfStock ? 'opacity-70 grayscale-[0.85]' : 'hover:-translate-y-1'
      } ${className}`}
    >
      <div>
        {/* Product Image Container */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-bg-secondary mb-3">
          <img
            src={imageError ? fallbackImage : (product.image || fallbackImage)}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale contrast-75' : ''
            }`}
          />

          {/* Discount Badge */}
          {priceCalc.hasDiscount && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              -{priceCalc.discountPercent}%
            </div>
          )}

          {/* Out of Stock Overlay Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2">
              <span className="bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[11px] font-bold px-2.5 py-1 rounded-lg text-center tracking-wide uppercase">
                {t('outOfStock', 'Out of Stock')}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && !priceCalc.hasDiscount && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-accent/90 backdrop-blur-sm text-black text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              {t('popularBadge', '★ Popular')}
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-sm sm:text-base text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5 leading-relaxed">
          {product.description}
        </p>

        {/* Rating & Reviews */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-text-muted">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-text-secondary">{product.rating}</span>
            {product.reviewsCount && <span>({product.reviewsCount})</span>}
          </div>
        )}
      </div>

      {/* Price & Action Row */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-dark/60">
        <div>
          <span className="font-extrabold text-sm sm:text-base text-accent">
            {formatCurrency(priceCalc.discountedPrice, settings?.currency || 'EGP')}
          </span>
          {priceCalc.hasDiscount && (
            <span className="block text-[11px] text-text-muted line-through">
              {formatCurrency(priceCalc.originalPrice, settings?.currency || 'EGP')}
            </span>
          )}
        </div>

        {/* Add Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
            isOutOfStock
              ? 'bg-bg-subtle text-text-muted cursor-not-allowed opacity-50'
              : 'bg-accent hover:bg-accent-hover text-black shadow-md shadow-accent/20 active:scale-90 hover:scale-105'
          }`}
        >
          {isOutOfStock ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
