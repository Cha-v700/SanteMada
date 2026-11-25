const API_URL = "http://localhost:3000/api/patients";

// =======================================
// 1. Récupérer le profil du patient connecté
// =======================================
export async function obtenirProfilPatient(token) {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Impossible de récupérer le profil");
    }

    return data;
}


// =======================================
// 2. Modifier le profil du patient connecté
// =======================================
export async function modifierProfilPatient(token, donnees) {
    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(donnees)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erreur de modification du profil");
    }

    return data;
}