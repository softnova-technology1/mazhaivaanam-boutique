import { Sparkles, X } from 'lucide-react';

export function OfferZoneModal({ popupConfig, onClose, onExplore }) {
  if (!popupConfig || popupConfig.isActive === false) return null;

  const {
    badgeText = 'LIMITED TIME OFFER',
    title = '',
    description = '',
    bgImage = 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/limited_offer_page/limited.png',
    buttonText = 'EXPLORE OFFERS NOW',
  } = popupConfig;

  const hasTitle = Boolean(title && title.trim());
  const hasDesc = Boolean(description && description.trim());

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onExplore}
    >
      <div 
        className="relative max-w-[440px] w-full rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-[#D4AF37] bg-white flex flex-col group transition-transform duration-300 cursor-pointer max-h-[92vh]"
        style={{ transform: 'translateZ(0)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Header Controls */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
          {badgeText ? (
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-black font-label-caps text-[10px] tracking-[0.18em] font-bold px-3 py-1.5 rounded-full shadow-2xl uppercase pointer-events-auto">
              <Sparkles size={11} className="text-black" />
              <span>{badgeText}</span>
            </div>
          ) : <div />}

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/75 hover:bg-black backdrop-blur-md border border-[#D4AF37]/60 text-white/90 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl pointer-events-auto"
            aria-label="Close offer modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 100% Edge-to-Edge Poster Image */}
        <div 
          className="relative w-full overflow-hidden bg-black flex items-center justify-center"
          onClick={onExplore}
        >
          <img 
            src={bgImage || 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/limited_offer_page/limited.png'} 
            alt="Offer Banner" 
            className="w-full h-auto object-cover max-h-[65vh] transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e) => { e.target.src = 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/limited_offer_page/limited.png'; }}
          />
        </div>

        {/* Bottom Footer Area — Main Heading and Description Text positioned right above the button */}
        <div className="relative z-20 p-4 sm:p-5 bg-white border-t border-[#D4AF37]/40 flex flex-col items-center text-center">
          {hasTitle && (
            <h3 className="font-display-lg text-base sm:text-xl text-[#1a1a1a] font-bold leading-snug mb-1.5 tracking-wide">
              {title}
            </h3>
          )}

          {hasDesc && (
            <p className="text-[#4a4a4a] text-xs sm:text-sm font-normal leading-relaxed mb-3 max-w-sm">
              {description}
            </p>
          )}

          <style>{`
            @keyframes goldShineSweep {
              0% { transform: translateX(-180%) skewX(-25deg); opacity: 0; }
              20% { opacity: 0.9; }
              55% { transform: translateX(280%) skewX(-25deg); opacity: 0; }
              100% { transform: translateX(280%) skewX(-25deg); opacity: 0; }
            }
            @keyframes goldPulseGlow {
              0%, 100% {
                box-shadow: 0 4px 18px rgba(184, 134, 11, 0.45), 0 0 0 1px rgba(223, 183, 72, 0.4);
              }
              50% {
                box-shadow: 0 6px 26px rgba(212, 175, 55, 0.75), 0 0 16px rgba(245, 208, 97, 0.5), 0 0 0 1.5px rgba(255, 235, 150, 0.6);
              }
            }
          `}</style>

          <button 
            type="button"
            onClick={onExplore}
            className="relative overflow-hidden w-full py-3.5 px-5 font-label-caps text-[13px] sm:text-sm tracking-[0.14em] font-extrabold rounded-full transition-all duration-300 flex items-center justify-center gap-2 uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7A5308 0%, #B8860B 28%, #DFB748 50%, #B8860B 72%, #7A5308 100%)',
              animation: 'goldPulseGlow 3s infinite ease-in-out',
              color: '#FFFFFF',
            }}
          >
            {/* Continuous Glistening Shining Light Beam Sweep */}
            <span 
              className="absolute inset-0 pointer-events-none" 
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 75%, transparent 100%)',
                animation: 'goldShineSweep 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1)',
                width: '60%',
                height: '100%',
              }} 
            />
            <span className="relative z-10" style={{ color: '#FFFFFF', fontWeight: 800, textShadow: '0 1px 2px rgba(40, 25, 0, 0.6)' }}>
              {buttonText || 'EXPLORE OFFERS NOW'}
            </span>
            <Sparkles size={16} className="relative z-10 text-white animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}
