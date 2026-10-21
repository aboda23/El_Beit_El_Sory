import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar } from 'lucide-react';

export function OfferFormModal({
  isOpen,
  onClose,
  offer = null,
}) {
  const { categories, products, addOffer, updateOffer, showToast } = useApp();
  const isEditing = !!offer;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState('20');
  const [targetType, setTargetType] = useState('category'); // 'category' | 'product'
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [badgeText, setBadgeText] = useState('20% OFF');
  const [bannerText, setBannerText] = useState('');
  const [image, setImage] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  // Helper to format ISO to datetime-local input string
  const toLocalInput = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (offer) {
      setTitle(offer.title || '');
      setDescription(offer.description || '');
      setDiscountType(offer.discountType || 'percentage');
      setDiscountValue(offer.discountValue ? offer.discountValue.toString() : '20');
      
      if (offer.categoryIds && offer.categoryIds.length > 0) {
        setTargetType('category');
        setSelectedCategoryId(offer.categoryIds[0]);
      } else if (offer.productIds && offer.productIds.length > 0) {
        setTargetType('product');
        setSelectedProductId(offer.productIds[0]);
      } else {
        setTargetType('category');
        setSelectedCategoryId(categories[0]?.id || 'burgers');
      }

      setStartsAt(toLocalInput(offer.startsAt));
      setEndsAt(toLocalInput(offer.endsAt));
      setBadgeText(offer.badgeText || '');
      setBannerText(offer.bannerText || '');
      setImage(offer.image || '');
      setIsEnabled(offer.isEnabled !== false);
    } else {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      setTitle('');
      setDescription('');
      setDiscountType('percentage');
      setDiscountValue('20');
      setTargetType('category');
      setSelectedCategoryId(categories[0]?.id || 'burgers');
      setSelectedProductId(products[0]?.id || '');
      setStartsAt(toLocalInput(now.toISOString()));
      setEndsAt(toLocalInput(tomorrow.toISOString()));
      setBadgeText('20% OFF');
      setBannerText('');
      setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
      setIsEnabled(true);
    }
  }, [offer, categories, products, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Offer title is required', 'error');
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      showToast('Please specify a positive discount value', 'error');
      return;
    }
    if (!startsAt || !endsAt) {
      showToast('Please select valid start and end dates', 'error');
      return;
    }

    const startIso = new Date(startsAt).toISOString();
    const endIso = new Date(endsAt).toISOString();

    if (new Date(startIso) >= new Date(endIso)) {
      showToast('Offer end time must be after start time!', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      categoryIds: targetType === 'category' ? [selectedCategoryId] : [],
      productIds: targetType === 'product' ? [selectedProductId] : [],
      startsAt: startIso,
      endsAt: endIso,
      badgeText: badgeText.trim() || (discountType === 'percentage' ? `${discountValue}% OFF` : `-${discountValue} EGP`),
      bannerText: bannerText.trim() || title.trim(),
      image: image.trim(),
      isEnabled,
    };

    if (isEditing) {
      updateOffer(offer.id, payload);
    } else {
      addOffer(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Promotional Offer' : 'Create Timed Offer / Discount'}
      subtitle="Configure start & expiry dates, discount type, and target meals"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title & Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Offer Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Student Exam Week 20% OFF"
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Badge Text
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="20% OFF"
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Offer Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Special discount for all registered university students..."
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Discount Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-bg-secondary p-3.5 rounded-2xl border border-border-dark">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Discount Type
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full bg-bg-card border border-border-dark text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount Discount (EGP)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Discount Value {discountType === 'percentage' ? '(%)' : '(EGP)'}
            </label>
            <input
              type="number"
              min="1"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="20"
              className="w-full bg-bg-card border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
            />
          </div>
        </div>

        {/* Target Scope: Category or Specific Product */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-text-secondary">
            Apply Offer To:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTargetType('category')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                targetType === 'category'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-bg-secondary border-border-dark text-text-muted hover:text-text-primary'
              }`}
            >
              Entire Category
            </button>
            <button
              type="button"
              onClick={() => setTargetType('product')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                targetType === 'product'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-bg-secondary border-border-dark text-text-muted hover:text-text-primary'
              }`}
            >
              Specific Meal Product
            </button>
          </div>

          {targetType === 'category' ? (
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  All {c.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.price} EGP)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Start Date & End Date / Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Start Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              End Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Promo Image URL */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Active Toggle */}
        <div>
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-secondary border border-border-dark cursor-pointer text-xs text-text-primary">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-accent bg-bg-card border-border-dark focus:ring-accent"
            />
            <span className="font-semibold">Offer is Enabled (Subject to Schedule)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-border-dark flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Publish Offer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default OfferFormModal;
