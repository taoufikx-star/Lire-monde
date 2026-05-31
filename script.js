// ================================================
//   script.js — LireMonde
//   Version simple et claire
// ================================================

const API = "http://localhost:3000/livres";

// ================================================
//   PARTIE 1 — APPELS API
//   Chaque fonction parle à json-server
// ================================================

// Récupérer tous les livres
async function getLivres() {
  try {
    const reponse = await fetch(API);
    const livres = await reponse.json();
    return livres;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return [];
  }
}

// Récupérer un seul livre par id
async function getLivreById(id) {
  try {
    const reponse = await fetch(API + "/" + id);
    const livre = await reponse.json();
    return livre;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return null;
  }
}

// Ajouter un livre
async function ajouterLivre(data) {
  try {
    const reponse = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const livre = await reponse.json();
    return livre;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return null;
  }
}

// Modifier un livre
async function modifierLivre(id, data) {
  try {
    const reponse = await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const livre = await reponse.json();
    return livre;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return null;
  }
}

// Supprimer un livre
async function supprimerLivre(id) {
  try {
    await fetch(API + "/" + id, { method: "DELETE" });
    return true;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return false;
  }
}

// Changer aLire (true/false)
async function toggleALire(id, valeur) {
  try {
    const reponse = await fetch(API + "/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aLire: valeur })
    });
    const livre = await reponse.json();
    return livre;
  } catch (err) {
    console.error("Erreur réseau :", err);
    return null;
  }
}

// ================================================
//   PARTIE 2 — PAGE ACCUEIL (index.html)
// ================================================

let tousLesLivres = [];
let genreChoisi = "Tous";

async function initAccueil() {
  tousLesLivres = await getLivres();

  if (tousLesLivres.length === 0) {
    document.getElementById("livres-grid").innerHTML =
      "<p class='vide'>Serveur non démarré. Lance : npm start</p>";
    return;
  }

  afficherLivres(tousLesLivres);
  afficherFiltres(tousLesLivres);

  // Écouter la barre de recherche
  document.getElementById("recherche").addEventListener("input", filtrer);
}

// Afficher une liste de livres dans la grille
function afficherLivres(liste) {
  const grille = document.getElementById("livres-grid");
  grille.innerHTML = "";

  if (liste.length === 0) {
    grille.innerHTML = "<p class='vide'>Aucun livre trouvé.</p>";
    return;
  }

  liste.forEach(function(livre) {
    // Créer la carte
    const carte = document.createElement("div");
    carte.classList.add("carte");
    carte.innerHTML =
      '<img src="' + livre.couverture + '" alt="' + livre.titre + '" />' +
      '<div class="carte-body">' +
        '<h3>' + livre.titre + '</h3>' +
        '<p class="auteur">' + livre.auteur + '</p>' +
        '<span class="badge">' + livre.genre + '</span>' +
      '</div>';

    // Cliquer sur la carte → ouvrir la modale
    carte.addEventListener("click", function() {
      ouvrirModale(livre);
    });

    grille.appendChild(carte);
  });
}

// Créer les boutons de filtre par genre
function afficherFiltres(liste) {
  const section = document.getElementById("filtres");
  section.innerHTML = "";

  // Collecter les genres uniques
  const genres = ["Tous"];
  liste.forEach(function(l) {
    if (!genres.includes(l.genre)) {
      genres.push(l.genre);
    }
  });

  // Créer un bouton par genre
  genres.forEach(function(genre) {
    const btn = document.createElement("button");
    btn.textContent = genre;
    if (genre === "Tous") btn.classList.add("actif");

    btn.addEventListener("click", function() {
      genreChoisi = genre;
      // Enlever actif de tous les boutons
      section.querySelectorAll("button").forEach(function(b) {
        b.classList.remove("actif");
      });
      btn.classList.add("actif");
      filtrer();
    });

    section.appendChild(btn);
  });
}

// Filtrer par genre + recherche
function filtrer() {
  const motCle = document.getElementById("recherche").value.toLowerCase();
  let resultat = tousLesLivres;

  // Filtre par genre
  if (genreChoisi !== "Tous") {
    resultat = resultat.filter(function(l) {
      return l.genre === genreChoisi;
    });
  }

  // Filtre par mot-clé
  if (motCle !== "") {
    resultat = resultat.filter(function(l) {
      return l.titre.toLowerCase().includes(motCle) ||
             l.auteur.toLowerCase().includes(motCle);
    });
  }

  afficherLivres(resultat);
}

