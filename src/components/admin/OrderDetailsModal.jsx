import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Phone, MapPin, Clock, Bike, ShoppingBag, FileText, CheckCircle2 } from 'lucide-react';

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}) {
  const { updateOrderStatus, settings } = useApp();

  if (!order) return null;

  const statuses = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: ${order.orderReference || order.id}`}
      subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Status Changer Bar */}
        <div className="p-3.5 rounded-2xl bg-bg-secondary border border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-text-secondary">
            Change Order Status:
          </span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-bg-card border border-border-dark text-accent font-bold text-xs rounded-xl p-2.5 focus:outline-none focus:border-accent"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-bg-secondary p-3.5 rounded-2xl border border-border-dark space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
              Customer Information
            </span>
            <p className="font-bold text-text-primary text-sm">{order.customer?.name}</p>
            <p className="flex items-center gap-1.5 text-text-secondary text-xs">
              <Phone className="w-3.5 h-3.5 text-accent" />
              <a href={`tel:${order.customer?.phone}`} className="hover:underline">
                {order.customer?.phone}
              </a>
            </p>
          </div>

          <div className="bg-bg-secondary p-3.5 rounded-2xl border border-border-dark space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
              Fulfillment Method
            </span>
            <div className="flex items-center gap-1.5 font-bold text-text-primary text-sm">
              {order.fulfillmentMethod === 'delivery' ? (
                <>
                  <Bike className="w-4 h-4 text-accent" />
                  <span>Campus Delivery</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-accent" />
                  <span>Branch Pickup</span>
                </>
              )}
            </div>
            {order.fulfillmentMethod === 'delivery' && (
              <p className="flex items-start gap-1.5 text-text-secondary text-xs">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span className="line-clamp-2">{order.deliveryAddress || 'Address not provided'}</span>
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Items Ordered ({order.items?.length || 0})
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-bg-secondary border border-border-dark flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-text-primary">
                    {item.name} × {item.quantity}
                  </span>
                  {item.extras && item.extras.length > 0 && (
                    <span className="block text-[11px] text-text-muted">
                      + {item.extras.map((e) => e.name).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-bold text-accent">
                  {formatCurrency(item.price * item.quantity, settings?.currency || 'EGP')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes if any */}
        {order.notes && (
          <div className="p-3 rounded-xl bg-bg-secondary/60 border border-border-dark text-xs flex items-start gap-2">
            <FileText className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-primary">Customer Note:</span>
              <p className="text-text-secondary mt-0.5 italic">"{order.notes}"</p>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="p-4 rounded-2xl bg-bg-secondary border border-border-dark space-y-2 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(order.subtotal, settings?.currency || 'EGP')}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount</span>
              <span className="font-semibold">
                -{formatCurrency(order.discount, settings?.currency || 'EGP')}
              </span>
            </div>
          )}
          <div className="flex justify-between text-text-secondary">
            <span>Delivery Fee</span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(order.deliveryFee, settings?.currency || 'EGP')}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border-dark/60 text-sm font-extrabold">
            <span className="text-text-primary">Total Paid / Due</span>
            <span className="text-accent">
              {formatCurrency(order.total, settings?.currency || 'EGP')}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;
