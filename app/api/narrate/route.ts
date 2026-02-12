import { NextRequest, NextResponse } from 'next/server';
import { getStory } from '@/lib/stories';

export async function POST(request: NextRequest) {
  try {
    const { storySlug, type } = await request.json();

    const story = getStory(storySlug);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    let text = '';
    if (type === 'leapIn') {
      text = story.narration.leapIn;
    } else if (type === 'scene') {
      text = story.narration.scene;
    }

    return NextResponse.json({
      text,
      voice: story.meta.narratorVoice,
      characterName: story.meta.characterName,
    });
  } catch (error) {
    console.error('Narrate error:', error);
    return NextResponse.json(
      { error: 'Failed to get narration' },
      { status: 500 }
    );
  }
}
