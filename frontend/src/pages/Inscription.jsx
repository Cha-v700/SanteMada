import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lireComptes, enregistrerComptes } from "../data/stockage.js";
import Message from "../components/Message.jsx";

function Inscription({ onConnexion }) {
  const [nom, setNom] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [mdp, setMdp] = useState("");
  const [mdp2, setMdp2] = useState("");
  const [message, setMessage] = useState({ texte: "", type: "" });

  const navigate = useNavigate();

  function erreur(texte) {
    setMessage({ texte: texte, type: "erreur" });
  }

  function envoyer(event) {
    event.preventDefault();

    const nomPropre = nom.trim();
    const id = identifiant.trim().replaceAll(" ", "");

    if (nomPropre === "" || id === "" || mdp === "" || mdp2 === "") {
      erreur("Veuillez remplir tous les champs.");
      return;
    }

    if (id.length < 8) {
      erreur("Identifiant trop court (8 caractères minimum).");
      return;
    }

    if (mdp.length < 6) {
      erreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (mdp !== mdp2) {
      erreur("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    const comptes = lireComptes();

    const existeDeja = comptes.some(function (c) {
      return c.identifiant === id;
    });

    if (existeDeja) {
      erreur("Ce compte existe déjà. Connectez-vous.");
      return;
    }

    // Tout est bon : on crée le compte.
    // Le rôle est toujours "patient" : on ne laisse jamais l'utilisateur le choisir.
    const nouveau = { identifiant: id, motDePasse: mdp, nom: nomPropre, role: "patient" };

    enregistrerComptes([...comptes, nouveau]);
    onConnexion({ nom: nouveau.nom, role: nouveau.role, identifiant: nouveau.identifiant });
    setMessage({ texte: "Compte créé ! Redirection...", type: "succes" });

    setTimeout(function () {
      navigate("/");
    }, 1000);
  }

  return (
    <form className="carte-formulaire" onSubmit={envoyer}>
      <h1>Créer un compte</h1>
      <p>Inscrivez-vous pour prendre rendez-vous.</p>

      <label htmlFor="nom">Nom complet</label>
      <input type="text" id="nom" placeholder="Rakoto Jean" value={nom} onChange={(e) => setNom(e.target.value)} />

      <label htmlFor="identifiant">Téléphone ou e-mail</label>
      <input type="text" id="identifiant" placeholder="034 00 000 00" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />

      <label htmlFor="mdp">Mot de passe</label>
      <input type="password" id="mdp" value={mdp} onChange={(e) => setMdp(e.target.value)} />
      <p className="aide">6 caractères minimum.</p>

      <label htmlFor="mdp2">Confirmer le mot de passe</label>
      <input type="password" id="mdp2" value={mdp2} onChange={(e) => setMdp2(e.target.value)} />

      <button>Créer mon compte</button>

      <Message texte={message.texte} type={message.type} />

      <p className="bas">
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}

export default Inscription;
