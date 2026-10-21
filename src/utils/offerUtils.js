/**
 * Timed Offers and Discount Calculation Utility
 */

/**
 * Determines the status of an offer based on the current time and offer settings
 * @param {Object} offer
 * @param {Date} [currentTime=new Date()]
 * @returns {'active' | 'scheduled' | 'expired' | 'disabled'}
 */
export function getOfferStatus(offer, currentTime = new Date()) {
  if (!offer || !offer.isEnabled) {
    return 'disabled';
  }

  const now = currentTime.getTime();
  const startTime = new Date(offer.startsAt).getTime();
  const endTime = new Date(offer.endsAt).getTime();

  if (now < startTime) {
    return 'scheduled';
  }

  if (now > endTime) {
    return 'expired';
  }

  return 'active';
}

/**
 * Checks if an offer is currently active
 * @param {Object} offer
 * @param {Date} [currentTime]
 * @returns {boolean}
 */
export function isOfferActive(offer, currentTime = new Date()) {
  return getOfferStatus(offer, currentTime) === 'active';
}

/**
 * Calculates the best eligible discount for a product among all active offers
 * Predictable rule: applies only the single best eligible discount per product.
 * @param {Object} product
 * @param {Array} activeOffers
 * @returns {{
 *   originalPrice: number,
 *   discountedPrice: number,
 *   discountAmount: number,
 *   hasDiscount: boolean,
 *   bestOffer: Object | null,
 *   discountPercent: number
 * }}
 */
export function calculateProductPrice(product, activeOffers = []) {
  if (!product) {
    return {
      originalPrice: 0,
      discountedPrice: 0,
      discountAmount: 0,
      hasDiscount: false,
      bestOffer: null,
      discountPercent: 0
    };
  }

  const basePrice = Number(product.price) || 0;
  
  // Find all active offers that apply to this product directly or to its category
  const eligibleOffers = (activeOffers || []).filter(offer => {
    if (!offer || !offer.isEnabled) return false;
    const matchesProduct = Array.isArray(offer.productIds) && offer.productIds.includes(product.id);
    const matchesCategory = Array.isArray(offer.categoryIds) && offer.categoryIds.includes(product.categoryId);
    return matchesProduct || matchesCategory;
  });

  if (eligibleOffers.length === 0) {
    // If product already has an explicit originalPrice set in its own data
    const hasStaticDiscount = product.originalPrice && product.originalPrice > basePrice;
    const diff = hasStaticDiscount ? product.originalPrice - basePrice : 0;
    const percent = hasStaticDiscount ? Math.round((diff / product.originalPrice) * 100) : 0;
    
    return {
      originalPrice: hasStaticDiscount ? product.originalPrice : basePrice,
      discountedPrice: basePrice,
      discountAmount: diff,
      hasDiscount: hasStaticDiscount,
      bestOffer: null,
      discountPercent: percent
    };
  }

  // Calculate discount for each eligible offer and pick the best one
  let bestOffer = null;
  let maxDiscountAmount = 0;

  for (const offer of eligibleOffers) {
    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (basePrice * (Number(offer.discountValue) || 0)) / 100;
    } else if (offer.discountType === 'fixed') {
      discount = Number(offer.discountValue) || 0;
    }
    // Discount cannot exceed the product base price
    discount = Math.min(discount, basePrice);

    if (discount > maxDiscountAmount) {
      maxDiscountAmount = discount;
      bestOffer = offer;
    }
  }

  if (maxDiscountAmount > 0 && bestOffer) {
    const discountedPrice = Math.max(0, Math.round((basePrice - maxDiscountAmount) * 100) / 100);
    const discountPercent = Math.round((maxDiscountAmount / basePrice) * 100);
    return {
      originalPrice: basePrice,
      discountedPrice,
      discountAmount: Math.round(maxDiscountAmount * 100) / 100,
      hasDiscount: true,
      bestOffer,
      discountPercent
    };
  }

  return {
    originalPrice: basePrice,
    discountedPrice: basePrice,
    discountAmount: 0,
    hasDiscount: false,
    bestOffer: null,
    discountPercent: 0
  };
}

/**
 * Formats time remaining until target date (endsAt)
 * @param {string|Date} endsAt
 * @param {Date} [currentTime]
 * @returns {{ hours: number, minutes: number, seconds: number, formatted: string, isExpired: boolean }}
 */
export function getTimeRemaining(endsAt, currentTime = new Date()) {
  const total = new Date(endsAt).getTime() - currentTime.getTime();
  
  if (total <= 0) {
    return {
      total: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "00:00:00",
      isExpired: true
    };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / (1000 * 60 * 60));

  const pad = (n) => n.toString().padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    total,
    hours,
    minutes,
    seconds,
    formatted,
    isExpired: false
  };
}
