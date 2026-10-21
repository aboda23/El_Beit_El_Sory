import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import { Tag, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function CartSummary({
  fulfillmentMethod = 'delivery',
  appliedPromo = null,
  onApplyPromo = null,
  onProceed = null,
  isCheckoutPage = false,
}) {
  const { cartSummary, settings, showToast, t, isRTL } = useApp();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(appliedPromo ? appliedPromo.code : '');
  const [promoDiscount, setPromoDiscount] = useState(appliedPromo ? appliedPromo.amount : 0);

  const deliveryFee = fulfillmentMethod === 'delivery' ? (settings?.deliveryFee || 15) : 0;
  const subtotal = cartSummary.subtotal;
  const finalTotal = Math.max(0, subtotal - promoDiscount + deliveryFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'CAMPUS10' || clean === 'STUDENT10') {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoSuccess(clean);
      showToast(`Promo ${clean} applied! Saved ${formatCurrency(discount, settings?.currency)}`, 'success');
      onApplyPromo?.({ code: clean, amount: discount });
    } else if (clean === 'FREEDEL') {
      setPromoDiscount(deliveryFee);
      setPromoSuccess(clean);
      showToast('Free delivery promo applied!', 'success');
      onApplyPromo?.({ code: clean, amount: deliveryFee });
    } else {
      showToast('Invalid promo code. Try "STUDENT10" or "FREEDEL"', 'error');
    }
  };

  const handleProceedClick = () => {
    if (cartSummary.hasUnavailableItems) {
      showToast(t('outOfStockInCart'), 'error');
      return;
    }
    if (onProceed) {
      onProceed();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      {/* Promo Code Form (only on Cart or if enabled) */}
      {!isCheckoutPage && (
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-accent" />
            <span>{t('havePromo')}</span>
          </label>
          <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="e.g. STUDENT10"
              className="flex-1 bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs uppercase font-medium rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
            <Button type="submit" variant="secondary" size="sm" className="px-4">
              {t('apply')}
            </Button>
          </form>
          {promoSuccess && (
            <p className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Promo {promoSuccess} active (-{formatCurrency(promoDiscount, settings?.currency)})</span>
            </p>
          )}
        </div>
      )}

      {/* Breakdown List */}
      <div className="space-y-3 pt-3 border-t border-border-dark/60 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span>{t('subtotal')} ({cartSummary.totalItems} {t('itemsCount', 'items')})</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(subtotal, settings?.currency || 'EGP')}
          </span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-400">
            <span>{t('promoDiscount')}</span>
            <span className="font-semibold">
              -{formatCurrency(promoDiscount, settings?.currency || 'EGP')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-text-secondary">
          <span>{t('fulfillment')} ({fulfillmentMethod === 'delivery' ? t('delivery') : t('branchPickup')})</span>
          <span className="font-semibold text-text-primary">
            {fulfillmentMethod === 'delivery'
              ? formatCurrency(deliveryFee, settings?.currency || 'EGP')
              : t('free')}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-border-dark text-base sm:text-lg font-extrabold">
          <span className="text-text-primary">{t('total')}</span>
          <span className="text-accent">
            {formatCurrency(finalTotal, settings?.currency || 'EGP')}
          </span>
        </div>
      </div>

      {/* Unavailable Items Alert */}
      {cartSummary.hasUnavailableItems && (
        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>
            {t('outOfStockInCart')}
          </span>
        </div>
      )}

      {/* Checkout Action Button */}
      {!isCheckoutPage && (
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={cartSummary.totalItems === 0 || cartSummary.hasUnavailableItems}
          onClick={handleProceedClick}
          className="shadow-glow-accent group"
        >
          <span>{t('proceedToCheckout')}</span>
          <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
        </Button>
      )}
    </div>
  );
}

export default CartSummary;
