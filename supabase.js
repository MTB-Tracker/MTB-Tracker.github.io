import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://bdwekhdyjimtvzflohan.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkd2VraGR5amltdHZ6ZmxvaGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDU4NDMsImV4cCI6MjA5Mjk4MTg0M30.Gst6K7haGWwXNiJVDRnhGG5a4YdV70DWhjqsDpfDVNU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = 'accueil.html'
}