// ============================================================
// Lire et écrire dans le localStorage (la mémoire du navigateur).
// Toutes les pages passent par ce fichier : un seul endroit.
// Plus tard, ces fonctions seront remplacées par des appels à l'API.
// ============================================================

// Les comptes de départ, pour pouvoir tester
const COMPTES_DE_TEST = [
  { identifiant: "0340000001", motDePasse: "patient123", nom: "Rakoto Jean", role: "patient" },
  { identifiant: "0340000010", motDePasse: "medecin123", nom: "Dr Rasoamanana", role: "medecin", medecinId: 1 }
];

// ----- Les comptes -----
export function lireComptes() {
  const texte = localStorage.getItem("comptes");

  if (texte === null) {
    localStorage.setItem("comptes", JSON.stringify(COMPTES_DE_TEST));
    return COMPTES_DE_TEST;
  }

  return JSON.parse(texte);
}

export function enregistrerComptes(liste) {
  localStorage.setItem("comptes", JSON.stringify(liste));
}

// ----- L'utilisateur connecté -----
export function lireUtilisateur() {
  const texte = localStorage.getItem("utilisateur");
  return texte === null ? null : JSON.parse(texte);
}

export function enregistrerUtilisateur(utilisateur) {
  localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
}

export function supprimerUtilisateur() {
  localStorage.removeItem("utilisateur");
}

// ----- Les rendez-vous -----
export function lireRendezVous() {
  const texte = localStorage.getItem("rendezvous");
  return texte === null ? [] : JSON.parse(texte);
}

export function enregistrerRendezVous(liste) {
  localStorage.setItem("rendezvous", JSON.stringify(liste));
}
