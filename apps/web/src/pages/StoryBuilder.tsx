import React, { useState } from 'react';

export default function StoryBuilder() {
  const [chapters, setChapters] = useState([{ title: '', text: '' }]);
  const [status, setStatus] = useState('');

  const handleSave = () => {
    // Mock save to API
    setStatus('Story saved to database successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-blue-900" style={{ fontFamily: 'var(--font-serif)' }}>Story Module Builder</h1>
        <p className="mb-6 opacity-70 text-sm">Compose chapters that play like the Constitution book section. Visitors will scroll through these chapters.</p>
        
        {chapters.map((chap, i) => (
          <div key={i} className="mb-6 p-4 border border-gray-200 rounded relative bg-gray-50">
            <h3 className="font-bold mb-3 uppercase text-xs">Chapter {i + 1}</h3>
            <input 
              type="text" 
              placeholder="Chapter Title"
              value={chap.title}
              onChange={e => {
                const newChaps = [...chapters];
                newChaps[i].title = e.target.value;
                setChapters(newChaps);
              }}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Chapter narrative text..."
              value={chap.text}
              onChange={e => {
                const newChaps = [...chapters];
                newChaps[i].text = e.target.value;
                setChapters(newChaps);
              }}
              className="w-full p-2 border rounded h-32 focus:outline-none focus:border-blue-500"
            />
            <div className="mt-3 text-sm opacity-50 flex gap-4">
              <button disabled className="underline cursor-not-allowed">Add Image</button>
              <button disabled className="underline cursor-not-allowed">Link Item</button>
            </div>
            
            {chapters.length > 1 && (
              <button 
                onClick={() => setChapters(chapters.filter((_, idx) => idx !== i))}
                className="absolute top-4 right-4 text-red-500 font-bold"
              >
                X
              </button>
            )}
          </div>
        ))}
        
        <div className="flex gap-4">
          <button 
            onClick={() => setChapters([...chapters, { title: '', text: '' }])}
            className="px-4 py-2 border border-blue-900 text-blue-900 rounded font-bold hover:bg-blue-50"
          >
            + Add Chapter
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-900 text-white rounded font-bold shadow hover:bg-blue-800"
          >
            Publish Story
          </button>
        </div>
        
        {status && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">{status}</div>}
      </div>
    </div>
  );
}
