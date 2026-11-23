// Affiche un message d'erreur ou de réussite.
// Si le texte est vide, on n'affiche rien.
function Message({ texte, type }) {
  if (texte === "") {
    return null;
  }

  return <p className={"message " + type}>{texte}</p>;
}

export default Message;
