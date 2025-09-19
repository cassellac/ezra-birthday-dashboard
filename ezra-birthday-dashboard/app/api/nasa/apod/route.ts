import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`,
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
  }
}
