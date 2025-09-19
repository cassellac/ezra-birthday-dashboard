import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${p62XzXkaKVUHgdfklD736zNJkcqtkjMaJtdQrjCK}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('NASA API request failed');
    }

    const data = await response.json();
    return NextResponse.json({
      url: data.url,
      title: data.title,
      explanation: data.explanation
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching NASA APOD:', error);
    // Fallback to Unsplash space image, and indicate an error occurred
    return NextResponse.json({
      url: 'https://source.unsplash.com/random/1920x1080/?space,galaxy',
      title: 'Space Background (Fallback)',
      explanation: 'Could not fetch NASA APOD. Showing fallback image. Error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 502 });
import { NextResponse } from 'next/server'

interface NasaApodResponse {
  url?: string
  hdurl?: string
  title?: string
  explanation?: string
}

export async function GET() {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'
  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${p62XzXkaKVUHgdfklD736zNJkcqtkjMaJtdQrjCK}`

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
