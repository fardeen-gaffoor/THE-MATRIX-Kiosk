import React, { useState, useEffect } from 'react';
import { useCollection } from '../CollectionContext';

export default function Timeline() {
  const [events, setEvents] = useState<any[]>([]);
  const { addToTray } = useCollection();

  useEffect(() => {
    fetch('http://localhost:8000/api/timeline')
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-suit-navy)', color: 'var(--color-paper)', fontFamily: 'var(--font-sans)' }}>
      <header className="p-8 pb-0 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>A Life, In Record</h1>
        <p className="opacity-70">Interactive, data-driven timeline of major milestones.</p>
      </header>

      <div className="max-w-4xl mx-auto py-12 relative">
        {/* Timeline spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white bg-opacity-20 transform -translate-x-1/2"></div>
        
        {events.map((ev, i) => (
          <div key={i} className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`w-1/2 ${i % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
              <div className="bg-black bg-opacity-30 p-6 rounded-xl border border-white border-opacity-10 hover:border-yellow-500 transition-colors group relative shadow-2xl">
                {/* Connector Dot */}
                <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-yellow-500 transform -translate-y-1/2 ${i % 2 === 0 ? '-right-[26px]' : '-left-[26px]'}`}></div>
                
                <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{ev.year}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{ev.title}</h3>
                <p className="opacity-80 text-sm leading-relaxed mb-4">{ev.desc}</p>
                
                {ev.related_item_id && (
                  <div className="pt-4 border-t border-white border-opacity-10 flex gap-2 justify-end">
                    <a href={`/item/${ev.related_item_id}`} className="px-3 py-1 text-xs border border-blue-500 text-blue-400 rounded hover:bg-blue-900 hover:text-white transition-colors">
                      View Source Item
                    </a>
                    <button 
                      onClick={() => addToTray({ id: ev.related_item_id, title: ev.title, type: 'Timeline Event' })}
                      className="px-3 py-1 text-xs bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
                    >
                      + Add to Tray
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
