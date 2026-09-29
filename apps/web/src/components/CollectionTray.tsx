import React, { useState } from 'react';
import { useCollection } from '../CollectionContext';
import { QRCodeSVG } from 'qrcode.react';

export default function CollectionTray() {
  const { tray, removeFromTray, clearTray } = useCollection();
  const [isOpen, setIsOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (tray.length === 0) return null;

  const handleDownloadPDF = () => {
    // Mock PDF generation
    const element = document.createElement("a");
    const file = new Blob([`Mock Booklet PDF\n\nItems included:\n${tray.map(i => i.title).join('\n')}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Ambedkar_Archive_Booklet.pdf";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="fixed bottom-0 right-8 z-50">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 text-black px-6 py-3 rounded-t-lg font-bold shadow-lg flex items-center justify-between min-w-[250px]"
      >
        <span>Collection Tray ({tray.length})</span>
        <span>{isOpen ? '▼' : '▲'}</span>
      </button>

      {/* Tray Panel */}
      {isOpen && (
        <div className="bg-white text-black w-96 max-h-[60vh] rounded-tl-lg shadow-2xl flex flex-col absolute bottom-full right-0 border border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center rounded-tl-lg">
            <h3 className="font-bold font-serif text-lg text-blue-900">Your Booklet</h3>
            <button onClick={clearTray} className="text-sm text-red-500 hover:underline">Clear all</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tray.map((item, i) => (
              <div key={item.id + i} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <div>
                  <span className="text-xs uppercase bg-blue-100 text-blue-800 px-1 py-0.5 rounded mr-2">{item.type}</span>
                  <span className="text-sm font-semibold">{item.title}</span>
                </div>
                <button onClick={() => removeFromTray(item.id)} className="text-red-500 font-bold ml-2">×</button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <button onClick={handleDownloadPDF} className="w-full bg-blue-900 text-white font-bold py-2 rounded shadow hover:bg-blue-800">
              Download PDF Booklet
            </button>
            <button onClick={() => setShowQR(!showQR)} className="w-full border border-blue-900 text-blue-900 font-bold py-2 rounded hover:bg-blue-50">
              Send to Phone (QR)
            </button>
            
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded shadow-inner">
                <QRCodeSVG value={`http://localhost:5173/booklet?ids=${tray.map(i => i.id).join(',')}`} size={128} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
