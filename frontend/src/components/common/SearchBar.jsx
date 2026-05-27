import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search...', onSubmit, initialValue = '' }) {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(val);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full bg-white border border-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider rounded px-3 py-2 focus:outline-none focus:border-black pr-10"
      />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black bg-transparent border-0 cursor-pointer p-0.5"
        aria-label="Search"
      >
        <Search size={13} />
      </button>
    </form>
  );
}
