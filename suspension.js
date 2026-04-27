console.log("Suspension chargé ✓");

let setups = [];

function sauvegarderSetup() {
  const nom = document.getElementById("setupNom").value.trim();
  if (!nom) {
    alert("Donne un nom à ce réglage !");
    return;
  }

  const fModele = document.getElementById("fModele").value;
  const aModele = document.getElementById("aModele").value;

  if (!fModele) {
    alert("Choisis un modèle de fourche !");
    return;
  }
  if (!aModele) {
    alert("Choisis un modèle d'amortisseur !");
    return;
  }

  const setup = {
    nom,
    date: new Date().toLocaleDateString("fr-FR"),
    fourche: {
      modele: fModele,
      sag: document.getElementById("fSag").value,
      rebond: document.getElementById("fRebond").value,
      compression: document.getElementById("fCompression").value,
      pression: document.getElementById("fPression").value,
      notes: document.getElementById("fNotes").value
    },
    amortisseur: {
      modele: aModele,
      sag: document.getElementById("aSag").value,
      rebond: document.getElementById("aRebond").value,
      compression: document.getElementById("aCompression").value,
      pression: document.getElementById("aPression").value,
      notes: document.getElementById("aNotes").value
    }
  };

  setups.push(setup);
  localStorage.setItem("setups", JSON.stringify(setups));
  afficherSetup(setup);
  document.getElementById("setupNom").value = "";
}

function afficherSetup(setup) {
  const list = document.getElementById("setupList");
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${setup.nom}</span>
      <span class="ride-detail" style="color:#aaa">${setup.date}</span>
      <span class="ride-type" style="margin-top:8px">Fourche</span>
      <span class="ride-detail">${setup.fourche.modele}</span>
      <span class="ride-detail">SAG ${setup.fourche.sag}% | Rebond ${setup.fourche.rebond} clics | Compression ${setup.fourche.compression} clics | ${setup.fourche.pression} PSI</span>
      ${setup.fourche.notes ? `<span class="ride-detail">${setup.fourche.notes}</span>` : ""}
      <span class="ride-type" style="margin-top:8px">Amortisseur</span>
      <span class="ride-detail">${setup.amortisseur.modele}</span>
      <span class="ride-detail">SAG ${setup.amortisseur.sag}% | Rebond ${setup.amortisseur.rebond} clics | Compression ${setup.amortisseur.compression} clics | ${setup.amortisseur.pression} PSI</span>
      ${setup.amortisseur.notes ? `<span class="ride-detail">${setup.amortisseur.notes}</span>` : ""}
    </div>
    <button class="btn-delete" onclick="supprimerSetup(this)">❌</button>
  `;
  list.appendChild(li);
}

function supprimerSetup(btn) {
  const li = btn.parentElement;
  const index = Array.from(document.getElementById("setupList").children).indexOf(li);
  setups.splice(index, 1);
  localStorage.setItem("setups", JSON.stringify(setups));
  li.remove();
}

function charger() {
  const data = localStorage.getItem("setups");
  if (data) {
    setups = JSON.parse(data);
    setups.forEach(function(setup) {
      afficherSetup(setup);
    });
  }
}

charger();