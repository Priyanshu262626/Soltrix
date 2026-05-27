import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { user, toggleWishlist, isInWishlist } = useAuth();
  const showToast = useToast();

  const isFavorite = user ? isInWishlist(product.id) : false;

  const handleFavClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to save favorites!', 'info');
      return;
    }
    try {
      await toggleWishlist(product.id);
      showToast(isFavorite ? 'Removed from Favorites' : 'Saved to Favorites', 'success');
    } catch (err) {
      showToast('Failed to update favorites', 'error');
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group product-card rounded overflow-hidden flex flex-col h-full text-left cursor-pointer border border-neutral-100 bg-[#f9f9fb] hover:bg-white hover:shadow-xs transition-all duration-300"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] relative p-8 bg-white/60 flex items-center justify-center border-b border-neutral-100 overflow-hidden">
        {/* Wishlist Button Overlay */}
        {(!user || user.role === 'ROLE_CUSTOMER') && (
          <button
            onClick={handleFavClick}
            className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full border flex items-center justify-center bg-white shadow-xxs transition-all duration-300 cursor-pointer ${isFavorite ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-neutral-200 text-black hover:border-black'
              }`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500" : ""}
            />
          </button>
        )}

        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
          className="max-h-[90%] w-auto object-contain transform transition-transform duration-[0.6s] ease-out group-hover:scale-105 group-hover:-rotate-3"
        />

        {/* Fallback Display if image doesn't exist */}
        <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-2">
            <span className="text-xl font-black">{product.brand[0]}</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">{product.brand}</span>
          <span className="text-sm font-bold text-black mt-1 uppercase">{product.name}</span>
        </div>

        {/* Category Tag overlay */}
        <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center shadow-xxs">
          {product.category}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow bg-white text-left space-y-1.5">
        <span className="text-[11px] text-neutral-400 font-extrabold uppercase tracking-[0.18em] block">{product.brand}</span>
        <h3 className="text-sm font-black text-neutral-850 uppercase tracking-tight line-clamp-1 group-hover:text-black transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex justify-between items-center border-t border-neutral-50 mt-4 pt-2.5">
          <span className="text-sm font-black font-mono text-black">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
