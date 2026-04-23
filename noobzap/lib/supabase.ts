import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client public pour la lecture (utilise la clé anonyme)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client privé pour l'écriture (utilise le service role, uniquement côté serveur)
export function getAdminSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY est requis côté serveur');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
