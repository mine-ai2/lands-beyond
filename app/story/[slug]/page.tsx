'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GamePhase, Message, StoryMeta } from '@/lib/types';
import NarrationPanel from '@/components/NarrationPanel';
import ChatInterface from '@/components/ChatInterface';
import EpiloguePanel from '@/components/EpiloguePanel';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [phase, setPhase] = useState<GamePhase>('intro');
  const [storyMeta, setStoryMeta] = useState<StoryMeta | null>(null);
  const [leapInText, setLeapInText] = useState('');
  const [sceneText, setSceneText] = useState('');
  const [narratorVoice, setNarratorVoice] = useState('nova');
  const [characterVoice, setCharacterVoice] = useState('onyx');
  const [epilogue, setEpilogue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load story data
  useEffect(() => {
    const loadStory = async () => {
      try {
        // Get leap-in narration
        const leapInRes = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storySlug: slug, type: 'leapIn' }),
        });
        const leapInData = await leapInRes.json();
        setLeapInText(leapInData.text);
        setNarratorVoice(leapInData.voice);

        // Get scene narration
        const sceneRes = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storySlug: slug, type: 'scene' }),
        });
        const sceneData = await sceneRes.json();
        setSceneText(sceneData.text);
        setStoryMeta({
          slug,
          title: '',
          description: '',
          setting: '',
          duration: '',
          characterName: sceneData.characterName,
          narratorVoice: leapInData.voice,
          characterVoice: sceneData.voice || 'onyx',
          canonicalOutcome: '',
        });
        setCharacterVoice(sceneData.voice || 'onyx');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load story:', error);
      }
    };

    loadStory();
  }, [slug]);

  const handleConversationEnd = async (transcript: Message[]) => {
    setPhase('epilogue');
    setIsLoading(true);

    try {
      const response = await fetch('/api/epilogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySlug: slug, transcript }),
      });
      const data = await response.json();
      setEpilogue(data.epilogue);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate epilogue:', error);
      setEpilogue('The moment fades. But you were there.');
      setIsLoading(false);
    }
  };

  // Character greeting based on story
  const getCharacterGreeting = () => {
    if (slug === 'the-night-before') {
      return "I didn't expect company tonight.";
    }
    if (slug === 'the-informant') {
      return "You came. I wasn't sure you would.";
    }
    return "Hello.";
  };

  if (isLoading && phase === 'intro') {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-amber-500 text-2xl font-serif">
            Preparing your journey...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          ← Back to stories
        </button>

        {/* Phase: Leap In */}
        {phase === 'intro' && (
          <div className="animate-fade-in">
            <NarrationPanel
              text={leapInText}
              voice={narratorVoice}
              onComplete={() => setPhase('scene')}
            />
          </div>
        )}

        {/* Phase: Scene */}
        {phase === 'scene' && (
          <div className="animate-fade-in">
            <NarrationPanel
              text={sceneText}
              voice={narratorVoice}
              onComplete={() => setPhase('conversation')}
            />
          </div>
        )}

        {/* Phase: Conversation */}
        {phase === 'conversation' && storyMeta && (
          <div className="animate-fade-in">
            <ChatInterface
              storySlug={slug}
              characterName={storyMeta.characterName}
              characterGreeting={getCharacterGreeting()}
              characterVoice={characterVoice}
              onEnd={handleConversationEnd}
            />
          </div>
        )}

        {/* Phase: Epilogue */}
        {phase === 'epilogue' && !isLoading && (
          <div className="animate-fade-in">
            <EpiloguePanel
              epilogue={epilogue}
              voice={narratorVoice}
              onComplete={() => router.push('/')}
            />
          </div>
        )}

        {/* Loading epilogue */}
        {phase === 'epilogue' && isLoading && (
          <div className="text-center py-16">
            <div className="animate-pulse text-amber-500 text-xl font-serif">
              Weaving the threads...
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
