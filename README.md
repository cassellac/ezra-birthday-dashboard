# 🎉 Ezra's Birthday Dashboard

A personalized web application celebrating Ezra's 13th birthday (September 12, 2012) - a dashboard filled with interactive features, family connections, and everything he loves: fishing, farming, and space exploration!

## 🌟 Live Demo

**Visit:** [https://ezra-gk.online](https://ezra-gk.online)

## 🎯 About This Project

This is a heartfelt belated birthday gift - a custom dashboard-style web app designed specifically for a 13-year-old who loves fishing, farming, and spending time with family. Built with love, creativity, and modern web technologies.

## ✨ Features

### 🏠 Core Pages
- **Login Page** - Secure authentication with Google, Apple, or email/phone
- **Dashboard/Home** - Interactive 3D cards with daily content
- **Account Settings** - Personalize your experience
- **Connections Library** - Manage integrations and plugins

### 🎵 Interactive Sections
- **🎧 Spotify Player** - Stream music directly in the dashboard
- **⚙️ IFTTT Automations** - NASA space photos, group messaging
- **📚 News & Facts Feed** - The Weekly Junior, fishing facts, local spots
- **🤖 AI Assistant** - Daily jokes, fun facts about #13, birthday twins
- **📇 Important Contacts** - Quick access to family members
- **📖 Story Page** - A loving story about Ezra's impact on the family

### 🎨 Design Features
- **3D-style UI elements** with interactive cards
- **Earth tones, blues, and greens** reflecting fishing/nature themes
- **NASA Astronomy Photo of the Day** as dynamic backgrounds
- **Responsive design** for mobile and desktop
- **Smooth animations** with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend & APIs
- **Supabase** - Authentication and database
- **OpenAI API** - ChatGPT integrations for jokes and facts
- **Spotify Web API** - Music streaming
- **NASA APOD API** - Daily space backgrounds
- **IFTTT Webhooks** - Home automation

### Deployment
- **Vercel** - Hosting and CI/CD
- **Custom Domain** - ezra-gk.online

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- API keys (see Environment Variables section)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ezra-birthday-dashboard.git
cd ezra-birthday-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys (see below)
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with these variables:

```env
# Supabase (Authentication & Database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# NASA API (optional - works with DEMO_KEY)
NASA_API_KEY=your_nasa_api_key

# IFTTT Webhooks
IFTTT_WEBHOOK_KEY=your_ifttt_webhook_key

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### API Keys Setup

| Service | Purpose | How to Get |
|---------|---------|------------|
| **Supabase** | Authentication & Database | [supabase.com](https://supabase.com) (Free) |
| **Spotify** | Music streaming | [developer.spotify.com](https://developer.spotify.com/dashboard) |
| **OpenAI** | AI-powered content | [platform.openai.com](https://platform.openai.com/api-keys) |
| **NASA** | Space backgrounds | [api.nasa.gov](https://api.nasa.gov) (Optional) |
| **IFTTT** | Home automation | [ifttt.com](https://ifttt.com/maker_webhooks) |

## 📁 Project Structure

```
ezra-birthday-dashboard/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication
│   │   ├── spotify/            # Spotify integration
│   │   ├── openai/             # ChatGPT features
│   │   ├── nasa/               # Space backgrounds
│   │   ├── fishing/            # Fishing facts & spots
│   │   └── affirmations/       # Daily affirmations
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main app component
│   └── globals.css             # Global styles
├── components/                 # React components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── SpotifyPlayer.tsx
│   ├── Contacts.tsx
│   ├── Story.tsx
│   ├── AIAssistant.tsx
│   └── Settings.tsx
├── lib/                        # Utility functions
├── public/                     # Static assets
└── package.json
```

## 🌟 Key Features Explained

### 🎵 Spotify Integration
- OAuth authentication
- Play/pause controls
- Playlist management
- Album art display

### 🤖 AI-Powered Content
- **Daily Jokes** - Age-appropriate humor
- **Fun Facts about #13** - Mathematical and cultural insights
- **Birthday Twins** - Famous people born on September 12
- **Positive Affirmations** - Daily encouragement with AI enhancement

### 🏠 IFTTT Automations
- NASA space photo as daily background
- Group message sender for family updates
- Custom automation recipes

### 📰 News & Learning
- The Weekly Junior news feed (kid-friendly)
- Fishing facts and educational content
- Local fishing spots in East Tennessee

### 👨‍👩‍👧‍👦 Family Connections

- **Family Story** - Interactive narrative about Ezra's impact

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in Vercel dashboard

3. **Configure Custom Domain**
- Add `ezra-gk.online` in Vercel settings
- Update DNS records at your domain registrar

### Domain Configuration
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

## 🎨 Customization

### Themes
- Earth tones for farming content
- Blues and greens for fishing sections
- Space themes with NASA backgrounds

### 3D Design Elements
- Interactive card layouts
- Layered shadow effects
- Hover animations
- Glass morphism effects

## 📱 Mobile Responsive

The dashboard is fully responsive and works beautifully on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Security & Privacy

- Secure authentication with Supabase
- Personal stories and affirmations are private by default
- Family contact information is protected
- No personal data is shared with third parties

## 🤝 Contributing

This is a personal project, but suggestions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions about this project, please reach out to the family members listed in the contacts section.

## 🎁 Special Thanks

This project was built with love as a belated birthday gift for Ezra. It celebrates his interests in fishing, farming, and his wonderful family connections.

**Happy 13th Birthday, Ezra! 🎂**

---

## 📜 License

## MIT License

Copyright (c) 2025 Anthony

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

*Built with ❤️ for Ezra's 13th birthday celebration*
