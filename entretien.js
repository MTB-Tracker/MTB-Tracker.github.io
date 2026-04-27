console.log("Entretien chargé ✓");

let pieces = [];

function sauvegarder() {
  localStorage.setItem("pieces", JSON.stringify(pieces));
}

function ajouterPiece() {
  const nom = document.getElementById("pieceNom").value.trim();
  if (!nom) {
    alert("Indique le nom de la pièce !");
    return;
  }

  const piece = {
    nom,
    categorie: document.getElementById("pieceCategorie").value,
    frequence: document.getElementById("pieceFrequence").value,
    date: document.getElementById("pieceDate").value,
    notes: document.getElementById("pieceNotes").value.trim()
  };

  pieces.push(piece);
  sauvegarder();
  afficherPiece(piece, pieces.length - 1);

  document.getElementById("pieceNom").value = "";
  document.getElementById("pieceDate").value = "";
  document.getElementById("pieceNotes").value = "";
}

function calculerStatut(piece) {
  if (!piece.date) return { texte: "Jamais entretenu", classe: "statut-danger" };

  const derniere = new Date(piece.date);
  const aujourd_hui = new Date();
  const joursEcoules = Math.floor((aujourd_hui - derniere) / (1000 * 60 * 60 * 24));

  const limites = {
    "Avant chaque ride": 3,
    "Toutes les 2 semaines": 14,
    "Tous les mois": 30,
    "Tous les 3 mois": 90,
    "Tous les 6 mois": 180,
    "Annuel": 365
  };

  const limite = limites[piece.frequence] || 30;
  const pourcentage = Math.min(Math.round((joursEcoules / limite) * 100), 100);

  let classe, texte;
  if (pourcentage < 60) {
    classe = "statut-ok";
    texte = "OK";
  } else if (pourcentage < 90) {
    classe = "statut-attention";
    texte = "Bientôt";
  } else {
    classe = "statut-danger";
    texte = "À faire";
  }

  return { texte, classe, pourcentage };
}

function afficherPiece(piece, index) {
  const list = document.getElementById("pieceList");
  const statut = calculerStatut(piece);

  const li = document.createElement("li");
  li.className = "piece-item";
  li.innerHTML = `
    <div class="ride-info" style="flex:1">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="ride-lieu">${piece.nom}</span>
        <span class="ride-type">${piece.categorie}</span>
      </div>
      <span class="ride-detail">${piece.frequence}</span>
      <span class="ride-detail">${piece.date ? "Dernier : " + piece.date : "Jamais entretenu"}</span>
      ${piece.notes ? `<span class="ride-detail">${piece.notes}</span>` : ""}
      <div class="barre-container">
        <div class="barre-fill ${statut.classe}" style="width:${statut.pourcentage}%"></div>
      </div>
      <span class="statut-texte ${statut.classe}">${statut.texte}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-left:12px">
      <button class="btn-fait" onclick="marquerFait(${index})">✓ Fait</button>
      <button class="btn-delete" onclick="supprimerPiece(${index})">❌</button>
    </div>
  `;

  list.appendChild(li);
}

function marquerFait(index) {
  const aujourd_hui = new Date().toISOString().slice(0, 10);
  pieces[index].date = aujourd_hui;
  sauvegarder();
  rechargerListe();
}

function supprimerPiece(index) {
  pieces.splice(index, 1);
  sauvegarder();
  rechargerListe();
}

function rechargerListe() {
  const list = document.getElementById("pieceList");
  list.innerHTML = "";
  pieces.forEach(function(piece, index) {
    afficherPiece(piece, index);
  });
}

function charger() {
  const data = localStorage.getItem("pieces");
  if (data) {
    pieces = JSON.parse(data);
    pieces.forEach(function(piece, index) {
      afficherPiece(piece, index);
    });
  }
}

charger();