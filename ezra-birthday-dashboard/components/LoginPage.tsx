'use client'

import { motion } from 'framer-motion'
import { Cake, LogIn } from 'lucide-react'
import { ReactNode } from 'react'
import EzraAvatar from './EzraAvatar'

interface LoginPageProps {
  backgroundImage?: string
  onLogin: () => void
  actions?: ReactNode
}

const loginOptions = [
  { label: 'Continue with Google', id: 'google' },
  { label: 'Continue with Apple', id: 'apple' },
  { label: 'Use phone or email', id: 'email' },
]

export function LoginPage({ backgroundImage, onLogin, actions }: LoginPageProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 px-4 py-10">
      {backgroundImage ? (
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="glass-card relative z-10 w-full max-w-xl space-y-6 p-10 text-center"
      >
        <motion.div
          className="mx-auto w-fit"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        >
          <Cake className="mb-6 h-16 w-16 text-purple-500" aria-hidden="true" />
        </motion.div>

        <div className="flex flex-col items-center gap-4 text-gray-800">
          <EzraAvatar size={120} />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Ezra!</h1>
            <p className="text-sm text-gray-600">September 12, 2012 · Lucky number 13 squad 🎉</p>
          </div>
        </div>

        <p className="mx-auto max-w-md text-sm text-gray-600">
          Your personalized birthday dashboard is waiting with new music, affirmations, space photos and family surprises.
          Choose a sign-in option to get started!
        </p>

        <div className="grid gap-3 text-left">
          {loginOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 px-5 py-4 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur transition hover:border-white hover:bg-white"
              onClick={onLogin}
            >
              <span>{option.label}</span>
              <LogIn className="h-4 w-4 text-purple-500" aria-hidden="true" />
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onLogin}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 px-6 py-3 text-base font-semibold text-white shadow-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400"
        >
          Enter Dashboard
        </motion.button>

        {actions ? <div className="text-sm text-gray-500">{actions}</div> : null}
      </motion.div>
    </div>
  )
}

export default LoginPage
