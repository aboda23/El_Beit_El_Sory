import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

export function ProductGrid({
  products = [],
  loading = false,
  onOpenDetails,
  emptyTitle = 'No meals available',
  emptyDescription = 'Try browsing another category or clearing your search.',
  onResetFilter,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilter ? 'Show All Meals' : null}
        onAction={onResetFilter}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
