'use client';

import type { ComponentType } from 'react';
import { differenceInYears, format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  Fish,
  Lightbulb,
  MapPin,
  Music,
  Newspaper,
  Phone,
  Smile,
  Star,
} from 'lucide-react';
import type { DailyContent, Profile } from '@/types/dashboard';

interface HomeSectionProps {
  profile: Profile | null;
  dailyContent: DailyContent | null;
  loading: boolean;
  userEmail: string;
}

const DEFAULT_BIRTHDAY = '2012-09-12';

export default function HomeSection({ profile, dailyContent, loading, userEmail }: HomeSectionProps) {
  const birthday = profile?.birthday ?? DEFAULT_BIRTHDAY;
  const age = differenceInYears(new Date(), new Date(birthday));

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Welcome back, {profile?.display_name ?? 'Ezra'}!
          </h1>
          <p className="mt-3 max-w-3xl text-base text-white/80 sm:text-lg">
            Here’s your personalized mission control—music, memories, and AI-powered surprises curated just for your 13th year around the sun.
          </p>
        </div>
        <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-right text-white shadow-lg backdrop-blur">
          <p className="text-sm uppercase tracking-widest text-white/70">Age</p>
          <p className="text-3xl font-bold">{age}</p>
          <p className="mt-2 text-xs text-white/60">Birthday: {format(new Date(birthday), 'MMMM d, yyyy')}</p>
          {userEmail && <p className="mt-1 text-xs text-white/50">Signed in as {userEmail}</p>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard
          title="Daily joke"
          icon={Smile}
          gradient="from-indigo-500 via-purple-500 to-pink-500"
          content={dailyContent?.joke ?? 'Loading a laugh from HQ…'}
          loading={loading}
        />
        <InfoCard
          title="Lucky 13 fact"
          icon={Lightbulb}
          gradient="from-amber-500 via-orange-500 to-red-500"
          content={dailyContent?.funFact13 ?? 'Gathering number lore…'}
          loading={loading}
        />
        <InfoCard
          title="Fishing wisdom"
          icon={Fish}
          gradient="from-emerald-500 via-teal-500 to-cyan-500"
          content={dailyContent?.fishingFact ?? 'Baiting the latest tip…'}
          loading={loading}
        />
        <InfoCard
          title="Kid-friendly news"
          icon={Newspaper}
          gradient="from-sky-500 via-blue-500 to-indigo-500"
          content={dailyContent?.newsHeadline ?? 'Scanning headlines…'}
          loading={loading}
        />
        <InfoCard
          title="Birthday twins"
          icon={Calendar}
          gradient="from-rose-500 via-fuchsia-500 to-violet-500"
          content={
            dailyContent?.birthdayTwins
              ?.map((twin) => `${twin.name} — ${twin.description}`)
              .join('\n') ?? 'Finding famous friends…'
          }
          loading={loading}
          multiline
        />
        <InfoCard
          title="Affirmation"
          icon={Star}
          gradient="from-yellow-400 via-orange-400 to-red-400"
          content={
            dailyContent?.affirmation ??
            'You are courageous, creative, and your smile makes every room brighter.'
          }
          loading={loading}
        />
      </div>

      <div className="glass-card grid gap-4 rounded-3xl p-6 text-gray-800 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction icon={Music} label="Play Spotify" description="Pick up where you left off" />
        <QuickAction icon={Phone} label="Call family" description="Stay connected with your crew" />
        <QuickAction icon={MapPin} label="Fishing spots" description="Discover East TN adventures" />
        <QuickAction icon={Calendar} label="Plan events" description="Add fun to your schedule" />
      </div>
    </section>
  );
}

function InfoCard({
  title,
  icon: Icon,
  gradient,
  content,
  loading,
  multiline,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  content: string;
  loading: boolean;
  multiline?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card-3d relative flex h-full flex-col rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white`}
    >
      <Icon className="mb-4 h-8 w-8" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={`mt-3 text-sm text-white/90 ${multiline ? 'whitespace-pre-line' : ''}`}>
        {loading ? 'Loading…' : content}
      </p>
    </motion.div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 text-left shadow-lg transition hover:shadow-xl"
    >
      <Icon className="mb-3 h-6 w-6 text-purple-500" />
      <span className="text-base font-semibold text-slate-900">{label}</span>
      <span className="mt-1 text-xs text-slate-500">{description}</span>
    </motion.button>
  );
}
