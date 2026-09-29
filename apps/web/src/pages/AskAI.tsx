import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AskAI() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('quick');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query, mode: mode };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content, mode: mode, lang: i18n.language })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer, sources: data.sources }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Connection error.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col" style={{ background: 'var(--color-suit-navy)', color: 'var(--color-paper)', fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>{t('AskAI')}</h1>
        <p className="text-sm opacity-70 mb-8 border-b border-white border-opacity-20 pb-4">Answers are grounded in the archive. Every claim is cited directly to a source document.</p>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4">
          {chatHistory.length === 0 && (
            <div className="text-center opacity-50 my-20">
              <p>Try asking: "Why did he call it Annihilation of Caste rather than reform?"</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-white bg-opacity-10 text-white rounded-br-none' : 'bg-black bg-opacity-30 border border-white border-opacity-10 rounded-bl-none'}`}>
                {msg.role === 'user' && <div className="text-xs opacity-50 mb-1 uppercase">Mode: {msg.mode?.replace('_', ' ')}</div>}
                <p className="text-lg leading-relaxed">{msg.content}</p>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white border-opacity-10">
                    <span className="text-xs uppercase opacity-50 block mb-2">Sources Used:</span>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((s: any, idx: number) => (
                        <a key={idx} href={`/item/${s.id}`} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-blue-900 bg-opacity-30 hover:bg-opacity-50 transition-colors border border-blue-800 border-opacity-50 cursor-pointer text-blue-200">
                          <span>{s.type}</span>
                          <span className="opacity-50">•</span>
                          <span className="font-semibold">{s.title} ({s.year})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.role === 'ai' && (
                  <div className="mt-3 flex gap-2 justify-end opacity-50">
                    <button className="hover:text-yellow-500 hover:opacity-100 px-2">👍</button>
                    <button className="hover:text-yellow-500 hover:opacity-100 px-2">👎</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-black bg-opacity-30 border border-white border-opacity-10 rounded-2xl rounded-bl-none p-5">
                <p className="animate-pulse">Searching the archive...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleAsk} className="bg-black bg-opacity-40 p-4 rounded-xl border border-white border-opacity-10 backdrop-blur-md">
          <div className="flex gap-4 mb-3">
            {['quick', 'deep_dive', 'compare', 'explain_student'].map(m => (
              <label key={m} className={`cursor-pointer text-sm px-3 py-1 rounded-full border transition-colors ${mode === m ? 'bg-yellow-600 bg-opacity-20 border-yellow-500 text-yellow-500' : 'border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 opacity-70'}`}>
                <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="hidden" />
                {m === 'quick' ? 'Quick Answer' : m === 'deep_dive' ? 'Deep Dive' : m === 'compare' ? 'Compare Ideas' : 'Explain to a Student'}
              </label>
            ))}
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything about Dr. Ambedkar's work..."
              className="flex-1 bg-transparent border-none text-white text-lg focus:outline-none placeholder-white placeholder-opacity-30"
            />
            <button type="submit" disabled={!query.trim() || loading} className="px-6 py-3 rounded-lg font-bold text-gray-900 transition-colors disabled:opacity-50" style={{ background: 'var(--color-gold)' }}>
              Ask
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

