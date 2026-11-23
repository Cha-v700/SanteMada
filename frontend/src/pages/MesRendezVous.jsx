import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { lireRendezVous, enregistrerRendezVous } from "../data/stockage.js";
import StatutBadge from "../components/StatutBadge.jsx";

function MesRendezVous({ utilisateur }) {
  const [rendezVous, setRendezVous] = useState(lireRendezVous);

  // Page réservée aux patients connectés
  if (utilisateur === null || utilisateur.role !== "patient") {
    return <Navigate to="/connexion" />;
  }

  // Seulement les rendez-vous de ce patient, les plus récents d'abord
  const mesRdv = rendezVous
    .filter((r) => r.patientIdentifiant === utilisateur.identifiant)
    .sort((a, b) => (b.date + b.heure).localeCompare(a.date + a.heure));

  function annuler(id) {
    const liste = rendezVous.map((r) => (r.id === id ? { ...r, statut: "annule" } : r));
    enregistrerRendezVous(liste);
    setRendezVous(liste);
  }

  return (
    <>
      <h1>Mes rendez-vous</h1>

      {mesRdv.length === 0 && (
        <p className="vide">
          Vous n'avez pas encore de rendez-vous. <Link to="/">Chercher un médecin</Link>
        </p>
      )}

      {mesRdv.map((r) => (
        <div className="ligne-rdv" key={r.id}>
          <div>
            <strong>{r.date} à {r.heure}</strong>
            <span className="doux">{r.medecin}</span>
          </div>

          <StatutBadge statut={r.statut} />

          {(r.statut === "en_attente" || r.statut === "confirme") && (
            <button onClick={() => annuler(r.id)}>Annuler</button>
          )}
        </div>
      ))}
    </>
  );
}

export default MesRendezVous;
