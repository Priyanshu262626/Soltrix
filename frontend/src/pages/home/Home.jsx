import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowRight, Tag, ShieldCheck, Heart, Truck, Sparkles, Star, Plus, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

// Helpers for dynamic styling and typography parsing in the hero slider
const getHeroTheme = (name, index) => {
  const themes = [
    {
      accentText: 'text-[#10b981]',
      textHighlight: 'bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent',
      progressBg: 'bg-[#10b981]',
      dotBg: 'bg-[#10b981]',
      btnBg: 'bg-black text-white hover:bg-neutral-900',
      btnBorder: 'border-black',
      pillBg: 'bg-emerald-50/80 text-[#10b981] border-[#10b981]/30',
      dotActiveBg: 'bg-[#10b981]'
    },
    {
      accentText: 'text-blue-600',
      textHighlight: 'bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent',
      progressBg: 'bg-blue-600',
      dotBg: 'bg-blue-600',
      btnBg: 'bg-black text-white hover:bg-neutral-900',
      btnBorder: 'border-black',
      pillBg: 'bg-blue-50/80 text-blue-600 border-blue-200/60',
      dotActiveBg: 'bg-blue-600'
    },
    {
      accentText: 'text-[#e01a22]',
      textHighlight: 'bg-gradient-to-r from-[#e01a22] to-orange-500 bg-clip-text text-transparent',
      progressBg: 'bg-[#e01a22]',
      dotBg: 'bg-[#e01a22]',
      btnBg: 'bg-black text-white hover:bg-neutral-900',
      btnBorder: 'border-black',
      pillBg: 'bg-red-50/80 text-red-600 border-red-200/60',
      dotActiveBg: 'bg-[#e01a22]'
    },
    {
      accentText: 'text-purple-600',
      textHighlight: 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent',
      progressBg: 'bg-purple-600',
      dotBg: 'bg-purple-600',
      btnBg: 'bg-black text-white hover:bg-neutral-900',
      btnBorder: 'border-black',
      pillBg: 'bg-purple-50/80 text-purple-600 border-purple-200/60',
      dotActiveBg: 'bg-purple-600'
    }
  ];

  const upper = name?.toUpperCase() || '';
  if (upper.includes('TAILWIND') || upper.includes('NEON')) {
    return {
      accentText: 'text-[#a3e635]',
      textHighlight: 'bg-gradient-to-r from-[#a3e635] to-[#84cc16] bg-clip-text text-transparent',
      progressBg: 'bg-[#84cc16]',
      dotBg: 'bg-[#84cc16]',
      btnBg: 'bg-black text-white hover:bg-neutral-900',
      btnBorder: 'border-black',
      pillBg: 'bg-lime-50/80 text-lime-600 border-lime-200/60',
      dotActiveBg: 'bg-[#84cc16]'
    };
  }

  if (upper.includes('JORDAN 7') || upper.includes('EMERALD') || upper.includes('GREEN') || upper.includes('GLIDE')) {
    return themes[0];
  }
  if (upper.includes('JORDAN 12') || upper.includes('BLUE') || upper.includes('ROYALTY') || upper.includes('SHADOW') || upper.includes('FLUX')) {
    return themes[1];
  }
  if (upper.includes('AIR MAX') || upper.includes('RED') || upper.includes('CREAM') || upper.includes('VORTEX')) {
    return themes[2];
  }
  if (upper.includes('APEX') || upper.includes('ONYX') || upper.includes('PURPLE') || upper.includes('VOMERO')) {
    return themes[3];
  }

  const safeIndex = typeof index === 'number' && !isNaN(index) ? index : 0;
  return themes[safeIndex % themes.length];
};

