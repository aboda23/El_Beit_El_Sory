import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductGrid from '../components/menu/ProductGrid';
import ProductDetailsModal from '../components/menu/ProductDetailsModal';
import OfferBanner from '../components/offers/OfferBanner';
import Button from '../components/common/Button';
import { ArrowRight, Bike, Sparkles, Wallet, Flame, ChevronRight } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { products, categories, activeOffers, settings, t, isRTL } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Popular / Featured Products
  const popularProducts = products
    .filter((p) => p.isFeatured || p.rating >= 4.8)
    .slice(0, 6);

  // Pick primary active offer
  const primaryOffer = activeOffers.length > 0 ? activeOffers[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14 py-4 sm:py-6">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-bg-secondary via-bg-card to-bg-primary border border-border-dark p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold tracking-wide">
              <span>🎓</span>
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight font-display leading-[1.15]">
              {t('heroTitle1')} <br />
              <span className="text-accent underline decoration-accent/40 decoration-wavy decoration-2">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/menu')}
                className="w-full sm:w-auto shadow-glow-accent group"
              >
                <span>{t('orderNow')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/menu')}
                className="w-full sm:w-auto"
              >
                <span>{t('exploreMenu')}</span>
              </Button>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-border-dark/60 text-center">
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-xl bg-bg-secondary border border-border-dark text-accent mb-1.5">
                  <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-text-primary">{t('fastDelivery')}</span>
                <span className="text-[10px] text-text-muted hidden sm:block">{t('fastDeliverySub')}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-2 rounded-xl bg-bg-secondary border border-border-dark text-accent mb-1.5">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-text-primary">{t('studentPrices')}</span>
                <span className="text-[10px] text-text-muted hidden sm:block">{t('studentPricesSub')}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-2 rounded-xl bg-bg-secondary border border-border-dark text-accent mb-1.5">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-text-primary">{t('freshFood')}</span>
                <span className="text-[10px] text-text-muted hidden sm:block">{t('freshFoodSub')}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 flex justify-center z-10">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-border-dark shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80"
                alt="مطعم البيت السوري - شاورما عربي"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="bg-accent text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full w-max mb-1">
                  {t('bestSeller')}
                </span>
                <span className="text-white font-bold text-base">
                  {isRTL ? 'وجبة شاورما عربي دبل مع بطاطس وتومية' : 'Double Arabic Shawarma Meal'}
                </span>
                <span className="text-accent font-extrabold text-sm">85 EGP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offer Banner */}
      {primaryOffer && (
        <section>
          <OfferBanner offer={primaryOffer} />
        </section>
      )}

      {/* Category Shortcuts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary font-display">
              {t('browseCategories')}
            </h2>
            <p className="text-xs text-text-secondary">
              {t('whatCraving')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>{t('seeAll')}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categories
            .filter((c) => c.isActive !== false)
            .map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/menu?category=${cat.id}`)}
                className="group p-3 rounded-2xl bg-bg-card hover:bg-bg-cardHover border border-border-dark hover:border-accent cursor-pointer transition-all duration-200 text-center flex flex-col items-center shadow-card hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden mb-2 bg-bg-secondary border border-border-dark">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary font-display">
              {t('popularItems')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>{t('seeAll')}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <ProductGrid
          products={popularProducts}
          onOpenDetails={(p) => setSelectedProduct(p)}
        />
      </section>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default HomePage;
