import { NextResponse } from 'next/server';

export const revalidate = 60 * 60 * 6; // refresh every 6 hours

export async function GET() {
  const apiKey = process.env.NASA_API_KEY ?? 'DEMO_KEY';
  const apiUrl = new URL('https://api.nasa.gov/planetary/apod');
  apiUrl.searchParams.set('api_key', apiKey);
  apiUrl.searchParams.set('thumbs', 'true');

  try {
    const response = await fetch(apiUrl.toString(), {
      next: { revalidate },
    });
    if (!response.ok) {
      throw new Error(`NASA API responded with ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json({
      url: data.hdurl ?? data.url ?? data.thumbnail_url,
      title: data.title,
      date: data.date,
    });
  } catch (error) {
    console.error('[NASA] Unable to fetch APOD', error);
    return NextResponse.json(
      {
        url: 'https://source.unsplash.com/random/1920x1080/?space,galaxy',
        title: 'Space inspiration',
        date: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