// Ouvrir la modale avec les détails du livre
function ouvrirModale(livre) {
  const modale = document.getElementById("modale");

  modale.innerHTML =
    '<div class="modale-box">' +
      '<button class="modale-fermer" id="btn-fermer">✕</button>' +
      '<img class="cover" src="' + livre.couverture + '" alt="' + livre.titre + '" />' +
      '<div class="modale-body">' +
        '<span class="badge">' + livre.genre + '</span>' +
        '<h2>' + livre.titre + '</h2>' +
        '<p class="sous-titre">' + livre.auteur + '</p>' +
        '<p class="desc">' + livre.description + '</p>' +
        '<button class="btn btn-or" id="btn-alire">' +
          (livre.aLire ? "➖ Retirer de ma liste" : "➕ Ajouter à ma liste") +
        '</button>' +
      '</div>' +
    '</div>';

  modale.classList.remove("cache");

  // Fermer en cliquant sur ✕
  document.getElementById("btn-fermer").addEventListener("click", fermerModale);

  // Fermer en cliquant dehors
  modale.addEventListener("click", function(e) {
    if (e.target === modale) fermerModale();
  });

  // Bouton À lire
  document.getElementById("btn-alire").addEventListener("click", async function() {
    const nouvelleValeur = !livre.aLire;
    const resultat = await toggleALire(livre.id, nouvelleValeur);
    if (resultat) {
      livre.aLire = nouvelleValeur;
      // Mettre à jour dans le tableau principal
      const index = tousLesLivres.findIndex(function(l) { return l.id === livre.id; });
      if (index !== -1) tousLesLivres[index].aLire = nouvelleValeur;
      // Mettre à jour le texte du bouton
      document.getElementById("btn-alire").textContent =
        nouvelleValeur ? "➖ Retirer de ma liste" : "➕ Ajouter à ma liste";
    }
  });
}

function fermerModale() {
  document.getElementById("modale").classList.add("cache");
}

// ================================================
//   PARTIE 3 — PAGE À LIRE (alire.html)
// ================================================

async function initAlire() {
  const livres = await getLivres();

  if (livres.length === 0) {
    document.getElementById("alire-grid").innerHTML =
      "<p class='vide'>Serveur non démarré.</p>";
    return;
  }

  // Garder seulement les livres marqués aLire = true
  const listeAlire = livres.filter(function(l) { return l.aLire === true; });
  afficherAlire(listeAlire);
}

function afficherAlire(liste) {
  const grille = document.getElementById("alire-grid");
  grille.innerHTML = "";

  if (liste.length === 0) {
    grille.innerHTML = "<p class='vide'>Votre liste est vide. Ajoutez des livres depuis l'accueil !</p>";
    return;
  }

  liste.forEach(function(livre) {
    const carte = document.createElement("div");
    carte.classList.add("carte");
    carte.innerHTML =
      '<img src="' + livre.couverture + '" alt="' + livre.titre + '" />' +
      '<div class="carte-body">' +
        '<h3>' + livre.titre + '</h3>' +
        '<p class="auteur">' + livre.auteur + '</p>' +
        '<span class="badge">' + livre.genre + '</span>' +
        '<button class="btn-retirer">✖ Retirer</button>' +
      '</div>';

    // Retirer de la liste
    carte.querySelector(".btn-retirer").addEventListener("click", async function() {
      const ok = await toggleALire(livre.id, false);
      if (ok) {
        carte.remove();
        if (grille.children.length === 0) {
          grille.innerHTML = "<p class='vide'>Votre liste est vide.</p>";
        }
      }
    });

    grille.appendChild(carte);
  });
}

// ================================================
//   PARTIE 4 — PAGE ADMIN (admin.html)
// ================================================

async function initAdmin() {
  await chargerTableau();
  document.getElementById("form-livre").addEventListener("submit", soumettreForm);
  document.getElementById("btn-annuler").addEventListener("click", viderForm);
}