const parseHeroTitle = (name) => {
  if (!name) return { line1: 'MOVE', line2: 'WITH', line3: 'PURPOSE.', line4: '' };
  const upper = name.toUpperCase().replace(/\./g, '').trim();

  if (upper.includes('TAILWIND')) {
    return { line1: 'NIKE', line2: 'TAILWIND V', line3: 'NEON EDGE.', line4: '' };
  }
  if (upper.includes('JORDAN 7')) {
    return { line1: 'AIR', line2: 'JORDAN 7', line3: 'RETRO BLACK.', line4: '' };
  }
  if (upper.includes('JORDAN 12')) {
    return { line1: 'AIR', line2: 'JORDAN 12', line3: 'ROYALTY.', line4: '' };
  }
  if (upper.includes('REVOLUTION')) {
    return { line1: 'NIKE', line2: 'REVOLUTION', line3: 'GREY.', line4: '' };
  }
  if (upper.includes('AIR MAX 1')) {
    return { line1: 'NIKE', line2: 'AIR MAX 1', line3: 'RED.', line4: '' };
  }
  if (upper.includes('DERBY')) {
    return { line1: 'BATA', line2: 'PREMIUM', line3: 'DERBY.', line4: '' };
  }
  if (upper.includes('VOMERO')) {
    return { line1: 'NIKE', line2: 'VOMERO', line3: 'NEON.', line4: '' };
  }

  const words = upper.split(' ');
  if (words.length >= 4) {
    return {
      line1: words[0],
      line2: words.slice(1, words.length - 2).join(' '),
      line3: words[words.length - 2],
      line4: words[words.length - 1] + '.'
    };
  } else if (words.length === 3) {
    return {
      line1: words[0],
      line2: words[1],
      line3: words[2] + '.',
      line4: ''
    };
  } else if (words.length === 2) {
    return {
      line1: words[0],
      line2: words[1] + '.',
      line3: '',
      line4: ''
    };
  } else {
    return {
      line1: words[0] + '.',
      line2: '',
      line3: '',
      line4: ''
    };
  }
};

