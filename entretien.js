import { supabase } from './supabase.js'
import { verifierSession, initDeconnexion } from './auth.js'
import { escapeHtml } from './escapeHtml.js'

const USER_ID = await verifierSession()
if (!USER_ID) throw new Error('Non connecté')
initDeconnexion()

async function ajouterPiece() {
  const nom = document.getElementById('pieceNom').value.trim()
  if (!nom) { alert('Indique le nom de la pièce !'); return }

  const btn = document.querySelector('button[onclick="ajouterPiece()"]')
  if (btn) btn.disabled = true

  const piece = {
    nom, user_id: USER_ID,
    categorie: document.getElementById('pieceCategorie').value,
    frequence: document.getElementById('pieceFrequence').value,
    date: document.getElementById('pieceDate').value || null,
    notes: document.getElementById('pieceNotes').value.trim() || null
  }

  const { data, error } = await supabase.from('pieces').insert([piece]).select()
  if (btn) btn.disabled = false
  if (error) { console.error('Erreur ajout:', error); return }

  afficherPiece(data[0], data[0].id)
  document.getElementById('pieceNom').value = ''
  document.getElementById('pieceDate').value = ''
  document.getElementById('pieceNotes').value = ''
}

function calculerStatut(piece) {
  if (!piece.date) return { texte: 'Jamais entretenu', classe: 'statut-danger', pourcentage: 100 }

  const joursEcoules = Math.floor((new Date() - new Date(piece.date)) / (1000 * 60 * 60 * 24))
  const limites = {
    'Avant chaque ride': 3,
    'Toutes les 2 semaines': 14,
    'Tous les mois': 30,
    'Tous les 3 mois': 90,
    'Tous les 6 mois': 180,
    'Annuel': 365
  }
  const limite = limites[piece.frequence]
  if (!limite) return { texte: 'Fréquence inconnue', classe: 'statut-attention', pourcentage: 50 }

  const pourcentage = Math.min(Math.round((joursEcoules / limite) * 100), 100)

  if (pourcentage < 60) return { texte: 'OK', classe: 'statut-ok', pourcentage }
  if (pourcentage < 90) return { texte: 'Bientôt', classe: 'statut-attention', pourcentage }
  return { texte: 'À faire', classe: 'statut-danger', pourcentage }
}

function afficherPiece(piece, id) {
  const statut = calculerStatut(piece)
  const li = document.createElement('li')
  li.className = 'piece-item'
  li.innerHTML = `
    <div class="ride-info">
      <div class="piece-header">
        <span class="ride-lieu">${escapeHtml(piece.nom)}</span>
        <span class="ride-type">${escapeHtml(piece.categorie)}</span>
      </div>
      <span class="ride-detail">${escapeHtml(piece.frequence)}</span>
      <span class="ride-detail">${piece.date ? 'Dernier : ' + escapeHtml(piece.date) : 'Jamais entretenu'}</span>
      ${piece.notes ? `<span class="ride-detail">${escapeHtml(piece.notes)}</span>` : ''}
      <div class="barre-container">
        <div class="barre-fill ${statut.classe}" style="width:${statut.pourcentage}%"></div>
      </div>
      <span class="statut-texte ${statut.classe}">${statut.texte}</span>
    </div>
    <div class="piece-actions">
      <button class="btn-fait" onclick="marquerFait(this, '${escapeHtml(String(id))}')">✓ Fait</button>
      <button class="btn-delete" onclick="supprimerPiece(this, '${escapeHtml(String(id))}')">❌</button>
    </div>
  `
  document.getElementById('pieceList').appendChild(li)
}

async function marquerFait(btn, id) {
  btn.disabled = true
  const { error } = await supabase
    .from('pieces')
    .update({ date: new Date().toISOString().slice(0, 10) })
    .eq('id', id)
  if (error) { console.error('Erreur update:', error); btn.disabled = false; return }
  document.getElementById('pieceList').innerHTML = ''
  charger()
}

async function supprimerPiece(btn, id) {
  const { error } = await supabase.from('pieces').delete().eq('id', id)
  if (error) { console.error('Erreur suppression:', error); return }
  btn.closest('li').remove()
}

async function charger() {
  const { data, error } = await supabase
    .from('pieces')
    .select('*')
    .eq('user_id', USER_ID)
    .order('id', { ascending: false })

  if (error) { console.error('Erreur chargement:', error); return }
  data.forEach(piece => afficherPiece(piece, piece.id))
}

window.ajouterPiece = ajouterPiece
window.marquerFait = marquerFait
window.supprimerPiece = supprimerPiece

charger()