import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, Landmark, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function CheckoutForm({ onSubmit, loading = false }) {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
    },
  });

  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const profile = await api.user.getProfile();
        if (profile && profile.address) {
          const addressStr = profile.address;
          
          // Try parsing formatted address: "address, city, state - pincode"
          const pincodeSplit = addressStr.split(' - ');
          if (pincodeSplit.length === 2) {
            const pincode = pincodeSplit[1].trim();
            const rest = pincodeSplit[0];
            const parts = rest.split(', ');
            if (parts.length >= 3) {
              const state = parts[parts.length - 1].trim();
              const city = parts[parts.length - 2].trim();
              const streetAddress = parts.slice(0, parts.length - 2).join(', ').trim();
              
              setValue('address', streetAddress);
              setValue('city', city);
              setValue('state', state);
              setValue('pincode', pincode);
              return;
            }
          }
          
          // Fallback: put the whole address into the address field
          setValue('address', addressStr);
        }
      } catch (err) {
        console.error('Failed to load default shipping address:', err);
      }
    };

    loadDefaultAddress();
  }, [setValue]);

  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\s?/g, '').replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < rawVal.length; i += 4) {
      parts.push(rawVal.substring(i, i + 4));
    }
    setValue('cardNumber', parts.join(' '));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setValue('cardExpiry', val);
  };

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit({ ...data, paymentMethod });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 text-left" id="checkout-form">
      
      {/* Shipping Details */}
      <div className="border border-neutral-200/60 rounded-sm p-6 bg-white shadow-xxs">
        <h2 className="text-sm font-black text-black border-b border-neutral-100 pb-3 mb-5 flex items-center uppercase tracking-[0.15em]">
          <Truck size={14} className="mr-2 text-black shrink-0" /> Shipping Details
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Street Address *</label>
            <input
              type="text"
              placeholder="Flat/House no, building, street, area"
              {...register('address', { required: 'Street address is required' })}
              className={`w-full nike-input ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">City *</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                {...register('city', { required: 'City is required' })}
                className={`w-full nike-input ${errors.city ? 'border-red-500' : ''}`}
              />
              {errors.city && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.city.message}</span>
              )}
            </div>
            <div>
              <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">State *</label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                {...register('state', { required: 'State is required' })}
                className={`w-full nike-input ${errors.state ? 'border-red-500' : ''}`}
              />
              {errors.state && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.state.message}</span>
              )}
            </div>
            <div>
              <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Pincode *</label>
              <input
                type="text"
                placeholder="560001"
                maxLength={6}
                {...register('pincode', {
                  required: 'Pincode is required',
                  pattern: { value: /^\d{6}$/, message: 'Pincode must be exactly 6 digits' }
                })}
                className={`w-full nike-input font-mono ${errors.pincode ? 'border-red-500' : ''}`}
              />
              {errors.pincode && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.pincode.message}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="border border-neutral-200/60 rounded-sm p-6 bg-white shadow-xxs">
        <h2 className="text-sm font-black text-black border-b border-neutral-100 pb-3 mb-5 flex items-center uppercase tracking-[0.15em]">
          <CreditCard size={14} className="mr-2 text-black shrink-0" /> Payment Method
        </h2>

        {/* payment selectors */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { id: 'card', name: 'Card', icon: CreditCard },
            { id: 'upi', name: 'UPI / QR', icon: Landmark },
            { id: 'cod', name: 'COD', icon: Truck },
          ].map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`p-3.5 border rounded-sm flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                  paymentMethod === method.id
                    ? 'border-black bg-neutral-900 text-white font-bold'
                    : 'border-neutral-200 bg-white text-neutral-400 hover:text-black hover:border-neutral-300'
                }`}
              >
                <Icon size={16} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{method.name}</span>
              </button>
            );
          })}
        </div>

        {/* card input fields */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Card Number *</label>
              <input
                type="text"
                placeholder="4111 2222 3333 4444"
                maxLength={19}
                {...register('cardNumber', {
                  required: paymentMethod === 'card' ? 'Card number is required' : false,
                  onChange: handleCardNumberChange,
                  pattern: { value: /^(\d{4}\s){3}\d{4}$/, message: 'Must be 16 digits' }
                })}
                className={`w-full nike-input font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
              />
              {errors.cardNumber && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.cardNumber.message}</span>
              )}
            </div>
            <div>
              <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Cardholder Name *</label>
              <input
                type="text"
                placeholder="Enter name on card"
                {...register('cardName', { required: paymentMethod === 'card' ? 'Cardholder name is required' : false })}
                className={`w-full nike-input ${errors.cardName ? 'border-red-500' : ''}`}
              />
              {errors.cardName && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.cardName.message}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Expiry Date *</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  {...register('cardExpiry', {
                    required: paymentMethod === 'card' ? 'Expiry is required' : false,
                    onChange: handleExpiryChange,
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Must be MM/YY' }
                  })}
                  className={`w-full nike-input font-mono ${errors.cardExpiry ? 'border-red-500' : ''}`}
                />
                {errors.cardExpiry && (
                  <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.cardExpiry.message}</span>
                )}
              </div>
              <div>
                <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">CVV *</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  {...register('cardCvv', {
                    required: paymentMethod === 'card' ? 'CVV is required' : false,
                    pattern: { value: /^\d{3}$/, message: 'Must be 3 digits' }
                  })}
                  className={`w-full nike-input font-mono ${errors.cardCvv ? 'border-red-500' : ''}`}
                />
                {errors.cardCvv && (
                  <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.cardCvv.message}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* UPI option panel */}
        {paymentMethod === 'upi' && (
          <div className="text-center p-6 bg-neutral-50 border border-neutral-200 rounded-sm space-y-4 animate-fadeIn">
            <div className="w-32 h-32 bg-white p-2 rounded-sm mx-auto flex items-center justify-center border border-neutral-200/80">
              <div className="w-full h-full border border-dashed border-neutral-900 flex items-center justify-center">
                <span className="text-[10px] font-black tracking-widest text-black">UPI SCANNER</span>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 max-w-xs mx-auto uppercase font-semibold tracking-wider">
              Scan using GPay, PhonePe, or Paytm. The transaction updates will process automatically.
            </p>
          </div>
        )}

        {/* COD option panel */}
        {paymentMethod === 'cod' && (
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm flex items-start space-x-3 animate-fadeIn">
            <Truck size={16} className="text-black shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-black uppercase tracking-wider">Cash on Delivery</h4>
              <p className="text-neutral-500 mt-1 uppercase font-semibold text-[9px] tracking-wide">
                Pay with cash upon package drop off. Verification checks are requested before parcel delivery.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Button to place order */}
      <button
        type="submit"
        disabled={loading}
        className="w-full nike-btn-black flex items-center justify-center space-x-2 text-xs py-4"
      >
        {loading ? (
          <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
        ) : (
          <>
            <ShieldCheck size={16} />
            <span>Place Order</span>
          </>
        )}
      </button>

    </form>
  );
}
