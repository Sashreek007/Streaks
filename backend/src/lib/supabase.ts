import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

// Client for public operations (respects RLS)
export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey
);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabase;
