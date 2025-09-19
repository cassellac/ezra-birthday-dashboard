'use client'

import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'

interface Contact {
  name: string
  phone: string
  email?: string
  relation: string
  emoji: string
}

const FAMILY_CONTACTS: Contact[] = [
  { name: 'Mom', phone: '865-617-1449', email: 'acbuckholz1@gmail.com', relation: 'Mom', emoji: '❤️' },
  { name: 'John', phone: '865-804-3114', relation: 'Knoxville Crew', emoji: '🧢' },
  { name: 'Uncle Anthony', phone: '510-216-2233', email: 'acinktown@gmail.com', relation: 'California Family', emoji: '🎯' },
  { name: 'Uncle Jason', phone: '928-529-7689', email: 'jasoncassella@gmail.com', relation: 'Arizona Adventurer', emoji: '🎸' },
  { name: 'Grandma Buckholz', phone: '928-550-1364', email: 'vickiebuckholz@gmail.com', relation: 'Grandma', emoji: '🌸' },
  { name: 'Grandpa Buckholz', phone: '928-714-8855', email: 'byronbuckholz10@gmail.com', relation: 'Grandpa', emoji: '🧡' },
]

export function ContactsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow">Family Hotline 📞</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Everyone who loves you is one tap away. Call, text or email to share the latest fishing victories and stories.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {FAMILY_CONTACTS.map((contact) => (
            <motion.div
              key={contact.name}
              whileHover={{ y: -4 }}
              className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-white to-purple-50 p-5 shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {contact.emoji}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-purple-500">{contact.relation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-purple-500" aria-hidden="true" />
                <span>{contact.phone}</span>
              </div>

              {contact.email ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-purple-500" aria-hidden="true" />
                  <span>{contact.email}</span>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ContactsSection
