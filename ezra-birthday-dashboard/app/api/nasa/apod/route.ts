import { NextResponse } from 'next/server'

interface NasaApodResponse {
  url?: string
  hdurl?: string
  title?: string
  explanation?: string
}

export async function GET() {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'
  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60 * 60 * 12 },
    })

    if (!res.ok) {
      throw new Error(`NASA APOD request failed with status ${res.status}`)
    }

    const data = (await res.json()) as NasaApodResponse

    return NextResponse.json({
      url: data.hdurl ?? data.url ?? 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2000&q=80',
      title: data.title ?? 'NASA Astronomy Photo of the Day',
      description: data.explanation ?? 'Exploring the cosmos while your dashboard loads fresh inspiration.',
    })
  } catch (error) {
    console.error('NASA APOD error', error)
    return NextResponse.json({
      url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=80',
      title: 'Galactic Fallback',
      description: 'A cosmic background from Unsplash while NASA takes a quick break.',
    })
  }
}
