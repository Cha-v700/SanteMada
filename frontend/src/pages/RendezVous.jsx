import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { medecins } from "../data/medecins.js";
import { lireRendezVous, enregistrerRendezVous } from "../data/stockage.js";
import Message from "../components/Message.jsx";

// Les créneaux : de 08:00 à 15:30, toutes les 30 minutes
const HEURES = [];
for (let h = 8; h < 16; h++) {
  const heure = String(h).padStart(2, "0");
  HEURES.push(heure + ":00");
  HEURES.push(heure + ":30");
}

function RendezVous({ utilisateur }) {
  // Quel médecin ? L'id est dans l'adresse : /rendez-vous/3
  const { id } = useParams();
  const medecin = medecins.find((m) => m.id === Number(id));

  const aujourdhui = new Date().toLocaleDateString("en-CA");

  // L'ÉTAT
  const [date, setDate] = useState(aujourdhui);
  const [heureChoisie, setHeureChoisie] = useState("");
  const [motif, setMotif] = useState("");
  const [message, setMessage] = useState({ texte: "", type: "" });
  const [rendezVous, setRendezVous] = useState(lireRendezVous);

  // Cas particuliers : on affiche un message à la place du formulaire
  if (medecin === undefined) {
    return (
      <p className="vide">
        Professionnel introuvable. <Link to="/">Retour à la recherche</Link>
      </p>
    );
  }

  // Les heures déjà prises pour ce médecin, à cette date
  const heuresPrises = rendezVous
    .filter((r) => r.medecinId === medecin.id && r.date === date && r.statut !== "annule")
    .map((r) => r.heure);

  function changerDate(e) {
    setDate(e.target.value);
    setHeureChoisie("");
    setMessage({ texte: "", type: "" });
  }

  function confirmer(event) {
    event.preventDefault();

    if (date === "") {
      setMessage({ texte: "Choisissez une date.", type: "erreur" });
      return;
    }

    if (date < aujourdhui) {
      setMessage({ texte: "La date doit être aujourd'hui ou plus tard.", type: "erreur" });
      return;
    }

    if (heureChoisie === "") {
      setMessage({ texte: "Choisissez un créneau.", type: "erreur" });
      return;
    }

    const nouveau = {
      id: Date.now(),
      medecinId: medecin.id,
      medecin: medecin.nom,
      patientIdentifiant: utilisateur.identifiant,
      patient: utilisateur.nom,
      date: date,
      heure: heureChoisie,
      motif: motif.trim(),
      statut: "en_attente"
    };

    const liste = [...rendezVous, nouveau];
    enregistrerRendezVous(liste);
    setRendezVous(liste);

    setMessage({
      texte: "Rendez-vous demandé pour le " + date + " à " + heureChoisie + ". Il est en attente de confirmation.",
      type: "succes"
    });
    setHeureChoisie("");
    setMotif("");
  }

  return (
    <>
      <Link to="/" className="retour">← Retour à la recherche</Link>

      <section className="carte-rdv">
        <h1>Prendre rendez-vous</h1>

        <div className="infos-medecin">
          <h2>{medecin.nom}</h2>
          <p>{medecin.specialite} · {medecin.etablissement}, {medecin.region}</p>
        </div>

        {utilisateur === null && (
          <>
            <Message texte="Connectez-vous pour prendre rendez-vous." type="erreur" />
            <p className="bas"><Link to="/connexion">Se connecter</Link></p>
          </>
        )}

        {utilisateur !== null && utilisateur.role !== "patient" && (
          <Message texte="Seuls les patients peuvent prendre rendez-vous." type="erreur" />
        )}

        {utilisateur !== null && utilisateur.role === "patient" && (
          <form onSubmit={confirmer}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" min={aujourdhui} value={date} onChange={changerDate} />

            <p className="titre-creneaux">Créneaux disponibles</p>
            <div className="creneaux">
              {HEURES.map((heure) => (
                <button
                  key={heure}
                  type="button"
                  className={"creneau" + (heure === heureChoisie ? " actif" : "")}
                  disabled={heuresPrises.includes(heure)}
                  onClick={() => setHeureChoisie(heure)}
                >
                  {heure}
                </button>
              ))}
            </div>

            <label htmlFor="motif">Motif de la consultation</label>
            <input
              type="text"
              id="motif"
              placeholder="Fièvre depuis deux jours"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            />

            <button className="confirmer">Confirmer le rendez-vous</button>
            <Message texte={message.texte} type={message.type} />
          </form>
        )}
      </section>
    </>
  );
}

export default RendezVous;
