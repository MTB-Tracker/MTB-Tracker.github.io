console.log("Script chargé ✓");

let rides = [];

function sauvegarder() {
  localStorage.setItem("rides", JSON.stringify(rides));
}

function mettreAJourStats() {
  const nb = rides.length;
  const denivTotal = rides.reduce(function(total, ride) {
    return total + (parseFloat(ride.deniv) || 0);
  }, 0);

  const derniere = rides.length > 0 ? rides[rides.length - 1].lieu : "—";

  document.getElementById("statNb").textContent = nb;
  document.getElementById("statDeniv").textContent = denivTotal + " m";
  document.getElementById("statDerniere").textContent = derniere;
}

function charger() {
  const data = localStorage.getItem("rides");
  if (data) {
    rides = JSON.parse(data);
    rides.forEach(function(ride) {
      afficherRide(ride);
    });
  }
  mettreAJourStats();
}

function addRide() {
  const lieu = document.getElementById("rideInput").value.trim();
  const date = document.getElementById("rideDate").value;
  const type = document.getElementById("rideType").value;
  const deniv = document.getElementById("rideDeniv").value;
  const notes = document.getElementById("rideNotes").value.trim();

  if (!lieu) {
    alert("Indique au moins un lieu !");
    return;
  }

  const ride = { lieu, date, type, deniv, notes };
  rides.push(ride);
  sauvegarder();
  afficherRide(ride);
  mettreAJourStats();

  document.getElementById("rideInput").value = "";
  document.getElementById("rideDate").value = "";
  document.getElementById("rideDeniv").value = "";
  document.getElementById("rideNotes").value = "";
}

function afficherRide(ride) {
  const list = document.getElementById("rideList");

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="ride-info">
      <span class="ride-lieu">${ride.lieu}</span>
      <span class="ride-type">${ride.type}</span>
      <span class="ride-detail">${ride.date ? ride.date : "Date non renseignée"}</span>
      <span class="ride-detail">${ride.deniv ? ride.deniv + " m D+" : ""}</span>
      <span class="ride-detail">${ride.notes}</span>
    </div>
    <button class="btn-delete" onclick="supprimerRide(this)">❌</button>
  `;

  list.appendChild(li);
}

function supprimerRide(btn) {
  const li = btn.parentElement;
  const index = Array.from(document.getElementById("rideList").children).indexOf(li);
  rides.splice(index, 1);
  sauvegarder();
  mettreAJourStats();
  li.remove();
}

charger();