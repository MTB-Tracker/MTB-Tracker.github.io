import { supabase } from './supabase.js'
import { verifierSession, initDeconnexion } from './auth.js'
import { escapeHtml } from './escapeHtml.js'

const USER_ID = await verifierSession()
if (!USER_ID) throw new Error('Non connecté')
initDeconnexion()

async function sauvegarderProfil() {
  const profil = {
    user_id: USER_ID,
    nom: document.getElementById('profilNom').value.trim() || null,
    age: document.getElementById('profilAge').value !== '' ? parseInt(document.getElementById('profilAge').value) : null,
    poids: document.getElementById('profilPoids').value !== '' ? parseFloat(document.getElementById('profilPoids').value) : null,
    categorie: document.getElementById('profilCategorie').value,
    club: document.getElementById('profilClub').value.trim() || null,
    // Vélo inclus pour éviter l'écrasement lors d'un upsert séparé
    velo_marque: document.getElementById('veloMarque').value.trim() || null,
    velo_taille: document.getElementById('veloTaille').value,
    velo_roues: document.getElementById('veloRoues').value,
    velo_debattement: document.getElementById('veloDebattement').value !== '' ? parseFloat(document.getElementById('veloDebattement').value) : null,
    velo_notes: document.getElementById('veloNotes').value.trim() || null
  }
  const { error } = await supabase.from('profil').upsert([profil], { onConflict: 'user_id' })
  if (error) { console.error('Erreur profil:', error); return }
  alert('Profil sauvegardé ✓')
}

// sauvegarderVelo fait exactement la même chose — on délègue à sauvegarderProfil
// pour éviter deux upserts séparés qui peuvent se marcher dessus
const sauvegarderVelo = sauvegarderProfil

async function ajouterComp() {
  const nom = document.getElementById('compNom').value.trim()
  if (!nom) { alert('Indique le nom de la compétition !'); return }

  const btn = document.querySelector('button[onclick="ajouterComp()"]')
  if (btn) btn.disabled = true

  const comp = {
    user_id: USER_ID,
    nom,
    date: document.getElementById('compDate').value || null,
    classement: document.getElementById('compClassement').value.trim() || null,
    notes: document.getElementById('compNotes').value.trim() || null
  }

  const { data, error } = await supabase.from('competitions').insert([comp]).select()
  if (btn) btn.disabled = false
  if (error) { console.error('Erreur ajout comp:', error); return }

  afficherComp(data[0])
  document.getElementById('compNom').value = ''
  document.getElementById('compDate').value = ''
  document.getElementById('compClassement').value = ''
  document.getElementById('compNotes').value = ''
}

function afficherComp(comp) {
  const li = document.createElement('li')
  li.className = 'comp-item'
  li.innerHTML = `
    <div>
      <span class="ride-lieu">${escapeHtml(comp.nom)}</span>
      <span class="ride-detail">${escapeHtml(comp.date) || ''}</span>
      <span class="ride-type">${escapeHtml(comp.classement) || ''}</span>
      ${comp.notes ? `<span class="ride-detail">${escapeHtml(comp.notes)}</span>` : ''}
    </div>
    <button class="btn-delete" onclick="supprimerComp(this, '${escapeHtml(String(comp.id))}')">❌</button>
  `
  document.getElementById('compList').appendChild(li)
}

async function supprimerComp(btn, id) {
  const { error } = await supabase.from('competitions').delete().eq('id', id)
  if (error) { console.error('Erreur suppression:', error); return }
  btn.closest('li').remove()
}

async function charger() {
  const { data: profData } = await supabase
    .from('profil').select('*').eq('user_id', USER_ID).maybeSingle()

  if (profData) {
    const set = (id, val) => { if (val != null) document.getElementById(id).value = val }
    set('profilNom', profData.nom)
    set('profilAge', profData.age)
    set('profilPoids', profData.poids)
    set('profilCategorie', profData.categorie)
    set('profilClub', profData.club)
    set('veloMarque', profData.velo_marque)
    set('veloTaille', profData.velo_taille)
    set('veloRoues', profData.velo_roues)
    set('veloDebattement', profData.velo_debattement)
    set('veloNotes', profData.velo_notes)
  }

  const { data: compsData } = await supabase
    .from('competitions').select('*').eq('user_id', USER_ID).order('id', { ascending: false })

  if (compsData) compsData.forEach(comp => afficherComp(comp))
}

// Style inline retiré — ajouter dans style.css :
// .comp-item { background: rgba(255,255,255,0.05); border-radius: 6px; padding: 10px;
//              margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; }

window.sauvegarderProfil = sauvegarderProfil
window.sauvegarderVelo = sauvegarderVelo
window.ajouterComp = ajouterComp
window.supprimerComp = supprimerComp

charger()