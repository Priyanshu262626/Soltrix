import React, { useState } from 'react';

export default function ImageGallery({ imageUrl, alt = 'Shoe Image' }) {
  const [activeView, setActiveView] = useState('profile');

  if (!imageUrl) return null;

  // CSS transform classes to simulate multi-angle shots
  const viewStyles = {
    profile: 'rotate-[-5deg]',
    closeUp: 'scale-125 origin-center',
    side: 'rotate-[-12deg] scale-95',
    top: 'rotate-[8deg] scale-90',
  };

  const views = [
    { id: 'profile', label: 'Profile' },
    { id: 'closeUp', label: 'Zoom' },
    { id: 'side', label: 'Sole' },
    { id: 'top', label: 'Angle' },
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full text-left">
      {/* Thumbnails Column (left side on desktop, bottom on mobile) */}
      <div className="flex flex-row md:flex-col gap-3 justify-start shrink-0">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveView(v.id)}
            className={`w-14 h-14 md:w-16 md:h-16 p-2 rounded bg-[#f7f7f9] border flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 ${
              activeView === v.id 
                ? 'border-black' 
                : 'border-neutral-200/50 hover:border-neutral-300'
            }`}
          >
            <img
              src={imageUrl}
              alt={`${alt} view`}
              className={`max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300 ${viewStyles[v.id]}`}
            />
          </button>
        ))}
      </div>

      {/* Main Large Display (right side on desktop, top on mobile) */}
      <div className="flex-grow p-8 bg-white border border-neutral-200/60 rounded flex items-center justify-center relative overflow-hidden h-[320px] md:h-[450px]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] md:w-[320px] md:h-[320px] bg-neutral-50 rounded-full filter blur-xl opacity-60 z-0 pointer-events-none" />
        <img
          src={imageUrl}
          alt={alt}
          className={`max-w-full max-h-[85%] object-contain transition-all duration-500 relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.06)] ${viewStyles[activeView]}`}
        />
      </div>
    </div>
  );
}
