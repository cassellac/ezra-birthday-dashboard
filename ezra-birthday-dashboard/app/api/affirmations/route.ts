import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { AffirmationEntry } from '@/types/content'

const IN_MEMORY_LOG: AffirmationEntry[] = []

const FALLBACK_AFFIRMATIONS: AffirmationEntry[] = [
  {
    id: 'welcome',
    message: 'I am grateful for my family and the adventures we share.',
    summary: 'Grateful for family adventures',
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json({ entries: IN_MEMORY_LOG.length ? IN_MEMORY_LOG : FALLBACK_AFFIRMATIONS })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { message?: string } | null

  if (!body?.message || !body.message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  let summary = body.message.trim()

  if (apiKey) {
    try {
      const client = new OpenAI({ apiKey })
      const completion = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content: 'Summarize affirmations warmly in under 12 words.'
          },
          {
            role: 'user',
            content: body.message,
          },
        ],
        temperature: 0.6,
      })
      const text = completion.output_text?.trim()
      if (text) {
        summary = text.replace(/^"|"$/g, '')
      }
    } catch (error) {
      console.error('OpenAI affirmation summary error', error)
    }
  }

  const entry: AffirmationEntry = {
    id: crypto.randomUUID(),
    message: body.message.trim(),
    summary,
    createdAt: new Date().toISOString(),
  }

  IN_MEMORY_LOG.unshift(entry)
  if (IN_MEMORY_LOG.length > 20) {
    IN_MEMORY_LOG.length = 20
  }

  return NextResponse.json({ entry })
}
