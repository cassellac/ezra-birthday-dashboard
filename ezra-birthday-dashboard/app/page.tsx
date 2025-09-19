'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  Bot,
  BookOpen,
  Gamepad2,
  Home,
  Image as ImageIcon,
  Music,
  PlugZap,
  Settings,
  Users,
} from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

import LoginPage from '@/components/LoginPage'
import Sidebar, { SidebarNavigationItem } from '@/components/Sidebar'
import { DashboardSection } from '@/components/sections/DashboardSection'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { StorySection } from '@/components/sections/StorySection'
import { SpotifySection } from '@/components/sections/SpotifySection'
import { AIAssistantSection } from '@/components/sections/AIAssistantSection'
import { GamesSection } from '@/components/sections/GamesSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { SettingsSection } from '@/components/sections/SettingsSection'
import { ConnectionsSection } from '@/components/sections/ConnectionsSection'
import type { AffirmationEntry, DailyContent } from '@/types/content'

const DEFAULT_DAILY_CONTENT: DailyContent = {
  joke: "Why don't fish do homework? Because they're always swimming in school!",
  funFact13: 'The number 13 is a Fibonacci number and appears in space missions, sports jerseys, and even guitar strings.',
  fishingFact: 'In East Tennessee, cool mornings make the bass extra active—perfect for early trips with the family.',
  affirmation: 'You are the calm in the storm and the brightest star in the galaxy of people who love you.',
  nasa: {
    title: 'Cosmic Dreams',
    description: 'Fallback nebula background from the stars for days when NASA is offline.',
  },
  birthdayTwins: [
    { name: 'Yao Ming', summary: 'Basketball legend known for his giant heart and giant height.' },
    { name: 'Jennifer Hudson', summary: 'Singer and actor who turned her voice into an award-winning journey.' },
    { name: 'Louis C.K.', summary: 'Comedian who proves storytelling can make the whole world laugh.' },
  ],
  news: [
    {
      title: 'The Week Junior: Science Special',
      summary: 'Kids across the U.S. are building greenhouses at school to learn about sustainability.',
      source: 'The Week Junior',
    },
    {
      title: 'New Tennessee Fishing Records',
      summary: 'An East TN teen just set a new record with a smallmouth bass! Challenge accepted?',
      source: 'Tennessee Wildlife Resources Agency',
    },
    {
      title: 'Space Launch Alert',
      summary: 'NASA is prepping the Artemis missions to take humans back to the Moon.',
      source: 'NASA',
    },
  ],
  localFishingSpots: [
    {
      name: 'Cherokee Lake',
      location: 'Grainger County, TN',
      tip: 'Launch before sunrise for topwater bass bites and calm waters.',
    },
    {
      name: 'Fort Loudoun Lake',
      location: 'Knoxville, TN',
      tip: 'Great for afternoon trips with family-friendly piers and picnic spots.',
    },
    {
      name: 'Douglas Lake',
      location: 'Sevier County, TN',
      tip: 'Bring medium crankbaits in autumn when the water is crystal clear.',
    },
  ],
}

