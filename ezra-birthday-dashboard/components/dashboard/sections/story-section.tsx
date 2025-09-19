'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';

const storySections = [
  {
    title: 'A new light',
    icon: Sparkles,
    content:
      "When you arrived on September 12, 2012, Ezra, you didn’t just join the family—you became the brightest point in our constellation. Your mom calls you her miracle, the reason every sunrise feels hopeful.",
  },
  {
    title: 'Family super team',
    icon: Users,
    content:
      'John is always ready with a tackle box and a grin. Uncle Anthony brings the wild west stories, Uncle Jason adds the music soundtrack, and your grandparents cheer loudest from every corner of the country.',
  },
  {
    title: 'Big-hearted hero',
    icon: Heart,
    content:
      "You’re the glue, the jokester, the caretaker. Whether you’re checking in on Grandma or helping Mom with farm chores, your kindness makes the whole crew feel seen and loved.",
  },
];

export default function StorySection() {
  return (
    <section className="space-y-8">
      <header className="text-center">
        <h2 className="text-4xl font-bold text-white">Your family story</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/70">
          Swipe through each chapter to remember why the Buckholz crew is so proud of you. Every card is a moment, every quote a reminder that you changed our world.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {storySections.map(({ title, icon: Icon, content }) => (
          <motion.article
            key={title}
            whileHover={{ y: -6 }}
            className="card-3d flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-6 text-white shadow-xl"
          >
            <div>
              <Icon className="h-10 w-10" />
              <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/90">{content}</p>
            </div>
            <div className="mt-6 rounded-2xl bg-white/20 p-4 text-sm text-white/80 shadow-inner">
              “Keep being brave, keep being silly, and keep reminding us that love is the best adventure.”
            </div>
          </motion.article>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 text-slate-800">
        <h3 className="text-xl font-semibold text-purple-700">Daily gratitude journal</h3>
        <p className="mt-2 text-sm text-slate-600">
          Ask each family member to drop a short note after dinner. Supabase stores every entry so you can flip through the memories whenever you need a boost.
        </p>
      </div>
    </section>
  );
}
