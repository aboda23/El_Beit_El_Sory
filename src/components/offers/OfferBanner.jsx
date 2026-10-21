import React from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { Sparkles, ArrowRight } from 'lucide-react';

export function OfferBanner({ offer, className = '' }) {
  const navigate = useNavigate();

  if (!offer) return null;

  const handleClick = () => {
    if (offer.categoryIds && offer.categoryIds.length > 0) {
      navigate(`/menu?category=${offer.categoryIds[0]}`);
    } else if (offer.productIds && offer.productIds.length > 0) {
      navigate(`/menu?product=${offer.productIds[0]}`);
    } else {
      navigate('/menu');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-bg-card to-bg-card border border-accent/30 p-4 sm:p-6 cursor-pointer shadow-card group hover:border-accent transition-all duration-200 ${className}`}
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4">
        {/* Left Text & Timer */}
        <div className="space-y-1.5 sm:space-y-2 z-10 max-w-xs sm:max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent text-black">
              {offer.badgeText || `${offer.discountValue}% OFF`}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Limited Time Deal</span>
            </span>
          </div>

          <h3 className="text-base sm:text-xl font-extrabold text-text-primary tracking-tight font-display group-hover:text-accent transition-colors">
            {offer.title}
          </h3>

          <p className="text-xs text-text-secondary line-clamp-1 hidden sm:block">
            {offer.description}
          </p>

          <div className="pt-1 flex items-center gap-3">
            <div className="bg-bg-primary/80 px-2.5 py-1 rounded-xl border border-border-dark inline-block">
              <CountdownTimer endsAt={offer.endsAt} />
            </div>

            <span className="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              <span>Claim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Food Photo */}
        {offer.image && (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-border-dark group-hover:scale-105 transition-transform duration-300">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

export default OfferBanner;
