import React from 'react';
import { Info, ArrowRight } from 'lucide-react';

export default function CartSummary({
  subtotal = 0,
  deliveryCharge = 0,
  total = 0,
  onCheckout,
  showCheckoutBtn = true,
}) {
  return (
    <div className="border border-neutral-200/60 rounded-sm p-6 bg-[#f9f9fb] sticky top-28 text-left">
      <h2 className="text-sm font-black text-black uppercase tracking-[0.15em] border-b border-neutral-200/80 pb-3 mb-5">Summary</h2>

      <div className="space-y-4 text-[11px] mb-6 font-semibold">
        <div className="flex justify-between text-neutral-500 uppercase tracking-wider">
          <span>Subtotal</span>
          <span className="font-mono text-black font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-neutral-500 uppercase tracking-wider">
          <span>Delivery Charges</span>
          <span className="font-mono text-black font-bold">
            {deliveryCharge === 0 ? <span className="text-green-600 font-bold uppercase">FREE</span> : `₹${deliveryCharge}`}
          </span>
        </div>

        {deliveryCharge > 0 && (
          <div className="bg-white border border-neutral-200/80 p-3 rounded-sm flex items-start space-x-2">
            <Info size={12} className="text-black mt-0.5 shrink-0" />
            <p className="text-[9px] text-neutral-500 leading-normal font-semibold uppercase tracking-wide">
              Add <strong>₹{(5000 - subtotal).toLocaleString('en-IN')}</strong> more for free shipping!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs font-bold text-neutral-800 uppercase tracking-wider border-t border-neutral-200 pt-4 mb-6">
        <span>Grand Total</span>
        <span className="font-mono text-lg text-black font-black">₹{total.toLocaleString('en-IN')}</span>
      </div>

      {showCheckoutBtn && (
        <button
          type="button"
          onClick={onCheckout}
          className="w-full nike-btn-black flex items-center justify-center space-x-2 text-xs py-3.5"
        >
          <span>Checkout</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
