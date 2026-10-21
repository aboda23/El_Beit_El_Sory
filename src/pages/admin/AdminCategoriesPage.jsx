import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from 'lucide-react';

export function AdminCategoriesPage() {
  const { categories, products, deleteCategory, toggleCategoryActive, t, isRTL } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCat, setDeletingCat] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCat) {
      deleteCategory(deletingCat.id);
      setDeletingCat(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-text-primary font-display">
            {isRTL ? 'تصنيفات وأقسام المنيو' : 'Menu Categories'} ({categories.length})
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {isRTL ? 'إدارة تصنيفات الطعام وترتيب الأقسام المعروضة للطلاب' : 'Organize customer tabs, meal classifications, and product grouping'}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleAddNew}
          icon={Plus}
          className="shadow-glow-accent"
        >
          {isRTL ? '+ إضافة تصنيف جديد' : 'Add New Category'}
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-bg-card border border-border-dark shadow-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-bg-secondary border border-border-dark shrink-0">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                      aria-label="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCat(cat)}
                      className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-text-primary font-display">
                    {cat.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      cat.isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {cat.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Disabled')}
                  </span>
                </div>

                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {cat.description || (isRTL ? 'لا يوجد وصف.' : 'No description provided.')}
                </p>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-border-dark/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">
                  {productCount} {isRTL ? 'وجبات' : `product${productCount !== 1 ? 's' : ''}`}
                </span>

                <button
                  type="button"
                  onClick={() => toggleCategoryActive(cat.id)}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  {cat.isActive ? (isRTL ? 'تعطيل التصنيف' : 'Disable Category') : (isRTL ? 'تفعيل التصنيف' : 'Enable Category')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        onConfirm={confirmDelete}
        title={isRTL ? `حذف تصنيف "${deletingCat?.name}"؟` : `Delete Category "${deletingCat?.name}"?`}
        message={isRTL ? "حذف التصنيف متاح فقط عند عدم وجود وجبات مرتبطة به. يرجى نقل أو حذف الوجبات التابعة له أولاً." : "Deleting a category is only allowed if it has zero assigned products. If products still belong to it, you must reassign them first."}
        confirmText={isRTL ? "تأكيد الحذف" : "Confirm Delete"}
        cancelText={t('cancel')}
        type="danger"
      />
    </div>
  );
}

export default AdminCategoriesPage;
