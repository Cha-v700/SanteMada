import { Link, useNavigate } from "react-router-dom";

// Props reçues : utilisateur (ou null) et la fonction onDeconnexion
function Navbar({ utilisateur, onDeconnexion }) {
  const navigate = useNavigate();

  function seDeconnecter() {
    onDeconnexion();
    navigate("/");
  }

  return (
    <header>
      <Link to="/" className="logo">SantéMada</Link>

      <nav>
        <Link to="/">Rechercher</Link>

        {/* Ces liens n'apparaissent que pour le bon rôle */}
        {utilisateur !== null && utilisateur.role === "patient" && (
          <Link to="/mes-rendez-vous">Mes rendez-vous</Link>
        )}
        {utilisateur !== null && utilisateur.role === "medecin" && (
          <Link to="/agenda">Mon agenda</Link>
        )}

        {/* Connecté : le nom et "Se déconnecter". Sinon : "Se connecter" */}
        {utilisateur !== null ? (
          <>
            <span className="nom-utilisateur">{utilisateur.nom}</span>
            <button className="lien" onClick={seDeconnecter}>Se déconnecter</button>
          </>
        ) : (
          <Link to="/connexion">Se connecter</Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
