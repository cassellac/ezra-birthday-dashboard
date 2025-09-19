'use client';

import { useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function SupabaseListener({ serverAccessToken }: { serverAccessToken?: string }) {
  const { session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.access_token !== serverAccessToken) {
      router.refresh();
    }
  }, [router, serverAccessToken, session?.access_token]);

  return null;
}
