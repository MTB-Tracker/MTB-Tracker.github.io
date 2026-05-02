import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://bdwekhdyjimtvzflohan.supabase.co'
const SUPABASE_KEY = 'sb_publishable_w8-gGy6dszRo-SL4N33_VQ_dhIWoB71'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
export async function getUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = 'login.html'
}