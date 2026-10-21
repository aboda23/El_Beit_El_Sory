const now = new Date();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

export const initialOffers = [
  {
    id: "offer-shawarma-uni",
    title: "عرض شاورما البيت السوري للطلاب",
    description: "خصم 15% على جميع وجبات وساندوتشات الشاورما السوري الأصلية لطلاب جامعة سيناء!",
    discountType: "percentage",
    discountValue: 15,
    productIds: [],
    categoryIds: ["shawarma"],
    startsAt: twoHoursAgo,
    endsAt: threeDaysLater,
    isEnabled: true,
    badgeText: "15% OFF",
    bannerText: "عرض خاص لطلاب جامعة سيناء — 15% خصم على قسم الشاورما",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "offer-royal-feast",
    title: "خصم الوجبة الملكية الفاخرة",
    description: "وفر 50 جنيه عند طلب الوجبة الملكية التي تكفي الأسرة والشباب (فرخة مشوية + نص شاورما + كريسبي + كفتة + أرز وبطاطس)",
    discountType: "fixed",
    discountValue: 50,
    productIds: ["box-01"],
    categoryIds: [],
    startsAt: twoHoursAgo,
    endsAt: sevenDaysLater,
    isEnabled: true,
    badgeText: "-50 EGP",
    bannerText: "الوجبة الملكية الفاخرة بخصم 50 جنيه!",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "offer-crepes-combo",
    title: "مهرجان الكريبات السورية",
    description: "خصم 10% على تشكيلة الكريبات الغنية بالجبنة والدجاج المقرمش والشاورما",
    discountType: "percentage",
    discountValue: 10,
    productIds: [],
    categoryIds: ["crepes"],
    startsAt: twoHoursAgo,
    endsAt: twentyFourHoursLater,
    isEnabled: true,
    badgeText: "10% OFF",
    bannerText: "مهرجان الكريبات السورية — خصم 10%",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80"
  }
];

export default initialOffers;
