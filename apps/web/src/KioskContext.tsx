import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCollection } from './CollectionContext';
import { useTranslation } from 'react-i18next';

type KioskContextType = {
  isKiosk: boolean;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (v: 'normal' | 'large' | 'xlarge') => void;
};

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: ReactNode }) {
  const [isKiosk, setIsKiosk] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { clearTray } = useCollection();
  const { i18n } = useTranslation();

  // Detect ?kiosk=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('kiosk') === '1') {
      setIsKiosk(true);
      document.body.classList.add('kiosk-mode');
    }
  }, []);

  // Idle Detection
  useEffect(() => {
    if (!isKiosk) return;
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      // If we are already on /display, don't reset anything, just wait for interaction to navigate home
      if (location.pathname === '/display') return;

      // Set 15 second idle timeout for testing (normally 3-5 mins)
      timeoutId = setTimeout(() => {
        clearTray();
        i18n.changeLanguage('en');
        navigate('/display');
      }, 15000); 
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('touchstart', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, [isKiosk, location.pathname, clearTray, i18n, navigate]);

  // Apply a11y classes
  useEffect(() => {
    document.documentElement.className = '';
    if (highContrast) document.documentElement.classList.add('high-contrast');
    if (textSize === 'large') document.documentElement.classList.add('text-large');
    if (textSize === 'xlarge') document.documentElement.classList.add('text-xlarge');
  }, [highContrast, textSize]);

  return (
    <KioskContext.Provider value={{ isKiosk, highContrast, setHighContrast, textSize, setTextSize }}>
      {children}
      {isKiosk && (
        <div className="fixed top-0 left-0 right-0 h-12 bg-black text-white z-50 flex items-center justify-end px-4 gap-4 border-b border-white border-opacity-20 text-sm">
           <span className="opacity-50 mr-auto font-bold uppercase tracking-widest text-xs">Accessibility Bar</span>
           <button onClick={() => setHighContrast(!highContrast)} className={`px-3 py-1 border rounded ${highContrast ? 'bg-yellow-500 text-black border-yellow-500' : 'border-white hover:bg-white hover:text-black'}`}>
             High Contrast
           </button>
           <div className="flex bg-white bg-opacity-10 rounded">
             <button onClick={() => setTextSize('normal')} className={`px-3 py-1 ${textSize === 'normal' ? 'bg-white text-black' : ''}`}>A</button>
             <button onClick={() => setTextSize('large')} className={`px-3 py-1 border-x border-white border-opacity-10 ${textSize === 'large' ? 'bg-white text-black' : ''}`}>A+</button>
             <button onClick={() => setTextSize('xlarge')} className={`px-3 py-1 ${textSize === 'xlarge' ? 'bg-white text-black' : ''}`}>A++</button>
           </div>
        </div>
      )}
    </KioskContext.Provider>
  );
}
