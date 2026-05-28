import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, LogOut, Menu, X, User, Shield, Heart, Search } from 'lucide-react';
import { api } from '../../services/api';

export default function Navbar() {
  const { user, cart, logout, wishlist = [] } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const searchRef = useRef(null);

  const cartCount = cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Click outside to close search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Only close if we didn't click the search toggle buttons
        const isSearchButton = event.target.closest('[aria-label="Search"]');
        if (!isSearchButton) {
          setIsSearchOpen(false);
          setSearchQuery('');
          setSuggestions([]);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/shop?search=${encodeURIComponent(searchQuery.trim())}` : '/shop');
    setIsSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  // Autocomplete / Search suggestions logic
  useEffect(() => {
    if (!isSearchOpen) {
      setSuggestions([]);
      return;
    }

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const data = await api.products.getAll(trimmedQuery);
        setSuggestions(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch search suggestions", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isSearchOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50 px-6 md:px-12 xl:px-16 py-5 transition-all duration-300">
      <div className="max-w-[90rem] mx-auto flex justify-between items-center relative px-2 lg:px-6">

        {/* Left Side: Logo */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="flex items-center text-2xl md:text-3xl font-black tracking-[0.25em] text-black hover:opacity-75 transition-all duration-300"
          >
            SOLTRIX
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12">
          <Link
            to="/"
            className={`text-xs md:text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 relative pb-2 ${isActive('/') ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-black after:rounded-full' : 'text-neutral-400 hover:text-black'}`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`text-xs md:text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 relative pb-2 ${isActive('/shop') && !location.search ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-black after:rounded-full' : 'text-neutral-400 hover:text-black'}`}
          >
            Shop
          </Link>
          <Link
            to="/shop?category=RUNNING"
            className={`text-xs md:text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 relative pb-2 ${location.search.includes('category=RUNNING') ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-black after:rounded-full' : 'text-neutral-400 hover:text-black'}`}
          >
            Men
          </Link>
          <Link
            to="/about"
            className={`text-xs md:text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 relative pb-2 ${isActive('/about') ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-black after:rounded-full' : 'text-neutral-400 hover:text-black'}`}
          >
            About
          </Link>
        </div>

        {/* Right Side: Desktop Utility Icons */}
        <div className="hidden md:flex items-center justify-end space-x-7 flex-1">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-black hover:opacity-75 transition-opacity bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
            aria-label="Search"
          >
            <Search size={26} strokeWidth={1.5} />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative group">
            {user ? (
              <>
                <button className="flex items-center gap-1 text-black hover:opacity-75 transition-opacity bg-transparent border-0 cursor-pointer p-0 focus:outline-none">
                  <User size={26} strokeWidth={1.5} />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left">
                  <div className="px-4 py-1.5 border-b border-neutral-50 mb-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Logged in as</span>
                    <span className="text-xs font-bold text-black truncate block">{user.name}</span>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-xxs font-bold uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-50">
                    My Profile
                  </Link>
                  {user.role === 'ROLE_ADMIN' ? (
                    <Link to="/admin" className="block px-4 py-2 text-xxs font-bold uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-50">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/orders" className="block px-4 py-2 text-xxs font-bold uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-50">
                      My Orders
                    </Link>
                  )}
                  <Link to="/wishlist" className="block px-4 py-2 text-xxs font-bold uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-50">
                    My Favorites
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-xxs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 bg-transparent border-0 cursor-pointer mt-1 border-t border-neutral-50 pt-2">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-black hover:opacity-75 transition-opacity" aria-label="Sign In">
                <User size={26} strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Wishlist Link */}
          {(!user || user.role === 'ROLE_CUSTOMER') && (
            <Link
              to="/wishlist"
              className="relative text-black hover:opacity-75 transition-opacity"
              aria-label="Wishlist"
            >
              <Heart size={26} className={wishlist.length > 0 ? "fill-black text-black" : "text-black"} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {/* Cart Link */}
          {(!user || user.role === 'ROLE_CUSTOMER') && (
            <Link
              to="/cart"
              className="relative text-black hover:opacity-75 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag size={26} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1 text-black bg-transparent border-0 cursor-pointer focus:outline-none"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          {(!user || user.role === 'ROLE_CUSTOMER') && (
            <>
              <Link to="/wishlist" className="relative p-1 text-black" aria-label="Wishlist">
                <Heart size={18} className={wishlist.length > 0 ? "fill-black text-black" : "text-black"} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-1 text-black" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black hover:opacity-70 focus:outline-none bg-transparent border-0 cursor-pointer"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar Dropdown (Below the Navbar) */}
      {isSearchOpen && (
        <div ref={searchRef} className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 py-4 px-6 md:px-12 xl:px-16 shadow-[0_10px_15px_rgba(0,0,0,0.03)] z-40 animate-slideDown">
          <div className="max-w-[90rem] mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
              <Search size={22} className="text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full text-sm md:text-base border-0 outline-hidden focus:ring-0 text-black placeholder-neutral-400 bg-transparent py-2 font-bold tracking-wide"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="text-neutral-400 hover:text-black transition-colors bg-transparent border-0 cursor-pointer p-2 focus:outline-none"
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </form>

            {/* Suggestions Popover */}
            {searchQuery.trim().length >= 1 && (
              <div className="absolute top-full left-0 mt-3 w-full bg-white border border-neutral-100 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.06)] overflow-hidden z-50 text-left">
                {isLoadingSuggestions ? (
                  <div className="p-4 flex items-center justify-center gap-2.5 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                    <div className="border-2 border-neutral-300 border-t-transparent w-4 h-4 rounded-full animate-spin"></div>
                    <span>Searching suggestions...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1.5 border-b border-neutral-50 mb-1.5">
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-extrabold block">Product Suggestions</span>
                    </div>
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSuggestions([]);
                        }}
                        className="flex items-center gap-4 px-4 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer group"
                      >
                        {/* Thumbnail Image */}
                        <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center p-2 border border-neutral-100 shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title and details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider">{product.brand}</span>
                            <span className="text-[9px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider">{product.category}</span>
                          </div>
                          <h4 className="text-xs font-bold text-black uppercase truncate mt-0.5 group-hover:text-black transition-colors">
                            {product.name}
                          </h4>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-black">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <div className="px-4 py-2 border-t border-neutral-50 mt-1.5 bg-neutral-50/50 flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Press Enter to view all results</span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-[10px] text-black font-extrabold uppercase tracking-wider hover:opacity-75 transition-opacity bg-transparent border-0 cursor-pointer p-0"
                      >
                        View All →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-neutral-400 text-xs font-medium uppercase tracking-wider">
                    No shoes found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-neutral-100 flex flex-col space-y-4 text-left animate-slideDown">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 hover:text-black"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 hover:text-black"
          >
            Shop All
          </Link>
          <Link
            to="/shop?category=RUNNING"
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 hover:text-black"
          >
            Men
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 hover:text-black"
          >
            About
          </Link>

          {user ? (
            <>
              {user.role === 'ROLE_ADMIN' ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
                  >
                    <Shield size={14} />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
                  >
                    My Favorites ({wishlist.length})
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
                  >
                    Profile
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-neutral-400 hover:text-black font-bold uppercase tracking-[0.12em] flex items-center space-x-1 pt-2"
              >
                <User size={12} className="text-black" />
                <span>{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 hover:text-red-600 self-start bg-transparent border-0 cursor-pointer"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
