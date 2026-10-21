import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

export function OfferCard({ offer }) {
  const navigate = useNavigate();
  const { settings } = useApp();
  const [imgErr, setImgErr] = useState(false);

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  const handleBrowseOffer = () => {
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
      onClick={handleBrowseOffer}
      className="group p-3.5 sm:p-4 rounded-2xl bg-bg-card hover:bg-bg-cardHover border border-border-dark hover:border-border-light transition-all duration-200 cursor-pointer shadow-card flex items-center justify-between gap-3.5"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Food Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-bg-secondary shrink-0">
          <img
            src={imgErr ? fallbackImage : (offer.image || fallbackImage)}
            alt={offer.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-accent transition-colors truncate">
              {offer.title}
            </h4>
            <span className="shrink-0 bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
              {offer.badgeText || (offer.discountType === 'percentage' ? `-${offer.discountValue}%` : `-${offer.discountValue} EGP`)}
            </span>
          </div>

          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
            {offer.description}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <CountdownTimer endsAt={offer.endsAt} />
          </div>
        </div>
      </div>

      {/* Right Action */}
      <div className="shrink-0 pl-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseOffer();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-bg-secondary group-hover:bg-accent text-text-secondary group-hover:text-black flex items-center justify-center transition-all border border-border-dark group-hover:border-accent"
          aria-label="View offer products"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default OfferCard;
