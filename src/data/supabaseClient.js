import { createClient } from "@supabase/supabase-js"

//imports aus env Datei
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const subabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

export const supabase = createClient(supabaseUrl, subabaseKey)