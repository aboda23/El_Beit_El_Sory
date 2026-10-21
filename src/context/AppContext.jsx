import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialProducts } from '../data/initialProducts';
import { initialCategories } from '../data/initialCategories';
import { initialOffers } from '../data/initialOffers';
import { initialSettings } from '../data/initialSettings';
import { initialOrders } from '../data/initialOrders';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateProductPrice, getOfferStatus, isOfferActive } from '../utils/offerUtils';
import { generateOrderId } from '../utils/orderFormatter';
import { translations } from '../utils/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 0. Language State (Arabic / English)
  const [lang, setLang] = useLocalStorage('campus_bites_lang', 'ar');
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, [setLang]);

  const t = useCallback((key, fallback = '') => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? fallback ?? key;
  }, [lang]);

  // 1. Data States persisted in LocalStorage
  const [products, setProducts] = useLocalStorage('campus_bites_products', initialProducts);
  const [categories, setCategories] = useLocalStorage('campus_bites_categories', initialCategories);
  const [offers, setOffers] = useLocalStorage('campus_bites_offers', initialOffers);
  const [cart, setCart] = useLocalStorage('campus_bites_cart', []);
  const [orders, setOrders] = useLocalStorage('campus_bites_orders', initialOrders);
  const [settings, setSettings] = useLocalStorage('campus_bites_settings', initialSettings);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage('campus_bites_admin_auth', false);

  // Auto-migrate settings & menu to official Al Beit Al Souri details on initial mount
  useEffect(() => {
    if (
      !settings ||
      settings.whatsappNumber === '201012345678' ||
      settings.restaurantName === 'Campus Bites' ||
      !settings.branchAddress?.includes('سيناء')
    ) {
      setSettings(initialSettings);
    }

    // If categories don't have shawarma yet, migrate categories and products to Syrian specialties
    if (categories && !categories.some((c) => c.id === 'shawarma')) {
      setCategories(initialCategories);
      setProducts(initialProducts);
      setOffers(initialOffers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Global Toast Notifications
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // 3. Current Time ticker for timed offers automatic expiration
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Check every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // 4. Computed Active Offers
  const activeOffers = useMemo(() => {
    return (offers || []).filter((offer) => isOfferActive(offer, currentTime));
  }, [offers, currentTime]);

  // 5. Product Methods
  const getProductById = useCallback((id) => {
    return (products || []).find((p) => p.id === id) || null;
  }, [products]);

  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || `product-${Date.now()}`,
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      isAvailable: productData.isAvailable !== false,
      isFeatured: !!productData.isFeatured,
      rating: productData.rating || 4.8,
      reviewsCount: productData.reviewsCount || 1,
      addons: Array.isArray(productData.addons) ? productData.addons : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}"`, 'success');
    return newProduct;
  }, [setProducts, showToast]);

  const updateProduct = useCallback((id, updatedData) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedData,
            price: Number(updatedData.price !== undefined ? updatedData.price : item.price),
            originalPrice: updatedData.originalPrice !== undefined 
              ? (updatedData.originalPrice ? Number(updatedData.originalPrice) : null) 
              : item.originalPrice,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast('Product updated successfully', 'success');
  }, [setProducts, showToast]);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast('Product deleted', 'info');
  }, [setProducts, setCart, showToast]);

  const toggleProductAvailability = useCallback((id) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.isAvailable;
          showToast(`"${item.name}" marked as ${newStatus ? 'Available' : 'Out of Stock'}`, newStatus ? 'success' : 'info');
          return { ...item, isAvailable: newStatus, updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );
  }, [setProducts, showToast]);

  // 6. Category Methods
  const addCategory = useCallback((categoryData) => {
    const id = categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory = {
      ...categoryData,
      id,
      isActive: categoryData.isActive !== false,
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" created`, 'success');
    return newCategory;
  }, [setCategories, showToast]);

  const updateCategory = useCallback((id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    showToast('Category updated successfully', 'success');
  }, [setCategories, showToast]);

  const deleteCategory = useCallback((id) => {
    // Check referential integrity: do products use this category?
    const productsInCat = (products || []).filter((p) => p.categoryId === id);
    if (productsInCat.length > 0) {
      showToast(
        `Cannot delete: ${productsInCat.length} product(s) still belong to this category. Reassign them first!`,
        'error',
        4000
      );
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
    return true;
  }, [products, setCategories, showToast]);

  const toggleCategoryActive = useCallback((id) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newActive = !c.isActive;
          showToast(`Category "${c.name}" ${newActive ? 'enabled' : 'disabled'}`, 'info');
          return { ...c, isActive: newActive };
        }
        return c;
      })
    );
  }, [setCategories, showToast]);

  // 7. Offers Methods
  const addOffer = useCallback((offerData) => {
    const newOffer = {
      ...offerData,
      id: offerData.id || `offer-${Date.now()}`,
      discountValue: Number(offerData.discountValue) || 0,
      productIds: Array.isArray(offerData.productIds) ? offerData.productIds : [],
      categoryIds: Array.isArray(offerData.categoryIds) ? offerData.categoryIds : [],
      isEnabled: offerData.isEnabled !== false,
      startsAt: offerData.startsAt || new Date().toISOString(),
      endsAt: offerData.endsAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setOffers((prev) => [newOffer, ...prev]);
    showToast(`Offer "${newOffer.title}" created`, 'success');
    return newOffer;
  }, [setOffers, showToast]);

  const updateOffer = useCallback((id, updatedData) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return {
            ...o,
            ...updatedData,
            discountValue: Number(updatedData.discountValue !== undefined ? updatedData.discountValue : o.discountValue),
          };
        }
        return o;
      })
    );
    showToast('Offer updated successfully', 'success');
  }, [setOffers, showToast]);

  const deleteOffer = useCallback((id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showToast('Offer deleted', 'info');
  }, [setOffers, showToast]);

  const toggleOffer = useCallback((id) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const newEnabled = !o.isEnabled;
          showToast(`Offer "${o.title}" ${newEnabled ? 'activated' : 'disabled'}`, 'info');
          return { ...o, isEnabled: newEnabled };
        }
        return o;
      })
    );
  }, [setOffers, showToast]);

  // 8. Cart Management
  // Unique cart item generator by product ID and sorted extras
  const generateCartItemId = (productId, extras = []) => {
    const sortedExtraIds = (extras || [])
      .map((e) => e.id)
      .sort()
      .join('_');
    return `${productId}${sortedExtraIds ? '__' + sortedExtraIds : ''}`;
  };

  const addToCart = useCallback((product, quantity = 1, selectedExtras = [], notes = '') => {
    if (!product || !product.isAvailable) {
      showToast('This product is currently out of stock', 'error');
      return false;
    }

    const priceCalc = calculateProductPrice(product, activeOffers);
    const extrasTotal = (selectedExtras || []).reduce((sum, e) => sum + (Number(e.price) || 0), 0);
    const itemUnitPrice = priceCalc.discountedPrice + extrasTotal;
    const itemOriginalPrice = priceCalc.originalPrice + extrasTotal;

    const cartItemId = generateCartItemId(product.id, selectedExtras);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        // Update existing item quantity
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          price: itemUnitPrice,
          originalPrice: priceCalc.hasDiscount ? itemOriginalPrice : null,
          isAvailable: true,
        };
        return updated;
      } else {
        // Add new cart item
        const newItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: itemUnitPrice,
          originalPrice: priceCalc.hasDiscount ? itemOriginalPrice : null,
          quantity: Math.max(1, quantity),
          extras: selectedExtras,
          notes: notes || '',
          categoryId: product.categoryId,
          isAvailable: true,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${product.name}" to cart!`, 'success');
    return true;
  }, [activeOffers, setCart, showToast]);

  const updateCartQuantity = useCallback((cartItemId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }, [setCart]);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  }, [setCart, showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Cart cleared', 'info');
  }, [setCart, showToast]);

  // Synchronize cart items with live product stock status and prices
  const verifiedCart = useMemo(() => {
    return (cart || []).map((cartItem) => {
      const liveProduct = products.find((p) => p.id === cartItem.productId);
      const isAvailable = liveProduct ? liveProduct.isAvailable : false;
      return {
        ...cartItem,
        isAvailable,
      };
    });
  }, [cart, products]);

  // Cart Totals
  const cartSummary = useMemo(() => {
    const totalItems = verifiedCart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = verifiedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Check if any item in cart is unavailable
    const hasUnavailableItems = verifiedCart.some((item) => !item.isAvailable);

    return {
      items: verifiedCart,
      totalItems,
      subtotal,
      hasUnavailableItems,
    };
  }, [verifiedCart]);

  // 9. Order Management
  const addOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: orderData.id || generateOrderId(),
      orderReference: orderData.orderReference || `#${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
      status: orderData.status || 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, [setOrders]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
  }, [setOrders, showToast]);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order ${orderId} removed from local history`, 'info');
  }, [setOrders, showToast]);

  // 10. Settings & Reset
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  }, [setSettings, showToast]);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setOffers(initialOffers);
    setOrders(initialOrders);
    setSettings(initialSettings);
    setCart([]);
    showToast('Reset to original demo data successfully!', 'success');
  }, [setProducts, setCategories, setOffers, setOrders, setSettings, setCart, showToast]);

  // 11. Admin Authentication (Demo)
  const loginAdmin = useCallback((username, password) => {
    if (username.trim().toLowerCase() === 'admin' && password === 'campusbites123') {
      setIsAdminAuthenticated(true);
      showToast('Logged in to Admin Dashboard', 'success');
      return true;
    }
    showToast('Invalid credentials. Use demo: admin / campusbites123', 'error');
    return false;
  }, [setIsAdminAuthenticated, showToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin Dashboard', 'info');
  }, [setIsAdminAuthenticated, showToast]);

  const value = {
    // Language & i18n
    lang,
    setLang,
    toggleLang,
    t,
    isRTL,

    // Data
    products,
    categories,
    offers,
    activeOffers,
    cart: verifiedCart,
    cartSummary,
    orders,
    settings,
    currentTime,
    isAdminAuthenticated,
    toasts,
    
    // Actions - Products
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,

    // Actions - Categories
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,

    // Actions - Offers
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOffer,

    // Actions - Cart
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,

    // Actions - Orders
    addOrder,
    updateOrderStatus,
    deleteOrder,

    // Actions - Settings & System
    updateSettings,
    resetDemoData,
    loginAdmin,
    logoutAdmin,
    showToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
