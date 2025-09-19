'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [supabaseClient] = useState(() => createSupabaseBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
