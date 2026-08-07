import React from 'react';
import styles from './SavedAddress.module.css';

export const SavedAddress = ({ setCurrentTab }) => {
  return (
    <div className={`bg-[#F8F4EE] min-h-[70vh] flex flex-col items-center justify-center p-8 text-center ${styles.mobileContainer}`}>
      <div className="max-w-2xl bg-white p-6 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#C8A34D]/20 text-left md:text-center">
        <h1 className="font-display-lg text-2xl md:text-4xl text-[#7B8467] mb-4 md:mb-6">Saved Addresses</h1>
        <div className="w-12 md:w-16 h-1 bg-[#C8A34D] ml-0 md:mx-auto mb-6 md:mb-8"></div>
        <p className="font-body-md text-on-surface-variant text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
          Your delivery destinations for our heirloom pieces will be stored here safely. This feature is currently under meticulous preparation.
        </p>
        <button 
          onClick={() => setCurrentTab('shop')}
          className="px-6 md:px-8 py-3 md:py-4 bg-[#7B8467] text-white font-label-caps tracking-widest text-[10px] md:text-[11px] uppercase hover:bg-[#5f6652] transition-colors w-full md:w-auto"
        >
          Return to Boutique
        </button>
      </div>
    </div>
  );
};
