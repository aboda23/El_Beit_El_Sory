import { formatCurrency } from './formatCurrency';

/**
 * Generates a unique user-friendly Order ID (e.g., BS-A7K92P)
 */
export function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BS-${result}`;
}

/**
 * Sanitizes phone number by removing spaces, dashes, parentheses and leading plus sign
 * @param {string} phone
 * @returns {string} Clean digits
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

/**
 * Validates whether a phone number is entered sensibly
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const cleaned = cleanPhoneNumber(phone);
  // Sensible check: at least 8 to 15 digits
  return cleaned.length >= 8 && cleaned.length <= 15;
}

/**
 * Formats a complete structured WhatsApp order message
 * @param {Object} params
 * @param {Object} params.order
 * @param {Object} params.settings
 * @returns {string} Plain text formatted WhatsApp message
 */
export function formatWhatsAppOrderMessage({ order, settings }) {
  const restaurantName = settings?.restaurantName || 'مطعم البيت السوري';
  const currency = settings?.currency || 'EGP';
  
  const dateStr = order.createdAt 
    ? new Date(order.createdAt).toLocaleString('ar-EG', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : new Date().toLocaleString();

  let itemsText = '';
  (order.items || []).forEach((item, index) => {
    const num = index + 1;
    const baseUnit = formatCurrency(item.price, currency);
    itemsText += `${num}. *${item.name}* × ${item.quantity} (${baseUnit})\n`;
    
    if (item.extras && item.extras.length > 0) {
      const extrasList = item.extras.map(e => `${e.name} (+${formatCurrency(e.price, currency)})`).join(', ');
      itemsText += `    └ إضافات: ${extrasList}\n`;
    }
  });

  const subtotalStr = formatCurrency(order.subtotal, currency);
  const discountStr = order.discount > 0 ? `-${formatCurrency(order.discount, currency)}` : `0 ${currency}`;
  const deliveryFeeStr = order.fulfillmentMethod === 'delivery' 
    ? formatCurrency(order.deliveryFee, currency)
    : '0 EGP (استلام مجاني من الفرع)';
  const totalStr = formatCurrency(order.total, currency);

  const fulfillmentMethod = order.fulfillmentMethod === 'delivery' 
    ? '🛵 توصيل (جامعة سيناء / سكن الطلاب / القنطرة شرق)' 
    : '🛍️ استلام شخصي من الفرع';

  let locationText = '';
  if (order.fulfillmentMethod === 'delivery') {
    locationText = `📍 *عنوان التوصيل:* ${order.deliveryAddress || 'غير محدد'}\n`;
  } else {
    locationText = `📍 *موقع الفرع:* ${settings?.branchAddress || 'مدينة القنطرة شرق - أمام جامعة سيناء'}\n`;
  }

  const notesText = order.notes ? `📝 *ملاحظات خاصة:* ${order.notes}\n` : '';

  const message = 
`🌯 *طلب جديد — ${restaurantName}*
📍 *الموقع:* مدينة القنطرة شرق - أمام جامعة سيناء

*كود الطلب:* ${order.id}
*اسم العميل:* ${order.customer?.name || 'عميل'}
*رقم الهاتف:* ${order.customer?.phone || 'غير مسجل'}

📋 *الوجبات المطلوبة:*
${itemsText.trim()}

─────────────────
*المجموع الفرعي:* ${subtotalStr}
${order.discount > 0 ? `*الخصم:* ${discountStr}\n` : ''}*رسوم التوصيل:* ${deliveryFeeStr}
*الإجمالي النهائي المطلوب:* *${totalStr}*

*طريقة الاستلام:* ${fulfillmentMethod}
${locationText}${notesText}*توقيت الطلب:* ${dateStr}

يرجى تأكيد استلام الطلب وبدء التحضير!`;

  return message;
}

/**
 * Builds the official WhatsApp click-to-chat URL
 * @param {string} rawPhone
 * @param {string} message
 * @returns {string} URL string
 */
export function buildWhatsAppUrl(rawPhone, message) {
  const cleanPhone = cleanPhoneNumber(rawPhone);
  if (!cleanPhone) {
    return '';
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
