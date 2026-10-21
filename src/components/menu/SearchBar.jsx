import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search for food...',
  className = '',
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-card border border-border-dark focus:border-accent text-text-primary placeholder:text-text-muted text-sm rounded-xl pl-10 pr-9 py-2.5 transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
