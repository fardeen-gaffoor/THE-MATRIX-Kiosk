import React, { useState } from 'react';

type Role = 'super_admin' | 'archivist' | 'editor' | 'viewer';

export default function Admin() {
  const [role, setRole] = useState<Role>('super_admin');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  
  const [reviewQueue, setReviewQueue] = useState([
    { id: 1, type: 'OCR Correction', original: 'Dalit panthes', suggestion: 'Dalit Panthers', status: 'pending' },
    { id: 2, type: 'AI Summary', original: '-', suggestion: 'A letter discussing constitutional remedies.', status: 'pending' },
    { id: 3, type: 'Translation', original: 'Liberty, Equality, Fraternity', suggestion: 'स्वातंत्र्य, समता, बंधुता', status: 'pending' }
  ]);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setReviewQueue(q => q.map(item => item.id === id ? { ...item, status: action } : item));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Uploading and adding to OCR/Embeddings queue...');
    setTimeout(() => {
      setStatus('Success: File processed. AI output moved to Review Queue.');
      setFile(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-8 text-black" style={{ background: '#f8fafc', fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header / Role Switcher */}
        <div className="bg-white p-6 rounded shadow flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900" style={{ fontFamily: 'var(--font-serif)' }}>Archive Administration</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold opacity-70">Simulate Role:</span>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value as Role)}
              className="p-2 border rounded font-bold"
            >
              <option value="super_admin">Super Admin</option>
              <option value="archivist">Archivist (Uploads & Metadata)</option>
              <option value="editor">Editor (Content Review)</option>
              <option value="viewer">Viewer (Read-only Stats)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Batch Upload & Metadata (Super Admin, Archivist) */}
            {(role === 'super_admin' || role === 'archivist') && (
              <div className="bg-white p-6 rounded shadow border-t-4 border-blue-900">
                <h2 className="text-xl font-bold mb-4">Batch Upload & Import</h2>
                <div className="flex gap-4 mb-4">
                  <button className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-bold">Import CSV</button>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-bold">Import Dublin Core XML</button>
                </div>
                <form onSubmit={handleUpload} className="space-y-4">
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full border p-2 rounded" />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Enforce 10-year Embargo</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Run Duplicate Detection</label>
                  </div>
                  <button type="submit" disabled={!file} className="px-6 py-2 bg-blue-900 text-white rounded font-bold hover:bg-blue-800 disabled:opacity-50">
                    Upload to Ingestion Queue
                  </button>
                </form>
                {status && <div className="mt-4 p-3 bg-green-50 text-green-800 rounded text-sm">{status}</div>}
              </div>
            )}

            {/* AI Review Queue (Super Admin, Editor, Archivist) */}
            {(role === 'super_admin' || role === 'editor' || role === 'archivist') && (
              <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                <h2 className="text-xl font-bold mb-4">AI Human-in-the-Loop Review Queue</h2>
                <p className="text-sm opacity-70 mb-4">Nothing AI-generated goes public without approval.</p>
                <div className="space-y-4">
                  {reviewQueue.map(item => (
                    <div key={item.id} className={`p-4 border rounded ${item.status === 'pending' ? 'bg-yellow-50' : item.status === 'approve' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs uppercase font-bold text-yellow-800 bg-yellow-200 px-2 py-1 rounded">{item.type}</span>
                        <span className="text-xs opacity-50">Item ID: samp-{item.id}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div className="p-2 bg-white rounded border border-red-200 line-through opacity-70">{item.original}</div>
                        <div className="p-2 bg-white rounded border border-green-200 font-bold">{item.suggestion}</div>
                      </div>
                      {item.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(item.id, 'approve')} className="px-4 py-1 bg-green-600 text-white text-xs font-bold rounded">Approve</button>
                          <button onClick={() => handleAction(item.id, 'reject')} className="px-4 py-1 bg-red-600 text-white text-xs font-bold rounded">Reject</button>
                          <button className="px-4 py-1 border text-xs font-bold rounded ml-auto">Edit Manually</button>
                        </div>
                      ) : (
                        <div className="text-sm font-bold uppercase">{item.status}D</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'viewer' && (
              <div className="bg-white p-6 rounded shadow text-center py-12">
                <p className="opacity-50">Your role (Viewer) only permits access to analytics and dashboards.</p>
              </div>
            )}

          </div>

          {/* Right Sidebar: Analytics & Health */}
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold border-b pb-2 mb-4">Collection Stats</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Total Items:</span> <span className="font-bold">1,204</span></li>
                <li className="flex justify-between"><span>Digitized Pages:</span> <span className="font-bold">45,912</span></li>
                <li className="flex justify-between"><span>Pending Review:</span> <span className="font-bold text-red-500">{reviewQueue.filter(i => i.status === 'pending').length}</span></li>
                <li className="flex justify-between"><span>Public Domain:</span> <span className="font-bold">98%</span></li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold border-b pb-2 mb-4">Top Searches (24h)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-gray-400">1.</span> Annihilation of Caste</li>
                <li className="flex items-center gap-2"><span className="text-gray-400">2.</span> Poona Pact</li>
                <li className="flex items-center gap-2"><span className="text-gray-400">3.</span> Constitution Drafts</li>
              </ul>
            </div>

            {(role === 'super_admin') && (
              <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                <h3 className="font-bold border-b pb-2 mb-4">Kiosk Fleet Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Main Hall (K1)</span>
                    <span className="text-green-500 font-bold">● Online (30s)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Library (K2)</span>
                    <span className="text-red-500 font-bold">● Offline (2h)</span>
                  </div>
                </div>
              </div>
            )}
            
            {(role === 'super_admin') && (
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-bold border-b pb-2 mb-4">Audit Log</h3>
                <div className="text-xs space-y-2 opacity-70 font-mono">
                  <p>[10:45] editor1 approved AI Summary #84</p>
                  <p>[10:42] archivist3 batch-uploaded 12 items</p>
                  <p>[09:12] SYSTEM: Kiosk K2 missed heartbeat</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
