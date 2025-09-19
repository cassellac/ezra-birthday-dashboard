import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: "Ezra's Birthday Dashboard",
  description: 'A special birthday gift for Ezra - September 12, 2012',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'https://ezra-gk.online'),
  openGraph: {
    title: "Ezra's Birthday Dashboard",
    description: 'Interactive dashboard celebrating Ezra with music, space photos, affirmations and family stories.',
    type: 'website',
    url: 'https://ezra-gk.online',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased text-slate-900">{children}</body>
    </html>
  )
}
