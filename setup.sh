#!/bin/bash

echo "🎉 Setting up Ezra's Birthday Dashboard 🎉"
echo "========================================="

# Create project directory
mkdir -p ezra-birthday-dashboard
cd ezra-birthday-dashboard

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "ezra-birthday-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "setup": "node setup.js"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "openai": "^4.24.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
EOF

# Install dependencies
echo "Installing dependencies..."
npm install

# Create directory structure
mkdir -p 
app/api/{auth,spotify,openai,nasa,ifttt,news,fishing,affirmations}
mkdir -p components
mkdir -p lib
mkdir -p public/images

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com', 'apod.nasa.gov', 'api.nasa.gov'],
  },
}

module.exports = nextConfig
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
export default config
EOF

# Create app/layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Ezra's Birthday Dashboard",
  description: 'A special birthday gift for Ezra - September 12, 2012',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# Create app/globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 100px rgba(255, 255, 255, 0.1) inset;
}

.card-3d {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  transform-style: preserve-3d;
  transition: all 0.4s ease;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 0 60px rgba(102, 126, 234, 0.3);
}

.card-3d:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 80px rgba(102, 126, 234, 0.5);
}
EOF

# Create .env.local template
cat > .env.local.example << 'EOF'
# Copy this to .env.local and fill in your values
# DO NOT commit .env.local to git

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=

# NASA (optional)
NASA_API_KEY=

# IFTTT
IFTTT_WEBHOOK_KEY=

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
EOF

# Create basic app/page.tsx (simplified version)
cat > app/page.tsx << 'EOF'
'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center 
bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="glass-card p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome, 
Ezra!</h1>
          <p className="text-center mb-8">Your Birthday Dashboard 🎂</p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white 
py-3 rounded-lg"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 
to-blue-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Ezra's 
Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-3d p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Daily Joke</h2>
          <p>Why don't scientists trust atoms? Because they make up 
everything!</p>
        </div>
        <div className="card-3d p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Fun Fact #13</h2>
          <p>13 is a prime number and considered lucky in many 
cultures!</p>
        </div>
        <div className="card-3d p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Fishing Tip</h2>
          <p>Best spots in East TN: Holston River Park!</p>
        </div>
      </div>
      <button 
        onClick={() => setIsLoggedIn(false)}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 
rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

echo ""
echo "✅ Project structure created!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Copy your .env.local.example to .env.local"
echo "   cp .env.local.example .env.local"
echo ""
echo "2. Edit .env.local and add your API keys"
echo ""
echo "3. Run the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000"
echo ""
echo "🚀 TO DEPLOY:"
echo "1. Push to GitHub"
echo "2. Connect to Vercel"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "📦 API KEYS NEEDED:"
echo "- Supabase: https://supabase.com (Free)"
echo "- Spotify: https://developer.spotify.com/dashboard"
echo "- OpenAI: https://platform.openai.com/api-keys"
echo "- NASA: https://api.nasa.gov (Optional)"
echo ""

