'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { AffirmationEntry } from '@/types/content'

interface AIAssistantSectionProps {
  affirmations: AffirmationEntry[]
  onCreateAffirmation: (message: string) => Promise<AffirmationEntry | null>
}

export function AIAssistantSection({ affirmations, onCreateAffirmation }: AIAssistantSectionProps) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('Ask me anything about fishing, space or being awesome!')
  const [isLoading, setIsLoading] = useState(false)

  const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) {
      toast.error('Please type a question first!')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/openai/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      })

      if (!res.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await res.json()
      setResponse(data.message)
      toast.success('GPT is here for you!')
    } catch (error) {
      console.error(error)
      toast.error('The AI assistant is taking a short break. Try again soon!')
    } finally {
      setIsLoading(false)
      setMessage('')
    }
  }

  const handleCreateAffirmation = async () => {
    if (!message.trim()) {
      toast.error('Write an affirmation first!')
      return
    }
    setIsLoading(true)
    try {
      const entry = await onCreateAffirmation(message)
      if (entry) {
        toast.success('Affirmation saved to your positivity log!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Unable to save affirmation right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">AI Co-Pilot 🤖</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Powered by OpenAI, customized with prompts crafted for you. Ask for jokes, space facts or quick pep talks.
        </p>
      </div>

      <div className="glass-card grid gap-6 p-6 lg:grid-cols-[1.6fr,1fr]">
        <form onSubmit={handleAsk} className="space-y-4">
          <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-6 shadow">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-purple-500" aria-hidden="true" />
              <div>
                <p className="text-sm uppercase text-purple-500">Chat with EzraGPT</p>
                <h3 className="text-xl font-semibold text-gray-800">What would you like to explore?</h3>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask for a fishing strategy, a NASA fact, or tell me how your day went..."
              rows={4}
              className="mt-4 w-full rounded-2xl border border-purple-200 bg-white/90 p-4 text-sm text-gray-700 shadow-sm focus:border-purple-400 focus:outline-none"
            />

            <div className="flex flex-col gap-3 pt-2 md:flex-row">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-600 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                Ask EzraGPT
              </button>
              <button
                type="button"
                onClick={handleCreateAffirmation}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-purple-600 shadow-lg transition hover:bg-purple-50 disabled:opacity-70"
              >
                Save as affirmation
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
            <p className="text-sm text-gray-500">EzraGPT says:</p>
            <p className="mt-2 text-base font-semibold text-gray-700">{response}</p>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Affirmation Log</h3>
          {affirmations.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-4 text-sm text-purple-600">
              Your positivity log is empty. Write something uplifting and save it!
            </p>
          ) : (
            <ul className="space-y-3">
              {affirmations.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-purple-100 bg-white/80 p-4 text-sm shadow-sm">
                  <p className="font-semibold text-purple-600">{entry.summary}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AIAssistantSection
