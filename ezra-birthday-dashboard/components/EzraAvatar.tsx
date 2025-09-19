'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const FIGURINES = [
  {
    id: 'everyday',
    label: "Ezra's Everyday Adventure",
    emoji: '🌟',
    gradient: 'linear-gradient(145deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
  },
  {
    id: 'fishing',
    label: 'Fishing Champion Ezra',
    emoji: '🎣',
    gradient: 'linear-gradient(145deg, #0ea5e9 0%, #22d3ee 50%, #0f766e 100%)',
  },
  {
    id: 'space',
    label: 'Space Explorer Ezra',
    emoji: '🚀',
    gradient: 'linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #22d3ee 100%)',
  },
  {
    id: 'halloween',
    label: 'Pumpkin Hero Ezra',
    emoji: '🎃',
    gradient: 'linear-gradient(145deg, #f97316 0%, #ea580c 50%, #7c2d12 100%)',
  },
  {
    id: 'storyteller',
    label: 'Storyteller Ezra',
    emoji: '📖',
    gradient: 'linear-gradient(145deg, #14b8a6 0%, #0f766e 50%, #134e4a 100%)',
  },
]

export type EzraAvatarMood = typeof FIGURINES[number]['id']

export interface EzraAvatarProps {
  mood?: EzraAvatarMood
  size?: number
}

const AUTO_ROTATE_INTERVAL = 10_000

export function EzraAvatar({ mood, size = 96 }: EzraAvatarProps) {
  const [activeId, setActiveId] = useState<EzraAvatarMood>(FIGURINES[0].id)

  const displayedFigurine = useMemo(() => {
    if (mood) {
      const match = FIGURINES.find((item) => item.id === mood)
      if (match) {
        return match
      }
    }
    return FIGURINES.find((item) => item.id === activeId) ?? FIGURINES[0]
  }, [activeId, mood])

  useEffect(() => {
    const handle = setInterval(() => {
      setActiveId((previous) => {
        const currentIndex = FIGURINES.findIndex((item) => item.id === previous)
        const nextIndex = (currentIndex + 1) % FIGURINES.length
        return FIGURINES[nextIndex].id as EzraAvatarMood
      })
    }, AUTO_ROTATE_INTERVAL)
    return () => clearInterval(handle)
  }, [])

  const handleCycleAvatar = () => {
    setActiveId((previous) => {
      const currentIndex = FIGURINES.findIndex((item) => item.id === previous)
      const nextIndex = (currentIndex + 1) % FIGURINES.length
      return FIGURINES[nextIndex].id as EzraAvatarMood
    })
  }

  return (
    <motion.button
      aria-label={displayedFigurine.label}
      onClick={handleCycleAvatar}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center rounded-full p-[3px] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%)',
      }}
    >
      <motion.div
        key={displayedFigurine.id}
        className="flex h-full w-full items-center justify-center rounded-full text-4xl text-white"
        style={{ background: displayedFigurine.gradient }}
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      >
        <span className="drop-shadow-lg">{displayedFigurine.emoji}</span>
      </motion.div>
      <span className="pointer-events-none absolute -bottom-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow-lg">
        Tap to change
      </span>
    </motion.button>
  )
}

export default EzraAvatar
