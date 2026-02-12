export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StoryMeta {
  slug: string;
  title: string;
  description: string;
  setting: string;
  duration: string;
  characterName: string;
  narratorVoice: string;
  characterVoice: string;
  canonicalOutcome: string;
}

export interface StoryContent {
  meta: StoryMeta;
  narration: {
    leapIn: string;
    scene: string;
  };
  characterPrompt: string;
}

export type GamePhase = 'selection' | 'intro' | 'scene' | 'conversation' | 'epilogue' | 'end';
