'use client';

import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { GalleryItem } from '@/types/dashboard';

interface GallerySectionProps {
  userId: string;
}

export default function GallerySection({ userId }: GallerySectionProps) {
  const { supabaseClient } = useSessionContext();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from('gallery_items')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data as GalleryItem[]);
      } catch (error) {
        console.error(error);
        toast.error('Gallery unavailable. Configure Supabase storage.');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [supabaseClient, userId]);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      toast.error('Sign in to upload memories.');
      return;
    }
    if (!file) {
      toast.error('Select a photo first.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;

    try {
      setUploading(true);
      const { error: uploadError } = await supabaseClient.storage
        .from('memories')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage.from('memories').getPublicUrl(path);
      const publicUrl = publicUrlData.publicUrl;

      const { data, error } = await supabaseClient
        .from('gallery_items')
        .insert({
          user_id: userId,
          title: form.title || 'Untitled memory',
          description: form.description,
          storage_path: path,
          public_url: publicUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => [data as GalleryItem, ...prev]);
      toast.success('Memory uploaded!');
      setFile(null);
      setForm({ title: '', description: '' });
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Check Supabase bucket permissions.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Memory gallery</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Upload photos, artwork, or fishing trophies. Files are stored in Supabase storage and instantly available to the family.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card rounded-3xl p-6 text-slate-900">
          <h3 className="text-lg font-semibold">Gallery</h3>
          {loading ? (
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading memories…
            </div>
          ) : items.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No uploads yet. Share your first memory!</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <motion.figure key={item.id} whileHover={{ y: -3 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.public_url} alt={item.title} className="h-48 w-full object-cover" />
                  <figcaption className="px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {item.description && <p className="mt-1 text-xs text-slate-500">{item.description}</p>}
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <ImagePlus className="mr-3 h-5 w-5 text-purple-500" />
            Upload a memory
          </h3>
          <form onSubmit={handleUpload} className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Describe the moment"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={uploading || !userId}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow"
            >
              {uploading ? 'Uploading…' : 'Save memory'}
            </motion.button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            Requires a Supabase storage bucket named <strong>memories</strong> with public read access and an RLS-enabled <code>gallery_items</code> table.
          </p>
        </aside>
      </div>
    </section>
  );
}
