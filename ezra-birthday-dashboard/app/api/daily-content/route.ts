import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { DailyContent } from '@/types/content'

const FALLBACK_CONTENT: DailyContent = {
  joke: "Why did the astronaut bring fishing gear? Because the Milky Way has the best bass!",
  funFact13: 'There are exactly 13 full moons every few years—perfect for night fishing legends.',
  fishingFact: 'The Tennessee River system holds more than 230 fish species, making it one of the most diverse in North America.',
  affirmation: 'You are the tide that lifts everyone up. Keep shining, keep smiling, keep reeling in joy.',
  nasa: {
    title: 'Galactic Fallback',
    description: 'A dreamy nebula sourced from open imagery as a backup when NASA is busy exploring.',
  },
  birthdayTwins: [
    { name: 'Emmy Rossum', summary: 'Actor and singer who balances art and kindness.' },
    { name: 'Paul Walker', summary: 'Actor remembered for his adventurous spirit and love of the ocean.' },
    { name: 'Kiana Madeira', summary: 'Canadian actor proving that determination leads to big roles.' },
  ],
  news: [
    {
      title: 'The Week Junior Highlights',
      summary: 'Students nationwide design eco-friendly inventions in this week’s maker challenge.',
      source: 'The Week Junior',
    },
    {
      title: 'Fishing Report: East TN',
      summary: 'Cooling temperatures mean crappie are schooling closer to shore—great for family outings.',
      source: 'TWRA',
    },
    {
      title: 'Space Snapshot',
      summary: 'The James Webb Space Telescope captured star-forming clouds 7,000 light-years away.',
      source: 'NASA',
    },
  ],
  localFishingSpots: [
    {
      name: 'Ijams River Landing',
      location: 'Knoxville, TN',
      tip: 'Perfect for kayak fishing and spotting wildlife along the Tennessee River.',
    },
    {
      name: 'Melton Hill Lake',
      location: 'Anderson County, TN',
      tip: 'Known for muskie and calm waters—bring a camera for scenic sunsets.',
    },
    {
      name: 'Watts Bar Reservoir',
      location: 'Rhea County, TN',
      tip: 'Use spinnerbaits near coves for active bass in the evening.',
    },
  ],
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ content: FALLBACK_CONTENT })
  }

  const client = new OpenAI({ apiKey })

  try {
    const prompt = `You are creating a JSON object of uplifting daily content for a 13-year-old named Ezra who loves fishing, space, and family.
Return valid JSON with keys joke, funFact13, fishingFact, affirmation, birthdayTwins (array of objects with name and summary), news (array with title, summary, source), and localFishingSpots (array with name, location, tip).
Keep things positive, concise, and family-friendly.`

    const completion = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: 'You respond with JSON only.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const contentText = completion.output_text?.trim()

    if (!contentText) {
      throw new Error('OpenAI returned no content')
    }

    const parsed = JSON.parse(contentText) as Partial<DailyContent>
    return NextResponse.json({ content: { ...FALLBACK_CONTENT, ...parsed } })
  } catch (error) {
    console.error('OpenAI daily content error', error)
    return NextResponse.json({ content: FALLBACK_CONTENT })
  }
}
