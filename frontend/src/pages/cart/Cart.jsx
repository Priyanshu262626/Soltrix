import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummary from '../../components/cart/CartSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const cartItems = cart?.cartItems || [];

  const handleQtyChange = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await updateCartQuantity(itemId, newQty);
      toast('Quantity updated.', 'success');
    } catch (err) {
      toast('Failed to update quantity.', 'error');
    }
  };

  const handleRemove = async (itemId) => {
    if (!window.confirm('Remove this item from your bag?')) return;
    try {
      await removeFromCart(itemId);
      toast('Item removed from bag.', 'success');
    } catch (err) {
      toast('Failed to remove item.', 'error');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryCharge = subtotal > 4999 ? 0 : 250;
  const total = subtotal + deliveryCharge;

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="border-b border-neutral-100 pb-6 mb-10 text-left">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            MY BAG
          </span>
          <h1 className="text-3xl md:text-4xl font-serif-editorial text-black tracking-tight mt-2 uppercase">
            Shopping Bag
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200/60 rounded-sm max-w-xl mx-auto bg-white p-8">
            <div className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-base font-bold text-black uppercase tracking-tight">Your bag is empty</h2>
            <p className="text-neutral-500 mt-2 text-xs max-w-xs mx-auto leading-relaxed uppercase font-semibold tracking-wide">
              Browse our catalog of premium, hand-crafted footwear and secure your pair.
            </p>
            <Link
              to="/shop"
              className="nike-btn-black mt-6 inline-flex items-center space-x-2 text-xs"
            >
              <ArrowLeft size={12} /> <span>Browse catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
            
            {/* Bag Items list */}
            <div className="lg:col-span-2 divide-y divide-neutral-100 bg-white border border-neutral-200/60 rounded-sm p-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQtyChange={handleQtyChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Price invoice Summary Component */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                total={total}
                onCheckout={() => navigate('/checkout')}
                showCheckoutBtn={true}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
