export const initialProducts = [
  {
    id: "product-syrian-01",
    name: "وجبة شاورما عربي دبل (Double Arabic Shawarma)",
    description: "شاورما دجاج متبلة على السيخ السوري في خبز صاج مقرمش، مقطعة رولات مع بطاطس فارم، تومية أصلية، ومخلل سوري.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80",
    categoryId: "shawarma",
    price: 85,
    originalPrice: 95,
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 182,
    nutritionalInfo: {
      calories: "680 kcal",
      protein: "38g",
      carbs: "52g",
      prepTime: "8-12 دقيقة"
    },
    addons: [
      { id: "addon-extra-toum", name: "تومية سوري زيادة", price: 10 },
      { id: "addon-mozzarella", name: "جبنة موتزاريلا سايحة", price: 15 },
      { id: "addon-fries-side", name: "باكت بطاطس إضافي", price: 15 }
    ],
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "product-syrian-02",
    name: "ساندوتش شاورما فراخ صاج (Chicken Shawarma Roll)",
    description: "شاورما دجاج سوري على الجريل ملفوفة في عيش صاج مقرمش مدهون بثومية البيت ومخلل الخيار المقرمش.",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80",
    categoryId: "shawarma",
    price: 50,
    originalPrice: null,
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 145,
    nutritionalInfo: {
      calories: "450 kcal",
      protein: "26g",
      carbs: "38g",
      prepTime: "6-8 دقائق"
    },
    addons: [
      { id: "addon-extra-toum", name: "تومية سوري زيادة", price: 10 },
      { id: "addon-pickles", name: "مخلل خيار زيادة", price: 5 }
    ],
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "product-syrian-03",
    name: "وجبة بروستد 4 قطع سوبر كرسبي (4 Pcs Broasted)",
    description: "4 قطع دجاج طازج مقلي مقرمش بتتبيلة البيت السوري، مع بطاطس فارم فريتس، تومية، كول سلو، وخبز سوري طازج.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    categoryId: "broasted",
    price: 110,
    originalPrice: 125,
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 167,
    nutritionalInfo: {
      calories: "820 kcal",
      protein: "55g",
      carbs: "44g",
      prepTime: "15-18 دقيقة"
    },
    addons: [
      { id: "addon-spicy", name: "خلطة حارة سبايسي", price: 5 },
      { id: "addon-extra-toum", name: "علبة تومية إضافية", price: 10 },
      { id: "addon-coleslaw", name: "كول سلو إضافي", price: 10 }
    ],
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "product-syrian-04",
    name: "فتة شاورما فراخ سوري مكس (Shawarma Fattah)",
    description: "أرز بسمتي مبهر، شاورما دجاج سوري محمرة، عيش شامي محمص، غارقة بصلصة التومية المميزة ورشة لوز وبقدونس.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    categoryId: "shawarma",
    price: 80,
    originalPrice: null,
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 112,
    nutritionalInfo: {
      calories: "650 kcal",
      protein: "34g",
      carbs: "72g",
      prepTime: "10-12 دقيقة"
    },
    addons: [
      { id: "addon-extra-toum", name: "صوص تومية إضافي", price: 10 },
      { id: "addon-extra-meat", name: "لحم شاورما زيادة", price: 25 }
    ],
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "product-001",
    name: "Classic Burger",
    description: "Juicy grilled beef, fresh lettuce, tomato, cheddar cheese and our special sauce on a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    categoryId: "burgers",
    price: 70,
    originalPrice: null,
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 124,
    nutritionalInfo: {
      calories: "620 kcal",
      protein: "32g",
      carbs: "45g",
      prepTime: "12-15 mins"
    },
    addons: [
      { id: "addon-extra-cheese", name: "Extra Cheese", price: 10 },
      { id: "addon-bacon", name: "Crispy Bacon", price: 15 },
      { id: "addon-double-patty", name: "Double Patty", price: 25 },
      { id: "addon-caramelized-onions", name: "Caramelized Onions", price: 8 }
    ],
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-10-15T12:00:00.000Z"
  },
  {
    id: "product-002",
    name: "Chicken Burger",
    description: "Crispy golden fried chicken breast, spicy garlic mayo, pickles, and melted cheese on a soft sesame bun.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    categoryId: "burgers",
    price: 65,
    originalPrice: null,
    isAvailable: true,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 98,
    nutritionalInfo: {
      calories: "580 kcal",
      protein: "28g",
      carbs: "50g",
      prepTime: "10-12 mins"
    },
    addons: [
      { id: "addon-extra-cheese", name: "Extra Cheese", price: 10 },
      { id: "addon-jalapenos", name: "Spicy Jalapeños", price: 8 },
      { id: "addon-extra-sauce", name: "Extra Spicy Sauce", price: 5 }
    ],
    createdAt: "2026-09-02T10:00:00.000Z",
    updatedAt: "2026-10-16T14:30:00.000Z"
  },
  {
    id: "product-003",
    name: "Bacon BBQ Smoke Burger",
    description: "Double beef smash patty, smoky barbecue glaze, crispy bacon strips, melted cheddar, and crispy onion straws.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    categoryId: "burgers",
    price: 85,
    originalPrice: 95,
    isAvailable: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 86,
    nutritionalInfo: {
      calories: "780 kcal",
      protein: "42g",
      carbs: "48g",
      prepTime: "15 mins"
    },
    addons: [
      { id: "addon-extra-cheese", name: "Extra Cheese", price: 10 },
      { id: "addon-fried-egg", name: "Fried Egg", price: 12 }
    ],
    createdAt: "2026-09-05T11:00:00.000Z",
    updatedAt: "2026-10-18T10:00:00.000Z"
  },
  {
    id: "product-004",
    name: "Cheese Pizza",
    description: "Stone-baked authentic Italian crust with rich San Marzano tomato sauce, double mozzarella, parmesan, and basil oil.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    categoryId: "pizza",
    price: 95,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 75,
    nutritionalInfo: {
      calories: "840 kcal",
      protein: "34g",
      carbs: "90g",
      prepTime: "15-18 mins"
    },
    addons: [
      { id: "addon-extra-mozzarella", name: "Extra Mozzarella", price: 15 },
      { id: "addon-stuffed-crust", name: "Cheesy Stuffed Crust", price: 20 },
      { id: "addon-garlic-butter", name: "Garlic Butter Crust Dip", price: 8 }
    ],
    createdAt: "2026-09-08T09:00:00.000Z",
    updatedAt: "2026-10-12T16:00:00.000Z"
  },
  {
    id: "product-005",
    name: "Pizza Combo",
    description: "Medium Pepperoni & Mozzarella Pizza with seasoned crispy fries and your choice of chilled beverage.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    categoryId: "pizza",
    price: 120,
    originalPrice: 160,
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 162,
    nutritionalInfo: {
      calories: "1050 kcal",
      protein: "40g",
      carbs: "120g",
      prepTime: "15-20 mins"
    },
    addons: [
      { id: "addon-extra-pepperoni", name: "Extra Pepperoni", price: 15 },
      { id: "addon-ranch-dip", name: "Ranch Dip", price: 8 }
    ],
    createdAt: "2026-09-10T12:00:00.000Z",
    updatedAt: "2026-10-19T08:00:00.000Z"
  },
  {
    id: "product-006",
    name: "Pasta Alfredo",
    description: "Al dente fettuccine pasta in rich creamy garlic parmesan cream with tender grilled chicken breast and fresh parsley.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    categoryId: "pasta",
    price: 75,
    originalPrice: 95,
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 110,
    nutritionalInfo: {
      calories: "720 kcal",
      protein: "35g",
      carbs: "75g",
      prepTime: "12-15 mins"
    },
    addons: [
      { id: "addon-extra-chicken", name: "Extra Grilled Chicken", price: 20 },
      { id: "addon-mushrooms", name: "Sautéed Mushrooms", price: 12 },
      { id: "addon-parmesan", name: "Extra Grated Parmesan", price: 10 }
    ],
    createdAt: "2026-09-12T13:00:00.000Z",
    updatedAt: "2026-10-17T11:00:00.000Z"
  },
  {
    id: "product-007",
    name: "Spicy Penne Arrabbiata",
    description: "Tossed penne in a fiery spicy tomato sauce with crushed garlic, extra virgin olive oil, and fresh oregano.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    categoryId: "pasta",
    price: 60,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.5,
    reviewsCount: 54,
    nutritionalInfo: {
      calories: "520 kcal",
      protein: "14g",
      carbs: "82g",
      prepTime: "10-12 mins"
    },
    addons: [
      { id: "addon-extra-chicken", name: "Add Grilled Chicken", price: 20 },
      { id: "addon-mozzarella", name: "Melted Mozzarella", price: 15 }
    ],
    createdAt: "2026-09-14T14:00:00.000Z",
    updatedAt: "2026-10-16T15:00:00.000Z"
  },
  {
    id: "product-008",
    name: "Golden Crispy Fries",
    description: "Crispy on the outside, fluffy on the inside french fries lightly dusted with our campus sea salt blend.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
    categoryId: "sides",
    price: 25,
    originalPrice: null,
    isAvailable: true,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 215,
    nutritionalInfo: {
      calories: "380 kcal",
      protein: "4g",
      carbs: "46g",
      prepTime: "6-8 mins"
    },
    addons: [
      { id: "addon-melted-cheddar", name: "Warm Melted Cheddar", price: 10 },
      { id: "addon-cajun-spice", name: "Spicy Cajun Dusting", price: 5 }
    ],
    createdAt: "2026-09-15T15:00:00.000Z",
    updatedAt: "2026-10-18T18:00:00.000Z"
  },
  {
    id: "product-009",
    name: "Battered Onion Rings",
    description: "Golden thick-cut sweet onions in crunchy beer batter, served with our signature barbecue dipping sauce.",
    image: "https://images.unsplash.com/photo-1639024471287-032f6670529e?auto=format&fit=crop&w=600&q=80",
    categoryId: "sides",
    price: 30,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 88,
    nutritionalInfo: {
      calories: "410 kcal",
      protein: "5g",
      carbs: "52g",
      prepTime: "8 mins"
    },
    addons: [
      { id: "addon-bbq-sauce", name: "Extra BBQ Sauce", price: 5 },
      { id: "addon-spicy-mayo", name: "Spicy Mayo", price: 5 }
    ],
    createdAt: "2026-09-18T16:00:00.000Z",
    updatedAt: "2026-10-15T13:00:00.000Z"
  },
  {
    id: "product-010",
    name: "Mozzarella Cheese Sticks",
    description: "Gooey melted mozzarella sticks coated in seasoned Italian breadcrumbs, served hot with marinara sauce.",
    image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=600&q=80",
    categoryId: "sides",
    price: 38,
    originalPrice: null,
    isAvailable: false, // Out of stock demo item
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 67,
    nutritionalInfo: {
      calories: "460 kcal",
      protein: "18g",
      carbs: "34g",
      prepTime: "8 mins"
    },
    addons: [
      { id: "addon-marinara", name: "Extra Marinara Sauce", price: 5 }
    ],
    createdAt: "2026-09-20T17:00:00.000Z",
    updatedAt: "2026-10-20T09:00:00.000Z"
  },
  {
    id: "product-011",
    name: "Coca-Cola Can",
    description: "Chilled 330ml ice-cold can of classic Coca-Cola refreshing fizz.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    categoryId: "drinks",
    price: 15,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 320,
    nutritionalInfo: {
      calories: "140 kcal",
      protein: "0g",
      carbs: "39g",
      prepTime: "Instant"
    },
    addons: [
      { id: "addon-lemon", name: "Fresh Lemon Slice", price: 2 },
      { id: "addon-cup-ice", name: "Cup with Crushed Ice", price: 0 }
    ],
    createdAt: "2026-09-22T10:00:00.000Z",
    updatedAt: "2026-10-18T12:00:00.000Z"
  },
  {
    id: "product-012",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed Valencia orange juice, 100% natural with no added sugar.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    categoryId: "drinks",
    price: 25,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 92,
    nutritionalInfo: {
      calories: "110 kcal",
      protein: "2g",
      carbs: "26g",
      prepTime: "3 mins"
    },
    addons: [
      { id: "addon-fresh-mint", name: "Fresh Mint Sprig", price: 3 }
    ],
    createdAt: "2026-09-25T11:00:00.000Z",
    updatedAt: "2026-10-17T14:00:00.000Z"
  },
  {
    id: "product-013",
    name: "Chocolate Molten Cake",
    description: "Warm individual chocolate sponge cake with a rich flowing dark chocolate molten core.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    categoryId: "desserts",
    price: 45,
    originalPrice: null,
    isAvailable: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 145,
    nutritionalInfo: {
      calories: "490 kcal",
      protein: "6g",
      carbs: "58g",
      prepTime: "10 mins"
    },
    addons: [
      { id: "addon-vanilla-icecream", name: "Vanilla Ice Cream Scoop", price: 12 },
      { id: "addon-hazelnuts", name: "Crushed Roasted Hazelnuts", price: 8 }
    ],
    createdAt: "2026-09-28T14:00:00.000Z",
    updatedAt: "2026-10-19T16:00:00.000Z"
  }
];
