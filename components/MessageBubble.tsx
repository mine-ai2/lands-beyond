'use client';

import { useState, useRef } from 'react';

interface MessageBubbleProps {
  role: 'user' | 'character';
  content: string;
  characterName?: string;
  voice?: string;
}

export default function MessageBubble({
  role,
  content,
  characterName,
  voice,
}: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioLoaded && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, voice }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = url;
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
      setAudioLoaded(true);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg px-4 py-2 max-w-[80%]">
          <p className="text-zinc-200">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 max-w-[80%]">
        {characterName && (
          <p className="text-amber-500 text-sm font-medium mb-1">
            {characterName}
          </p>
        )}
        <p className="text-zinc-200 font-serif">{content}</p>
        {voice && (
          <button
            onClick={playAudio}
            className="mt-2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
          >
            {isPlaying ? '⏸ Pause' : '▶ Listen'}
          </button>
        )}
      </div>
    </div>
  );
}
