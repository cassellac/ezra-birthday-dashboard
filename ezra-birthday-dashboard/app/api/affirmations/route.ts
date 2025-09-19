import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AffirmationEntry } from '@/types/dashboard';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/route';

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json([] satisfies AffirmationEntry[]);
  }

  const { data, error } = await supabase
    .from('affirmations')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Affirmations] fetch error', error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data as AffirmationEntry[]);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = (await request.json()) as { prompt?: string };
  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  let summary = prompt.trim();
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    const client = new OpenAI({ apiKey });
    try {
      const response = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'You are a warm motivational coach for a 13-year-old named Ezra. Respond with a short, 2-sentence affirmation summarizing the parent-provided note. Output plain text only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
      });
      summary = response.output_text.trim();
    } catch (error) {
      console.error('[Affirmations] OpenAI error', error);
    }
  }

  const { data, error } = await supabase
    .from('affirmations')
    .insert({
      user_id: session.user.id,
      prompt,
      summary,
    })
    .select()
    .single();

  if (error) {
    console.error('[Affirmations] insert error', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json(data as AffirmationEntry, { status: 201 });
}
