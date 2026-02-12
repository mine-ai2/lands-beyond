'use client';

import Link from 'next/link';
import { StoryMeta } from '@/lib/types';

interface StoryCardProps {
  story: StoryMeta;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/story/${story.slug}`}>
      <div className="group bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-600/50 transition-all duration-300 cursor-pointer">
        <h2 className="text-2xl font-serif text-zinc-100 group-hover:text-amber-500 transition-colors">
          {story.title}
        </h2>
        <p className="text-zinc-500 text-sm mt-1 font-sans">
          {story.setting}
        </p>
        <p className="text-zinc-400 mt-4 font-serif leading-relaxed">
          {story.description}
        </p>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <span className="text-zinc-500 text-sm">{story.duration}</span>
          <span className="text-amber-600 text-sm group-hover:translate-x-1 transition-transform">
            Enter →
          </span>
        </div>
      </div>
    </Link>
  );
}
