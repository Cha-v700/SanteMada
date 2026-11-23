import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { lireComptes } from "../data/stockage.js";
import Message from "../components/Message.jsx";

function Connexion({ onConnexion }) {
  // L'ÉTAT : ce qui est tapé dans les champs et le message à afficher
  const [identifiant, setIdentifiant] = useState("");
  const [mdp, setMdp] = useState("");
  const [message, setMessage] = useState({ texte: "", type: "" });

  const navigate = useNavigate();

  function envoyer(event) {
    event.preventDefault();

    const id = identifiant.trim().replaceAll(" ", "");

    // Contrôle 1 : champs vides
    if (id === "" || mdp === "") {
      setMessage({ texte: "Veuillez remplir tous les champs.", type: "erreur" });
      return;
    }

    // Contrôle 2 : longueur du mot de passe
    if (mdp.length < 6) {
      setMessage({ texte: "Le mot de passe doit contenir au moins 6 caractères.", type: "erreur" });
      return;
    }

    // Contrôle 3 : le compte existe-t-il ?
    const compte = lireComptes().find(function (c) {
      return c.identifiant === id && c.motDePasse === mdp;
    });

    if (compte === undefined) {
      setMessage({ texte: "Identifiant ou mot de passe incorrect.", type: "erreur" });
      return;
    }

    // Tout est bon : on prévient App, puis on retourne à l'accueil
    onConnexion({
      nom: compte.nom,
      role: compte.role,
      identifiant: compte.identifiant,
      medecinId: compte.medecinId
    });
    setMessage({ texte: "Connexion réussie ! Redirection...", type: "succes" });

    setTimeout(function () {
      navigate("/");
    }, 1000);
  }

  return (
    <form className="carte-formulaire" onSubmit={envoyer}>
      <h1>Connexion</h1>
      <p>Bienvenue ! Connectez-vous pour réserver.</p>

      <label htmlFor="identifiant">Téléphone ou e-mail</label>
      <input
        type="text"
        id="identifiant"
        placeholder="034 00 000 00"
        value={identifiant}
        onChange={(e) => setIdentifiant(e.target.value)}
      />

      <label htmlFor="mdp">Mot de passe</label>
      <input
        type="password"
        id="mdp"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
      />

      <button>Se connecter</button>

      <Message texte={message.texte} type={message.type} />

      <p className="bas">
        Pas de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}

export default Connexion;
