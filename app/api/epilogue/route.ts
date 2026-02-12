import { NextRequest, NextResponse } from 'next/server';
import { generateEpilogue } from '@/lib/claude';
import { getStory } from '@/lib/stories';
import { Message } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { storySlug, transcript } = await request.json();

    const story = getStory(storySlug);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const storyContext = `${story.narration.leapIn}\n\n${story.narration.scene}`;
    
    const epilogue = await generateEpilogue(
      storyContext,
      story.meta.canonicalOutcome,
      transcript as Message[]
    );

    return NextResponse.json({
      epilogue,
      voice: story.meta.narratorVoice,
    });
  } catch (error) {
    console.error('Epilogue error:', error);
    return NextResponse.json(
      { error: 'Failed to generate epilogue' },
      { status: 500 }
    );
  }
}
