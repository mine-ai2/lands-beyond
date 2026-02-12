'use client';

import { useState, useEffect, useRef } from 'react';

interface EpiloguePanelProps {
  epilogue: string;
  voice: string;
  onComplete: () => void;
}

export default function EpiloguePanel({
  epilogue,
  voice,
  onComplete,
}: EpiloguePanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < epilogue.length) {
        setDisplayedText(epilogue.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [epilogue]);

  // Load audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: epilogue, voice }),
        });

        if (!response.ok) throw new Error('TTS failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        
        audioRef.current.src = url;
        audioRef.current.onended = () => setIsPlaying(false);
        setAudioReady(true);
        
        // Auto-play
        audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio error:', error);
      }
    };

    loadAudio();
  }, [epilogue, voice]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-invert prose-lg font-serif">
        <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
          {displayedText}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {audioReady && (
          <button
            onClick={togglePlay}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play audio'}
          </button>
        )}
        
        <button
          onClick={onComplete}
          className="ml-auto px-6 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded transition-colors"
        >
          Another Story
        </button>
      </div>
    </div>
  );
}
