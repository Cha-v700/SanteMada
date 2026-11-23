import { useState } from "react";
import { medecins, regions, specialites } from "../data/medecins.js";
import CarteMedecin from "../components/CarteMedecin.jsx";

function Accueil() {
  // L'ÉTAT : ce que l'utilisateur a choisi dans la recherche
  const [texte, setTexte] = useState("");
  const [region, setRegion] = useState("");
  const [specialite, setSpecialite] = useState("");

  // On filtre la liste à chaque fois que l'état change
  const resultats = medecins.filter(function (m) {
    const tout = (m.nom + " " + m.specialite + " " + m.etablissement + " " + m.region).toLowerCase();

    const okTexte = tout.includes(texte.toLowerCase());
    const okRegion = region === "" || m.region === region;
    const okSpecialite = specialite === "" || m.specialite === specialite;

    return okTexte && okRegion && okSpecialite;
  });

  return (
    <>
      <section className="bandeau">
        <h1>Trouvez un professionnel de santé</h1>
        <p>Cherchez un médecin, un établissement ou une spécialité.</p>

        <form className="recherche" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Cardiologue, pédiatre, hôpital..."
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
          />

          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Toutes les régions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select value={specialite} onChange={(e) => setSpecialite(e.target.value)}>
            <option value="">Toutes les spécialités</option>
            {specialites.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </form>
      </section>

      <h2>Professionnels disponibles</h2>
      <p>{resultats.length === 0 ? "Aucun résultat." : resultats.length + " résultat(s)"}</p>

      <div className="liste">
        {resultats.map((m) => (
          <CarteMedecin
            key={m.id}
            id={m.id}
            nom={m.nom}
            specialite={m.specialite}
            etablissement={m.etablissement}
            region={m.region}
          />
        ))}
      </div>
    </>
  );
}

export default Accueil;
