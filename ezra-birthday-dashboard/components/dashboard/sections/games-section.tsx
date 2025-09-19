'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Gamepad2, Rocket, Trophy } from 'lucide-react';

const games = [
  {
    title: 'Stardew Valley Co-op',
    description: 'Farm, fish, and explore Pelican Town with Mom. Sync schedules via the dashboard calendar.',
    icon: Rocket,
    link: 'https://www.stardewvalley.net/'
  },
  {
    title: 'Minecraft Fishing Challenge',
    description: 'Weekly fishing derby on the family realm. Log catches and crown the Lure Legend.',
    icon: Trophy,
    link: 'https://www.minecraft.net/'
  },
  {
    title: 'Brain training corner',
    description: 'Logic puzzles and math quests curated for future engineers. Powered by Brilliant.org.',
    icon: BrainCircuit,
    link: 'https://brilliant.org/'
  },
];

export default function GamesSection() {
  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Game time hub</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Quick-launch activities that combine fun, learning, and family time. Bookmark your favorites in the settings tab.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {games.map(({ title, description, icon: Icon, link }) => (
          <motion.a
            key={title}
            href={link}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -4 }}
            className="card-3d flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-6 text-white"
          >
            <div>
              <Icon className="h-10 w-10" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-white/85">{description}</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Launch game
              <Gamepad2 className="h-4 w-4" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
