import { supabase } from './supabase.js'
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  window.location.href = 'accueil.html'
}
async function charger() {
  const { data, error } = await supabase
    .from('sorties')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Erreur chargement:', error)
    return
  }

  data.forEach(function(ride) {
    afficherRide(ride)
  })

  mettreAJourStats(data)
}

async function addRide() {
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
    .insert([{ lieu, date, type, deniv, notes }])
    .select()

  if (error) {
    console.error('Erreur ajout:', error)
    return
  }

  afficherRide(data[0])
  mettreAJourStats(null)

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