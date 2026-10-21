import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CategoryTabs from '../components/menu/CategoryTabs';
import SearchBar from '../components/menu/SearchBar';
import ProductGrid from '../components/menu/ProductGrid';
import ProductDetailsModal from '../components/menu/ProductDetailsModal';
import MenuFlyerModal from '../components/menu/MenuFlyerModal';
import OfferBanner from '../components/offers/OfferBanner';
import { Filter, SlidersHorizontal, Sparkles, Image as ImageIcon } from 'lucide-react';

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, activeOffers, t, isRTL } = useApp();

  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const productParam = searchParams.get('product') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

  // Sync category param with state
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Open direct product modal if URL has ?product=ID
  useEffect(() => {
    if (productParam) {
      const found = products.find((p) => p.id === productParam);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [productParam, products]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Stock availability filter
        if (onlyAvailable && !product.isAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        // Default: featured first, then in-stock before out-of-stock
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, onlyAvailable, sortBy]);

  // Top banner offer
  const primaryOffer = activeOffers.length > 0 ? activeOffers[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Search Bar at Top */}
      <div className="w-full">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t('searchPlaceholder')}
        />
      </div>

      {/* Category Pills (Mockup 2 style) */}
      <div>
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Featured Offer Banner (if active) */}
      {primaryOffer && !searchQuery && selectedCategory === 'all' && (
        <div>
          <OfferBanner offer={primaryOffer} />
        </div>
      )}

      {/* Filter & Sorting Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {selectedCategory === 'all'
              ? t('allMenuItems')
              : categories.find((c) => c.id === selectedCategory)?.name || 'Items'}
          </span>
          <span className="text-xs text-text-muted">
            ({filteredProducts.length} {t('itemsCount', 'items')})
          </span>

          {/* View Official Printed Menu Flyer Button */}
          <button
            type="button"
            onClick={() => setIsFlyerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-all shadow-sm ml-1"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isRTL ? 'عرض صورة المنيو الورقي 📜' : 'View Printed Menu Flyer 📜'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Availability toggle */}
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded bg-bg-card border-border-dark text-accent focus:ring-accent w-3.5 h-3.5"
            />
            <span>{t('availableOnly')}</span>
          </label>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-card border border-border-dark text-text-primary text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-accent appearance-none cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="name-asc">{t('sortNameAsc')}</option>
            </select>
            <SlidersHorizontal className={`w-3.5 h-3.5 text-text-muted absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
          </div>
        </div>
      </div>

      {/* Product Grid (2 columns on mobile) */}
      <ProductGrid
        products={filteredProducts}
        onOpenDetails={(p) => setSelectedProduct(p)}
        emptyTitle={searchQuery ? `No results for "${searchQuery}"` : 'No meals found'}
        emptyDescription={
          searchQuery
            ? 'Check for spelling mistakes or try searching for another dish.'
            : 'Try selecting another category or unchecking available only.'
        }
        onResetFilter={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          setOnlyAvailable(false);
          setSearchParams({});
        }}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          if (productParam) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('product');
            setSearchParams(newParams);
          }
        }}
      />

      {/* Official Printed Menu Flyer Modal */}
      <MenuFlyerModal
        isOpen={isFlyerOpen}
        onClose={() => setIsFlyerOpen(false)}
      />
    </div>
  );
}

export default MenuPage;
