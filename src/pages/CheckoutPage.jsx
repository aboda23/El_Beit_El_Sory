import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DeliveryMethodSelector from '../components/checkout/DeliveryMethodSelector';
import WhatsAppFallbackModal from '../components/checkout/WhatsAppFallbackModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatCurrency';
import {
  generateOrderId,
  formatWhatsAppOrderMessage,
  buildWhatsAppUrl,
  isValidPhone,
} from '../utils/orderFormatter';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Building,
} from 'lucide-react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSummary, settings, addOrder, showToast, t, isRTL } = useApp();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState('delivery'); // 'delivery' | 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery Zones from Settings
  const deliveryZones = settings?.deliveryZones && settings.deliveryZones.length > 0
    ? settings.deliveryZones
    : [
        { id: "inside_city", name: "داخل المدينة", nameEn: "Inside City", fee: 10 },
        { id: "uni_gate", name: "باب الجامعة", nameEn: "Sinai University Gate", fee: 15 },
        { id: "uni_housing", name: "سكن الجامعة", nameEn: "University Dorms / Housing", fee: 20 },
        { id: "behind_uni", name: "خلف الجامعة", nameEn: "Behind University", fee: 25 },
        { id: "al_sabea", name: "السابعة", nameEn: "The 7th District", fee: 30 },
        { id: "al_balad_ferry", name: "البلد والمعدية", nameEn: "Al Balad & The Ferry", fee: 40 }
      ];
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || 'inside_city');
  const activeZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];

  // Auto-sync selectedZoneId if settings change or zone removed
  React.useEffect(() => {
    if (deliveryZones.length > 0 && !deliveryZones.some((z) => z.id === selectedZoneId)) {
      setSelectedZoneId(deliveryZones[0].id);
    }
  }, [deliveryZones, selectedZoneId]);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp fallback dialog state
  const [activeCreatedOrder, setActiveCreatedOrder] = useState(null);
  const [activeWhatsAppUrl, setActiveWhatsAppUrl] = useState('');
  const [activeWhatsAppMessage, setActiveWhatsAppMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If cart is empty, return to cart
  if (cart.length === 0 && !activeCreatedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <EmptyState
          title={t('cartEmptyTitle')}
          description={t('cartEmptyDesc')}
          actionText={t('browseMenuBtn')}
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  const deliveryFee = fulfillmentMethod === 'delivery' ? (activeZone?.fee ?? 10) : 0;
  const subtotal = cartSummary.subtotal;
  const finalTotal = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = isRTL ? 'يرجى كتابة الاسم بالكامل' : 'Please enter your full name';
    }

    if (!customerPhone.trim()) {
      newErrors.customerPhone = isRTL ? 'يرجى كتابة رقم الهاتف' : 'Please enter your phone number';
    } else if (!isValidPhone(customerPhone)) {
      newErrors.customerPhone = isRTL ? 'يرجى كتابة رقم هاتف صحيح (من 8 إلى 11 رقم)' : 'Please enter a valid phone number (at least 8-11 digits)';
    }

    if (fulfillmentMethod === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = isRTL ? 'يرجى كتابة عنوان التوصيل أو المبنى ورقم الغرفة' : 'Please enter your delivery location (building, room, campus)';
    }

    if (cartSummary.hasUnavailableItems) {
      newErrors.cart = isRTL ? 'سلتك تحتوي على عناصر غير متوفرة، يرجى حذفها أولاً' : 'Your cart contains out-of-stock items. Please remove them first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(isRTL ? 'يرجى استكمال الحقول المطلوبة' : 'Please fix the highlighted fields in the form', 'error');
      return;
    }

    if (!settings?.whatsappNumber) {
      showToast(isRTL ? 'رقم الواتساب غير مضبوط في الإعدادات!' : 'Restaurant WhatsApp number is not configured in settings!', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const orderData = {
      id: orderId,
      orderReference: `#${orderId.replace('CB-', '')}`,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
      },
      items: cart,
      fulfillmentMethod,
      deliveryZone: fulfillmentMethod === 'delivery' ? (isRTL ? activeZone?.name : (activeZone?.nameEn || activeZone?.name)) : '',
      deliveryAddress: fulfillmentMethod === 'delivery' ? deliveryAddress.trim() : '',
      notes: orderNotes.trim(),
      subtotal,
      discount: 0,
      deliveryFee,
      total: finalTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local browser history
    const savedOrder = addOrder(orderData);

    // 2. Format WhatsApp text
    const message = formatWhatsAppOrderMessage({ order: savedOrder, settings });
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);

    setActiveCreatedOrder(savedOrder);
    setActiveWhatsAppMessage(message);
    setActiveWhatsAppUrl(url);

    // 3. Attempt to open WhatsApp in a new tab
    try {
      if (url) {
        const opened = window.open(url, '_blank');
        if (!opened) {
          showToast(isRTL ? 'تم حظر فتح التبويب تلقائياً، يمكنك الضغط على زر فتح واتساب.' : 'Popup blocker prevented automatic tab opening. Use the link below.', 'warning');
        }
      }
    } catch (err) {
      console.warn('Could not open WhatsApp tab automatically:', err);
    }

    // 4. Show Fallback Modal so user can review, copy, or reopen
    setIsModalOpen(true);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border-dark">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          aria-label="Back to cart"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary font-display">
            {t('checkoutTitle')}
          </h1>
          <p className="text-xs text-text-muted">
            {t('checkoutSubtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Customer Info & Fulfillment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Fulfillment Selector */}
            <div className="bg-bg-card border border-border-dark rounded-3xl p-5 shadow-card">
              <DeliveryMethodSelector
                value={fulfillmentMethod}
                onChange={(m) => setFulfillmentMethod(m)}
              />
            </div>

            {/* Customer Details Card */}
            <div className="bg-bg-card border border-border-dark rounded-3xl p-5 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-accent" />
                <span>{t('contactDetails')}</span>
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('fullName')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: null });
                    }}
                    placeholder={isRTL ? "مثال: أحمد محمد" : "e.g. Omar Hassan"}
                    className={`w-full bg-bg-secondary border text-text-primary text-xs rounded-xl p-3 focus:outline-none transition-colors ${
                      errors.customerName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border-dark focus:border-accent'
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('phoneNum')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors({ ...errors, customerPhone: null });
                    }}
                    placeholder="01012345678"
                    className={`w-full bg-bg-secondary border text-text-primary text-xs rounded-xl p-3 focus:outline-none transition-colors ${
                      errors.customerPhone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border-dark focus:border-accent'
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.customerPhone}</p>
                )}
                <span className="text-[10px] text-text-muted mt-1 block">
                  {t('phoneHint')}
                </span>
              </div>
            </div>

            {/* Delivery Address & Zone (only if delivery chosen) */}
            {fulfillmentMethod === 'delivery' ? (
              <div className="bg-bg-card border border-border-dark rounded-3xl p-5 shadow-card space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{isRTL ? 'منطقة وعنوان التوصيل' : 'Delivery Area & Address'}</span>
                </h3>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">
                    {isRTL ? 'اختر منطقة التوصيل (حسب منيو المطعم):' : 'Select Delivery Zone:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {deliveryZones.map((zone) => {
                      const isSelected = selectedZoneId === zone.id;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setSelectedZoneId(zone.id)}
                          className={`p-2.5 rounded-2xl border text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'border-accent bg-accent/15 text-text-primary shadow-sm ring-1 ring-accent'
                              : 'border-border-dark bg-bg-secondary text-text-secondary hover:border-text-muted hover:bg-bg-secondary/70'
                          }`}
                        >
                          <span className="block text-xs font-bold text-text-primary">
                            {isRTL ? zone.name : (zone.nameEn || zone.name)}
                          </span>
                          <span className="block text-[11px] text-accent font-extrabold mt-1">
                            +{zone.fee} {settings?.currency || 'EGP'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {isRTL ? 'العنوان بالتفصيل (المبنى / السكن / رقم الشقة أو الغرفة)' : t('campusAddress')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: null });
                    }}
                    placeholder={isRTL ? "مثال: سكن الطلبة، عمارة 3، شقة 12، بجوار البوابة" : t('campusAddressPlaceholder')}
                    className={`w-full bg-bg-secondary border text-text-primary text-xs rounded-xl p-3 focus:outline-none transition-colors ${
                      errors.deliveryAddress
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border-dark focus:border-accent'
                    }`}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Branch Pickup Info Card */
              <div className="bg-bg-card border border-border-dark rounded-3xl p-5 shadow-card space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-accent">
                  <Building className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    {t('pickupLocation')}
                  </h3>
                </div>
                <p className="text-xs text-text-primary font-semibold">
                  {settings?.branchAddress || (isRTL ? 'مجمع المطاعم المركزي، مبنى اتحاد الطلاب' : 'Campus Food Court, Student Union Building 3')}
                </p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {t('pickupInstructions')}
                </p>
              </div>
            )}

            {/* Order Notes */}
            <div className="bg-bg-card border border-border-dark rounded-3xl p-5 shadow-card space-y-3">
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                <span>{t('orderNotes')}</span>
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={isRTL ? 'مثال: رن على الهاتف عند الوصول، زيادة مناديل...' : 'e.g. Ring phone on arrival, extra cutlery, please hurry...'}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Order Summary & WhatsApp Action */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-border-dark/60 pb-2">
                {t('orderItemsTitle')} ({cartSummary.totalItems})
              </h3>

              {/* Items List */}
              <div className="max-h-52 overflow-y-auto space-y-2.5 no-scrollbar pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-text-primary block truncate">
                        {item.name} × {item.quantity}
                      </span>
                      {item.extras && item.extras.length > 0 && (
                        <span className="text-[10px] text-text-muted block truncate">
                          +{item.extras.map((e) => e.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-text-primary shrink-0">
                      {formatCurrency(item.price * item.quantity, settings?.currency || 'EGP')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Totals */}
              <div className="space-y-2 pt-3 border-t border-border-dark/60 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-text-primary">
                    {formatCurrency(subtotal, settings?.currency || 'EGP')}
                  </span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>{t('delivery')}</span>
                  <span className="font-semibold text-text-primary">
                    {fulfillmentMethod === 'delivery'
                      ? formatCurrency(deliveryFee, settings?.currency || 'EGP')
                      : t('free')}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-border-dark text-base font-extrabold">
                  <span className="text-text-primary">{t('finalTotal')}</span>
                  <span className="text-accent">
                    {formatCurrency(finalTotal, settings?.currency || 'EGP')}
                  </span>
                </div>
              </div>

              {/* Stock Warning if any */}
              {cartSummary.hasUnavailableItems && (
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{t('outOfStockInCart')}</span>
                </div>
              )}

              {/* Submit via WhatsApp Button */}
              <Button
                type="submit"
                variant="whatsapp"
                size="lg"
                fullWidth
                disabled={isSubmitting || cartSummary.hasUnavailableItems}
                loading={isSubmitting}
                icon={MessageCircle}
                className="mt-2 text-sm sm:text-base py-3.5 shadow-glow-whatsapp"
              >
                {t('sendViaWhatsApp')}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-whatsapp" />
                <span>{t('whatsappNotice')}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* WhatsApp Fallback & Confirmation Modal */}
      <WhatsAppFallbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={activeCreatedOrder}
        whatsAppUrl={activeWhatsAppUrl}
        whatsAppMessage={activeWhatsAppMessage}
      />
    </div>
  );
}

export default CheckoutPage;
