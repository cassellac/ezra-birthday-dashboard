import { NextResponse } from 'next/server'

const CONNECTIONS = [
  {
    id: 'supabase',
    name: 'Supabase Auth',
    description: 'Secure login with Google, Apple, or email.',
    env: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    action: 'View credentials',
  },
  {
    id: 'spotify',
    name: 'Spotify API',
    description: 'OAuth music playback using your own playlists.',
    env: ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET'],
    action: 'Connect account',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Generates jokes, facts, and affirmation summaries.',
    env: ['OPENAI_API_KEY'],
  },
  {
    id: 'nasa',
    name: 'NASA APOD',
    description: 'Astronomy Photo of the Day for cosmic backgrounds.',
    env: ['NASA_API_KEY'],
  },
  {
    id: 'ifttt',
    name: 'IFTTT Automations',
    description: 'Triggers NASA wallpaper updates and family message blasts.',
    env: ['IFTTT_WEBHOOK_KEY'],
    action: 'Open automation recipes',
  },
]

export async function GET() {
  const connections = CONNECTIONS.map((connection) => {
    const isConnected = connection.env.every((key) => Boolean(process.env[key]))
    return {
      id: connection.id,
      name: connection.name,
      description: connection.description,
      connected: isConnected,
      lastChecked: 'just now',
      action: connection.action,
    }
  })

  return NextResponse.json({ connections })
}
