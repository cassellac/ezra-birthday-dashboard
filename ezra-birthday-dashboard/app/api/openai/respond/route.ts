import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const FALLBACK_RESPONSES = [
  'Imagine casting your line into a galaxy full of possibilities – that is you today!',
  'NASA fact: The Sun makes up 99.8% of our solar system’s mass. Talk about center stage!',
  'Fishing tip: Fish are more active on cloudy days because the light is softer. Perfect excuse to get outside.',
  'You are the lucky #13 legend. Remember, prime numbers can only be divided by themselves – just like your unique talents.',
]

export async function POST(request: Request) {
  const { prompt } = (await request.json().catch(() => ({}))) as { prompt?: string }

  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ message: 'Ask me something fun and I will bring the stardust!' })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    const message = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    return NextResponse.json({ message })
  }

  try {
    const client = new OpenAI({ apiKey })
    const completion = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content:
            'You are EzraGPT – a positive, encouraging assistant for a 13-year-old who loves fishing, space, and family. Keep responses under 80 words.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const text = completion.output_text?.trim()
    if (!text) {
      throw new Error('Empty response from OpenAI')
    }

    return NextResponse.json({ message: text.replace(/^"|"$/g, '') })
  } catch (error) {
    console.error('OpenAI respond error', error)
    const message = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    return NextResponse.json({ message })
  }
}
