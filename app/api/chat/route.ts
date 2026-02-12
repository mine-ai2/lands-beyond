import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/claude';
import { getStory } from '@/lib/stories';
import { Message } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { storySlug, messages, newMessage } = await request.json();

    const story = getStory(storySlug);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const reply = await chat(
      story.characterPrompt,
      messages as Message[],
      newMessage
    );

    return NextResponse.json({
      reply,
      voice: story.meta.characterVoice,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
