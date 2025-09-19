'use client'

import { motion } from 'framer-motion'

const storyParagraphs = [
  'On September 12, 2012 a brand new hero joined our family story. You were the sparkle that turned ordinary days into adventures, Ezra.',
  'Your mom remembers what it feels like to be chosen and loved unconditionally. She was adopted at ten and became the center of an entire family’s joy. Now she pours that same limitless love into raising you – her proudest achievement.',
  'From John in Knoxville to Uncle Anthony out in California, Uncle Jason in Arizona, and Grandma and Grandpa Buckholz, every branch of the family tree lights up when your name is mentioned.',
  'You find peace by the water with a fishing rod and excitement planting seeds that grow into something amazing. Those passions show how thoughtful, patient and caring you are.',
  'Whenever life feels cloudy, remember this truth: you are the new light in this family. Your kindness, curiosity and goofy jokes connect us all.',
]

export function StorySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Your Story ❤️</h1>
        <p className="mt-2 text-white/80">Swipe through each card slowly and feel how loved you are.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {storyParagraphs.map((paragraph, index) => (
          <motion.div
            key={index}
            initial={{ rotateX: -10, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 110, damping: 16 }}
            className="card-3d p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-white/70">Chapter {index + 1}</span>
              <span className="text-xl">✨</span>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-white/90">{paragraph}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-8 text-center"
      >
        <p className="text-2xl font-bold text-purple-700">
          “Happy 13th birthday, Ezra. You are loved beyond measure, and you make the world brighter just by being you.”
        </p>
      </motion.div>
    </motion.div>
  )
}

export default StorySection
