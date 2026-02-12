# Lands Beyond

**Social-first interactive stories — "I was there."**

Step into history. Talk to the people who lived it. You can't change what happens — but you can be there.

## Overview

Lands Beyond lets you "leap" into historical or fictional moments, have real conversations with characters, then get woven back into the story's inevitable arc.

**Core principle:** The story goes where it's going. You're a witness, not a driver. The conversation is real; the outcome is fixed; the intimacy is yours to keep.

## Stories

- **The Night Before** — Philadelphia, 1776. Share a drink with James Wilson the night before he changes history.
- **The Informant** — Los Angeles, 1947. A nervous man has something to tell you.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **LLM:** Anthropic Claude API
- **TTS:** OpenAI TTS API
- **Deployment:** Digital Ocean App Platform

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key
- OpenAI API key

### Installation

```bash
# Clone the repo
git clone https://github.com/truths/lands-beyond.git
cd lands-beyond

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Digital Ocean App Platform

1. Push to GitHub
2. Go to [Digital Ocean Apps](https://cloud.digitalocean.com/apps)
3. Create App → Connect GitHub repo
4. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
5. Deploy

Or use the included `app.yaml`:

```bash
doctl apps create --spec app.yaml
```

## Project Structure

```
lands-beyond/
├── app/
│   ├── page.tsx              # Story selection
│   ├── story/[slug]/         # Story experience
│   └── api/                  # Backend routes
├── components/               # React components
├── content/stories/          # Story content
├── lib/                      # Utilities
└── app.yaml                  # DO deployment spec
```

## License

MIT
