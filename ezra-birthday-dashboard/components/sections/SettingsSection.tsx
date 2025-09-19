'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const defaultPreferences = {
  jokes: true,
  nasaBackground: true,
  birthdayCountdown: true,
  notifications: false,
}

export function SettingsSection() {
  const [preferences, setPreferences] = useState(defaultPreferences)

  const togglePreference = (key: keyof typeof defaultPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Settings ⚙️</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Fine-tune your daily experience, manage API keys, and keep integrations connected.
        </p>
      </div>

      <div className="glass-card grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">API Credentials</h2>
          <p className="text-sm text-gray-600">
            Add your keys when you’re ready. Everything runs in secure server-side functions.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-••••••••••••"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 p-3 text-sm focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Spotify Client ID</label>
              <input
                type="text"
                placeholder="spotify-client-id"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 p-3 text-sm focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">NASA API Key (optional)</label>
              <input
                type="text"
                placeholder="DEMO_KEY"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/90 p-3 text-sm focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
            <p className="text-sm text-gray-600">Toggle what shows up on your dashboard.</p>
            <div className="mt-4 space-y-3">
              {(
                [
                  { key: 'jokes', label: 'Daily joke notifications' },
                  { key: 'nasaBackground', label: 'NASA background updates' },
                  { key: 'birthdayCountdown', label: 'Birthday countdown reminder' },
                  { key: 'notifications', label: 'Send me weekly recap email' },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => togglePreference(item.key)}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 text-sm text-purple-700">
            <p className="font-semibold">Need help deploying?</p>
            <p className="mt-1">Connect your GitHub repo to Vercel, add your environment variables, and hit deploy.</p>
          </div>

          <button className="w-full rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
            Save settings
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsSection
