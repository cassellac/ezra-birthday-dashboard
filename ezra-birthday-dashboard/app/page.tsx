import DashboardShell from '@/components/dashboard/dashboard-shell';
import AuthScreen from '@/components/auth/auth-screen';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/dashboard';

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <AuthScreen />;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, favorite_color, bio, birthday')
    .eq('id', session.user.id)
    .maybeSingle();

  return <DashboardShell profile={(profile as Profile | null) ?? null} />;
}
