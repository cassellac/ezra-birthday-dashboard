import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './server';

export class MissingSupabaseAdminCredentialsError extends Error {
  public readonly missingEnvVars: string[];

  constructor(missingEnvVars: string[]) {
    super(
      `Missing Supabase admin environment variables: ${missingEnvVars.join(
        ', '
      )}. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY.`
    );
    this.name = 'MissingSupabaseAdminCredentialsError';
    this.missingEnvVars = missingEnvVars;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingSupabaseAdminCredentialsError);
    }
  }
}

export const createAdminSupabaseClient = <T extends Database = Database>() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  const missingEnvVars: string[] = [];
  if (!supabaseUrl) {
    missingEnvVars.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!serviceKey) {
    missingEnvVars.push('SUPABASE_SERVICE_KEY');
  }

  if (missingEnvVars.length > 0) {
    console.error(
      '[Supabase] Missing admin credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY before running the server.',
      { missingEnvVars }
    );
    throw new MissingSupabaseAdminCredentialsError(missingEnvVars);
  }

  return createClient<T>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as SupabaseClient<T>;
};

export type AdminSupabaseClient = ReturnType<typeof createAdminSupabaseClient>;
