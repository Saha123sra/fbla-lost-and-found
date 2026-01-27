import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmzdjvoeyhychwzuymtu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY; // Vite uses VITE_ prefix for env vars

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
