import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Database = any;

export const createServerSupabaseClient = <T extends Database = Database>() =>
  createServerComponentClient<T>({ cookies }) as SupabaseClient<T>;

export type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient>;
