export const initialOrders = [
  {
    id: "CB-1024",
    orderReference: "#1024",
    customer: {
      name: "Ahmed Mostafa",
      phone: "+201019876543"
    },
    items: [
      {
        id: "cart-1",
        productId: "product-001",
        name: "Classic Burger",
        price: 70,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: [
          { id: "addon-extra-cheese", name: "Extra Cheese", price: 10 }
        ]
      },
      {
        id: "cart-2",
        productId: "product-008",
        name: "Golden Crispy Fries",
        price: 25,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: []
      },
      {
        id: "cart-3",
        productId: "product-011",
        name: "Coca-Cola Can",
        price: 15,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: []
      }
    ],
    fulfillmentMethod: "delivery",
    deliveryAddress: "Engineering Faculty Dorms, Block B, Room 402",
    notes: "Please call when you reach the gate",
    subtotal: 120,
    discount: 10,
    deliveryFee: 15,
    total: 125,
    status: "Delivered",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "CB-1023",
    orderReference: "#1023",
    customer: {
      name: "Salma El-Sayed",
      phone: "+201123456789"
    },
    items: [
      {
        id: "cart-4",
        productId: "product-005",
        name: "Pizza Combo",
        price: 120,
        originalPrice: 160,
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: []
      }
    ],
    fulfillmentMethod: "pickup",
    deliveryAddress: "",
    notes: "Extra napkins please",
    subtotal: 120,
    discount: 0,
    deliveryFee: 0,
    total: 120,
    status: "Ready for Pickup",
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString()
  },
  {
    id: "CB-1022",
    orderReference: "#1022",
    customer: {
      name: "Karim Zaki",
      phone: "+201234567890"
    },
    items: [
      {
        id: "cart-5",
        productId: "product-002",
        name: "Chicken Burger",
        price: 65,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: []
      }
    ],
    fulfillmentMethod: "delivery",
    deliveryAddress: "Main Campus Library, 2nd Floor Study Room",
    notes: "Leave with the front desk reception",
    subtotal: 65,
    discount: 0,
    deliveryFee: 15,
    total: 80,
    status: "Delivered",
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString()
  },
  {
    id: "CB-1021",
    orderReference: "#1021",
    customer: {
      name: "Nouran Tarek",
      phone: "+201555667788"
    },
    items: [
      {
        id: "cart-6",
        productId: "product-006",
        name: "Pasta Alfredo",
        price: 75,
        originalPrice: 95,
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        extras: [
          { id: "addon-extra-chicken", name: "Extra Grilled Chicken", price: 20 }
        ]
      }
    ],
    fulfillmentMethod: "delivery",
    deliveryAddress: "Faculty of Medicine, Research Labs Wing",
    notes: "",
    subtotal: 95,
    discount: 0,
    deliveryFee: 15,
    total: 110,
    status: "Preparing",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }
];
