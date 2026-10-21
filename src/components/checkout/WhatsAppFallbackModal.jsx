import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Copy, Check, AlertCircle, Phone, MapPin } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildWhatsAppUrl } from '../../utils/orderFormatter';

export function WhatsAppFallbackModal({
  isOpen,
  onClose,
  order,
  whatsAppUrl,
  whatsAppMessage,
}) {
  const { clearCart, settings, showToast, isRTL, lang } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsAppMessage);
      setCopied(true);
      showToast(isRTL ? 'تم نسخ نص الطلب إلى الحافظة!' : 'Order message copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast(isRTL ? 'فشل النسخ التلقائي، يرجى التحديد والنسخ يدوياً.' : 'Failed to copy. Please manually select the text.', 'error');
    }
  };

  const openWhatsAppNumber = (num) => {
    const url = buildWhatsAppUrl(num, whatsAppMessage);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFinish = () => {
    clearCart();
    onClose();
    navigate('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRTL ? 'تأكيد وإرسال الطلب عبر واتساب' : 'Complete Your Order via WhatsApp'}
      subtitle={`${isRTL ? 'كود الطلب' : 'Order Reference'}: ${order.id}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Important Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-accent mb-0.5">
              {isRTL ? 'الخطوة الأخيرة — اضغط "إرسال" داخل واتساب' : 'Final Step — Tap Send in WhatsApp'}
            </p>
            <p>
              {isRTL
                ? 'تم تجهيز تفاصيل طلبك! اختر رقم الواتساب بالأسفل لفتح المحادثة جاهزة، وتأكد من الضغط على زر الإرسال داخل تطبيق الواتساب ليصل الطلب للمطعم فوراً.'
                : 'Your order is ready! Click below to open WhatsApp with your pre-filled order. Press Send in WhatsApp so our branch staff receives it.'}
            </p>
          </div>
        </div>

        {/* Quick Order Info */}
        <div className="bg-bg-secondary p-4 rounded-2xl border border-border-dark space-y-2 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>{isRTL ? 'العميل:' : 'Customer:'}</span>
            <span className="font-bold text-text-primary">{order.customer?.name} ({order.customer?.phone})</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>{isRTL ? 'طريقة الاستلام:' : 'Fulfillment:'}</span>
            <span className="font-bold text-text-primary uppercase tracking-wide">
              {order.fulfillmentMethod === 'delivery' ? (isRTL ? '🛵 توصيل للجامعة / السكن' : '🛵 Delivery') : (isRTL ? '🛍️ استلام من الفرع' : '🛍️ Branch Pickup')}
            </span>
          </div>
          {order.fulfillmentMethod === 'delivery' && (
            <div className="flex justify-between text-text-secondary">
              <span>{isRTL ? 'العنوان:' : 'Address:'}</span>
              <span className="font-semibold text-text-primary text-right max-w-[200px] truncate">
                {order.deliveryAddress}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border-dark/60 text-sm font-extrabold">
            <span className="text-text-primary">{isRTL ? 'إجمالي الطلب:' : 'Order Total:'}</span>
            <span className="text-accent">{formatCurrency(order.total, settings?.currency || 'EGP')}</span>
          </div>
        </div>

        {/* Restaurant Contact Info */}
        <div className="p-3 rounded-xl bg-bg-card border border-border-dark/80 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-text-muted">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[11px] font-medium text-text-primary">
              {settings?.branchAddress || 'مدينة القنطرة شرق - أمام جامعة سيناء'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[11px]">
              {isRTL ? 'أرقام الطلبات:' : 'Order Lines:'} <strong>01144590527</strong> / <strong>01017753792</strong>
            </span>
          </div>
        </div>

        {/* Main WhatsApp CTAs (Two lines supported) */}
        <div className="space-y-2 pt-1">
          <Button
            variant="whatsapp"
            fullWidth
            size="lg"
            onClick={() => openWhatsAppNumber('201144590527')}
            icon={MessageCircle}
          >
            {isRTL ? 'إرسال الطلب عبر واتساب (خط 1: 01144590527)' : 'Send to WhatsApp Line 1 (01144590527)'}
          </Button>

          <Button
            variant="whatsapp"
            fullWidth
            size="sm"
            onClick={() => openWhatsAppNumber('201017753792')}
            icon={MessageCircle}
            className="opacity-95"
          >
            {isRTL ? 'إرسال الطلب عبر واتساب (خط 2: 01017753792)' : 'Send to WhatsApp Line 2 (01017753792)'}
          </Button>

          {/* Fallback Copy Button */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleCopyMessage}
            icon={copied ? Check : Copy}
          >
            {copied ? (isRTL ? 'تم النسخ بنجاح!' : 'Copied to Clipboard!') : (isRTL ? 'نسخ نص الطلب كاملاً (احتياطي)' : 'Copy Order Text (Fallback)')}
          </Button>
        </div>

        {/* Message Preview Box */}
        <div>
          <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            {isRTL ? 'معاينة نص الرسالة المرسلة:' : 'Formatted Order Preview:'}
          </label>
          <pre className="bg-bg-primary p-3 rounded-xl border border-border-dark text-[11px] font-mono text-text-secondary whitespace-pre-wrap max-h-32 overflow-y-auto no-scrollbar">
            {whatsAppMessage}
          </pre>
        </div>

        {/* Finish & Clear Cart */}
        <div className="pt-2 border-t border-border-dark flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors text-center"
          >
            {isRTL ? 'تم الإرسال • تفريغ السلة والعودة للرئيسية' : 'Done • Clear Cart & Return Home'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default WhatsAppFallbackModal;
