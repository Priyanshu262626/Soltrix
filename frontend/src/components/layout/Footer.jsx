import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-[#fbfbfd] py-14 px-8 mt-auto text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-lg font-black tracking-[0.3em] text-black">SOLTRIX</span>
          <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest mt-2">
            © {new Date().getFullYear()} Soltrix, Inc. Engineered for movement.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          <span className="hover:text-black transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black transition-colors cursor-pointer">Terms of Sale</span>
          <span className="hover:text-black transition-colors cursor-pointer">Local Store Network</span>
          <span className="hover:text-black transition-colors cursor-pointer">Careers</span>
        </div>
      </div>
    </footer>
  );
}
