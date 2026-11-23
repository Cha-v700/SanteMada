import { useState } from "react";
import { Navigate } from "react-router-dom";
import { lireRendezVous, enregistrerRendezVous } from "../data/stockage.js";
import StatutBadge from "../components/StatutBadge.jsx";

function Agenda({ utilisateur }) {
  const [rendezVous, setRendezVous] = useState(lireRendezVous);

  // Page réservée aux médecins connectés
  if (utilisateur === null || utilisateur.role !== "medecin") {
    return <Navigate to="/connexion" />;
  }

  // Seulement les rendez-vous de CE médecin, par ordre chronologique
  const agenda = rendezVous
    .filter((r) => r.medecinId === utilisateur.medecinId)
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  function compter(statut) {
    return agenda.filter((r) => r.statut === statut).length;
  }

  function changerStatut(id, statut) {
    const liste = rendezVous.map((r) => (r.id === id ? { ...r, statut: statut } : r));
    enregistrerRendezVous(liste);
    setRendezVous(liste);
  }

  return (
    <>
      <h1>Mon agenda</h1>
      <p className="doux">{utilisateur.nom}</p>

      <div className="stats">
        <div className="stat"><span>En attente</span><strong>{compter("en_attente")}</strong></div>
        <div className="stat"><span>Confirmés</span><strong>{compter("confirme")}</strong></div>
        <div className="stat"><span>Terminés</span><strong>{compter("termine")}</strong></div>
      </div>

      {agenda.length === 0 && <p className="vide">Aucun rendez-vous pour le moment.</p>}

      {agenda.map((r) => (
        <div className="ligne-rdv" key={r.id}>
          <div>
            <strong>{r.date} à {r.heure} · {r.patient}</strong>
            <span className="doux">{r.motif === "" ? "Motif non précisé" : r.motif}</span>
          </div>

          <StatutBadge statut={r.statut} />

          {r.statut === "en_attente" && (
            <button onClick={() => changerStatut(r.id, "confirme")}>Confirmer</button>
          )}
          {(r.statut === "en_attente" || r.statut === "confirme") && (
            <button onClick={() => changerStatut(r.id, "annule")}>Annuler</button>
          )}
          {r.statut === "confirme" && (
            <button onClick={() => changerStatut(r.id, "termine")}>Terminer</button>
          )}
        </div>
      ))}
    </>
  );
}

export default Agenda;
