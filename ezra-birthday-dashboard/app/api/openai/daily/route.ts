import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { DailyContent } from '@/types/dashboard';

const fallbackContent: DailyContent = {
  joke: "Why did the fish blush? Because it saw the ocean's bottom!",
  funFact13: 'There are 13 stripes on the United States flag representing the original colonies.',
  fishingFact: 'Bass are most active at dawn and dusk when the water is cool and calm.',
  newsHeadline: 'Check The Week Junior for today’s top kid-friendly stories.',
  birthdayTwins: [
    { name: 'Jennifer Hudson (1981)', description: 'Oscar-winning singer and actor who shares your September 12 sparkle.' },
    { name: 'Andrew Luck (1989)', description: 'NFL quarterback known for his grit and sportsmanship.' },
  ],
  affirmation: 'You are courageous, clever, and every day you make your family proud.',
  generatedAt: new Date().toISOString(),
};

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackContent);
  }

  const client = new OpenAI({ apiKey });
  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content:
            'You are an enthusiastic family assistant building daily dashboard content for a 13-year-old named Ezra. Respond ONLY with JSON.',
        },
        {
          role: 'user',
          content:
            'Generate a JSON object with keys joke, funFact13, fishingFact, newsHeadline, affirmation, birthdayTwins (array of {name, description}) tailored to a 13-year-old fisher and space fan living in East Tennessee. Keep responses upbeat and concise.',
        },
      ],
      temperature: 0.7,
    });

    const outputText = response.output_text.trim();
    const parsed = JSON.parse(outputText) as Omit<DailyContent, 'generatedAt'>;

    return NextResponse.json({ ...parsed, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[OpenAI] daily content error', error);
    return NextResponse.json(fallbackContent);
  }
}
