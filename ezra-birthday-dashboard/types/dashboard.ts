export interface Profile {
  id?: string;
  display_name?: string | null;
  avatar_url?: string | null;
  favorite_color?: string | null;
  bio?: string | null;
  birthday?: string | null;
}

export interface DailyContent {
  joke: string;
  funFact13: string;
  fishingFact: string;
  newsHeadline: string;
  birthdayTwins: Array<{ name: string; description: string }>;
  affirmation?: string;
  generatedAt: string;
}

export interface AffirmationEntry {
  id: string;
  user_id: string;
  prompt: string;
  summary: string | null;
  created_at: string;
}

export interface ContactEntry {
  id: string;
  user_id: string;
  name: string;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  storage_path: string;
  public_url: string;
  created_at: string;
}

export interface SpotifyTopTrack {
  id: string;
  name: string;
  artists: string;
  albumArt: string;
  externalUrl: string;
}