type SectionKey =
  | 'dashboard'
  | 'spotify'
  | 'contacts'
  | 'story'
  | 'ai'
  | 'games'
  | 'gallery'
  | 'settings'
  | 'connections'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard')
  const [nasaBackground, setNasaBackground] = useState<string | null>(null)
  const [dailyContent, setDailyContent] = useState<DailyContent>(DEFAULT_DAILY_CONTENT)
  const [affirmations, setAffirmations] = useState<AffirmationEntry[]>([])
  const [spotifyConnected, setSpotifyConnected] = useState(false)

  useEffect(() => {
    void loadNasaBackground()
    void loadDailyContent()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      void loadAffirmations()
    }
  }, [isLoggedIn])

  const navigationItems: SidebarNavigationItem[] = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Daily cosmic briefing' },
      { id: 'spotify', label: 'Spotify', icon: Music, description: 'Connect & play music' },
      { id: 'contacts', label: 'Contacts', icon: Users, description: 'Family hotline' },
      { id: 'story', label: 'Story', icon: BookOpen, description: 'Family storybook' },
      { id: 'ai', label: 'AI Assistant', icon: Bot, description: 'Chat with EzraGPT' },
      { id: 'connections', label: 'Connections', icon: PlugZap, description: 'Integrations & plugins' },
      { id: 'games', label: 'Games', icon: Gamepad2, description: 'Quick brain breaks' },
      { id: 'gallery', label: 'Gallery', icon: ImageIcon, description: 'Memories & photos' },
      { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize everything' },
    ],
    [],
  )

  async function loadNasaBackground() {
    try {
      const res = await fetch('/api/nasa/apod', { cache: 'no-store' })
      if (!res.ok) {
        throw new Error('Failed to fetch NASA background')
      }
      const data = await res.json()
      setNasaBackground(data.url)
      if (data.title) {
        setDailyContent((previous) => ({
          ...previous,
          nasa: { title: data.title, description: data.description },
        }))
      }
    } catch (error) {
      console.warn('NASA fallback activated', error)
      setNasaBackground('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=80')
    }
  }

  async function loadDailyContent() {
    try {
      const res = await fetch('/api/daily-content', { cache: 'no-store' })
      if (!res.ok) {
        throw new Error('Failed to load daily content')
      }
      const data = await res.json()
      setDailyContent((previous) => ({ ...previous, ...data.content }))
    } catch (error) {
      console.warn('Using default daily content', error)
    }
  }

  async function loadAffirmations() {
    try {
      const res = await fetch('/api/affirmations')
      if (!res.ok) {
        throw new Error('Unable to load affirmations')
      }
      const data = await res.json()
      setAffirmations(data.entries ?? [])
    } catch (error) {
      console.warn('Affirmations fallback', error)
      setAffirmations([])
    }
  }

  const handleCreateAffirmation = async (message: string) => {
    try {
      const res = await fetch('/api/affirmations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) {
        throw new Error('Failed to save affirmation')
      }
      const data = await res.json()
      const entry = data.entry as AffirmationEntry
      setAffirmations((prev) => [entry, ...prev].slice(0, 10))
      return entry
    } catch (error) {
      console.error(error)
      toast.error('Could not save affirmation just yet.')
      return null
    }
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage
          backgroundImage={nasaBackground ?? undefined}
          onLogin={() => {
            setIsLoggedIn(true)
            toast.success('Welcome back, Ezra! 🎉')
          }}
          actions={<p>No passwords stored – Supabase handles secure sign in.</p>}
        />
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 text-white">
      {nasaBackground ? (
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${nasaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}

      <Sidebar
        items={navigationItems}
        activeItem={activeSection}
        onSelect={(id) => setActiveSection(id as SectionKey)}
        onLogout={() => {
          setIsLoggedIn(false)
          toast.success('See you soon, superstar!')
        }}
      />

      <main className="relative z-10 flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' ? <DashboardSection key="dashboard" content={dailyContent} /> : null}
          {activeSection === 'spotify' ? (
            <SpotifySection
              key="spotify"
              isConnected={spotifyConnected}
              onConnect={() => {
                setSpotifyConnected(true)
                toast.success('Spotify connected! Time for tunes!')
              }}
            />
          ) : null}
          {activeSection === 'contacts' ? <ContactsSection key="contacts" /> : null}
          {activeSection === 'story' ? <StorySection key="story" /> : null}
          {activeSection === 'ai' ? (
            <AIAssistantSection key="ai" affirmations={affirmations} onCreateAffirmation={handleCreateAffirmation} />
          ) : null}
          {activeSection === 'connections' ? <ConnectionsSection key="connections" /> : null}
          {activeSection === 'games' ? <GamesSection key="games" /> : null}
          {activeSection === 'gallery' ? <GallerySection key="gallery" /> : null}
          {activeSection === 'settings' ? <SettingsSection key="settings" /> : null}
        </AnimatePresence>
      </main>

      <Toaster position="top-right" />
    </div>
  )
}
