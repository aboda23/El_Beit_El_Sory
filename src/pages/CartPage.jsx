import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, cartSummary, clearCart, t, isRTL } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title={t('cartEmptyTitle')}
          description={t('cartEmptyDesc')}
          actionText={t('browseMenuBtn')}
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Header matching Mockup 4 */}
      <div className="flex items-center justify-between pb-3 border-b border-border-dark">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
            aria-label="Back to menu"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary font-display">
              {t('yourCart')}
            </h1>
            <p className="text-xs text-text-muted">
              {cartSummary.totalItems} {t('itemsInTray')}
            </p>
          </div>
        </div>

        {/* Clear Cart Action with Dialog */}
        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('clear')}</span>
        </button>
      </div>

      {/* Grid: Cart Items on left, Cart Summary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Summary Card */}
        <div className="lg:col-span-5 sticky top-24">
          <CartSummary
            appliedPromo={appliedPromo}
            onApplyPromo={(promo) => setAppliedPromo(promo)}
            onProceed={() => navigate('/checkout')}
          />
        </div>
      </div>

      {/* Confirm Clear Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
        }}
        title={isRTL ? 'تفريغ السلة بالكامل؟' : 'Clear entire cart?'}
        message={isRTL ? 'هل أنت متأكد من رغبتك في حذف جميع الوجبات والإضافات من صينيتك؟' : 'Are you sure you want to remove all selected items and extras from your tray?'}
        confirmText={isRTL ? 'نعم، أفرغ السلة' : 'Yes, Clear Cart'}
        cancelText={isRTL ? 'إلغاء والاحتفاظ بالوجبات' : 'Keep Items'}
        type="danger"
      />
    </div>
  );
}

export default CartPage;
