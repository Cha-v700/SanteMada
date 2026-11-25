import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { lireUtilisateur, enregistrerUtilisateur, supprimerUtilisateur } from "./data/stockage.js";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Accueil from "./pages/Accueil.jsx";
import Connexion from "./pages/Connexion.jsx";
import Inscription from "./pages/Inscription.jsx";
import RendezVous from "./pages/RendezVous.jsx";
import MesRendezVous from "./pages/MesRendezVous.jsx";
import Agenda from "./pages/Agenda.jsx";
import MonProfil from "./pages/MonProfil.jsx";

function App() {
  // L'ÉTAT central : qui est connecté ? (null = personne)
  // Au démarrage, on relit ce que le navigateur a mémorisé.
  const [utilisateur, setUtilisateur] = useState(lireUtilisateur);

  function seConnecter(infos) {
    enregistrerUtilisateur(infos);
    setUtilisateur(infos);
  }

  function seDeconnecter() {
    supprimerUtilisateur();
    setUtilisateur(null);
  }

  return (
    <>
      <Navbar utilisateur={utilisateur} onDeconnexion={seDeconnecter} />

      <main>
        {/* Chaque Route associe une adresse à une page */}
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion onConnexion={seConnecter} />} />
          <Route path="/mon-profil" element={<MonProfil utilisateur={utilisateur} />} />
          <Route path="/inscription" element={<Inscription onConnexion={seConnecter} />} />
          <Route path="/rendez-vous/:id" element={<RendezVous utilisateur={utilisateur} />} />
          <Route path="/mes-rendez-vous" element={<MesRendezVous utilisateur={utilisateur} />} />
          <Route path="/agenda" element={<Agenda utilisateur={utilisateur} />} />
          <Route path="*" element={<p className="vide">Page introuvable.</p>} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
