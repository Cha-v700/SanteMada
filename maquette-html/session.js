// 1. On cherche le lien et on relit l'utilisateur mémorisé
let lienConnexion = document.getElementById("lien-connexion");
let utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

// 2. Si quelqu'un est connecté, on change la barre du haut
if (utilisateur !== null) {
  lienConnexion.textContent = utilisateur.nom;
  lienConnexion.href = "#";

  let lienDeconnexion = document.createElement("a");
  lienDeconnexion.textContent = "Se déconnecter";
  lienDeconnexion.href = "acceuil.html";

  lienDeconnexion.addEventListener("click", function () {
    localStorage.removeItem("utilisateur");
  });

  lienConnexion.after(lienDeconnexion);
}