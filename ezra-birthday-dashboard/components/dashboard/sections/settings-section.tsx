'use client';

import { useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { Palette, Save, UserCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Profile } from '@/types/dashboard';

interface SettingsSectionProps {
  profile: Profile | null;
}

export default function SettingsSection({ profile }: SettingsSectionProps) {
  const { session, supabaseClient } = useSessionContext();
  const [form, setForm] = useState({
    display_name: profile?.display_name ?? 'Ezra',
    favorite_color: profile?.favorite_color ?? '#6d28d9',
    birthday: profile?.birthday ?? '2012-09-12',
    bio: profile?.bio ?? 'Fishing champion • Science explorer • Family hero',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = session?.user;
    if (!user) {
      toast.error('Sign in to update your profile.');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabaseClient
        .from('profiles')
        .upsert({ id: user.id, ...form });
      if (error) throw error;
      toast.success('Profile updated!');
    } catch (error) {
      console.error(error);
      toast.error('Unable to save settings. Check Supabase policies.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Personalize your dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          These preferences control the greeting, accent colors, and upcoming birthday countdown.
        </p>
      </header>

      <div className="glass-card rounded-3xl p-6 text-slate-900">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Display name</span>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <UserCircle className="mr-3 h-5 w-5 text-purple-500" />
              <input
                className="w-full border-none bg-transparent text-sm focus:outline-none"
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Favorite accent color</span>
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-purple-500" />
              <input
                type="color"
                name="favorite_color"
                value={form.favorite_color}
                onChange={handleChange}
                className="h-10 w-20 cursor-pointer rounded-xl border border-slate-200"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Birthday</span>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
            />
          </label>

          <label className="md:col-span-2 space-y-2">
            <span className="text-sm font-medium text-slate-600">Bio</span>
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
            />
          </label>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="md:col-span-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </motion.button>
        </form>
      </div>
    </section>
  );
}
