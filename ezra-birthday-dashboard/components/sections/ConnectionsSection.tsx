'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { CheckCircle, PlugZap, ShieldAlert, Timer } from 'lucide-react'

interface ConnectionStatus {
  id: string
  name: string
  description: string
  connected: boolean
  lastChecked: string
  action?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ConnectionsSection() {
  const { data, isLoading } = useSWR<{ connections: ConnectionStatus[] }>('/api/connections/status', fetcher)
  const connections = data?.connections ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Connections & Plugins 🔌</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Manage integrations for Spotify, OpenAI, NASA and the family automation recipes.
        </p>
      </div>

      <div className="glass-card p-6">
        {isLoading ? (
          <p className="text-sm text-gray-600">Checking connections...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {connections.map((connection) => (
              <motion.div
                key={connection.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{connection.name}</p>
                    <p className="text-sm text-gray-600">{connection.description}</p>
                  </div>
                  {connection.connected ? (
                    <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="h-6 w-6 text-amber-500" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <Timer className="h-4 w-4" aria-hidden="true" />
                    Last checked {connection.lastChecked}
                  </span>
                  {connection.action ? (
                    <button className="text-sm font-semibold text-purple-600 hover:underline">{connection.action}</button>
                  ) : null}
                </div>
              </motion.div>
            ))}
            <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-5 text-sm text-purple-700">
              <p className="flex items-center gap-2 font-semibold">
                <PlugZap className="h-4 w-4" aria-hidden="true" />
                Want more automations?
              </p>
              <p className="mt-1">
                Add IFTTT recipes for NASA photos, morning text blasts, and positivity reminders.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ConnectionsSection
