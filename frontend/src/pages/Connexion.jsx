
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connecterAPI } from "../services/authService.js";
import Message from "../components/Message.jsx";

function Connexion({ onConnexion }) {
  const [identifiant, setIdentifiant] = useState("");
  const [mdp, setMdp] = useState("");
  const [message, setMessage] = useState({ texte: "", type: "" });
  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();

  async function envoyer(event) {
    event.preventDefault();

    const email = identifiant.trim().toLowerCase();

    if (email === "" || mdp === "") {
      setMessage({
        texte: "Veuillez remplir tous les champs.",
        type: "erreur"
      });
      return;
    }

    setChargement(true);
    setMessage({ texte: "", type: "" });

    try {
      const data = await connecterAPI(email, mdp);

      onConnexion({
        ...data.user,
        token: data.token
      });

      setMessage({
        texte: "Connexion réussie !",
        type: "succes"
      });

      navigate("/");
    } catch (error) {
      setMessage({
        texte: error.message,
        type: "erreur"
      });
    } finally {
      setChargement(false);
    }
  }

  return (
    <form className="carte-formulaire" onSubmit={envoyer}>
      <h1>Connexion</h1>
      <p>Bienvenue ! Connectez-vous pour réserver.</p>

      <label htmlFor="identifiant">E-mail</label>
      <input
        type="email"
        id="identifiant"
        placeholder="exemple@email.com"
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

      <button disabled={chargement}>
        {chargement ? "Connexion..." : "Se connecter"}
      </button>

      <Message texte={message.texte} type={message.type} />

      <p className="bas">
        Pas de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}

export default Connexion;
