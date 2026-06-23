import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Public read-only client — uses the anon key only. Never exposes the service role key.
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
