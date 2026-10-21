import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateProductPrice } from '../utils/offerUtils';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft, Star, Plus, Minus, Check, AlertCircle } from 'lucide-react';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, activeOffers, addToCart, settings } = useApp();

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [notes, setNotes] = useState('');
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          title="Product not found"
          description="The meal you are looking for does not exist or has been removed."
          actionText="Back to Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  const isOutOfStock = !product.isAvailable;
  const priceCalc = calculateProductPrice(product, activeOffers);

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
    const ok = addToCart(product, quantity, selectedExtras, notes);
    if (ok) {
      navigate('/cart');
    }
  };

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/menu')}
        className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-8 shadow-card">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg-secondary border border-border-dark">
          <img
            src={imageError ? fallbackImage : (product.image || fallbackImage)}
            alt={product.name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
              <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-xl uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isFeatured && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-accent text-black uppercase">
                  Popular
                </span>
              )}
              {priceCalc.hasDiscount && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                  -{priceCalc.discountPercent}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-text-primary">{product.rating}</span>
                <span className="text-text-muted">({product.reviewsCount || 100}+ reviews)</span>
              </div>
            )}

            <div className="mt-3">
              <span className="text-2xl font-black text-accent">
                {formatCurrency(singleItemPrice, settings?.currency || 'EGP')}
              </span>
              {priceCalc.hasDiscount && (
                <span className="ml-2 text-sm text-text-muted line-through">
                  {formatCurrency(singleItemOriginalPrice, settings?.currency || 'EGP')}
                </span>
              )}
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mt-4">
              {product.description}
            </p>
          </div>

          {/* Extras */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border-dark/60">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Select Extras
              </h3>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isChecked = selectedExtras.some((e) => e.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleExtra(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-accent/10 border-accent text-text-primary'
                          : 'bg-bg-secondary/60 hover:bg-bg-secondary border-border-dark text-text-secondary'
                      } ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}
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
                        <span className="text-xs sm:text-sm font-medium">{addon.name}</span>
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

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              value={notes}
              disabled={isOutOfStock}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra napkins, no sauce..."
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-4 border-t border-border-dark">
            <div className="flex items-center bg-bg-secondary border border-border-dark rounded-xl p-1">
              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30"
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
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'Out of Stock' : `Add to Cart • ${formatCurrency(totalPrice, settings?.currency || 'EGP')}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
