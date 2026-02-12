import fs from 'fs';
import path from 'path';
import { StoryMeta, StoryContent } from './types';

const storiesDir = path.join(process.cwd(), 'content', 'stories');

export function getAllStories(): StoryMeta[] {
  const slugs = fs.readdirSync(storiesDir);
  return slugs.map((slug) => {
    const metaPath = path.join(storiesDir, slug, 'meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    return meta as StoryMeta;
  });
}

export function getStory(slug: string): StoryContent | null {
  const storyDir = path.join(storiesDir, slug);
  
  if (!fs.existsSync(storyDir)) {
    return null;
  }

  const meta = JSON.parse(
    fs.readFileSync(path.join(storyDir, 'meta.json'), 'utf-8')
  ) as StoryMeta;

  const narrationRaw = fs.readFileSync(
    path.join(storyDir, 'narration.md'),
    'utf-8'
  );

  const characterPrompt = fs.readFileSync(
    path.join(storyDir, 'character.md'),
    'utf-8'
  );

  // Parse narration.md
  const leapInMatch = narrationRaw.match(/# Leap In\n\n([\s\S]*?)(?=\n# Scene)/);
  const sceneMatch = narrationRaw.match(/# Scene\n\n([\s\S]*?)$/);

  const narration = {
    leapIn: leapInMatch ? leapInMatch[1].trim() : '',
    scene: sceneMatch ? sceneMatch[1].trim() : '',
  };

  return {
    meta,
    narration,
    characterPrompt,
  };
}
