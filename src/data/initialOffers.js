// Helper to generate dynamic ISO timestamps for realistic demo active/scheduled/expired states
const now = new Date();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
const threeDaysLater = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();
const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

export const initialOffers = [
  {
    id: "offer-001",
    title: "عرض شاورما طلاب جامعة سيناء",
    description: "خصم حصري 20% على جميع وجبات وسندوتشات الشاورما السوري لطلاب جامعة سيناء والقنطرة شرق!",
    discountType: "percentage",
    discountValue: 20,
    productIds: [],
    categoryIds: ["shawarma"],
    startsAt: twoHoursAgo,
    endsAt: twentyFourHoursLater,
    isEnabled: true,
    badgeText: "20% OFF",
    bannerText: "عرض خاص لطلاب جامعة سيناء 20% خصم على الشاورما",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "offer-002",
    title: "Pizza Combo Feast",
    description: "Get our signature Pepperoni Pizza Combo with fries and drink at a huge 25 EGP flat discount.",
    discountType: "fixed",
    discountValue: 25,
    productIds: ["product-005"],
    categoryIds: [],
    startsAt: twoHoursAgo,
    endsAt: twoDaysLater,
    isEnabled: true,
    badgeText: "-25 EGP",
    bannerText: "Pizza Combo Feast — Save 25 EGP",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "offer-003",
    title: "Pasta Lovers Special",
    description: "Warm, rich and comforting pasta dishes at 15% off across all pasta recipes.",
    discountType: "percentage",
    discountValue: 15,
    productIds: [],
    categoryIds: ["pasta"],
    startsAt: twoHoursAgo,
    endsAt: threeDaysLater,
    isEnabled: true,
    badgeText: "15% OFF",
    bannerText: "Pasta Lovers 15% OFF",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "offer-004",
    title: "Weekend Midnight Munchies",
    description: "Scheduled late-night discount on all sides and desserts starting next weekend.",
    discountType: "percentage",
    discountValue: 25,
    productIds: [],
    categoryIds: ["sides", "desserts"],
    startsAt: fiveDaysLater,
    endsAt: sevenDaysLater,
    isEnabled: true,
    badgeText: "25% OFF",
    bannerText: "Weekend Midnight Munchies Coming Soon",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "offer-005",
    title: "Orientation Week Welcome",
    description: "Expired orientation promotional offer archive.",
    discountType: "percentage",
    discountValue: 30,
    productIds: ["product-001"],
    categoryIds: [],
    startsAt: fiveDaysAgo,
    endsAt: oneDayAgo,
    isEnabled: true,
    badgeText: "Expired",
    bannerText: "Orientation Week 30% OFF",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"
  }
];
