import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Simplified error handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    localStorage.clear();
  }
});