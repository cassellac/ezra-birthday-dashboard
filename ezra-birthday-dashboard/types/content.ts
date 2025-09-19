export interface BirthdayTwin {
  name: string
  summary: string
}

export interface NewsItem {
  title: string
  summary: string
  source: string
  url?: string
}

export interface FishingSpot {
  name: string
  location: string
  tip: string
}

export interface DailyContent {
  joke: string
  funFact13: string
  fishingFact: string
  affirmation: string
  nasa?: {
    title: string
    description: string
  }
  birthdayTwins: BirthdayTwin[]
  news: NewsItem[]
  localFishingSpots: FishingSpot[]
}

export interface AffirmationEntry {
  id: string
  message: string
  summary: string
  createdAt: string
}
