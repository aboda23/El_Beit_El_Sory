import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OfferFormModal from '../../components/admin/OfferFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import CountdownTimer from '../../components/offers/CountdownTimer';
import { getOfferStatus } from '../../utils/offerUtils';
import { Plus, Edit2, Trash2, Tag, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AdminOffersPage() {
  const { offers, deleteOffer, toggleOffer, currentTime } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deletingOfferId, setDeletingOfferId] = useState(null);

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingOffer(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingOfferId) {
      deleteOffer(deletingOfferId);
      setDeletingOfferId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      case 'scheduled':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
      case 'expired':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      case 'disabled':
      default:
        return 'bg-red-500/15 text-red-400 border border-red-500/25';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary font-display">
            Timed Offers & Discounts ({offers.length})
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Create scheduled flash sales, student percentage discounts, or limited-time combos
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleAddNew}
          icon={Plus}
          className="shadow-glow-accent"
        >
          Create New Offer
        </Button>
      </div>

      {/* Offers Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => {
          const status = getOfferStatus(offer, currentTime);

          return (
            <div
              key={offer.id}
              className="p-5 rounded-3xl bg-bg-card border border-border-dark shadow-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${getStatusBadge(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                    <span className="text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20">
                      {offer.badgeText || (offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `-${offer.discountValue} EGP`)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(offer)}
                      className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                      aria-label="Edit offer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingOfferId(offer.id)}
                      className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Delete offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-text-primary font-display">
                  {offer.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {offer.description}
                </p>

                {/* Target Scope */}
                <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  <span>
                    Applies to:{' '}
                    {offer.categoryIds?.length
                      ? `Category "${offer.categoryIds.join(', ')}"`
                      : offer.productIds?.length
                      ? `Product IDs (${offer.productIds.length})`
                      : 'All Products'}
                  </span>
                </div>
              </div>

              {/* Timing & Toggle Footer */}
              <div className="pt-3 border-t border-border-dark/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-text-muted">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>
                      {new Date(offer.startsAt).toLocaleDateString()} – {new Date(offer.endsAt).toLocaleDateString()}
                    </span>
                  </span>

                  {status === 'active' && (
                    <div className="bg-bg-secondary px-2 py-0.5 rounded-md border border-border-dark">
                      <CountdownTimer endsAt={offer.endsAt} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-text-secondary">
                    Status: <strong className="text-text-primary">{offer.isEnabled ? 'Enabled' : 'Disabled'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleOffer(offer.id)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    {offer.isEnabled ? 'Disable Offer' : 'Enable Offer'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Offer Modal */}
      <OfferFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOffer(null);
        }}
        offer={editingOffer}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingOfferId}
        onClose={() => setDeletingOfferId(null)}
        onConfirm={confirmDelete}
        title="Delete this promotional offer?"
        message="This discount will no longer apply to customer menus or carts."
        confirmText="Confirm Delete"
        cancelText="Keep Offer"
        type="danger"
      />
    </div>
  );
}

export default AdminOffersPage;