export default function Home() {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const showToast = useToast();

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero slider active index (0 to 3)
  const [heroIndex, setHeroIndex] = useState(0);

  // Trending horizontal slider index
  const [trendingIndex, setTrendingIndex] = useState(0);

  // Selected highlight product specifications
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('black');

  // 4 gorgeous premium fallback products if the DB is empty
  const fallbackHeroProducts = [
    {
      id: 101,
      name: "Aero Glide 3",
      brand: "Kix Edition",
      price: 10999,
      imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=60",
      category: "RUNNING",
      description: "Classic design meets modern comfort. Engineered for premium daily wear."
    },
    {
      id: 102,
      name: "Flux Pro Shadow",
      brand: "Kix Edition",
      price: 12999,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=60",
      category: "LIFESTYLE",
      description: "Revolutionary air cushioning system for ultimate impact protection and standout style."
    },
    {
      id: 103,
      name: "Vortex Street Cream",
      brand: "Kix Edition",
      price: 9999,
      imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&auto=format&fit=crop&q=60",
      category: "CASUAL",
      description: "Minimalist leather sneaker tailored for clean visual geometry and comfort."
    },
    {
      id: 104,
      name: "Apex Specimen Onyx",
      brand: "Kix Edition",
      price: 15999,
      imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=80",
      category: "FORMAL",
      description: "Luxury dress shoes fused with responsive running shoe midsoles."
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
      // Slice first 4 for the main product grid
      setFeaturedProducts(data.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Find tailwind shoe from products if it exists
  const tailwindDbProduct = products.find(p => p.imageUrl?.includes('nike-air-max-tailwind.png') || p.title?.toLowerCase().includes('tailwind'));
  
  // Make a list of 5 products, ensuring the Tailwind shoe is included first
  let heroProductsList = [];
  if (products.length > 0) {
    if (tailwindDbProduct) {
      const others = products.filter(p => p.id !== tailwindDbProduct.id).slice(0, 4);
      heroProductsList = [tailwindDbProduct, ...others];
    } else {
      heroProductsList = products.slice(0, 5);
    }
  } else {
    const tailwindFallback = {
      id: 105,
      name: "Nike Air Max Tailwind",
      brand: "Nike",
      price: 11999,
      imageUrl: "/images/shoes/nike-air-max-tailwind.png",
      category: "SNEAKERS",
      description: "High-performance retro trainer featuring light grey mesh, stark black overlays, and neon yellow accents."
    };
    heroProductsList = [tailwindFallback, ...fallbackHeroProducts];
  }
  const currentHeroProduct = heroProductsList[heroIndex] || heroProductsList[0];

  // Auto transition hero products every 5 seconds
  useEffect(() => {
    const listLength = heroProductsList.length;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % listLength);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroProductsList]);

  // Safe fallback product for Hero/Showcases if DB is empty
  const heroProduct = products[0] || fallbackHeroProducts[0];

  const highlightProduct = products[1] || fallbackHeroProducts[1];

  // Active Hero slide theme & title parse
  const activeTheme = getHeroTheme(currentHeroProduct?.name, heroIndex);
  const heroTitleParts = parseHeroTitle(currentHeroProduct?.name);
  const isHeroFav = user ? isInWishlist(currentHeroProduct?.id) : false;

  const handleHeroWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to save favorites!', 'info');
      return;
    }
    if (user.role === 'ROLE_ADMIN') {
      showToast('Administrators cannot save favorites.', 'error');
      return;
    }
    try {
      await toggleWishlist(currentHeroProduct.id);
      showToast(isHeroFav ? 'Removed from Favorites' : 'Saved to Favorites', 'success');
    } catch (err) {
      showToast('Failed to update favorites', 'error');
    }
  };

  const nextHeroSlide = () => {
    setHeroIndex((prev) => (prev + 1) % heroProductsList.length);
  };

  const prevHeroSlide = () => {
    setHeroIndex((prev) => (prev - 1 + heroProductsList.length) % heroProductsList.length);
  };

  // Horizontal slider next/prev actions
  const nextTrending = () => {
    if (products.length > 0) {
      setTrendingIndex((prev) => (prev + 1) % Math.min(products.length, 5));
    }
  };

  const prevTrending = () => {
    if (products.length > 0) {
      setTrendingIndex((prev) => (prev - 1 + Math.min(products.length, 5)) % Math.min(products.length, 5));
    }
  };

  const currentTrendingShoe = products[trendingIndex] || heroProduct;
  const isTrendingFav = user ? isInWishlist(currentTrendingShoe.id) : false;

  const handleTrendingFav = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to save favorites!', 'info');
      return;
    }
    try {
      await toggleWishlist(currentTrendingShoe.id);
      showToast(isTrendingFav ? 'Removed from Favorites' : 'Saved to Favorites', 'success');
    } catch (err) {
      showToast('Failed to update favorites', 'error');
    }
  };

  return (
    <div className="bg-[#f4f4f6] text-black">

      {/* SECTION 1 — CINEMATIC HERO */}
      <section className="relative min-h-[95vh] lg:h-[calc(100vh-74px)] flex items-center justify-center overflow-hidden px-6 md:px-12 xl:px-16 border-b border-neutral-100 bg-[#f4f4f6]">
        
        {/* Full Page Background Architectural Beams (gallery feel) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Thick light grey structural column */}
          <div className="absolute right-[12%] lg:right-[15%] top-[-25%] w-[24%] lg:w-[28%] h-[150%] bg-white/70 rotate-[24deg] transform z-0 shadow-[0_15px_60px_rgba(0,0,0,0.02)]" />
          {/* Secondary light slate beam */}
          <div className="absolute right-[-5%] lg:right-[0%] top-[-10%] w-[12%] lg:w-[15%] h-[130%] bg-[#eaeaea]/40 rotate-[24deg] transform z-0" />
          {/* Grid dot pattern on the right boundary */}
          <div className="absolute right-0 top-0 w-[18%] h-full bg-[radial-gradient(#e1e1e7_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-50 z-0" />
        </div>

        <div className="max-w-[90rem] mx-auto w-full h-full relative z-10 flex flex-col justify-center">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center w-full py-12 lg:py-0">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 text-left relative z-20 lg:pl-6 xl:pl-12">
              <div className="flex flex-col justify-center gap-3 lg:gap-4 text-left py-2 lg:py-6">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-[9px] font-extrabold uppercase tracking-widest text-neutral-600 transition-all duration-500 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.dotBg || 'bg-[#10b981]'}`} />
                    <span>{currentHeroProduct.brand} • {currentHeroProduct.category}</span>
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[90px] 2xl:text-[105px] tracking-cinematic leading-[0.82] animate-slideUp font-sans font-black uppercase text-black flex flex-col">
                  <span className="whitespace-nowrap">{heroTitleParts.line1}</span>
                  {heroTitleParts.line2 && (
                    <span className={`whitespace-nowrap inline-block ${activeTheme.textHighlight || 'text-[#10b981]'} transition-all duration-500`}>
                      {heroTitleParts.line2}
                    </span>
                  )}
                  {heroTitleParts.line3 && <span className="whitespace-nowrap">{heroTitleParts.line3}</span>}
                  {heroTitleParts.line4 && <span className="whitespace-nowrap">{heroTitleParts.line4}</span>}
                </h1>

                <p className="text-xs md:text-sm lg:text-base text-neutral-500 max-w-sm font-normal tracking-wide leading-relaxed animate-slideUp">
                  {currentHeroProduct.description || "Premium sneakers designed for performance and everyday style."}
                </p>

                <div className="pt-2 flex items-center gap-4 animate-slideUp">
                  <Link
                    to={`/product/${currentHeroProduct.id}`}
                    className={`flex items-center justify-center gap-6 px-8 py-4 rounded-xs text-xs font-bold uppercase tracking-widest transition-all duration-300 border shadow-xs select-none ${activeTheme.btnBg || 'bg-black text-white hover:bg-neutral-900 border-black'} ${activeTheme.btnBorder || 'border-black'}`}
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={14} />
                  </Link>

                  <button
                    onClick={handleHeroWishlistToggle}
                    className="w-12 h-12 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-400 flex items-center justify-center transition-all shadow-xs cursor-pointer focus:outline-none text-black"
                    title={isHeroFav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Heart size={18} className={isHeroFav ? "fill-red-500 text-red-500" : "text-black"} />
                  </button>
                </div>

                {/* Inline Trust Badges Card */}
                <div className="pt-6 hidden sm:flex animate-slideUp">
                  <div className="bg-white border border-neutral-200/50 rounded-2xl p-4 md:px-5 md:py-3.5 shadow-sm flex items-center gap-5">
                    <div className="flex items-center gap-2.5">
                      <Truck size={18} className="text-black shrink-0" />
                      <div className="text-left">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-black leading-tight">Free Shipping</h4>
                        <p className="text-[9px] text-neutral-400 font-semibold leading-tight">On all orders</p>
                      </div>
                    </div>
                    <div className="w-[1px] h-7 bg-neutral-200" />
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-black shrink-0" />
                      <div className="text-left">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-black leading-tight">Authentic</h4>
                        <p className="text-[9px] text-neutral-400 font-semibold leading-tight">100% authentic</p>
                      </div>
                    </div>
                    <div className="w-[1px] h-7 bg-neutral-200" />
                    <div className="flex items-center gap-2.5">
                      <RotateCcw size={16} className="text-black shrink-0" />
                      <div className="text-left">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-black leading-tight">Easy Returns</h4>
                        <p className="text-[9px] text-neutral-400 font-semibold leading-tight">30-day returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Column */}
            <div className="lg:col-span-6 relative flex items-end justify-center h-[380px] sm:h-[460px] lg:h-[50vh] xl:h-[56vh] max-h-[600px] w-full z-10 pb-6 sm:pb-8 lg:pb-10">
              
              {/* 3D Concrete Pedestal/Slab extending to the right edge */}
              <div className="absolute bottom-[4%] sm:bottom-[6%] lg:bottom-[8%] right-[-50vw] w-[100vw] h-[110px] sm:h-[135px] lg:h-[155px] z-0 pointer-events-none select-none">
                {/* Top face of the block (light grey stone gradient, angled left side) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-neutral-50 shadow-xs" 
                  style={{ clipPath: 'polygon(18% 0%, 100% 0%, 100% 72%, 0% 72%)' }}
                />
                {/* Front face of the block (shadow stone face) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-[#cfcfd6] to-[#eaeaea] border-t border-white/25"
                  style={{ clipPath: 'polygon(0% 72%, 100% 72%, 100% 100%, 0% 100%)' }}
                />
              </div>

              {/* Flat Grounding Shoe shadow on top face of the block */}
              <div className="absolute bottom-[24%] sm:bottom-[26%] lg:bottom-[28%] left-[20%] w-[60%] h-[10px] bg-black/20 rounded-full filter blur-[6px] rotate-[-5deg] mix-blend-multiply z-10 pointer-events-none transition-all duration-700" />

              {/* Grounded Sneaker Image */}
              <div
                key={heroIndex}
                className="absolute bottom-[20%] sm:bottom-[22%] lg:bottom-[24%] z-10 w-full max-w-[580px] lg:max-w-[48vw] xl:max-w-[52vw] px-6 select-none flex justify-center items-end"
              >
                <img
                  src={currentHeroProduct.imageUrl}
                  alt={currentHeroProduct.name}
                  className="w-full h-auto max-h-[320px] sm:max-h-[400px] lg:max-h-[44vh] xl:max-h-[50vh] object-contain transform -rotate-[12deg] translate-y-[10px] sm:translate-y-[15px] lg:translate-y-[20px] animate-fadeIn transition-all duration-700"
                />
              </div>
            </div>
          </div>

          {/* Slide Progress Indicator */}
          <div className="absolute bottom-8 md:bottom-12 right-0 lg:right-6 z-20 flex items-center gap-3">
            <span className="text-xs font-black text-black font-mono leading-none">
              {String(heroIndex + 1).padStart(2, '0')}
            </span>
            <div className="w-16 h-[3px] bg-neutral-200 relative rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${activeTheme.progressBg || 'bg-[#10b981]'} transition-all duration-500`}
                style={{ width: `${((heroIndex + 1) / heroProductsList.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-neutral-400 font-mono leading-none">
              {String(heroProductsList.length).padStart(2, '0')}
            </span>
          </div>

        </div>

        {/* Manual Slide Arrow Navigation (circular buttons on screen edges) */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center text-black shadow-sm hover:scale-105 transition-all cursor-pointer focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextHeroSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black hover:bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 transition-all cursor-pointer focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* SECTION 2 — BRAND STATEMENT */}
      <section id="manifesto" className="max-w-[90rem] mx-auto px-6 py-16 md:py-24 text-center scroll-mt-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
            OUR MANIFESTO
          </span>
          <h2 className="text-3xl md:text-5xl font-serif-editorial text-black tracking-tight leading-tight">
            “Not made for everyone. Designed to move with you.”
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed uppercase font-semibold tracking-wider pt-4">
            Soltrix blends raw performance elements, conscious materials, and luxury minimalist design structure to build e-commerce footwear staples that redefine comfort.
          </p>
          <div className="w-12 h-[1px] bg-neutral-200 mx-auto mt-8" />
        </div>
      </section>

      {/* SECTION 3 — TRENDING PRODUCTS (Horizontal Storytelling) */}
      <section className="bg-[#f7f7f9] border-y border-neutral-100 py-20 px-6 md:px-12 overflow-hidden">
        <div className="max-w-[90rem] mx-auto w-full flex flex-col space-y-12">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                IN FOCUS
              </span>
              <h2 className="text-3xl md:text-4xl font-serif-editorial text-black tracking-tight mt-2">
                Trending Editions
              </h2>
            </div>
            <div className="flex gap-3">
              <button onClick={prevTrending} className="w-10 h-10 border border-neutral-200 hover:border-black rounded-full flex items-center justify-center text-black bg-white transition-all cursor-pointer">
                ←
              </button>
              <button onClick={nextTrending} className="w-10 h-10 border border-neutral-200 hover:border-black rounded-full flex items-center justify-center text-black bg-white transition-all cursor-pointer">
                →
              </button>
            </div>
          </div>

          {/* Sliding Story Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-neutral-200/50 p-6 md:p-8 lg:p-10 rounded-lg shadow-xxs relative overflow-hidden text-left">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-black bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded uppercase">
                  {currentTrendingShoe.category}
                </span>
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{currentTrendingShoe.brand}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black uppercase text-black leading-none tracking-tighter">
                {currentTrendingShoe.name}
              </h3>

              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm uppercase font-semibold tracking-wide">
                {currentTrendingShoe.description || "Designed with premium quality components, offering optimal cushioning, lightweight response, and lasting lifestyle style."}
              </p>

              <div className="flex items-center gap-5 pt-4">
                <span className="text-lg font-bold font-mono text-black">
                  ₹{currentTrendingShoe.price.toLocaleString('en-IN')}
                </span>
                <Link to={`/product/${currentTrendingShoe.id}`} className="nike-btn-black text-xs">
                  View Details
                </Link>
                {(!user || user.role === 'ROLE_CUSTOMER') && (
                  <button
                    onClick={handleTrendingFav}
                    className={`p-2.5 border rounded-full transition-all bg-white cursor-pointer ${isTrendingFav ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-neutral-200 text-black hover:border-black'
                      }`}
                  >
                    <Heart size={16} className={isTrendingFav ? "fill-red-500" : ""} />
                  </button>
                )}
              </div>
            </div>

            {/* Large Image Showcase Column */}
            <div className="lg:col-span-7 flex justify-center py-6 bg-neutral-50/50 rounded-lg border border-neutral-100 select-none aspect-[16/9] items-center relative overflow-hidden">
              <img
                src={currentTrendingShoe.imageUrl}
                alt={currentTrendingShoe.name}
                className="max-h-[85%] w-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.08)] transform hover:scale-105 transition-all duration-700"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — BRAND VALUES */}
      <section className="max-w-[90rem] mx-auto px-6 py-16 md:py-20 border-b border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
          <div className="space-y-3 md:border-r border-neutral-100 last:border-r-0 md:pr-8">
            <span className="text-xs font-bold text-black border border-black w-8 h-8 rounded-full flex items-center justify-center font-mono">01</span>
            <h4 className="font-extrabold text-black uppercase tracking-wider text-xs pt-2">Engineered Comfort</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">Each sole is precision-molded using reactive, high-density cell foam formulations that respond instantly to your natural strides.</p>
          </div>
          <div className="space-y-3 md:border-r border-neutral-100 last:border-r-0 md:pr-8">
            <span className="text-xs font-bold text-black border border-black w-8 h-8 rounded-full flex items-center justify-center font-mono">02</span>
            <h4 className="font-extrabold text-black uppercase tracking-wider text-xs pt-2">Sustainable Materials</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">Consciously manufactured using recycled mesh structures, eco-certified synthetic panels, and clean vulcanized rubber bases.</p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-black border border-black w-8 h-8 rounded-full flex items-center justify-center font-mono">03</span>
            <h4 className="font-extrabold text-black uppercase tracking-wider text-xs pt-2">Precision Crafted</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">Every seam is triple-stitched and reinforced along high-wear areas, ensuring longevity across trail, street, and performance domains.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CATEGORY EXPERIENCE */}
      <section className="py-2 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { id: 'SNEAKERS', name: 'STREET / LIFESTYLE', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80' },
            { id: 'RUNNING', name: 'RUNNING / TRACK', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80' },
            { id: 'CASUAL', name: 'CASUAL / BOOTS', img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80' },
            { id: 'FORMAL', name: 'FORMAL / EXECUTIVE', img: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80' }
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative h-[450px] overflow-hidden flex flex-col justify-end p-8 cursor-pointer bg-neutral-900 rounded"
            >
              {/* Background image container */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s] ease-out filter grayscale hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Overlay label */}
              <div className="relative z-10 space-y-2 text-left">
                <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 block uppercase">
                  DISCOVER COLLECTION
                </span>
                <h3 className="text-xl font-black tracking-tight text-white leading-none uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 6 — PRODUCT GRID */}
      <section className="max-w-[90rem] mx-auto px-6 py-24 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 border-b border-neutral-100 pb-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
              COLLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-editorial text-black tracking-tight mt-2">
              The Product Wall
            </h2>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-1 hover:opacity-75 transition-opacity">
            View All Shop Items
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((shoe) => (
              <ProductCard key={shoe.id} product={shoe} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 7 — INTERACTIVE PRODUCT HIGHLIGHT */}
      <section className="bg-neutral-50/50 border-t border-neutral-200/50 py-24 px-6 md:px-12 text-left">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Highlight Left: Large Image */}
          <div className="lg:col-span-7 flex justify-center py-8 bg-[#fdfdfd] border border-neutral-200/40 rounded-lg select-none relative aspect-[4/3] items-center">
            <img
              src={highlightProduct.imageUrl}
              alt={highlightProduct.name}
              className={`max-h-[85%] w-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.06)] transition-all duration-700 ${selectedHighlightColor === 'black' ? 'filter brightness-90 grayscale' :
                selectedHighlightColor === 'gray' ? 'filter saturate-50' : ''
                }`}
            />
          </div>

          {/* Highlight Right: Details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
              CORE EXHIBIT
            </span>
            <h3 className="text-3xl font-black uppercase text-black leading-none tracking-tighter">
              {highlightProduct.name}
            </h3>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm uppercase font-semibold tracking-wide">
              {highlightProduct.description}
            </p>

            {/* Colors picker */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Select Finish</label>
              <div className="flex gap-2">
                {[
                  { id: 'black', color: 'bg-neutral-900 border-neutral-900' },
                  { id: 'gray', color: 'bg-neutral-400 border-neutral-400' },
                  { id: 'original', color: 'bg-amber-100 border-amber-200' }
                ].map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedHighlightColor(spec.id)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${spec.color} ${selectedHighlightColor === spec.id ? 'ring-2 ring-black ring-offset-2 scale-110' : 'opacity-80'
                      }`}
                    aria-label={`Select ${spec.id}`}
                  />
                ))}
              </div>
            </div>

            {/* Specifications list */}
            <div className="border-t border-neutral-200 pt-5 space-y-2.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400 uppercase tracking-wider">Base Material</span>
                <span className="text-black uppercase">FlyKnit / Microfiber</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400 uppercase tracking-wider">Outsole Composition</span>
                <span className="text-black uppercase">Vulcanized Gum Rubber</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400 uppercase tracking-wider">Warranty Rating</span>
                <span className="text-black uppercase">2-Year Direct Guarantee</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-5">
              <span className="text-lg font-bold font-mono text-black">
                ₹{highlightProduct.price.toLocaleString('en-IN')}
              </span>
              <Link to={`/product/${highlightProduct.id}`} className="nike-btn-black">
                Inspect Item
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 8 — LOOKBOOK / STYLE SECTION */}
      <section id="lookbook" className="py-24 px-6 md:px-12 bg-black text-white text-left scroll-mt-20">
        <div className="max-w-[90rem] mx-auto w-full space-y-12">

          <div className="space-y-2 border-b border-neutral-800 pb-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
              CAMPAIGN
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-editorial text-white tracking-tight leading-none">
              Soltrix Lookbook
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left tall block */}
            <div className="md:col-span-8 relative h-[380px] md:h-[500px] bg-neutral-900 rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=80"
                alt="Campaign lookbook details"
                className="w-full h-full object-cover opacity-50 filter grayscale hover:grayscale-0 transition-all duration-[1s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 text-left max-w-sm space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 block">LIFESTYLE LABELS</span>
                <h4 className="text-lg font-bold uppercase tracking-tight text-white leading-none">THE COURT PRO ESSENTIALS</h4>
                <p className="text-xxs text-neutral-400 leading-normal uppercase">Engineered for clean visual geometry and modern daily lifestyle usage.</p>
              </div>
            </div>

            {/* Right smaller blocks stacking */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-neutral-950 p-6 border border-neutral-800 rounded flex flex-col justify-between">
                <div>
                  <Star className="text-white fill-white mb-4" size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white leading-none">Curated Style Guides</h4>
                  <p className="text-xxs text-neutral-400 uppercase mt-2 leading-relaxed">Access expert advice on how to integrate our monochrome sneakers into high-fashion streetwear wardrobes.</p>
                </div>
                <Link to="/shop" className="text-xxs text-neutral-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5 mt-4 hover:text-white transition-colors">
                  <span>Browse Style Guides</span>
                  <ArrowRight size={10} />
                </Link>
              </div>

              <div className="bg-neutral-950 p-6 border border-neutral-800 rounded flex flex-col justify-between">
                <div>
                  <Sparkles className="text-white mb-4" size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white leading-none">Exclusive Pre-Orders</h4>
                  <p className="text-xxs text-neutral-400 uppercase mt-2 leading-relaxed">Sign up to receive early notifications on drops, special capsules, and limited footwear collaborations.</p>
                </div>
                <Link to="/register" className="text-xxs text-neutral-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5 mt-4 hover:text-white transition-colors">
                  <span>Create Account</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9 — TESTIMONIALS */}
      <section className="bg-[#f7f7f9] py-24 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            ENDORSEMENTS
          </span>

          <div className="relative pt-6">
            <span className="text-6xl font-serif text-neutral-300 absolute -top-4 left-0 select-none">“</span>
            <p className="text-sm md:text-lg font-serif-editorial text-neutral-800 leading-relaxed max-w-2xl mx-auto relative z-10 italic">
              These are hands down the most comfortable and visually clean shoes I have ever owned. They feel premium, lightweight, and pair perfectly with tailored trousers.
            </p>
            <span className="text-6xl font-serif text-neutral-300 absolute -bottom-12 right-0 select-none">”</span>
          </div>

          <div className="pt-6 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Aman Verma</h4>
            <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-widest">Premium Shoe Collector & Architect</p>
          </div>
        </div>
      </section>

      {/* SECTION 10 — DRAMATIC FINAL CTA */}
      <section className="relative bg-black text-white py-28 md:py-36 px-6 overflow-hidden border-b border-neutral-900">
        {/* Decorative dark glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-900/30 rounded-full filter blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
            LIMITED CAPSULE DROPS
          </span>
          <h2 className="text-4xl md:text-6xl font-serif-editorial text-white tracking-tight leading-none uppercase">
            THE APEX SPECIMEN
          </h2>

          {/* Centered product shadow base */}
          <div className="relative w-full max-w-[340px] mx-auto py-8 select-none">
            <img
              src={heroProduct.imageUrl}
              alt={heroProduct.name}
              className="w-full h-auto object-contain drop-shadow-[0_30px_30px_rgba(255,255,255,0.08)] transform -rotate-[5deg] hover:scale-105 transition-transform duration-700"
            />
          </div>

          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed uppercase font-semibold tracking-wider">
            Engineered comfort, conscious design, and minimal style. Secure your pair from the premium Soltrix catalog today.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link to="/shop" className="nike-btn-white text-xs">
              Go to Store
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
