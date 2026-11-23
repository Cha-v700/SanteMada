// ============================================
// 1. LES ÉLÉMENTS DE LA PAGE
// ============================================
let formulaire = document.getElementById("formulaire-inscription");
let champNom = document.getElementById("nom");
let champIdentifiant = document.getElementById("identifiant");
let champMdp = document.getElementById("mdp");
let champMdp2 = document.getElementById("mdp2");
let zoneMessage = document.getElementById("zone-message");

// ============================================
// 2. UNE FONCTION POUR AFFICHER UN MESSAGE
// ============================================
function afficherMessage(texte, type) {
  zoneMessage.textContent = texte;
  zoneMessage.className = "message " + type;
}

// ============================================
// 3. QUAND ON ENVOIE LE FORMULAIRE
// ============================================
formulaire.addEventListener("submit", function (event) {
  event.preventDefault();

  let nom = champNom.value.trim();
  let identifiant = champIdentifiant.value.trim().replaceAll(" ", "");
  let mdp = champMdp.value;
  let mdp2 = champMdp2.value;

  if (nom === "" || identifiant === "" || mdp === "" || mdp2 === "") {
    afficherMessage("Veuillez remplir tous les champs.", "erreur");
    return;
  }

  if (identifiant.length < 8) {
    afficherMessage("Identifiant trop court (8 caractères minimum).", "erreur");
    return;
  }

  if (mdp.length < 6) {
    afficherMessage("Le mot de passe doit contenir au moins 6 caractères.", "erreur");
    return;
  }

  if (mdp !== mdp2) {
    afficherMessage("Les deux mots de passe ne sont pas identiques.", "erreur");
    return;
  }

  let comptes = lireComptes();

  let existeDeja = comptes.some(function (c) {
    return c.identifiant === identifiant;
  });

  if (existeDeja) {
    afficherMessage("Ce compte existe déjà. Connectez-vous.", "erreur");
    return;
  }

  let nouveau = {
    identifiant: identifiant,
    motDePasse: mdp,
    nom: nom,
    role: "patient"
  };

  comptes.push(nouveau);
  enregistrerComptes(comptes);

  localStorage.setItem("utilisateur", JSON.stringify({ nom: nouveau.nom, role: nouveau.role }));
  afficherMessage("Compte créé ! Redirection...", "succes");

  setTimeout(function () {
    window.location.href = "acceuil.html";
  }, 1000);
});