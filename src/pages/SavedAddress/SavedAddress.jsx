import React from 'react';

export const SavedAddress = ({ setCurrentTab }) => {
  return (
    <div className="bg-[#F8F4EE] min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl bg-white p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C8A34D]/20">
        <h1 className="font-display-lg text-4xl text-[#7B8467] mb-6">Saved Addresses</h1>
        <div className="w-16 h-1 bg-[#C8A34D] mx-auto mb-8"></div>
        <p className="font-body-md text-on-surface-variant text-lg leading-relaxed mb-10">
          Your delivery destinations for our heirloom pieces will be stored here safely. This feature is currently under meticulous preparation.
        </p>
        <button 
          onClick={() => setCurrentTab('shop')}
          className="px-8 py-4 bg-[#7B8467] text-white font-label-caps tracking-widest text-[11px] uppercase hover:bg-[#5f6652] transition-colors"
        >
          Return to Boutique
        </button>
      </div>
    </div>
  );
};
