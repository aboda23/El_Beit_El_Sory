import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { cleanPhoneNumber, isValidPhone } from '../../utils/orderFormatter';
import {
  Settings,
  Save,
  RotateCcw,
  MessageCircle,
  Building,
  Clock,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData, showToast, t, isRTL } = useApp();

  const [formData, setFormData] = useState({
    restaurantName: settings?.restaurantName || 'Campus Bites',
    tagline: settings?.tagline || 'Good Food • Better Days',
    headline: settings?.headline || 'Fresh Food For Busy Students',
    subheadline: settings?.subheadline || 'Delicious meals, great prices, and fast service — because you deserve the best, even on a busy day.',
    whatsappNumber: settings?.whatsappNumber || '201012345678',
    branchAddress: settings?.branchAddress || 'Campus Food Court, Student Union Building 3, University City',
    openingHours: settings?.openingHours || '9:00 AM – 11:30 PM Daily',
    deliveryFee: settings?.deliveryFee !== undefined ? settings.deliveryFee.toString() : '15',
    minOrder: settings?.minOrder !== undefined ? settings.minOrder.toString() : '30',
    currency: settings?.currency || 'EGP',
    estimatedDeliveryTime: settings?.estimatedDeliveryTime || '20-30 mins',
    contactPhone: settings?.contactPhone || '+20 101 234 5678',
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const cleanedPhone = cleanPhoneNumber(formData.whatsappNumber);
    if (!cleanedPhone || cleanedPhone.length < 8) {
      showToast(isRTL ? 'يرجى إدخال رقم واتساب دولي صحيح (مثال: 201012345678)' : 'Please enter a valid international WhatsApp number (e.g. 201012345678)', 'error');
      return;
    }

    updateSettings({
      ...formData,
      whatsappNumber: cleanedPhone,
      deliveryFee: Number(formData.deliveryFee) || 0,
      minOrder: Number(formData.minOrder) || 0,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black text-text-primary font-display">
          {isRTL ? 'إعدادات المطعم والواتساب' : 'Restaurant & WhatsApp Settings'}
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          {isRTL ? 'تعديل اسم المطعم، أرقام التواصل، أسعار التوصيل، ورقم الواتساب لاستقبال الطلبات' : 'Configure store brand identity, contact numbers, delivery charges, and ordering parameters'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information Card */}
        <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-dark/60 pb-3">
            <Building className="w-4 h-4 text-accent" />
            <span>{isRTL ? 'بيانات الهوية والمتجر' : 'Brand & Homepage Identity'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'اسم المطعم' : 'Restaurant Brand Name'}
              </label>
              <input
                type="text"
                required
                value={formData.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'الشعار التسويقي' : 'Tagline / Slogan'}
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'العنوان الرئيسي' : 'Hero Headline'}
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'رمز العملة' : 'Currency Label'}
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              {isRTL ? 'النص التعريفي الترحيبي' : 'Hero Supporting Text'}
            </label>
            <textarea
              rows={2}
              value={formData.subheadline}
              onChange={(e) => handleChange('subheadline', e.target.value)}
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* WhatsApp & Orders Configuration Card */}
        <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-dark/60 pb-3">
            <MessageCircle className="w-4 h-4 text-whatsapp" />
            <span>{isRTL ? 'قناة استقبال طلبات الواتساب' : 'WhatsApp Ordering Channel'}</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              {isRTL ? 'رقم هاتف الواتساب للمطعم (أرقام دولية بدون +)' : 'Restaurant WhatsApp Phone Number (International Digits Only)'} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="201012345678"
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
              {isRTL
                ? 'أدخل الرقم بالصيغة الدولية بدون رموز أو مسافات. مثال للرقم المصري: 201012345678. يتم توجيه رسائل الطلب فوراً عبر رابط wa.me المباشر.'
                : 'Format: Country code + Mobile digits without plus, spaces, or dashes. E.g. for Egyptian number 01012345678, enter 201012345678. Customer checkout messages will be dispatched directly to https://wa.me/201012345678.'}
            </p>
          </div>
        </div>

        {/* Location & Delivery Fees Card */}
        <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-dark/60 pb-3">
            <Clock className="w-4 h-4 text-accent" />
            <span>{isRTL ? 'بيانات الفرع وأسعار التوصيل' : 'Branch Logistics & Pricing'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'عنوان وموقع الفرع' : 'Branch Location & Address'}
              </label>
              <input
                type="text"
                value={formData.branchAddress}
                onChange={(e) => handleChange('branchAddress', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'مواعيد العمل اليومية' : 'Opening Hours'}
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'سعر التوصيل العادي' : 'Standard Delivery Fee (EGP)'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => handleChange('deliveryFee', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'الحد الأدنى للطلب' : 'Minimum Order Amount (EGP)'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrder}
                onChange={(e) => handleChange('minOrder', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {isRTL ? 'وقت التوصيل التقديري' : 'Est. Delivery Time'}
              </label>
              <input
                type="text"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => handleChange('estimatedDeliveryTime', e.target.value)}
                className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isRTL ? 'استعادة البيانات الافتراضية' : 'Reset Demo Data to Defaults'}</span>
          </button>

          {/* Save Settings Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            className="w-full sm:w-auto shadow-glow-accent"
          >
            {t('saveChanges')}
          </Button>
        </div>
      </form>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetDemoData();
          setShowResetConfirm(false);
        }}
        title={isRTL ? 'استعادة كافة البيانات الافتراضية؟' : 'Reset all demo data?'}
        message={isRTL ? 'سيؤدي هذا إلى إعادة ضبط الوجبات والتصنيفات والعروض والإعدادات لحالتها الأصلية.' : 'This will restore the original demo products, categories, timed offers, settings, and orders. Any custom edits you made will be replaced.'}
        confirmText={isRTL ? 'نعم، استعد كل شيء' : 'Yes, Reset Everything'}
        cancelText={t('cancel')}
        type="warning"
      />
    </div>
  );
}

export default AdminSettingsPage;
