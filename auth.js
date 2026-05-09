import { supabase } from './supabase.js'

export async function verifierSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) console.error('Erreur session:', error)
  if (!session) {
    window.location.replace('accueil.html')
    return null
  }
  return session.user.id
}

export function initDeconnexion() {
  const btn = document.getElementById('btn-deconnexion')
  if (!btn) return
  btn.addEventListener('click', async () => {
    if (window.confirm('Tu veux vraiment te déconnecter ?')) {
      await supabase.auth.signOut()
      window.location.href = 'accueil.html'
    }
  })
}