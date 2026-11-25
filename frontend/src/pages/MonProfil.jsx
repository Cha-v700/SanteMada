import { useEffect, useState } from "react";
import {
    obtenirProfilPatient,
    modifierProfilPatient
} from "../services/patientService.js";

import Message from "../components/Message.jsx";

function MonProfil({ utilisateur }) {
    const [profil, setProfil] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [enregistrement, setEnregistrement] = useState(false);
    const [modeModification, setModeModification] = useState(false);
    const [message, setMessage] = useState({ texte: "", type: "" });

    const [formulaire, setFormulaire] = useState({
        date_naissance: "",
        sexe: "",
        adresse: ""
    });

    // 1. Charger le profil
    useEffect(() => {
        async function chargerProfil() {
            try {
                if (!utilisateur?.token) {
                    throw new Error("Vous devez être connecté.");
                }

                const data = await obtenirProfilPatient(utilisateur.token);
                const patient = data.patient || data;

                setProfil(patient);

                setFormulaire({
                    date_naissance: patient.date_naissance
                        ? patient.date_naissance.slice(0, 10)
                        : "",
                    sexe: patient.sexe || "",
                    adresse: patient.adresse || ""
                });
            } catch (error) {
                setMessage({
                    texte: error.message,
                    type: "erreur"
                });
            } finally {
                setChargement(false);
            }
        }

        chargerProfil();
    }, [utilisateur?.token]);

    // 2. Modifier les champs
    function changerChamp(event) {
        const { name, value } = event.target;

        setFormulaire((ancienFormulaire) => ({
            ...ancienFormulaire,
            [name]: value
        }));
    }

    // 3. Enregistrer les modifications
    async function enregistrer(event) {
        event.preventDefault();

        if (!formulaire.date_naissance || !formulaire.sexe || !formulaire.adresse.trim()) {
            setMessage({
                texte: "Veuillez remplir tous les champs.",
                type: "erreur"
            });
            return;
        }

        setEnregistrement(true);
        setMessage({ texte: "", type: "" });

        try {
            const data = await modifierProfilPatient(
                utilisateur.token,
                formulaire
            );

            const patient = data.patient || data;

            setProfil(patient);

            setFormulaire({
                date_naissance: patient.date_naissance
                    ? patient.date_naissance.slice(0, 10)
                    : "",
                sexe: patient.sexe || "",
                adresse: patient.adresse || ""
            });

            setModeModification(false);

            setMessage({
                texte: data.message || "Profil modifié avec succès !",
                type: "succes"
            });
        } catch (error) {
            setMessage({
                texte: error.message,
                type: "erreur"
            });
        } finally {
            setEnregistrement(false);
        }
    }

    // 4. Annuler la modification
    function annulerModification() {
        setFormulaire({
            date_naissance: profil.date_naissance
                ? profil.date_naissance.slice(0, 10)
                : "",
            sexe: profil.sexe || "",
            adresse: profil.adresse || ""
        });

        setModeModification(false);
        setMessage({ texte: "", type: "" });
    }

    if (chargement) {
        return <p>Chargement du profil...</p>;
    }

    return (
        <section className="carte-formulaire">
            <h1>Mon profil patient</h1>

            {message.texte && (
                <Message
                    texte={message.texte}
                    type={message.type}
                />
            )}

            {!profil && !message.texte && (
                <p>Profil patient introuvable.</p>
            )}

            {profil && !modeModification && (
                <div className="profil-details">

                    <p>
                        <strong>Identifiant :</strong> {profil.id}
                    </p>

                    <p>
                        <strong>Date de naissance :</strong>{" "}
                        {profil.date_naissance
                            ? profil.date_naissance.slice(0, 10)
                            : "Non renseignée"}
                    </p>

                    <p>
                        <strong>Sexe :</strong>{" "}
                        {profil.sexe === "M"
                            ? "Masculin"
                            : profil.sexe === "F"
                            ? "Féminin"
                            : "Non renseigné"}
                    </p>

                    <p>
                        <strong>Adresse :</strong>{" "}
                        {profil.adresse || "Non renseignée"}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setModeModification(true);
                            setMessage({ texte: "", type: "" });
                        }}
                    >
                        Modifier mon profil
                    </button>
                </div>
            )}

            {profil && modeModification && (
                <form onSubmit={enregistrer}>

                    <label htmlFor="date_naissance">
                        Date de naissance
                    </label>

                    <input
                        type="date"
                        id="date_naissance"
                        name="date_naissance"
                        value={formulaire.date_naissance}
                        onChange={changerChamp}
                    />

                    <label htmlFor="sexe">
                        Sexe
                    </label>

                    <select
                        id="sexe"
                        name="sexe"
                        value={formulaire.sexe}
                        onChange={changerChamp}
                    >
                        <option value="">Choisir le sexe</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                    </select>

                    <label htmlFor="adresse">
                        Adresse
                    </label>

                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={formulaire.adresse}
                        onChange={changerChamp}
                        placeholder="Votre adresse"
                    />

                    <button type="submit" disabled={enregistrement}>
                        {enregistrement
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                    </button>

                    <button
                        type="button"
                        onClick={annulerModification}
                        disabled={enregistrement}
                    >
                        Annuler
                    </button>
                </form>
            )}
        </section>
    );
}

export default MonProfil;