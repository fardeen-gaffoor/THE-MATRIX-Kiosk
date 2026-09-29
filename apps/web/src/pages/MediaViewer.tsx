import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function MediaViewer() {
  const { id } = useParams();
  const [transcript, setTranscript] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/media/${id}/transcript`)
      .then(res => res.json())
      .then(data => setTranscript(data.transcript));
  }, [id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col md:flex-row gap-8" style={{ background: 'var(--color-suit-navy)', color: 'var(--color-paper)', fontFamily: 'var(--font-sans)' }}>
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>Audio/Video Archive</h1>
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-white border-opacity-20 aspect-video relative flex items-center justify-center">
          <video 
            ref={videoRef}
            src="https://www.w3schools.com/html/mov_bbb.mp4" 
            controls 
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
        <div className="mt-4 p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
          <h3 className="font-bold mb-2">Media Information</h3>
          <p className="text-sm opacity-70 mb-1">ID: {id}</p>
          <p className="text-sm opacity-70">This is a mocked player. In production, this streams via HLS or MP4 range requests from MinIO.</p>
        </div>
      </div>

      {/* Transcript Synced Panel */}
      <div className="w-full md:w-1/3 bg-black bg-opacity-30 p-6 rounded-xl border border-white border-opacity-10 flex flex-col h-[70vh]">
        <h3 className="text-xl font-bold mb-2 border-b border-white border-opacity-10 pb-2" style={{ color: 'var(--color-gold)' }}>Auto-Transcript</h3>
        <p className="text-xs opacity-60 mb-4 uppercase">Powered by Whisper</p>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {transcript.length === 0 ? (
             <div className="animate-pulse">Loading transcript...</div>
          ) : (
            transcript.map((t, i) => {
              const isActive = currentTime >= t.start && currentTime < t.end;
              return (
                <div 
                  key={i} 
                  onClick={() => seekTo(t.start)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${isActive ? 'bg-yellow-500 bg-opacity-20 border-yellow-500 text-yellow-300' : 'border-transparent hover:bg-white hover:bg-opacity-10 opacity-70 hover:opacity-100'}`}
                >
                  <div className="text-xs font-bold mb-1 opacity-50">{t.start.toFixed(1)}s - {t.end.toFixed(1)}s</div>
                  <p>{t.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
