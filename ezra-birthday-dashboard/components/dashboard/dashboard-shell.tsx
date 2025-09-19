'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  BookOpen,
  Gamepad2,
  Home,
  Image,
  LogOut,
  Music,
  Settings,
  Users,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import type { DailyContent, Profile } from '@/types/dashboard';
import HomeSection from './sections/home-section';
import SpotifySection from './sections/spotify-section';
import ContactsSection from './sections/contacts-section';
import StorySection from './sections/story-section';
import AiSection from './sections/ai-section';
import GamesSection from './sections/games-section';
import GallerySection from './sections/gallery-section';
import SettingsSection from './sections/settings-section';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'spotify', label: 'Spotify', icon: Music },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'ai', label: 'AI Studio', icon: Bot },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

interface DashboardShellProps {
  profile: Profile | null;
}

type ActiveSection = (typeof navigation)[number]['id'];

export default function DashboardShell({ profile }: DashboardShellProps) {
  const router = useRouter();
  const { session, supabaseClient } = useSessionContext();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [nasaBackground, setNasaBackground] = useState<string | null>(null);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);

  const user = session?.user;

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const res = await fetch('/api/nasa/apod');
        if (!res.ok) throw new Error('Failed to load background');
        const data = await res.json();
        setNasaBackground(data.url ?? null);
      } catch (error) {
        console.error('NASA background error', error);
        setNasaBackground('https://source.unsplash.com/random/1920x1080/?space,galaxy');
      }
    };

    loadBackground();
  }, []);

  useEffect(() => {
    const loadDailyContent = async () => {
      try {
        setDailyLoading(true);
        const res = await fetch('/api/openai/daily', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load daily content');
        const data = (await res.json()) as DailyContent;
        setDailyContent(data);
      } catch (error) {
        console.error('Daily content error', error);
        toast.error('Using fallback jokes until OpenAI is configured.');
        setDailyContent({
          joke: "Why don't fish do well in school? Because they're always swimming below sea level!",
          funFact13: '13 is the number of moons orbiting Neptune discovered so far.',
          fishingFact: 'The Tennessee state record for largemouth bass is over 15 pounds!',
          newsHeadline: 'The Week Junior: Explore the latest kid-friendly news!',
          birthdayTwins: [
            {
              name: 'Yao Ming',
              description: 'Retired NBA star born September 12, 1980—towering talent like your bright spirit.',
            },
          ],
          affirmation: 'You are thoughtful, brave, and have a heart that inspires everyone around you.',
          generatedAt: new Date().toISOString(),
        });
      } finally {
        setDailyLoading(false);
      }
    };

    loadDailyContent();
  }, []);

  const avatarInitial = useMemo(() => {
    if (profile?.display_name) {
      return profile.display_name[0]?.toUpperCase();
    }
    if (user?.email) {
      return user.email[0]?.toUpperCase();
    }
    return 'E';
  }, [profile?.display_name, user?.email]);

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      toast.success('See you soon, Ezra!');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Could not sign out. Try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-700 via-blue-700 to-emerald-600">
      <Toaster position="top-right" />
      {nasaBackground && (
        <div
          className="pointer-events-none fixed inset-0 opacity-20"
          style={{
            backgroundImage: `url(${nasaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="relative z-10 w-72 shrink-0 border-r border-white/10 bg-slate-950/70 px-6 py-8 text-white shadow-2xl backdrop-blur"
      >
        <div className="mb-10 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold"
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Ezra avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <span>{avatarInitial}</span>
            )}
          </motion.div>
          <h2 className="text-xl font-bold">
            {profile?.display_name ?? user?.email ?? "Ezra's Dashboard"}
          </h2>
          <p className="mt-1 text-sm text-white/60">Born September 12, 2012</p>
        </div>

        <nav className="space-y-2">
          {navigation.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(id)}
              className={`flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                activeSection === id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </motion.button>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-10 flex w-full items-center justify-center rounded-2xl bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </motion.button>
      </motion.aside>

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-10 lg:px-12">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <HomeSection
                profile={profile}
                dailyContent={dailyContent}
                loading={dailyLoading}
                userEmail={user?.email ?? ''}
              />
            </motion.div>
          )}

          {activeSection === 'spotify' && (
            <motion.div key="spotify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SpotifySection userId={user?.id ?? ''} />
            </motion.div>
          )}

          {activeSection === 'contacts' && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ContactsSection userId={user?.id ?? ''} />
            </motion.div>
          )}

          {activeSection === 'story' && (
            <motion.div key="story" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <StorySection />
            </motion.div>
          )}

          {activeSection === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AiSection userId={user?.id ?? ''} dailyContent={dailyContent} loadingDaily={dailyLoading} />
            </motion.div>
          )}

          {activeSection === 'games' && (
            <motion.div key="games" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <GamesSection />
            </motion.div>
          )}

          {activeSection === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <GallerySection userId={user?.id ?? ''} />
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SettingsSection profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
