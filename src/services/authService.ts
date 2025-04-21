
import { supabase } from './supabaseClient';

export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  getUserProfile: async (userId: string) => {
    // First check if user is an institution
    const { data: institution, error: institutionError } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', userId)
      .single();

    if (institution) {
      return { ...institution, role: 'institution' as const };
    }

    // If not an institution, check if user is an agency
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', userId)
      .single();

    if (agency) {
      return { ...agency, role: 'agency' as const };
    }

    throw new Error('User profile not found');
  },
};
