import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Display() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();
  
  const quotes = [
    "I measure the progress of a community by the degree of progress which women have achieved.",
    "Life should be great rather than long.",
    "Cultivation of mind should be the ultimate aim of human existence.",
    "Equality may be a fiction but nonetheless one must accept it as a governing principle."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Any touch/click wakes up the kiosk and goes to home
  const wakeUp = () => navigate('/');

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-8 cursor-pointer relative overflow-hidden"
      style={{ background: 'var(--color-suit-navy)', color: 'var(--color-paper)', fontFamily: 'var(--font-sans)' }}
      onClick={wakeUp}
    >
      {/* Animated abstract background */}
      <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at center, var(--color-gold) 0%, transparent 70%)', transform: `scale(${1 + (quoteIndex * 0.1)})`, transition: 'transform 8s linear' }}></div>
      
      <div className="z-10 max-w-4xl space-y-12 transition-opacity duration-1000">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>
          "{quotes[quoteIndex]}"
        </h1>
        <p className="text-2xl opacity-70">— Dr. B. R. Ambedkar</p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center animate-pulse opacity-50 z-10">
        <p className="text-xl tracking-widest uppercase">Touch anywhere to begin</p>
      </div>
    </div>
  );
}
