import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ProductFormModal from '../../components/admin/ProductFormModal';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import SearchBar from '../../components/menu/SearchBar';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  SlidersHorizontal,
  FolderPlus,
} from 'lucide-react';

export function AdminProductsPage() {
  const { products, categories, deleteProduct, toggleProductAvailability, settings, t, isRTL } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'inStock' | 'outOfStock'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      if (stockFilter === 'inStock' && !p.isAvailable) return false;
      if (stockFilter === 'outOfStock' && p.isAvailable) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, search]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary font-display">
            {isRTL ? 'قائمة الوجبات' : 'Meal Products'} ({products.length})
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {isRTL ? 'إضافة وتعديل الوجبات والأسعار وتحديد حالة التوفر في المنيو' : 'Add, update pricing, customize add-ons, or toggle stock availability'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => setIsCatModalOpen(true)}
            icon={FolderPlus}
          >
            {isRTL ? '+ إضافة تصنيف جديد' : '+ Add Category'}
          </Button>

          <Button
            variant="primary"
            onClick={handleAddNew}
            icon={Plus}
            className="shadow-glow-accent"
          >
            {t('addNewProduct')}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-4 shadow-card grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={isRTL ? "ابحث عن أي وجبة..." : "Search products..."}
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-2.5 focus:outline-none focus:border-accent"
          >
            <option value="all">{isRTL ? 'جميع التصنيفات' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-2.5 focus:outline-none focus:border-accent"
          >
            <option value="all">{isRTL ? 'جميع الحالات' : 'All Stock Statuses'}</option>
            <option value="inStock">{isRTL ? 'المتاح فقط' : 'Available Only'}</option>
            <option value="outOfStock">{isRTL ? 'غير المتوفر فقط' : 'Out of Stock Only'}</option>
          </select>
        </div>
      </div>

      {/* Products Table / Responsive Cards */}
      <div className="bg-bg-card border border-border-dark rounded-3xl overflow-hidden shadow-card">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            {isRTL ? 'لا توجد وجبات تطابق معايير البحث.' : 'No products match the selected criteria.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-dark bg-bg-secondary/60 text-text-muted font-bold uppercase tracking-wider">
                  <th className="p-4">{isRTL ? 'الوجبة' : 'Product'}</th>
                  <th className="p-4">{isRTL ? 'التصنيف' : 'Category'}</th>
                  <th className="p-4">{isRTL ? 'السعر' : 'Price'}</th>
                  <th className="p-4">{isRTL ? 'حالة التوفر' : 'Stock Status'}</th>
                  <th className="p-4">{isRTL ? 'الإضافات' : 'Extras'}</th>
                  <th className="p-4 text-right rtl:text-left">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/60">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-bg-cardHover/60 transition-colors"
                    >
                      {/* Product details & thumbnail */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-bg-secondary overflow-hidden shrink-0 border border-border-dark">
                            <img
                              src={p.image}
                              alt={p.name}
                              className={`w-full h-full object-cover ${
                                !p.isAvailable ? 'grayscale opacity-60' : ''
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary text-sm">
                                {p.name}
                              </span>
                              {p.isFeatured && (
                                <span className="bg-accent/15 text-accent text-[10px] font-bold px-1.5 py-0.2 rounded border border-accent/20">
                                  ★ Popular
                                </span>
                              )}
                            </div>
                            <span className="text-text-muted text-[11px] line-clamp-1 max-w-xs">
                              {p.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="bg-bg-secondary text-text-secondary px-2.5 py-1 rounded-lg border border-border-dark font-medium">
                          {cat?.name || p.categoryId}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <span className="font-extrabold text-accent text-sm">
                          {formatCurrency(p.price, settings?.currency || 'EGP')}
                        </span>
                        {p.originalPrice && (
                          <span className="block text-[10px] text-text-muted line-through">
                            {formatCurrency(p.originalPrice, settings?.currency || 'EGP')}
                          </span>
                        )}
                      </td>

                      {/* Stock Toggle Button */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            p.isAvailable
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {p.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isRTL ? 'متوفر' : 'Available'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{isRTL ? 'غير متوفر' : 'Out of Stock'}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Extras count */}
                      <td className="p-4 text-text-secondary">
                        {p.addons && p.addons.length > 0 ? (
                          <span>{p.addons.length} {isRTL ? 'إضافات' : 'add-ons'}</span>
                        ) : (
                          <span className="text-text-muted">{isRTL ? 'بدون' : 'None'}</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent hover:border-border-dark transition-all"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      {/* Quick Add Category Modal */}
      <CategoryFormModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={confirmDelete}
        title={isRTL ? 'حذف هذه الوجبة نهائياً؟' : 'Delete this meal product?'}
        message={isRTL ? 'هل أنت متأكد من رغبتك في حذف هذه الوجبة من قائمة الطعام؟' : 'Are you sure you want to delete this product from the menu? It will also be removed from any active carts.'}
        confirmText={isRTL ? 'نعم، احذف الوجبة' : 'Yes, Delete'}
        cancelText={isRTL ? 'إلغاء' : 'Keep Product'}
        type="danger"
      />
    </div>
  );
}

export default AdminProductsPage;
