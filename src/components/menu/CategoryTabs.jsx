import React from 'react';

export function CategoryTabs({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  className = '',
}) {
  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}>
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
        {/* "All" Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
            selectedCategory === 'all'
              ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
              : 'bg-bg-card hover:bg-bg-cardHover text-text-secondary hover:text-text-primary border border-border-dark'
          }`}
        >
          All
        </button>

        {/* Dynamic Active Categories */}
        {categories
          .filter((cat) => cat.isActive !== false)
          .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
                    : 'bg-bg-card hover:bg-bg-cardHover text-text-secondary hover:text-text-primary border border-border-dark'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default CategoryTabs;
