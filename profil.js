const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  window.location.href = 'accueil.html'
}
let comps = []

async function sauvegarderProfil() {
  const profil = {
    nom: document.getElementById('profilNom').value.trim(),
    age: document.getElementById('profilAge').value,
    poids: document.getElementById('profilPoids').value,
    categorie: document.getElementById('profilCategorie').value,
    club: document.getElementById('profilClub').value.trim()
  }

  const { error } = await supabase
    .from('profil')
    .upsert([{ id: 1, ...profil }])

  if (error) {
    console.error('Erreur profil:', error)
    return
  }
  alert('Profil sauvegardé ✓')
}

async function sauvegarderVelo() {
  const velo = {
    velo_marque: document.getElementById('veloMarque').value.trim(),
    velo_taille: document.getElementById('veloTaille').value,
    velo_roues: document.getElementById('veloRoues').value,
    velo_debattement: document.getElementById('veloDebattement').value,
    velo_notes: document.getElementById('veloNotes').value.trim()
  }

  const { error } = await supabase
    .from('profil')
    .upsert([{ id: 1, ...velo }])

  if (error) {
    console.error('Erreur vélo:', error)
    return
  }
  alert('Vélo sauvegardé ✓')
}

async function ajouterComp() {
  const nom = document.getElementById('compNom').value.trim()
  if (!nom) {
    alert('Indique le nom de la compétition !')
    return
  }

  const comp = {
    nom,
    date: document.getElementById('compDate').value,
    classement: document.getElementById('compClassement').value.trim(),
    notes: document.getElementById('compNotes').value.trim()
  }

  comps.push(comp)
  localStorage.setItem('comps', JSON.stringify(comps))
  afficherComp(comp)

  document.getElementById('compNom').value = ''
  document.getElementById('compDate').value = ''
  document.getElementById('compClassement').value = ''
  document.getElementById('compNotes').value = ''
}

function afficherComp(comp) {
  const list = document.getElementById('compList')
  const li = document.createElement('li')
  li.style.cssText = 'background:rgba(255,255,255,0.05);border-radius:6px;padding:10px;margin-bottom:8px;'
  li.innerHTML = `
    <span class="ride-lieu">${comp.nom}</span>
    <span class="ride-detail">${comp.date ? comp.date : ''}</span>
    <span class="ride-type" style="margin-top:4px">${comp.classement ? comp.classement : ''}</span>
    ${comp.notes ? `<span class="ride-detail">${comp.notes}</span>` : ''}
  `
  list.appendChild(li)
}

async function charger() {
  const { data, error } = await supabase
    .from('profil')
    .select('*')
    .eq('id', 1)
    .single()

  if (!error && data) {
    if (data.nom) document.getElementById('profilNom').value = data.nom
    if (data.age) document.getElementById('profilAge').value = data.age
    if (data.poids) document.getElementById('profilPoids').value = data.poids
    if (data.categorie) document.getElementById('profilCategorie').value = data.categorie
    if (data.club) document.getElementById('profilClub').value = data.club
    if (data.velo_marque) document.getElementById('veloMarque').value = data.velo_marque
    if (data.velo_taille) document.getElementById('veloTaille').value = data.velo_taille
    if (data.velo_roues) document.getElementById('veloRoues').value = data.velo_roues
    if (data.velo_debattement) document.getElementById('veloDebattement').value = data.velo_debattement
    if (data.velo_notes) document.getElementById('veloNotes').value = data.velo_notes
  }

  const compsData = localStorage.getItem('comps')
  if (compsData) {
    comps = JSON.parse(compsData)
    comps.forEach(function(comp) {
      afficherComp(comp)
    })
  }
}

window.sauvegarderProfil = sauvegarderProfil
window.sauvegarderVelo = sauvegarderVelo
window.ajouterComp = ajouterComp

charger()