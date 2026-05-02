import { supabase } from './supabase.js'

const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  window.location.replace('accueil.html')
  throw new Error('Non connecté')
}
const USER_ID = session.user.id

async function sauvegarderSetup() {
  const nom = document.getElementById('setupNom').value.trim()
  if (!nom) { alert('Donne un nom à ce réglage !'); return }

  const fModele = document.getElementById('fModele').value
  const aModele = document.getElementById('aModele').value

  if (!fModele) { alert('Choisis un modèle de fourche !'); return }
  if (!aModele) { alert('Choisis un modèle d\'amortisseur !'); return }

  const setup = {
    nom,
    user_id: USER_ID,
    date: new Date().toLocaleDateString('fr-FR'),
    fourche_modele: fModele,
    fourche_sag: document.getElementById('fSag').value,
    fourche_rebond: document.getElementById('fRebond').value,
    fourche_compression: document.getElementById('fCompression').value,
    fourche_pression: document.getElementById('fPression').value,
    fourche_notes: document.getElementById('fNotes').value,
    amortisseur_modele: aModele,
    amortisseur_sag: document.getElementById('aSag').value,
    amortisseur_rebond: document.getElementById('aRebond').value,
    amortisseur_compression: document.getElementById('aCompression').value,
    amortisseur_pression: document.getElementById('aPression').value,
    amortisseur_notes: document.getElementById('aNotes').value
  }

  const { data, error } = await supabase
    .from('setups')
    .insert([setup])
    .select()

  if (error) { console.error('Erreur ajout setup:', error); return }

  afficherSetup(data[0])
  document.getElementById('setupNom').value = ''
}

function afficherSetup(setup) {
  const list = document.getElementById('setupList')
  const li = document.createElement('li')
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${setup.nom}</span>
      <span class="ride-detail" style="color:#aaa">${setup.date}</span>
      <span class="ride-type" style="margin-top:8px">Fourche</span>
      <span class="ride-detail">${setup.fourche_modele}</span>
      <span class="ride-detail">SAG ${setup.fourche_sag}% | Rebond ${setup.fourche_rebond} clics | Compression ${setup.fourche_compression} clics | ${setup.fourche_pression} PSI</span>
      ${setup.fourche_notes ? `<span class="ride-detail">${setup.fourche_notes}</span>` : ''}
      <span class="ride-type" style="margin-top:8px">Amortisseur</span>
      <span class="ride-detail">${setup.amortisseur_modele}</span>
      <span class="ride-detail">SAG ${setup.amortisseur_sag}% | Rebond ${setup.amortisseur_rebond} clics | Compression ${setup.amortisseur_compression} clics | ${setup.amortisseur_pression} PSI</span>
      ${setup.amortisseur_notes ? `<span class="ride-detail">${setup.amortisseur_notes}</span>` : ''}
    </div>
    <button class="btn-delete" onclick="supprimerSetup(this, '${setup.id}')">❌</button>
  `
  list.appendChild(li)
}

async function supprimerSetup(btn, id) {
  const { error } = await supabase.from('setups').delete().eq('id', id)
  if (error) { console.error('Erreur suppression:', error); return }
  btn.parentElement.remove()
}

async function charger() {
  const { data, error } = await supabase
    .from('setups')
    .select('*')
    .eq('user_id', USER_ID)
    .order('id', { ascending: false })

  if (error) { console.error('Erreur chargement:', error); return }
  data.forEach(function(setup) { afficherSetup(setup) })
}

window.sauvegarderSetup = sauvegarderSetup
window.supprimerSetup = supprimerSetup

charger()

document.getElementById('btn-deconnexion').addEventListener('click', function(e) {
  e.preventDefault()
  supabase.auth.signOut().then(() => { window.location.href = 'accueil.html' })
})