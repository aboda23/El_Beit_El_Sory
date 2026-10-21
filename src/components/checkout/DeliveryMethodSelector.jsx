import React from 'react';
import { Bike, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useApp } from '../../context/AppContext';

export function DeliveryMethodSelector({
  value = 'delivery',
  onChange,
}) {
  const { settings, t } = useApp();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
        {t('deliveryMethod')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Delivery Option */}
        <label
          onClick={() => onChange('delivery')}
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            value === 'delivery'
              ? 'bg-accent/10 border-accent text-text-primary shadow-sm'
              : 'bg-bg-card hover:bg-bg-cardHover border-border-dark text-text-secondary'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`p-2.5 rounded-xl ${
                value === 'delivery'
                  ? 'bg-accent text-black font-bold'
                  : 'bg-bg-secondary text-text-muted border border-border-dark'
              }`}
            >
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block text-text-primary">
                {t('delivery')}
              </span>
              <span className="text-xs text-text-muted block">
                {settings?.estimatedDeliveryTime || '20-30 mins'} • {formatCurrency(settings?.deliveryFee || 15, settings?.currency || 'EGP')}
              </span>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              value === 'delivery'
                ? 'border-accent bg-accent'
                : 'border-border-dark bg-transparent'
            }`}
          >
            {value === 'delivery' && (
              <div className="w-2 h-2 rounded-full bg-black" />
            )}
          </div>
        </label>

        {/* Pickup Option */}
        <label
          onClick={() => onChange('pickup')}
          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
            value === 'pickup'
              ? 'bg-accent/10 border-accent text-text-primary shadow-sm'
              : 'bg-bg-card hover:bg-bg-cardHover border-border-dark text-text-secondary'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`p-2.5 rounded-xl ${
                value === 'pickup'
                  ? 'bg-accent text-black font-bold'
                  : 'bg-bg-secondary text-text-muted border border-border-dark'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block text-text-primary">
                {t('branchPickup')}
              </span>
              <span className="text-xs text-text-muted block">
                {settings?.estimatedPickupTime || '10-15 mins'} • {t('free')}
              </span>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              value === 'pickup'
                ? 'border-accent bg-accent'
                : 'border-border-dark bg-transparent'
            }`}
          >
            {value === 'pickup' && (
              <div className="w-2 h-2 rounded-full bg-black" />
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

export default DeliveryMethodSelector;
