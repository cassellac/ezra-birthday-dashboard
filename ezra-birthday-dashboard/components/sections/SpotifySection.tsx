'use client'

import { motion } from 'framer-motion'
import { Music, Play, PauseCircle, ListMusic, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

interface SpotifySectionProps {
  isConnected: boolean
  onConnect: () => void
}

export function SpotifySection({ isConnected, onConnect }: SpotifySectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Spotify Vibes 🎧</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Connect your Spotify account to control playlists from a 3D floating player. We added a safe family playlist as a fallback.
        </p>
      </div>

      <div className="glass-card grid gap-6 p-6 lg:grid-cols-[2fr,1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 p-6 text-white shadow-xl">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Music className="h-10 w-10" aria-hidden="true" />
              <div>
                <p className="text-sm uppercase text-white/70">Now Playing</p>
                <h3 className="text-2xl font-bold">Ezra’s Happy Hits</h3>
              </div>
            </div>
            <p className="max-w-md text-sm text-white/80">
              Hand-picked tunes to match fishing trips, farming mornings, and late night LEGO builds.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsPlaying((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 shadow-lg"
              >
                {isPlaying ? <PauseCircle className="h-7 w-7" aria-hidden="true" /> : <Play className="h-7 w-7" aria-hidden="true" />}
              </motion.button>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Mood Boost Mix</p>
                <p className="text-white/70">Upbeat pop · 24 tracks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onConnect}
            className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-lg transition ${
              isConnected ? 'bg-emerald-500/90 hover:bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isConnected ? 'Spotify connected – let’s jam!' : 'Connect Spotify account'}
          </motion.button>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Secure login with OAuth
            </div>
            <p className="mt-2 text-emerald-700">
              We never store your password. When you connect, Spotify handles authentication and sends us a temporary token.
            </p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center gap-3 font-semibold text-gray-800">
              <ListMusic className="h-5 w-5 text-emerald-500" aria-hidden="true" />
              Fallback Playlist
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Not ready to connect? Enjoy our curated “Family Celebrations” playlist powered by Spotify’s public data.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SpotifySection
