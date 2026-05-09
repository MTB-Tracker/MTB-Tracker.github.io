import { supabase } from './supabase.js'
import { verifierSession, initDeconnexion } from './auth.js'
import { escapeHtml } from './escapeHtml.js'

const USER_ID = await verifierSession()
if (!USER_ID) throw new Error('Non connecté')
initDeconnexion()

async function sauvegarderSetup() {
  const nom = document.getElementById('setupNom').value.trim()
  const fModele = document.getElementById('fModele').value
  const aModele = document.getElementById('aModele').value

  if (!nom) { alert('Donne un nom à ce réglage !'); return }
  if (!fModele) { alert('Choisis un modèle de fourche !'); return }
  if (!aModele) { alert("Choisis un modèle d'amortisseur !"); return }

  const btn = document.querySelector('button[onclick="sauvegarderSetup()"]')
  if (btn) btn.disabled = true

  const toNum = id => {
    const v = document.getElementById(id).value
    return v !== '' ? parseFloat(v) : null
  }

  const setup = {
    nom, user_id: USER_ID,
    date: new Date().toLocaleDateString('fr-FR'),
    fourche_modele: fModele,
    fourche_sag: toNum('fSag'),
    fourche_rebond: toNum('fRebond'),
    fourche_compression: toNum('fCompression'),
    fourche_pression: toNum('fPression'),
    fourche_notes: document.getElementById('fNotes').value.trim() || null,
    amortisseur_modele: aModele,
    amortisseur_sag: toNum('aSag'),
    amortisseur_rebond: toNum('aRebond'),
    amortisseur_compression: toNum('aCompression'),
    amortisseur_pression: toNum('aPression'),
    amortisseur_notes: document.getElementById('aNotes').value.trim() || null
  }

  const { data, error } = await supabase.from('setups').insert([setup]).select()
  if (btn) btn.disabled = false
  if (error) { console.error('Erreur ajout setup:', error); return }

  afficherSetup(data[0])
  document.getElementById('setupNom').value = ''
}

function afficherSetup(setup) {
  const li = document.createElement('li')
  const fmt = (val, suffix) => val != null ? escapeHtml(String(val)) + suffix : '—'
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${escapeHtml(setup.nom)}</span>
      <span class="ride-detail">${escapeHtml(setup.date)}</span>
      <span class="ride-type">Fourche</span>
      <span class="ride-detail">${escapeHtml(setup.fourche_modele)}</span>
      <span class="ride-detail">SAG ${fmt(setup.fourche_sag,'%')} | Rebond ${fmt(setup.fourche_rebond,' clics')} | Compression ${fmt(setup.fourche_compression,' clics')} | ${fmt(setup.fourche_pression,' PSI')}</span>
      ${setup.fourche_notes ? `<span class="ride-detail">${escapeHtml(setup.fourche_notes)}</span>` : ''}
      <span class="ride-type">Amortisseur</span>
      <span class="ride-detail">${escapeHtml(setup.amortisseur_modele)}</span>
      <span class="ride-detail">SAG ${fmt(setup.amortisseur_sag,'%')} | Rebond ${fmt(setup.amortisseur_rebond,' clics')} | Compression ${fmt(setup.amortisseur_compression,' clics')} | ${fmt(setup.amortisseur_pression,' PSI')}</span>
      ${setup.amortisseur_notes ? `<span class="ride-detail">${escapeHtml(setup.amortisseur_notes)}</span>` : ''}
    </div>
    <button class="btn-delete" onclick="supprimerSetup(this, '${escapeHtml(String(setup.id))}')">❌</button>
  `
  document.getElementById('setupList').appendChild(li)
}

async function supprimerSetup(btn, id) {
  const { error } = await supabase.from('setups').delete().eq('id', id)
  if (error) { console.error('Erreur suppression:', error); return }
  btn.closest('li').remove()
}

async function charger() {
  const { data, error } = await supabase
    .from('setups')
    .select('*')
    .eq('user_id', USER_ID)
    .order('id', { ascending: false })

  if (error) { console.error('Erreur chargement:', error); return }
  data.forEach(setup => afficherSetup(setup))
}

window.sauvegarderSetup = sauvegarderSetup
window.supprimerSetup = supprimerSetup

charger()