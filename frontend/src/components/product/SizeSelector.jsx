import React from 'react';

export default function SizeSelector({ sizes = [], selectedSize, onSizeChange }) {
  if (sizes.length === 0) return null;

  return (
    <div className="text-left">
      <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-3">Select Size (UK/India)</h3>
      <div className="grid grid-cols-5 gap-2 max-w-xs">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeChange && onSizeChange(size)}
            className={`h-10 border text-xs font-bold font-mono transition-all duration-200 cursor-pointer ${
              selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
