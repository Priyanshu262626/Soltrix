import React from 'react';
import SearchBar from './SearchBar';
import { ArrowUpDown } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  activeCategory = 'ALL',
  onCategoryChange,
  activeSearch = '',
  onSearchChange,
  activeSort = 'none',
  onSortChange,
}) {
  return (
    <div className="space-y-5 text-left">
      {/* Search Bar */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-2">Search</h3>
        <SearchBar 
          placeholder="e.g. Ultraboost, Bata"
          initialValue={activeSearch}
          onSubmit={onSearchChange}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-2">Categories</h3>
        <div className="flex flex-col space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange && onCategoryChange(cat)}
              className={`text-left text-[11.5px] font-extrabold uppercase tracking-widest transition-colors border-0 bg-transparent cursor-pointer py-1 ${
                activeCategory === cat ? 'text-black border-l-2 border-black pl-2.5' : 'text-gray-400 hover:text-black pl-0'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-2">Sort By</h3>
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="w-full bg-white border border-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider rounded px-3 py-2 focus:outline-none focus:border-black cursor-pointer appearance-none"
          >
            <option value="none">Default Sort</option>
            <option value="price-low-high">Price: Low - High</option>
            <option value="price-high-low">Price: High - Low</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ArrowUpDown size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
