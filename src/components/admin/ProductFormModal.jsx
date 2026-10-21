import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  FolderPlus,
  X,
} from 'lucide-react';

export function ProductFormModal({
  isOpen,
  onClose,
  product = null, // null for Add, object for Edit
}) {
  const { categories, addCategory, addProduct, updateProduct, showToast } = useApp();

  const isEditing = !!product;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Image handling: supports 'upload' (local file from device) and 'url' (web link)
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'url'
  const [image, setImage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Category selection & quick inline category creation
  const [categoryId, setCategoryId] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Pricing & Stock
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [addons, setAddons] = useState([]);

  // New addon input temp fields
  const [addonName, setAddonName] = useState('');
  const [addonPrice, setAddonPrice] = useState('');

  // Sample quick images for easy selection in admin
  const sampleImages = [
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Chicken', url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pasta', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80' },
    { label: 'Drink', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80' },
    { label: 'Dessert', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
  ];

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setImage(product.image || '');
      setUploadedFileName('');
      setImageSourceMode(product.image?.startsWith('data:') ? 'upload' : 'url');
      setCategoryId(product.categoryId || (categories[0]?.id || 'burgers'));
      setPrice(product.price !== undefined ? product.price.toString() : '');
      setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
      setIsAvailable(product.isAvailable !== false);
      setIsFeatured(!!product.isFeatured);
      setAddons(product.addons || []);
      setShowNewCatInput(false);
      setNewCatName('');
    } else {
      setName('');
      setDescription('');
      setImage(sampleImages[0].url);
      setUploadedFileName('');
      setImageSourceMode('upload');
      setCategoryId(categories[0]?.id || 'burgers');
      setPrice('');
      setOriginalPrice('');
      setIsAvailable(true);
      setIsFeatured(false);
      setAddons([]);
      setShowNewCatInput(false);
      setNewCatName('');
    }
  }, [product, categories, isOpen]);

  // Handle Local Device File Upload via FileReader (Base64 Data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, etc.)', 'error');
      return;
    }

    // Limit to reasonable size for localStorage (e.g. < 4MB)
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image is larger than 4MB. Please choose a smaller image.', 'error');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      showToast(`Image "${file.name}" loaded successfully!`, 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Quick inline category creation
  const handleQuickCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }
    const created = addCategory({
      name: newCatName.trim(),
      description: `Delicious ${newCatName.trim()} menu section`,
      image: sampleImages[0].url,
      isActive: true,
    });
    if (created) {
      setCategoryId(created.id);
      setShowNewCatInput(false);
      setNewCatName('');
      showToast(`Category "${created.name}" created and selected!`, 'success');
    }
  };

  const handleAddAddon = (e) => {
    e.preventDefault();
    if (!addonName.trim()) return;
    const newAddon = {
      id: `addon-${Date.now()}`,
      name: addonName.trim(),
      price: Number(addonPrice) || 0,
    };
    setAddons([...addons, newAddon]);
    setAddonName('');
    setAddonPrice('');
  };

  const handleRemoveAddon = (addonId) => {
    setAddons(addons.filter((a) => a.id !== addonId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Please specify a valid price', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Please select or create a category', 'error');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim() || sampleImages[0].url,
      categoryId,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      isAvailable,
      isFeatured,
      addons,
    };

    if (isEditing) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Meal Product' : 'Add New Meal Product'}
      subtitle="Upload photo from device or link, set category, price, and stock"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Image Selection with Device Upload & URL Options --- */}
        <div className="bg-bg-secondary p-3.5 sm:p-4 rounded-2xl border border-border-dark space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-accent" />
              <span>Product Image / صورة الوجبة</span>
            </label>

            {/* Toggle Modes: Upload from Device vs Web Link */}
            <div className="flex items-center bg-bg-card border border-border-dark rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setImageSourceMode('upload')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  imageSourceMode === 'upload'
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload (من الجهاز)</span>
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode('url')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  imageSourceMode === 'url'
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link (رابط)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Image Preview */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-bg-card border border-border-dark shrink-0 shadow-md">
              <img
                src={image || sampleImages[0].url}
                alt="Meal preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                Preview
              </span>
            </div>

            {/* Upload or Link Input based on active mode */}
            <div className="flex-1 w-full space-y-2">
              {imageSourceMode === 'upload' ? (
                /* 1. Device File Upload Zone */
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-border-dark hover:border-accent/60 bg-bg-card hover:bg-bg-cardHover rounded-xl cursor-pointer transition-all text-center group"
                  >
                    <Upload className="w-6 h-6 text-accent mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-text-primary">
                      {uploadedFileName ? 'Choose another image...' : 'Click to upload photo from your device'}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      Supports JPG, PNG, WEBP (Max 4MB)
                    </span>
                  </label>
                  {uploadedFileName && (
                    <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <span className="truncate max-w-[200px]">✓ {uploadedFileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName('');
                          setImage(sampleImages[0].url);
                        }}
                        className="text-text-muted hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 2. Web URL Input */
                <div className="space-y-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or web image link"
                    className="w-full bg-bg-card border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
                  />
                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-text-muted">Presets:</span>
                    {sampleImages.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setImage(s.url)}
                        className="text-[10px] font-semibold bg-bg-card hover:bg-bg-cardHover border border-border-dark px-2 py-0.5 rounded text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Product Name / اسم الوجبة <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Double Smash Cheeseburger"
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Category & Inline Quick Category Creation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-text-secondary">
              Category / التصنيف <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowNewCatInput(!showNewCatInput)}
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>{showNewCatInput ? 'Cancel' : '+ New Category (إضافة تصنيف جديد)'}</span>
            </button>
          </div>

          {/* Quick Category Add Input */}
          {showNewCatInput && (
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 flex items-center gap-2 animate-fade-in">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category name (e.g. Wraps, Salads, Breakfast)..."
                className="flex-1 bg-bg-card border border-border-dark focus:border-accent text-text-primary text-xs rounded-lg p-2 focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleQuickCreateCategory}
              >
                Create
              </Button>
            </div>
          )}

          {/* Category Dropdown */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isActive === false ? '(Disabled)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Price (EGP) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="70"
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Original Price (Optional for Discount)
            </label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="90"
              className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Juicy grilled beef patty, lettuce, cheddar cheese, special sauce..."
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Stock / Availability & Featured Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Stock Status
            </label>
            <div className="grid grid-cols-2 gap-2 bg-bg-secondary p-1 rounded-xl border border-border-dark">
              <button
                type="button"
                onClick={() => setIsAvailable(true)}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Available</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAvailable(false)}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !isAvailable
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Badging & Promotion
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-secondary border border-border-dark cursor-pointer text-xs text-text-primary">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-accent bg-bg-card border-border-dark focus:ring-accent"
              />
              <span className="font-semibold">Mark as ★ Popular / Featured</span>
            </label>
          </div>
        </div>

        {/* Extras & Add-ons Manager */}
        <div className="pt-2 border-t border-border-dark/60 space-y-2">
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
            Optional Extras ({addons.length})
          </label>

          {/* Existing Addons List */}
          {addons.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-bg-secondary border border-border-dark text-xs"
                >
                  <span className="font-semibold text-text-primary">{addon.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold">+{addon.price} EGP</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addon.id)}
                      className="text-text-muted hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Addon Input Row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={addonName}
              onChange={(e) => setAddonName(e.target.value)}
              placeholder="Extra name (e.g. Bacon, Extra Dip)"
              className="flex-1 bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              value={addonPrice}
              onChange={(e) => setAddonPrice(e.target.value)}
              placeholder="Price (EGP)"
              className="w-24 bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddAddon}
              icon={Plus}
            >
              Add Extra
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border-dark flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="md">
            {isEditing ? 'Save Changes' : 'Save Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
