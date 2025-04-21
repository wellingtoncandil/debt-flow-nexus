
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Supabase integration.');
}

// Create a dummy client for development if environment variables are missing
const dummySupabase = {
  auth: {
    signInWithPassword: async () => ({ data: { user: { id: 'dummy-id', email: 'dummy@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: { id: 'dummy-id', email: 'dummy@example.com' } }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: { id: 'dummy-id', name: 'Dummy Institution', role: 'institution' }, error: null }),
      }),
    }),
  }),
};

// Only create the actual Supabase client if we have valid environment variables
export const supabase = (supabaseUrl && supabaseAnonKey) ? 
  createClient<Database>(supabaseUrl, supabaseAnonKey) : 
  dummySupabase as any;
