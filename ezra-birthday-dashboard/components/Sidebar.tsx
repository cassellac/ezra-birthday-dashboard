'use client'

import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import EzraAvatar from './EzraAvatar'

export interface SidebarNavigationItem {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  description?: string
}

interface SidebarProps {
  items: SidebarNavigationItem[]
  activeItem: string
  onSelect: (id: string) => void
  onLogout: () => void
}

export function Sidebar({ items, activeItem, onSelect, onLogout }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      className="relative z-10 flex w-72 flex-col gap-8 bg-black/40 p-6 text-white backdrop-blur-xl"
    >
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <EzraAvatar size={96} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Ezra’s World</h2>
          <p className="text-sm text-white/70">September 12, 2012 · Age 13</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
          <div className="rounded-lg bg-white/10 p-3 shadow">
            <p className="font-semibold text-white">Lucky #13</p>
            <p>Prime Number</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3 shadow">
            <p className="font-semibold text-white">Fave Vibes</p>
            <p>Fishing · Space</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400 ${
                isActive ? 'bg-white/20 text-white shadow-lg' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white/80'}`} aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-semibold">{item.label}</span>
                {item.description ? <span className="text-xs text-white/60">{item.description}</span> : null}
              </div>
            </motion.button>
          )
        })}
      </nav>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-red-500/80 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-500"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </motion.button>
    </motion.aside>
  )
}

export default Sidebar
