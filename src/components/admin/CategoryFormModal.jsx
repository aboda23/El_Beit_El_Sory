import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';

export function CategoryFormModal({
  isOpen,
  onClose,
  category = null,
}) {
  const { addCategory, updateCategory, showToast } = useApp();
  const isEditing = !!category;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const fileInputRef = useRef(null);

  const defaultImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80';

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setImage(category.image || '');
      setUploadedFileName('');
      setImageMode(category.image?.startsWith('data:') ? 'upload' : 'url');
      setIsActive(category.isActive !== false);
    } else {
      setName('');
      setDescription('');
      setImage(defaultImage);
      setUploadedFileName('');
      setImageMode('upload');
      setIsActive(true);
    }
  }, [category, isOpen]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image is larger than 4MB. Please pick a smaller image.', 'error');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      showToast(`Image "${file.name}" loaded!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim() || defaultImage,
      isActive,
    };

    if (isEditing) {
      updateCategory(category.id, payload);
    } else {
      addCategory(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Create New Category'}
      subtitle="Organize your menu sections with device image or link"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Category Name / اسم التصنيف <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Burgers, Pizza, Wraps, Shakes..."
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
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
            placeholder="Fresh handcrafted meals for students..."
            className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Image Upload or URL */}
        <div className="bg-bg-secondary p-3.5 rounded-2xl border border-border-dark space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-accent" />
              <span>Category Image / صورة التصنيف</span>
            </span>

            <div className="flex items-center bg-bg-card border border-border-dark rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  imageMode === 'upload'
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  imageMode === 'url'
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>URL</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-card border border-border-dark shrink-0">
              <img
                src={image || defaultImage}
                alt="Category preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              {imageMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    id="cat-image-upload"
                  />
                  <label
                    htmlFor="cat-image-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-bg-card hover:bg-bg-cardHover border border-border-dark text-text-primary cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>Upload from Device</span>
                  </label>
                  {uploadedFileName && (
                    <span className="block text-[10px] text-emerald-400 mt-1 truncate">
                      ✓ {uploadedFileName}
                    </span>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-bg-card border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-2.5 focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div>
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-secondary border border-border-dark cursor-pointer text-xs text-text-primary">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-accent bg-bg-card border-border-dark focus:ring-accent"
            />
            <span className="font-semibold">Category is Active & Visible in Menu</span>
          </label>
        </div>

        <div className="pt-3 border-t border-border-dark flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;
