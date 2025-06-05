
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mwwjrrduavfcwjiyniuy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13d2pycmR1YXZmY3dqaXluaXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTEwNjgsImV4cCI6MjA2NDY2NzA2OH0.izReQBVYj_iCxC3aI-nMjspnnIbz8W3L-8HUB0k9R3A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
