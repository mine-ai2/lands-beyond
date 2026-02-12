import { getAllStories } from '@/lib/stories';
import StoryCard from '@/components/StoryCard';

export default function Home() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-amber-500 mb-4">
            Lands Beyond
          </h1>
          <p className="text-xl text-zinc-400 font-serif max-w-lg mx-auto">
            Step into history. Talk to the people who lived it. 
            You can&apos;t change what happens — but you can be there.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-zinc-600 text-sm">
          <p>The story goes where it&apos;s going. You get to be there.</p>
        </div>
      </div>
    </main>
  );
}
