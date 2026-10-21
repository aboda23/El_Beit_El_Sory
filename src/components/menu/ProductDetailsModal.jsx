import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, Check, Flame, Clock, Heart, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProductPrice } from '../../utils/offerUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}) {
  const { activeOffers, addToCart, settings, t } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [notes, setNotes] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset local state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedExtras([]);
      setNotes('');
      setShowNutrition(false);
      setImageError(false);
    }
  }, [product, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isOutOfStock = !product.isAvailable;
  const priceCalc = calculateProductPrice(product, activeOffers);

  // Extras calculation
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + (Number(e.price) || 0), 0);
  const singleItemPrice = priceCalc.discountedPrice + extrasTotal;
  const singleItemOriginalPrice = priceCalc.originalPrice + extrasTotal;
  const totalPrice = singleItemPrice * quantity;

  const handleToggleExtra = (addon) => {
    if (isOutOfStock) return;
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === addon.id);
      if (exists) {
        return prev.filter((e) => e.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity, selectedExtras, notes);
    if (success) {
      onClose();
    }
  };

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-bg-card border border-border-dark rounded-3xl shadow-2xl z-10 overflow-hidden animate-fade-in my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Header / Image Area */}
        <div className="relative w-full h-56 sm:h-64 bg-bg-secondary shrink-0">
          <img
            src={imageError ? fallbackImage : (product.image || fallbackImage)}
            alt={product.name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale contrast-75' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-black/20 to-black/60" />

          {/* Close & Action Buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all border border-white/10"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {product.isFeatured && (
                <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Popular
                </span>
              )}
            </div>
          </div>

          {/* Out of stock Banner on Image */}
          {isOutOfStock && (
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 border border-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-xl text-center shadow-lg flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-zinc-400" />
              <span>{t('outOfStockBanner')}</span>
            </div>
          )}
        </div>

        {/* Scrollable Details Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
          {/* Title & Price Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight font-display">
                  {product.name}
                </h2>
                {product.rating && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-text-secondary">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                    <span className="font-bold text-text-primary">{product.rating}</span>
                    <span className="text-text-muted">({product.reviewsCount || 100}+ {t('studentReviews')})</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-extrabold text-accent">
                  {formatCurrency(singleItemPrice, settings?.currency || 'EGP')}
                </span>
                {priceCalc.hasDiscount && (
                  <span className="block text-xs text-text-muted line-through">
                    {formatCurrency(singleItemOriginalPrice, settings?.currency || 'EGP')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-3">
              {product.description}
            </p>
          </div>

          {/* Extras / Add-ons Selection */}
          {product.addons && product.addons.length > 0 && (
            <div className="pt-2 border-t border-border-dark/60">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-sm font-bold text-text-primary">
                  {t('extrasAndAddons')}
                </h4>
                <span className="text-[11px] text-text-muted font-medium">{t('optional')}</span>
              </div>

              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isChecked = selectedExtras.some((e) => e.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleExtra(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-accent/10 border-accent/40 text-text-primary'
                          : 'bg-bg-secondary/60 hover:bg-bg-secondary border-border-dark text-text-secondary'
                      } ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-accent text-black font-bold'
                              : 'border border-border-dark bg-bg-card'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-accent">
                        +{formatCurrency(addon.price, settings?.currency || 'EGP')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes / Instructions */}
          <div className="pt-2 border-t border-border-dark/60">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              {t('specialInstructions')}
            </label>
            <input
              type="text"
              value={notes}
              disabled={isOutOfStock}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('specialInstructionsPlaceholder')}
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Nutritional Info Accordion */}
          {product.nutritionalInfo && (
            <div className="border border-border-dark/60 rounded-xl overflow-hidden bg-bg-secondary/40">
              <button
                type="button"
                onClick={() => setShowNutrition(!showNutrition)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>{t('nutritionInfo')}</span>
                {showNutrition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showNutrition && (
                <div className="px-3 pb-3 pt-1 border-t border-border-dark/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-bg-card p-2 rounded-lg">
                    <span className="text-text-muted text-[10px] block">{t('calories')}</span>
                    <span className="font-bold text-accent">{product.nutritionalInfo.calories || '—'}</span>
                  </div>
                  <div className="bg-bg-card p-2 rounded-lg">
                    <span className="text-text-muted text-[10px] block">{t('protein')}</span>
                    <span className="font-bold text-text-primary">{product.nutritionalInfo.protein || '—'}</span>
                  </div>
                  <div className="bg-bg-card p-2 rounded-lg">
                    <span className="text-text-muted text-[10px] block">{t('carbs')}</span>
                    <span className="font-bold text-text-primary">{product.nutritionalInfo.carbs || '—'}</span>
                  </div>
                  <div className="bg-bg-card p-2 rounded-lg">
                    <span className="text-text-muted text-[10px] block">{t('prepTime')}</span>
                    <span className="font-bold text-text-primary">{product.nutritionalInfo.prepTime || '10 mins'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-border-dark bg-bg-secondary/70 shrink-0">
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-bg-card border border-border-dark rounded-xl p-1 shrink-0">
              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-text-primary">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1"
            >
              {isOutOfStock ? (
                t('outOfStock')
              ) : (
                <div className="flex items-center justify-between w-full px-1">
                  <span>{t('addToCart')}</span>
                  <span className="text-black/80 font-bold text-sm">
                    {formatCurrency(totalPrice, settings?.currency || 'EGP')}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
