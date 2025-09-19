'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, Loader2, Music, Play, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { SpotifyTopTrack } from '@/types/dashboard';

interface SpotifySectionProps {
  userId: string;
}

interface SpotifyStatusResponse {
  connected: boolean;
  tracks: SpotifyTopTrack[];
  displayName?: string;
  lastSynced?: string;
}

const FALLBACK_PLAYLIST = [
  { title: 'Good Day Sunshine – The Beatles', url: 'https://open.spotify.com/track/4gVuIEffBIVg1RcLZ1cS5Z' },
  { title: "Believer – Imagine Dragons", url: 'https://open.spotify.com/track/0pqnGHJpmpxLKifKRmU6WP' },
  { title: 'Count On Me – Bruno Mars', url: 'https://open.spotify.com/track/3W3aSUjcy3646p5B0Vi6zO' },
];

export default function SpotifySection({ userId }: SpotifySectionProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<SpotifyStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async (showToast?: boolean) => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch('/api/spotify/status');
      if (!res.ok) throw new Error('Failed to check Spotify status');
      const data = (await res.json()) as SpotifyStatusResponse;
      setStatus(data);
      if (showToast) {
        toast.success('Spotify connection refreshed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to connect to Spotify. Review your API credentials.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const result = searchParams.get('spotify');
    if (result === 'success') {
      toast.success('Spotify account connected!');
      fetchStatus(true);
    } else if (result === 'error') {
      toast.error('Spotify connection failed. Try again.');
    }
  }, [fetchStatus, searchParams]);

  const connectToSpotify = async () => {
    try {
      const res = await fetch('/api/spotify/login', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start OAuth flow');
      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error('Unable to open Spotify login.');
    }
  };

  const refreshTracks = async () => {
    try {
      setRefreshing(true);
      await fetchStatus(true);
    } finally {
      setRefreshing(false);
    }
  };

  const connected = status?.connected;

  const headerText = useMemo(() => {
    if (connected) {
      return `Hey ${status?.displayName ?? 'friend'}! Here's what you've been spinning.`;
    }
    return 'Link Spotify to beam in your playlists and see what Ezra is listening to.';
  }, [connected, status?.displayName]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Spotify control center</h2>
          <p className="mt-2 max-w-2xl text-white/70">{headerText}</p>
        </div>
        {connected && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshTracks}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 shadow hover:bg-emerald-500/30"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh tracks
          </motion.button>
        )}
      </div>

      <div className="glass-card grid gap-6 rounded-3xl p-6 text-gray-900 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="flex items-center text-xl font-semibold text-slate-900">
            <Music className="mr-3 h-5 w-5 text-purple-500" />
            {connected ? 'Your top tracks' : 'Quick start playlist'}
          </h3>

          {loading ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center text-sm text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              <p className="mt-3">Warming up the player…</p>
            </div>
          ) : connected ? (
            <ul className="mt-6 space-y-4">
              {status?.tracks?.map((track) => (
                <motion.li
                  key={track.id}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.albumArt}
                    alt={track.name}
                    className="h-16 w-16 rounded-xl object-cover shadow-inner"
                  />
                  <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900">{track.name}</p>
                    <p className="text-sm text-slate-500">{track.artists}</p>
                  </div>
                  <a
                    href={track.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500"
                  >
                    Listen
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-slate-600">
                We built a cheerful playlist to keep the vibes going until you connect your own account.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                {FALLBACK_PLAYLIST.map((song) => (
                  <li key={song.url} className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3 shadow">
                    <span>{song.title}</span>
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Open
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-semibold">Secure OAuth</p>
                <p className="text-xs text-slate-500">Tokens are stored in Supabase with automatic refresh.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-semibold">3D card player</p>
                <p className="text-xs text-slate-500">Control playback from Ezra’s floating dashboard.</p>
              </div>
            </div>
            {status?.lastSynced && (
              <p className="text-xs text-slate-500">
                Last synced: {new Date(status.lastSynced).toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            {!connected && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={connectToSpotify}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                <Play className="h-4 w-4" />
                Connect Spotify
              </motion.button>
            )}
            <p className="text-xs text-slate-500">
              Spotify developer setup instructions are available in the README. After configuring client ID, secret, and redirect URL, return here to authorize Ezra’s dashboard.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
