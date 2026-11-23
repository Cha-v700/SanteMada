// Le petit badge coloré qui montre l'état d'un rendez-vous
const TEXTES = {
  en_attente: "En attente",
  confirme: "Confirmé",
  annule: "Annulé",
  termine: "Terminé"
};

function StatutBadge({ statut }) {
  return <span className={"badge " + statut}>{TEXTES[statut]}</span>;
}

export default StatutBadge;
