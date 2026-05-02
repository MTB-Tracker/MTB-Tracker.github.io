import { supabase } from './supabase.js'
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  window.location.replace('accueil.html')
  throw new Error('Non connecté')
}
async function charger() {
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session.user.id
  console.log('User ID:', userId)

  const { data, error } = await supabase
    .from('sorties')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: false })

  console.log('Sorties:', data)
  console.log('Erreur:', error)

  if (error) {
    console.error('Erreur chargement:', error)
    return
  }

  data.forEach(function(ride) {
    afficherRide(ride)
  })

  mettreAJourStats()
}

async function addRide() {
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session.user.id

  const lieu = document.getElementById('rideInput').value.trim()
  const date = document.getElementById('rideDate').value
  const type = document.getElementById('rideType').value
  const deniv = document.getElementById('rideDeniv').value
  const notes = document.getElementById('rideNotes').value.trim()

  if (!lieu) {
    alert('Indique au moins un lieu !')
    return
  }

  const { data, error } = await supabase
    .from('sorties')
    .insert([{ lieu, date, type, deniv, notes, user_id: userId }])
    .select()

  if (error) {
    console.error('Erreur ajout:', error)
    return
  }

  afficherRide(data[0])
  mettreAJourStats()

  document.getElementById('rideInput').value = ''
  document.getElementById('rideDate').value = ''
  document.getElementById('rideDeniv').value = ''
  document.getElementById('rideNotes').value = ''
}

async function supprimerRide(btn, id) {
  const { error } = await supabase
    .from('sorties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression:', error)
    return
  }

  btn.parentElement.remove()
  mettreAJourStats(null)
}

function afficherRide(ride) {
  const list = document.getElementById('rideList')
  const li = document.createElement('li')
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${ride.lieu}</span>
      <span class="ride-type">${ride.type}</span>
      <span class="ride-detail">${ride.date ? ride.date : 'Date non renseignée'}</span>
      <span class="ride-detail">${ride.deniv ? ride.deniv + ' m D+' : ''}</span>
      <span class="ride-detail">${ride.notes}</span>
    </div>
    <button class="btn-delete" onclick="supprimerRide(this, '${ride.id}')">❌</button>
  `
  list.appendChild(li)
}

async function mettreAJourStats() {
  const { data, error } = await supabase
    .from('sorties')
    .select('*')

  if (error) return

  const nb = data.length
  const denivTotal = data.reduce(function(total, ride) {
    return total + (parseFloat(ride.deniv) || 0)
  }, 0)
  const derniere = data.length > 0 ? data[0].lieu : '—'

  document.getElementById('statNb').textContent = nb
  document.getElementById('statDeniv').textContent = denivTotal + ' m'
  document.getElementById('statDerniere').textContent = derniere
}

window.addRide = addRide
window.supprimerRide = supprimerRide

async function deconnexion() {
  await supabase.auth.signOut()
  window.location.href = 'accueil.html'
}

document.getElementById('btn-deconnexion').addEventListener('click', function(e) {
  e.preventDefault()
  deconnexion()
})
charger()