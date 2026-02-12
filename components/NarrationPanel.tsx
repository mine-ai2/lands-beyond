'use client';

import { useState, useEffect, useRef } from 'react';

interface NarrationPanelProps {
  text: string;
  voice: string;
  onComplete: () => void;
  autoPlay?: boolean;
}

export default function NarrationPanel({
  text,
  voice,
  onComplete,
  autoPlay = true,
}: NarrationPanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowContinue(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  // Load and play audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }),
        });

        if (!response.ok) throw new Error('TTS failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          setAudioReady(true);
          
          if (autoPlay) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Audio error:', error);
        setShowContinue(true);
      }
    };

    loadAudio();
  }, [text, voice, autoPlay]);

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setShowContinue(true);
  };

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
      <audio ref={audioRef} onEnded={handleAudioEnd} />
      
      <div className="prose prose-invert prose-lg font-serif">
        <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
          {displayedText}
          <span className="animate-pulse">|</span>
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
        
        {showContinue && (
          <button
            onClick={onComplete}
            className="ml-auto px-6 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
