import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCollection } from '../CollectionContext';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function Search() {
  const { t, i18n } = useTranslation();
  const { addToTray, tray } = useCollection();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = useRef<any>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/graph')
      .then(res => res.json())
      .then(data => setGraphData(data));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--color-suit-navy)', color: 'var(--color-paper)', fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Search & Results */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{t('Search')}</h1>
          
          <form onSubmit={handleSearch} className="mb-8 flex gap-4">
            <input 
              type="text" 
              value={query}
              onChange={e => { setQuery(e.target.value); if(keyboardRef.current) keyboardRef.current.setInput(e.target.value); }}
              placeholder={t('SearchPlaceholder')} onFocus={() => setShowKeyboard(true)}
              className="flex-1 p-4 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500"
            />
            <button type="submit" className="px-8 py-4 rounded-lg font-bold text-gray-900 transition-colors" style={{ background: 'var(--color-gold)' }}>
              {t('Search')}
            </button>
          </form>

                    {showKeyboard && (
            <div className="mb-8 text-black">
              <div className="flex justify-between bg-gray-200 p-2 rounded-t-lg">
                <span className="text-xs font-bold uppercase">On-Screen Keyboard ({i18n.language})</span>
                <button type="button" onClick={() => setShowKeyboard(false)} className="text-red-500 font-bold px-2">X</button>
              </div>
              <Keyboard 
                keyboardRef={r => (keyboardRef.current = r)}
                onChange={setQuery}
                layoutName="default"
                theme="hg-theme-default myTheme1"
              />
            </div>
          )}
          <div className="space-y-6">
            {results.map((item: any) => (
              <div key={item.id} className="p-6 rounded-xl border border-white border-opacity-10 bg-black bg-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-gold)' }}>{item.title}</h3>
                  <span className="text-xs uppercase px-2 py-1 rounded bg-white bg-opacity-10">{item.collection}</span>
                </div>
                <p className="text-sm opacity-80 mb-4">{item.description}</p>
                <div className="flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-red-900 bg-opacity-40 rounded">Semantic Match</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToTray({id: item.id, title: item.title, type: item.collection || 'Document'}); }}
                    className="text-xs px-2 py-1 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
                  >
                    {tray.find(i => i.id === item.id) ? 'Saved ?' : '+ Add to Tray'}
                  </button>
                </div>
              </div>
            ))}
            {results.length === 0 && query && (
              <p className="opacity-60 italic">No exact matches, but semantic search is exploring related concepts...</p>
            )}
          </div>
        </div>

        {/* Right Column: Knowledge Graph Mock */}
        <div className="w-full md:w-1/3 p-6 rounded-xl border border-white border-opacity-10 bg-black bg-opacity-40">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Knowledge Graph</h3>
          <p className="text-sm opacity-70 mb-6">Interactive force-directed graph of entities related to your query.</p>
          
          <div className="relative w-full aspect-square border border-white border-opacity-5 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Extremely simple pure CSS mock of a network graph */}
            <div className="absolute w-full h-full flex items-center justify-center">
              {graphData?.nodes.map((node: any, i: number) => {
                const angle = (i / graphData.nodes.length) * Math.PI * 2;
                const r = 80;
                return (
                  <div key={node.id} className="absolute flex flex-col items-center justify-center" style={{ transform: `translate(${Math.cos(angle)*r}px, ${Math.sin(angle)*r}px)`}}>
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(201,162,75,0.8)] z-10" />
                    <span className="text-[10px] mt-1 whitespace-nowrap bg-black bg-opacity-50 px-1 rounded">{node.label}</span>
                  </div>
                );
              })}
              {/* Center node */}
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-[0_0_15px_rgba(143,27,43,0.8)] z-10" />
              
              {/* Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                 <line x1="50%" y1="50%" x2="70%" y2="50%" stroke="white" strokeWidth="1" />
                 <line x1="50%" y1="50%" x2="40%" y2="30%" stroke="white" strokeWidth="1" />
                 <line x1="50%" y1="50%" x2="40%" y2="70%" stroke="white" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


