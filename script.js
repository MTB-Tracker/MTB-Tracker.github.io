import { supabase } from './supabase.js'
import { verifierSession, initDeconnexion } from './auth.js'
import { escapeHtml } from './escapeHtml.js'

const USER_ID = await verifierSession()
if (!USER_ID) throw new Error('Non connecté')
initDeconnexion()

async function charger() {
  const { data, error } = await supabase
    .from('sorties')
    .select('*')
    .eq('user_id', USER_ID)
    .order('date', { ascending: false })

  if (error) { console.error('Erreur chargement:', error); return }
  data.forEach(ride => afficherRide(ride))
  mettreAJourStats()
}

async function addRide() {
  const lieu = document.getElementById('rideInput').value.trim()
  if (!lieu) { alert('Indique au moins un lieu !'); return }

  const btn = document.querySelector('button[onclick="addRide()"]')
  if (btn) btn.disabled = true

  const denivRaw = document.getElementById('rideDeniv').value
  const ride = {
    lieu,
    date: document.getElementById('rideDate').value || null,
    type: document.getElementById('rideType').value,
    deniv: denivRaw !== '' ? parseFloat(denivRaw) : null,
    notes: document.getElementById('rideNotes').value.trim() || null,
    user_id: USER_ID
  }

  const { data, error } = await supabase.from('sorties').insert([ride]).select()
  if (btn) btn.disabled = false
  if (error) { console.error('Erreur ajout:', error); return }

  afficherRide(data[0])
  mettreAJourStats()

  document.getElementById('rideInput').value = ''
  document.getElementById('rideDate').value = ''
  document.getElementById('rideDeniv').value = ''
  document.getElementById('rideNotes').value = ''
}

async function supprimerRide(btn, id) {
  const { error } = await supabase.from('sorties').delete().eq('id', id)
  if (error) { console.error('Erreur suppression:', error); return }
  btn.closest('li').remove()
  mettreAJourStats()
}

function afficherRide(ride) {
  const li = document.createElement('li')
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${escapeHtml(ride.lieu)}</span>
      <span class="ride-type">${escapeHtml(ride.type)}</span>
      <span class="ride-detail">${escapeHtml(ride.date) || 'Date non renseignée'}</span>
      <span class="ride-detail">${ride.deniv ? escapeHtml(String(ride.deniv)) + ' m D+' : ''}</span>
      <span class="ride-detail">${escapeHtml(ride.notes)}</span>
    </div>
    <button class="btn-delete" onclick="supprimerRide(this, '${escapeHtml(String(ride.id))}')">❌</button>
  `
  document.getElementById('rideList').appendChild(li)
}

async function mettreAJourStats() {
  const { data, error } = await supabase
    .from('sorties')
    .select('*')
    .eq('user_id', USER_ID)
    .order('date', { ascending: false })

  if (error) return

  const denivTotal = data.reduce((total, ride) => total + (parseFloat(ride.deniv) || 0), 0)

  document.getElementById('statNb').textContent = data.length
  document.getElementById('statDeniv').textContent = denivTotal + ' m'
  document.getElementById('statDerniere').textContent = data.length > 0 ? escapeHtml(data[0].lieu) : '—'
}

window.addRide = addRide
window.supprimerRide = supprimerRide

charger()