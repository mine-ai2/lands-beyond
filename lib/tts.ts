import OpenAI from 'openai';

export type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function textToSpeech(
  text: string,
  voice: Voice = 'nova'
): Promise<Buffer> {
  const response = await getOpenAI().audio.speech.create({
    model: 'tts-1',
    voice: voice,
    input: text,
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
