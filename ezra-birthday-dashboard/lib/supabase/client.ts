'use client';

import { useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './server';

export const createSupabaseBrowserClient = <T extends Database = Database>() => {
  return createClientComponentClient<T>() as SupabaseClient<T>;
};

export const useSupabaseBrowserClient = <T extends Database = Database>() =>
  useMemo(() => createSupabaseBrowserClient<T>(), []);
