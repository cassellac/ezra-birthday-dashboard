import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/route';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');

  const storedState = cookies().get('spotify_oauth_state')?.value;
  cookies().delete('spotify_oauth_state');

  if (errorParam) {
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  if (!code || !state || !storedState || storedState !== state) {
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/api/spotify/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    console.error('[Spotify] token exchange failed', await tokenResponse.text());
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.access_token as string;
  const refreshToken = tokenJson.refresh_token as string;
  const expiresIn = tokenJson.expires_in as number;
  const scope = tokenJson.scope as string | undefined;

  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from('spotify_tokens')
    .upsert(
      {
        user_id: session.user.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        scope,
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('[Spotify] failed to persist tokens', error);
    return NextResponse.redirect(new URL('/?spotify=error', url.origin));
  }

  return NextResponse.redirect(new URL('/?spotify=success', url.origin));
}
