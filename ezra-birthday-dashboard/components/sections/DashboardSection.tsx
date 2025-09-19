'use client'

import { motion } from 'framer-motion'
import { Calendar, Fish, Lightbulb, MapPin, Newspaper, Smile, Star } from 'lucide-react'
import type { DailyContent } from '@/types/content'

interface DashboardSectionProps {
  content: DailyContent
}

export function DashboardSection({ content }: DashboardSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Welcome back, Ezra! 🌠</h1>
        <p className="mt-2 max-w-xl text-white/80">
          Here is your daily cosmic briefing – fresh jokes, fishing knowledge, family love and more to celebrate being 13.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard title="Daily Joke" icon={Smile} variant="primary" description={content.joke} />
        <InfoCard title="Fun Fact about #13" icon={Lightbulb} variant="earth" description={content.funFact13} />
        <InfoCard title="Fishing Fact" icon={Fish} variant="ocean" description={content.fishingFact} />
        <InfoCard
          title="Daily Affirmation"
          icon={Star}
          variant="sunrise"
          description={content.affirmation}
        />
        <div className="card-3d forest-card space-y-4 p-6 text-white">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Kid-Friendly News</h3>
          </div>
          <ul className="space-y-3 text-sm text-white/90">
            {content.news.map((item) => (
              <li key={item.title} className="rounded-xl bg-white/10 p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-white/80">{item.summary}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-white/60">Source: {item.source}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-3d p-6 text-white">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Birthday Twins</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-white/90">
            {content.birthdayTwins.map((twin) => (
              <li key={twin.name} className="rounded-xl bg-white/10 p-3">
                <p className="font-semibold">{twin.name}</p>
                <p className="text-xs text-white/80">{twin.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Explore East Tennessee Fishing Spots</h2>
            <p className="mt-1 text-sm text-gray-600">
              These locations were hand-picked for easy family trips, calm waters and lots of bites.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-3">
            {content.localFishingSpots.map((spot) => (
              <div key={spot.name} className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-purple-600">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {spot.name}
                </div>
                <p className="text-xs text-gray-500">{spot.location}</p>
                <p className="mt-2 text-sm">{spot.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface InfoCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'earth' | 'ocean' | 'sunrise'
}

function InfoCard({ title, description, icon: Icon, variant = 'primary' }: InfoCardProps) {
  const variantClass = {
    primary: 'card-3d p-6 text-white',
    earth: 'card-3d earth-tone-card p-6 text-white',
    ocean: 'card-3d ocean-card p-6 text-white',
    sunrise: 'card-3d p-6 text-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500',
  }[variant]

  return (
    <motion.div whileHover={{ scale: 1.05 }} className={variantClass}>
      <Icon className="mb-4 h-8 w-8" aria-hidden="true" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/90">{description}</p>
    </motion.div>
  )
}

export default DashboardSection
