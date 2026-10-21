import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OfferBanner from '../components/offers/OfferBanner';
import OfferCard from '../components/offers/OfferCard';
import EmptyState from '../components/common/EmptyState';
import { Sparkles, Calendar, ArrowLeft } from 'lucide-react';
import { getOfferStatus } from '../utils/offerUtils';

export function OffersPage() {
  const navigate = useNavigate();
  const { offers, activeOffers, currentTime, t, isRTL } = useApp();

  // Primary active offer for top hero banner
  const heroOffer = activeOffers.length > 0 ? activeOffers[0] : null;

  // Scheduled offers (starting in future)
  const scheduledOffers = (offers || []).filter(
    (o) => getOfferStatus(o, currentTime) === 'scheduled'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border-dark">
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          aria-label="Back to menu"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary font-display flex items-center gap-2">
            <span>{t('specialOffers')}</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </h1>
          <p className="text-xs text-text-muted">
            {t('offersSubtitle')}
          </p>
        </div>
      </div>

      {/* Featured Top Offer Banner (Mockup 6 style) */}
      {heroOffer ? (
        <section>
          <OfferBanner offer={heroOffer} />
        </section>
      ) : null}

      {/* Current Active Offers */}
      <section className="space-y-4">
        <h2 className="text-sm sm:text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <span>{t('activeDeals')}</span>
          <span className="text-xs text-accent bg-accent/15 px-2 py-0.5 rounded-md font-bold">
            {activeOffers.length} {t('live')}
          </span>
        </h2>

        {activeOffers.length === 0 ? (
          <EmptyState
            title={isRTL ? "لا توجد عروض نشطة حالياً" : "No active deals right now"}
            description={isRTL ? "طاهينا يحضر خصومات جديدة ومميزة، تابعنا قريباً أو استكشف المنيو كاملاً!" : "Our chef is preparing fresh discounts. Check back soon or browse the full menu!"}
            actionText={t('exploreMenu')}
            onAction={() => navigate('/menu')}
          />
        ) : (
          <div className="space-y-3">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* Scheduled / Upcoming Offers */}
      {scheduledOffers.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-border-dark/60">
          <h2 className="text-sm sm:text-base font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{t('comingSoon')}</span>
          </h2>

          <div className="space-y-3 opacity-80">
            {scheduledOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-2xl bg-bg-card/70 border border-border-dark flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-sm">{offer.title}</span>
                    <span className="bg-bg-secondary text-accent text-[10px] font-bold px-2 py-0.5 rounded border border-border-dark">
                      {isRTL ? 'يبدأ في ' : 'Starts '} {new Date(offer.startsAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-muted mt-1">{offer.description}</p>
                </div>
                <span className="font-extrabold text-accent text-sm">
                  {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `-${offer.discountValue} EGP`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default OffersPage;
