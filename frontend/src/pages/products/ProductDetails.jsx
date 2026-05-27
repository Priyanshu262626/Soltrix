import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';

// Reusable Components Imports
import ImageGallery from '../../components/product/ImageGallery';
import SizeSelector from '../../components/product/SizeSelector';
import QuantitySelector from '../../components/product/QuantitySelector';
import AddToCartButton from '../../components/product/AddToCartButton';
import RelatedProducts from '../../components/product/RelatedProducts';

import { ArrowLeft, AlertTriangle, Heart, Shield, HelpCircle, Star } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart, toggleWishlist, isInWishlist } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  
  // Accordion local state
  const [openSection, setOpenSection] = useState('details');

  const isFavorite = user ? isInWishlist(product?.id) : false;

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (user.role === 'ROLE_ADMIN') {
      toast('Administrators cannot add items to favorites.', 'error');
      return;
    }
    setTogglingFav(true);
    try {
      await toggleWishlist(product.id);
      toast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err) {
      toast('Failed to update favorites', 'error');
    } finally {
      setTogglingFav(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.products.getById(id);
      setProduct(data);
      if (data.sizes) {
        setSelectedSize(data.sizes.split(',')[0]);
      }
    } catch (err) {
      setError('Product details could not be loaded.');
      toast('Product details could not be loaded.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (user.role === 'ROLE_ADMIN') {
      toast('Administrators cannot add items to cart.', 'error');
      return;
    }

    if (!selectedSize) {
      toast('Please select a shoe size.', 'warning');
      return;
    }

    setAdding(true);

    try {
      await addToCart(product.id, quantity, selectedSize);
      toast(`Successfully added ${quantity} item(s) (UK ${selectedSize}) to your bag!`, 'success');
    } catch (err) {
      toast(err.message || 'Failed to add item to cart.', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading specs...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center bg-white">
        <div className="border border-neutral-200 p-8 rounded-lg bg-neutral-50">
          <p className="text-red-500 font-bold">{error || 'Product not found.'}</p>
          <Link to="/shop" className="mt-4 inline-flex items-center text-black hover:underline font-bold text-xs uppercase tracking-wider">
            <ArrowLeft size={14} className="mr-1.5" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const sizesArray = product.sizes ? product.sizes.split(',') : [];

  return (
    <div className="bg-white min-h-screen text-left">
      <div className="max-w-[90rem] mx-auto px-6 py-12">
        
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center text-neutral-400 hover:text-black mb-10 transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Vertical Image Gallery (7/12 width) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <ImageGallery imageUrl={product.imageUrl} alt={product.name} />
          </div>

          {/* Right Column: Shoe Details (5/12 width) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* Title / Brand Header */}
            <div>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-[0.2em] block">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif-editorial text-black mt-2 leading-tight uppercase tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1.5">
                Collection / {product.category}
              </p>
            </div>

            {/* Price & Stock bar */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
              <span className="text-2xl font-mono font-black text-black">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              
              {product.stock > 0 ? (
                <span className="bg-neutral-50 border border-neutral-200 text-neutral-800 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center">
                  <AlertTriangle size={12} className="mr-1 shrink-0" /> Out of Stock
                </span>
              )}
            </div>

            {/* Sizing & Quantity selector */}
            {product.stock > 0 && (
              <div className="space-y-6">
                <SizeSelector
                  sizes={sizesArray}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />

                <QuantitySelector
                  quantity={quantity}
                  maxStock={product.stock}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* Action buttons */}
            {product.stock > 0 && (
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <AddToCartButton
                  onClick={handleAddToCart}
                  loading={adding}
                  text={user ? 'Add to Bag' : 'Sign in to Buy'}
                />
                {(!user || user.role === 'ROLE_CUSTOMER') && (
                  <button
                    onClick={handleToggleWishlist}
                    disabled={togglingFav}
                    className="border border-neutral-200 rounded-sm px-6 py-3.5 flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all hover:bg-neutral-50 cursor-pointer w-full sm:w-auto gap-2 bg-white text-black min-h-[48px] shrink-0 hover:border-black"
                  >
                    <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-black"} />
                    <span>{isFavorite ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Accordion sections */}
            <div className="border-t border-neutral-100 pt-6 space-y-4">
              
              {/* Accordion 1: Details */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? '' : 'details')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black cursor-pointer bg-transparent border-0 py-1"
                >
                  <span>Product Details</span>
                  <span>{openSection === 'details' ? '—' : '+'}</span>
                </button>
                {openSection === 'details' && (
                  <div className="mt-3 text-xs text-neutral-500 leading-relaxed space-y-3 animate-slideDown">
                    <p>{product.description || "Designed with premium quality components, offering optimal cushioning, lightweight response, and lasting lifestyle style."}</p>
                    <ul className="list-disc pl-4 space-y-1.5 uppercase font-semibold text-[10px] tracking-wide text-neutral-400">
                      <li>Flyknit breathable mesh structure</li>
                      <li>Vamp padding lining for durability</li>
                      <li>Curated sole traction patterns</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Returns */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? '' : 'shipping')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black cursor-pointer bg-transparent border-0 py-1"
                >
                  <span>Shipping & Returns</span>
                  <span>{openSection === 'shipping' ? '—' : '+'}</span>
                </button>
                {openSection === 'shipping' && (
                  <div className="mt-3 text-xs text-neutral-500 leading-relaxed space-y-2 animate-slideDown">
                    <p>Free standard dispatch on all orders above ₹4,999. In-transit insurance logs are recorded for security.</p>
                    <p>Returns are accepted within 14 days of delivery. The item must be in its original shoe box with packaging intact.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Reviews */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => setOpenSection(openSection === 'reviews' ? '' : 'reviews')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black cursor-pointer bg-transparent border-0 py-1"
                >
                  <span>Reviews (120)</span>
                  <span>{openSection === 'reviews' ? '—' : '+'}</span>
                </button>
                {openSection === 'reviews' && (
                  <div className="mt-3 text-xs text-neutral-500 leading-relaxed animate-slideDown space-y-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-black" />
                        ))}
                      </div>
                      <span className="font-bold text-black text-[10px] uppercase tracking-wider">4.8 / 5 Rating</span>
                    </div>
                    <p className="italic">"The comfort is absolutely incredible. Exceeded all my premium sneakers design expectations." — Verified Buyer</p>
                  </div>
                )}
              </div>

            </div>

            {/* Admin Helper Box */}
            {user && user.role === 'ROLE_ADMIN' && (
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center font-semibold">
                  <Shield size={14} className="mr-2 text-black shrink-0" />
                  You are logged in as Admin.
                </span>
                <Link
                  to={`/admin/edit-product/${product.id}`}
                  className="nike-btn-black py-1.5 px-3 text-xxs cursor-pointer"
                >
                  Edit in Catalog
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* Reusable Related Footwear Component */}
        <RelatedProducts
          category={product.category}
          currentProductId={product.id}
        />

      </div>
    </div>
  );
}
