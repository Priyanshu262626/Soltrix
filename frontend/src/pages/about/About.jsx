import React from 'react';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#fcfcfd] text-black min-h-screen text-left">
      {/* Editorial Header Banner */}
      <section className="border-b border-neutral-100 py-20 px-8 bg-[#f7f7f9]">
        <div className="max-w-[90rem] mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            THE SOLTRIX CHRONICLE
          </span>
          <h1 className="text-4xl md:text-6xl font-serif-editorial text-black tracking-tight mt-2 uppercase leading-none">
            Our Narrative
          </h1>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="max-w-[90rem] mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            ESTABLISHED IN 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-serif-editorial text-black tracking-tight leading-tight">
            “Not made for everyone. Designed to move with you.”
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Soltrix was founded on a simple realization: high-end luxury styling and raw athletic performance shouldn't live on opposite ends of a spectrum. We design premium, daily-wear footwear staples engineered to support natural body kinetics without sacrificing visual elegance.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Every contour is mapped, every seam is tested, and every batch is checked by hand. We believe in visual discipline, quiet luxury, and products that speak for themselves.
          </p>
        </div>

        {/* Large Decorative Visual Block */}
        <div className="lg:col-span-7 relative h-[380px] lg:h-[500px] bg-neutral-900 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=80"
            alt="Craftsmanship campaign details"
            className="w-full h-full object-cover opacity-60 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-left max-w-sm space-y-2 text-white">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 block">DESIGN STUDIO</span>
            <h4 className="text-lg font-bold uppercase tracking-tight leading-none">CRAFTED IN GEOMETRY</h4>
            <p className="text-xxs text-neutral-400 leading-normal uppercase">Each piece represents a balance of visual scale and raw material functionality.</p>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Material Pillars */}
      <section className="bg-neutral-50/50 border-y border-neutral-200/50 py-20 px-6 md:px-12">
        <div className="max-w-[90rem] mx-auto space-y-12">
          <div className="text-left space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
              MATERIAL ARCHITECTURE
            </span>
            <h2 className="text-3xl font-serif-editorial text-black tracking-tight uppercase leading-none">
              Craftsmanship Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 border border-neutral-200/50 rounded-lg shadow-xxs space-y-4">
              <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center text-black">
                <Sparkles size={18} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-black">Engineered Foam Bases</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our proprietary midsole structures use high-density reactive foam formulations molded under heat constraints to cushion impacts while returning optimal energy output.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 border border-neutral-200/50 rounded-lg shadow-xxs space-y-4">
              <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center text-black">
                <Shield size={18} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-black">Conscious Material selection</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                We select premium, eco-certified meshes, recycled fiber synthetics, and organic rubbers to build shoes that offer high tensile longevity while remaining conscious of their footprint.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 border border-neutral-200/50 rounded-lg shadow-xxs space-y-4">
              <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center text-black">
                <Heart size={18} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-black">Hand-Finished Quality</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Before leaving our partner facilities, every single product is hand-inspected for stitching consistency, bond integrity, and layout alignment details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Pledge */}
      <section className="max-w-[90rem] mx-auto px-6 py-20 lg:py-28 text-left space-y-12">
        <div className="max-w-2xl space-y-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            SUSTAINABILITY PLEDGE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif-editorial text-black tracking-tight leading-tight">
            Better Materials, Better Footwear Futures
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            At Soltrix, our vision extends beyond just designing sneakers. We believe in taking responsibility for the full product lifecycle. That is why we are committed to carbon-offsetting our shipping routes and integrating recycled structural plastics directly into our heel counters.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            By partnering with sustainable manufacturers who share our dedication to minimal waste, we continue to prove that premium luxury performance can be built with conscious decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
