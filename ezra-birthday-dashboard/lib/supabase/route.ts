import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './server';

export const createRouteHandlerSupabaseClient = <T extends Database = Database>() =>
  createRouteHandlerClient<T>({ cookies }) as SupabaseClient<T>;

export type RouteHandlerSupabaseClient = ReturnType<typeof createRouteHandlerSupabaseClient>;
