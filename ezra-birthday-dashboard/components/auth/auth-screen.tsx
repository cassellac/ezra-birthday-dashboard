'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, LogIn, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast, Toaster } from 'react-hot-toast';

const FALLBACK_BACKGROUND = 'https://source.unsplash.com/random/1920x1080/?space,galaxy';

const oauthProviders = [
  { provider: 'google' as const, label: 'Continue with Google' },
  { provider: 'apple' as const, label: 'Continue with Apple' },
];

export default function AuthScreen() {
  const { supabaseClient } = useSessionContext();
  const [background, setBackground] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const res = await fetch('/api/nasa/apod', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load background');
        const data = await res.json();
        setBackground(data.url ?? FALLBACK_BACKGROUND);
      } catch (error) {
        setBackground(FALLBACK_BACKGROUND);
      }
    };

    loadBackground();
  }, []);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      setLoadingProvider(provider);
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to start OAuth flow. Check provider configuration.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    try {
      setLoading(true);
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;
      toast.success('Check your inbox for a magic link to continue.');
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error('Email sign-in failed. Confirm the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!phone) {
      toast.error('Enter a valid phone number including country code.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOtp({
        phone,
        options: { channel: 'sms' },
      });
      if (error) throw error;
      setPhoneOtpSent(true);
      toast.success('Text message sent! Enter the 6-digit code to continue.');
    } catch (error) {
      console.error(error);
      toast.error('Could not send SMS code. Verify your Supabase phone auth setup.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone || !phoneOtp) {
      toast.error('Enter the code you received to finish signing in.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.verifyOtp({
        phone,
        token: phoneOtp,
        type: 'sms',
      });
      if (error) throw error;
      toast.success('Welcome back! Redirecting to your dashboard.');
    } catch (error) {
      console.error(error);
      toast.error('Invalid or expired code. Request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 via-blue-700 to-emerald-600 px-4">
      <Toaster position="top-right" />
      {background && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
          >
            <Cake className="h-12 w-12" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Ezra, your adventure awaits! 🎉</h1>
          <p className="mt-3 max-w-xl text-base text-gray-600 sm:text-lg">
            Sign in securely to unlock your birthday dashboard, connect Spotify, check family messages, and explore new AI-powered surprises every day.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-inner">
            <h2 className="flex items-center text-lg font-semibold">
              <ShieldCheck className="mr-3 h-5 w-5" />
              Single-tap logins
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Use the same accounts you already trust. We never store your passwords.
            </p>
            <div className="mt-6 space-y-4">
              {oauthProviders.map(({ provider, label }) => (
                <motion.button
                  key={provider}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOAuth(provider)}
                  className="flex w-full items-center justify-between rounded-xl bg-white/10 px-5 py-3 text-left text-sm font-medium shadow-lg ring-1 ring-white/10 transition hover:bg-white/20"
                  disabled={loadingProvider === provider}
                >
                  <span>{label}</span>
                  <LogIn className="h-4 w-4" />
                  {loadingProvider === provider && <span className="text-xs text-white/70">Preparing…</span>}
                </motion.button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-gray-800">Magic link or text message</h2>
            <p className="mt-2 text-sm text-gray-600">
              We can send a secure link to your inbox or a 6-digit code to your phone.
            </p>

            <form onSubmit={handleEmailLogin} className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email address
              </label>
              <div className="flex items-center rounded-xl bg-white px-4 py-3 shadow-inner">
                <Mail className="mr-3 h-5 w-5 text-purple-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ezra@example.com"
                  className="w-full border-none bg-transparent text-sm focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-600 hover:to-blue-600"
              >
                Send magic link
              </motion.button>
            </form>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                Phone number (with country code)
              </label>
              <div className="flex items-center rounded-xl bg-white px-4 py-3 shadow-inner">
                <Phone className="mr-3 h-5 w-5 text-emerald-500" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 865 555 1234"
                  className="w-full border-none bg-transparent text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={loading || phoneOtpSent}
                  className="flex-1 rounded-xl border border-emerald-400 bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
                >
                  {phoneOtpSent ? 'Code sent!' : 'Text me a code'}
                </motion.button>
                {phoneOtpSent && (
                  <form onSubmit={handleVerifyPhoneOtp} className="flex flex-1 items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(event) => setPhoneOtp(event.target.value)}
                      placeholder="123456"
                      className="w-full rounded-lg border border-emerald-300 px-3 py-3 text-center text-sm tracking-widest focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow"
                    >
                      Verify
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
