'use client'

import { motion } from 'framer-motion'
import { Fish, Gamepad2, Heart, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface GameCard {
  title: string
  description: string
  icon: LucideIcon
  color: string
}

const games: GameCard[] = [
  {
    title: 'Fishing Frenzy',
    description: 'Tap to cast, reel in legendary fish, and upgrade your boat.',
    icon: Fish,
    color: 'from-sky-400 to-emerald-500',
  },
  {
    title: 'Lucky 13 Puzzle',
    description: 'Stack tiles that add up to 13 before the board fills up!',
    icon: Star,
    color: 'from-amber-400 to-pink-500',
  },
  {
    title: 'Memory Match: Family Edition',
    description: 'Flip cards to match family emojis and unlock funny stories.',
    icon: Heart,
    color: 'from-rose-400 to-purple-500',
  },
]

export function GamesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4 text-white">
        <div>
          <h1 className="text-4xl font-extrabold drop-shadow">Mini Games 🎮</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Quick brain breaks designed just for you. Launch them on your phone or desktop.
          </p>
        </div>
        <Gamepad2 className="hidden h-12 w-12 text-white/60 lg:block" aria-hidden="true" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <motion.div
            key={game.title}
            whileHover={{ y: -6 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${game.color} p-6 text-white shadow-xl`}
          >
            <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="flex items-center gap-3">
              <game.icon className="h-10 w-10" aria-hidden="true" />
              <h3 className="text-xl font-semibold">{game.title}</h3>
            </div>
            <p className="mt-4 text-sm text-white/80">{game.description}</p>
            <button className="mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
              Launch Game
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default GamesSection
