import { NextResponse } from 'next/server';
import type { SpotifyTopTrack } from '@/types/dashboard';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/route';
import {
  createAdminSupabaseClient,
  MissingSupabaseAdminCredentialsError,
} from '@/lib/supabase/admin';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const MISSING_ADMIN_ENV_MESSAGE =
  'Supabase admin credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY to manage Spotify connections.';

interface SpotifyTokens {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope?: string | null;
}

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify client credentials missing');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ connected: false, tracks: [] });
  }

  let admin;
  try {
    admin = createAdminSupabaseClient();
  } catch (error) {
    if (error instanceof MissingSupabaseAdminCredentialsError) {
      console.error('[Spotify] Supabase admin credentials missing for status route');
      return NextResponse.json(
        {
          connected: false,
          tracks: [],
          message: MISSING_ADMIN_ENV_MESSAGE,
          missingEnvVars: error.missingEnvVars,
        },
        { status: 503 }
      );
    }

    console.error('[Spotify] Unexpected error creating Supabase admin client', error);
    return NextResponse.json(
      {
        connected: false,
        tracks: [],
        message: 'Failed to initialize Supabase admin client.',
      },
      { status: 500 }
    );
  }

  const { data: token, error: tokenError } = await admin
    .from('spotify_tokens')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (tokenError) {
    console.error('[Spotify] token fetch error', tokenError);
    return NextResponse.json({ connected: false, tracks: [] });
  }

  if (!token) {
    return NextResponse.json({ connected: false, tracks: [] });
  }

  let { access_token: accessToken, refresh_token: refreshToken, expires_at: expiresAt } = token as SpotifyTokens;

  if (Date.parse(expiresAt) <= Date.now() + 60_000) {
    try {
      const refreshed = await refreshAccessToken(refreshToken);
      accessToken = refreshed.access_token;
      refreshToken = refreshed.refresh_token ?? refreshToken;
      expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
      const { error: updateError } = await admin
        .from('spotify_tokens')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
        })
        .eq('user_id', session.user.id);
      if (updateError) {
        console.error('[Spotify] failed to update refreshed token', updateError);
      }
    } catch (refreshError) {
      console.error('[Spotify] refresh error', refreshError);
      return NextResponse.json({ connected: false, tracks: [] });
    }
  }

  const headers = { Authorization: `Bearer ${accessToken}` };
  try {
    const [profileRes, topTracksRes] = await Promise.all([
      fetch(`${SPOTIFY_API_BASE}/me`, { headers }),
      fetch(`${SPOTIFY_API_BASE}/me/top/tracks?limit=5`, { headers }),
    ]);

    if (!profileRes.ok || !topTracksRes.ok) {
      throw new Error('Spotify API request failed');
    }

    const profile = await profileRes.json();
    const tracksJson = await topTracksRes.json();

    const tracks: SpotifyTopTrack[] = (tracksJson.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name).join(', '),
      albumArt: track.album?.images?.[0]?.url ?? '',
      externalUrl: track.external_urls?.spotify ?? '#',
    }));

    return NextResponse.json({
      connected: true,
      displayName: profile.display_name ?? profile.email ?? 'Spotify friend',
      tracks,
      lastSynced: new Date().toISOString(),
    });
  } catch (apiError) {
    console.error('[Spotify] API fetch error', apiError);
    return NextResponse.json({ connected: false, tracks: [] });
  }
}
