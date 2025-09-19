import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import SupabaseProvider from '@/components/providers/supabase-provider';
import SupabaseListener from '@/components/providers/supabase-listener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Ezra's Birthday Dashboard",
  description: 'A special birthday gift for Ezra - September 12, 2012',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
