import { Link } from "react-router-dom";

// Une carte = un médecin. Les informations arrivent par les props.
function CarteMedecin({ id, nom, specialite, etablissement, region }) {
  return (
    <article>
      <h3>{nom}</h3>
      <p>{specialite}</p>
      <p>{etablissement}, {region}</p>
      <Link to={"/rendez-vous/" + id} className="bouton-lien">Prendre rendez-vous</Link>
    </article>
  );
}

export default CarteMedecin;
