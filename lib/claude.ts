import Anthropic from '@anthropic-ai/sdk';
import { Message } from './types';

let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

export async function chat(
  systemPrompt: string,
  messages: Message[],
  newMessage: string
): Promise<string> {
  const allMessages = [
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: newMessage },
  ];

  const response = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: allMessages,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

export async function generateEpilogue(
  storyContext: string,
  canonicalOutcome: string,
  transcript: Message[]
): Promise<string> {
  const transcriptText = transcript
    .map((m) => `${m.role === 'user' ? 'VISITOR' : 'CHARACTER'}: ${m.content}`)
    .join('\n\n');

  const systemPrompt = `You are the Narrator for Lands Beyond — you weave the user's conversation back into the story's inevitable arc.

STORY CONTEXT:
${storyContext}

CANONICAL OUTCOME:
${canonicalOutcome}

Your job:
1. Read the conversation. Note the tone, key moments, what the user said or didn't say.
2. Write an epilogue (3-5 short paragraphs) that:
   - Acknowledges specific moments from their conversation
   - Returns to the canonical outcome (the story goes where it was always going)
   - Frames the user as a witness who got to be there
   - Ends with a line that honors the intimacy: "You were there."

TONE:
- Warm, intimate, slightly literary
- The user is a privileged guest, not a hero
- Never make them feel like they failed — there's no failure, only experience
- Genre-appropriate (historical gravitas, noir melancholy, etc.)

Write only the epilogue text. No meta-commentary, no headers, no markdown.`;

  const response = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `CONVERSATION TRANSCRIPT:\n\n${transcriptText}\n\nWrite the epilogue now.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}
