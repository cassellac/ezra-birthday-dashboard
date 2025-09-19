'use client'

import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'

const galleryPlaceholders = [
  'Fishing Trophy Day',
  'Pumpkin Patch Adventures',
  'Space Camp Memories',
  'Family Game Night',
  'Camping Under Stars',
  'First Farm Harvest',
  'Epic LEGO Build',
  'Birthday Fireworks',
]

export function GallerySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Memory Gallery 📸</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Upload your favorite photos and we’ll showcase them with gentle animations and captions.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPlaceholders.map((label) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.04, rotateX: 8 }}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-blue-400 to-teal-400 text-white shadow-xl"
            >
              <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100" />
              <ImageIcon className="h-10 w-10 text-white/80" aria-hidden="true" />
              <span className="z-10 px-4 text-center text-sm font-semibold leading-snug">{label}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white/80 p-5 text-center text-gray-700 shadow-sm lg:flex-row">
          <p className="text-sm">
            Ready to add real photos? Drop them here or tap upload. We keep everything private for your family.
          </p>
          <button className="rounded-xl bg-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-600">
            Upload memories
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default GallerySection
