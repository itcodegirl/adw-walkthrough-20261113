import { createClient } from '@supabase/supabase-js'

// One shared client for the whole site. Values come from the
// environment at build time; nothing is hardcoded here.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)