// Afficher tous les livres dans le tableau
async function chargerTableau() {
  const livres = await getLivres();
  const corps = document.getElementById("corps-tableau");
  corps.innerHTML = "";

  if (livres.length === 0) {
    corps.innerHTML = '<tr><td colspan="4" style="color:red">Serveur non démarré.</td></tr>';
    return;
  }

  livres.forEach(function(livre) {
    corps.appendChild(creerLigne(livre));
  });
}

// Créer une ligne du tableau pour un livre
function creerLigne(livre) {
  const ligne = document.createElement("tr");
  ligne.setAttribute("data-id", livre.id);
  ligne.innerHTML =
    '<td>' + livre.titre + '</td>' +
    '<td>' + livre.auteur + '</td>' +
    '<td><span class="badge">' + livre.genre + '</span></td>' +
    '<td class="td-actions">' +
      '<button class="btn btn-bleu btn-modifier">✏️ Modifier</button>' +
      '<button class="btn btn-rouge btn-supprimer">🗑️ Supprimer</button>' +
    '</td>';

  // Modifier → remplir le formulaire
  ligne.querySelector(".btn-modifier").addEventListener("click", function() {
    remplirForm(livre);
  });

  // Supprimer → effacer le livre
  ligne.querySelector(".btn-supprimer").addEventListener("click", async function() {
    if (confirm("Supprimer ce livre ?")) {
      const ok = await supprimerLivre(livre.id);
      if (ok) ligne.remove();
    }
  });

  return ligne;
}

// Remplir le formulaire pour modifier
function remplirForm(livre) {
  document.getElementById("champ-id").value          = livre.id;
  document.getElementById("champ-titre").value       = livre.titre;
  document.getElementById("champ-auteur").value      = livre.auteur;
  document.getElementById("champ-genre").value       = livre.genre;
  document.getElementById("champ-description").value = livre.description;
  document.getElementById("champ-couverture").value  = livre.couverture;
  document.getElementById("form-titre").textContent  = "✏️ Modifier un livre";
  document.getElementById("btn-submit").textContent  = "💾 Sauvegarder";
  document.getElementById("btn-annuler").style.display = "inline-block";
}

// Soumettre le formulaire (ajouter ou modifier)
async function soumettreForm(e) {
  e.preventDefault();

  const id          = document.getElementById("champ-id").value;
  const titre       = document.getElementById("champ-titre").value.trim();
  const auteur      = document.getElementById("champ-auteur").value.trim();
  const genre       = document.getElementById("champ-genre").value;
  const description = document.getElementById("champ-description").value.trim();
  const couverture  = document.getElementById("champ-couverture").value.trim()
                      || "https://picsum.photos/seed/" + titre + "/200/300";

  const data = { titre, auteur, genre, description, couverture, aLire: false };

  if (id === "") {
    // Nouveau livre
    const nouveau = await ajouterLivre(data);
    if (nouveau) {
      document.getElementById("corps-tableau").appendChild(creerLigne(nouveau));
    }
  } else {
    // Modifier livre existant
    const ancien = await getLivreById(id);
    data.aLire = ancien ? ancien.aLire : false;
    const modifie = await modifierLivre(id, data);
    if (modifie) {
      const ancienneLigne = document.querySelector('tr[data-id="' + id + '"]');
      if (ancienneLigne) ancienneLigne.replaceWith(creerLigne(modifie));
    }
  }

  viderForm();
}

// Vider le formulaire
function viderForm() {
  document.getElementById("champ-id").value          = "";
  document.getElementById("champ-titre").value       = "";
  document.getElementById("champ-auteur").value      = "";
  document.getElementById("champ-genre").value       = "Classique";
  document.getElementById("champ-description").value = "";
  document.getElementById("champ-couverture").value  = "";
  document.getElementById("form-titre").textContent  = "➕ Ajouter un livre";
  document.getElementById("btn-submit").textContent  = "➕ Ajouter le livre";
  document.getElementById("btn-annuler").style.display = "none";
}

// ================================================
//   DÉMARRAGE — détecter quelle page est ouverte
// ================================================
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("livres-grid"))   initAccueil();
  if (document.getElementById("alire-grid"))    initAlire();
  if (document.getElementById("corps-tableau")) initAdmin();
});