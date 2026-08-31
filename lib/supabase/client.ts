import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lopyfhtncrhjimnkhfwf.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ma8CzxvhYoCCfLLPSppr7Q_QJbE9rSW';

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}
