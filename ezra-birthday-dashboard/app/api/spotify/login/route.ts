import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/route';

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-playback-state',
].join(' ');

export async function POST() {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/api/spotify/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Missing SPOTIFY_CLIENT_ID' }, { status: 500 });
  }

  const state = crypto.randomUUID();
  cookies().set('spotify_oauth_state', state, {
    maxAge: 60 * 10,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('scope', scopes);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);

  return NextResponse.json({ url: authorizeUrl.toString() });
}
