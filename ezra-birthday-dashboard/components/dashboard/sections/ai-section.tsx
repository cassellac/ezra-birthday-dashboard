'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MessageCircle, PencilLine, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { AffirmationEntry, DailyContent } from '@/types/dashboard';

interface AiSectionProps {
  userId: string;
  dailyContent: DailyContent | null;
  loadingDaily: boolean;
}

export default function AiSection({ userId, dailyContent, loadingDaily }: AiSectionProps) {
  const [prompt, setPrompt] = useState('');
  const [affirmations, setAffirmations] = useState<AffirmationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState(true);
  const signedIn = Boolean(userId);

  useEffect(() => {
    const loadAffirmations = async () => {
      try {
        setLoadingLog(true);
        const res = await fetch('/api/affirmations');
        if (!res.ok) throw new Error('Failed to load affirmations');
        const data = (await res.json()) as AffirmationEntry[];
        setAffirmations(data);
      } catch (error) {
        console.error(error);
        toast.error('Affirmation log unavailable. Check Supabase table permissions.');
      } finally {
        setLoadingLog(false);
      }
    };

    loadAffirmations();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signedIn) {
      toast.error('Sign in to save affirmations.');
      return;
    }
    if (!prompt.trim()) {
      toast.error('Tell the AI what kind of encouragement you need.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/affirmations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }
      const created = (await res.json()) as AffirmationEntry;
      setAffirmations((prev) => [created, ...prev]);
      setPrompt('');
      toast.success('Affirmation saved to your positivity log.');
    } catch (error) {
      console.error(error);
      toast.error('OpenAI is not configured yet. Add your API key in the environment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">AI studio</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          GPT crafts jokes, number 13 trivia, and daily affirmations. Add your own prompt and we’ll save the AI-powered response for the whole family to read.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card rounded-3xl p-6 text-slate-900">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <MessageCircle className="mr-3 h-5 w-5 text-purple-500" />
            Daily brief from ChatGPT
          </h3>

          {loadingDaily ? (
            <div className="mt-10 flex flex-col items-center justify-center text-sm text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              <p className="mt-3">Generating today’s updates…</p>
            </div>
          ) : dailyContent ? (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Joke:</span> {dailyContent.joke}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Number 13 fact:</span> {dailyContent.funFact13}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Fishing tip:</span> {dailyContent.fishingFact}
              </p>
              <div>
                <p className="font-semibold text-slate-800">Birthday twins (9/12/2012):</p>
                <ul className="ml-4 mt-2 list-disc space-y-1">
                  {dailyContent.birthdayTwins.map((twin) => (
                    <li key={twin.name}>
                      <span className="font-medium">{twin.name}</span> — {twin.description}
                    </li>
                  ))}
                </ul>
              </div>
              {dailyContent.affirmation && (
                <p>
                  <span className="font-semibold text-slate-800">Daily affirmation:</span> {dailyContent.affirmation}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Generated {new Date(dailyContent.generatedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              We’ll show AI content here once the OpenAI API key is available.
            </p>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <PencilLine className="mr-3 h-5 w-5 text-emerald-500" />
            Create a positivity log entry
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <textarea
              className="h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
              placeholder="Tell the AI what kind of encouragement Ezra needs today…"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !signedIn}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow"
            >
              {loading ? 'Talking to GPT…' : 'Generate affirmation'}
            </motion.button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            {signedIn
              ? 'We send your prompt to OpenAI’s GPT model, summarize the encouragement, and store it in Supabase so Ezra can replay the pep talks anytime.'
              : 'Sign in to unlock the GPT-powered affirmation log.'}
          </p>
        </aside>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="flex items-center text-lg font-semibold text-slate-900">
          <Sparkles className="mr-3 h-5 w-5 text-amber-500" />
          Positivity log
        </h3>
        {loadingLog ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading affirmations…
          </div>
        ) : affirmations.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No entries yet. Add one above to start the daily gratitude ritual.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {affirmations.map((entry) => (
              <li key={entry.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow">
                <p className="text-sm text-slate-700">{entry.summary ?? entry.prompt}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
