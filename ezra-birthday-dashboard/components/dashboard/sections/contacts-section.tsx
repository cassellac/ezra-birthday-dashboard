'use client';

import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { Mail, Phone, Trash2, UserPlus, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ContactEntry } from '@/types/dashboard';

interface ContactsSectionProps {
  userId: string;
}

const fallbackContacts: Array<Omit<ContactEntry, 'id' | 'user_id' | 'created_at'>> = [
  { name: 'Mom', relationship: 'Mom', phone: '865-617-1449', email: 'acbuckholz1@gmail.com', notes: 'Always your #1 fan 💖' },
  { name: 'John', relationship: 'Dad', phone: '865-804-3114', notes: 'Fishing buddy and adventure guide' },
  { name: 'Uncle Anthony', relationship: 'Uncle', phone: '510-216-2233', email: 'acinktown@gmail.com', notes: 'West coast storyteller' },
  { name: 'Uncle Jason', relationship: 'Uncle', phone: '928-529-7689', email: 'jasoncassella@gmail.com', notes: 'Guitar hero of the family' },
  { name: 'Grandma Buckholz', relationship: 'Grandma', phone: '928-550-1364', email: 'vickiebuckholz@gmail.com', notes: 'Loves baking cookies with you' },
  { name: 'Grandpa Buckholz', relationship: 'Grandpa', phone: '928-714-8855', email: 'byronbuckholz10@gmail.com', notes: 'Stories for days' },
];

export default function ContactsSection({ userId }: ContactsSectionProps) {
  const { supabaseClient } = useSessionContext();
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) {
        setContacts(
          fallbackContacts.map((contact, index) => ({
            ...contact,
            id: `fallback-${index}`,
            user_id: 'fallback',
            created_at: new Date().toISOString(),
          }))
        );
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from('contacts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) {
          await supabaseClient.from('contacts').insert(
            fallbackContacts.map((contact) => ({
              ...contact,
              user_id: userId,
            }))
          );
          await fetchContacts();
          return;
        }

        setContacts(data as ContactEntry[]);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load contacts. Showing the family list instead.');
        setContacts(
          fallbackContacts.map((contact, index) => ({
            ...contact,
            id: `fallback-${index}`,
            user_id: 'fallback',
            created_at: new Date().toISOString(),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [supabaseClient, userId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (!userId) {
      toast.error('Sign in to save contacts.');
      return;
    }

    try {
      setLoading(true);
      const { error, data } = await supabaseClient
        .from('contacts')
        .insert({
          ...form,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setContacts((prev) => [...prev, data as ContactEntry]);
      toast.success(`${form.name} added to your crew!`);
      setForm({ name: '', relationship: '', phone: '', email: '', notes: '' });
    } catch (error) {
      console.error(error);
      toast.error('Could not add contact. Confirm Supabase policies.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!userId) return;
    try {
      setLoading(true);
      const { error } = await supabaseClient
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', userId);
      if (error) throw error;
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
      toast.success('Contact removed.');
    } catch (error) {
      console.error(error);
      toast.error('Unable to remove contact.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Important contacts</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Family and friends who always pick up. Call, text, or email directly from your dashboard.
        </p>
      </header>

      <div className="glass-card grid gap-6 rounded-3xl p-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <Users className="mr-3 h-5 w-5 text-purple-500" />
            Your crew
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {contacts.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{contact.name}</p>
                    {contact.relationship && (
                      <p className="text-xs uppercase tracking-wide text-purple-500/80">{contact.relationship}</p>
                    )}
                    {contact.phone && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-emerald-500" />
                        <a href={`tel:${contact.phone}`} className="hover:text-emerald-600">
                          {contact.phone}
                        </a>
                      </p>
                    )}
                    {contact.email && (
                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="h-4 w-4 text-sky-500" />
                        <a href={`mailto:${contact.email}`} className="hover:text-sky-600">
                          {contact.email}
                        </a>
                      </p>
                    )}
                    {contact.notes && <p className="mt-3 text-xs text-slate-500">{contact.notes}</p>}
                  </div>
                  {contact.user_id !== 'fallback' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(contact.id)}
                      className="rounded-full bg-red-100 p-2 text-red-500 transition hover:bg-red-200"
                      aria-label={`Remove ${contact.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <UserPlus className="mr-3 h-5 w-5 text-emerald-500" />
            Add a new contact
          </h3>
          <form onSubmit={handleAddContact} className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Relationship"
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
              placeholder="Notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow"
            >
              Save contact
            </motion.button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            Contacts are stored in Supabase so the whole family can update the list together.
          </p>
        </aside>
      </div>
    </section>
  );
}
