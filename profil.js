console.log("Profil chargé ✓");

let comps = [];

function sauvegarderProfil() {
  const profil = {
    nom: document.getElementById("profilNom").value.trim(),
    age: document.getElementById("profilAge").value,
    poids: document.getElementById("profilPoids").value,
    categorie: document.getElementById("profilCategorie").value,
    club: document.getElementById("profilClub").value.trim()
  };
  localStorage.setItem("profil", JSON.stringify(profil));
  alert("Profil sauvegardé ✓");
}

function sauvegarderVelo() {
  const velo = {
    marque: document.getElementById("veloMarque").value.trim(),
    taille: document.getElementById("veloTaille").value,
    roues: document.getElementById("veloRoues").value,
    debattement: document.getElementById("veloDebattement").value,
    notes: document.getElementById("veloNotes").value.trim()
  };
  localStorage.setItem("velo", JSON.stringify(velo));
  alert("Vélo sauvegardé ✓");
}

function ajouterComp() {
  const nom = document.getElementById("compNom").value.trim();
  if (!nom) {
    alert("Indique le nom de la compétition !");
    return;
  }

  const comp = {
    nom,
    date: document.getElementById("compDate").value,
    classement: document.getElementById("compClassement").value.trim(),
    notes: document.getElementById("compNotes").value.trim()
  };

  comps.push(comp);
  localStorage.setItem("comps", JSON.stringify(comps));
  afficherComp(comp);

  document.getElementById("compNom").value = "";
  document.getElementById("compDate").value = "";
  document.getElementById("compClassement").value = "";
  document.getElementById("compNotes").value = "";
}

function afficherComp(comp) {
  const list = document.getElementById("compList");
  const li = document.createElement("li");
  li.style.cssText = "background:rgba(255,255,255,0.05);border-radius:6px;padding:10px;margin-bottom:8px;";
  li.innerHTML = `
    <span class="ride-lieu">${comp.nom}</span>
    <span class="ride-detail">${comp.date ? comp.date : ""}</span>
    <span class="ride-type" style="margin-top:4px">${comp.classement ? comp.classement : ""}</span>
    ${comp.notes ? `<span class="ride-detail">${comp.notes}</span>` : ""}
  `;
  list.appendChild(li);
}

function charger() {
  const profil = JSON.parse(localStorage.getItem("profil") || "{}");
  if (profil.nom) document.getElementById("profilNom").value = profil.nom;
  if (profil.age) document.getElementById("profilAge").value = profil.age;
  if (profil.poids) document.getElementById("profilPoids").value = profil.poids;
  if (profil.categorie) document.getElementById("profilCategorie").value = profil.categorie;
  if (profil.club) document.getElementById("profilClub").value = profil.club;

  const velo = JSON.parse(localStorage.getItem("velo")