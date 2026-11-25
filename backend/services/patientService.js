import * as repository from "../repositories/patientRepository.js";

// Consulter son profil
export async function getMyProfile(userId) {
    const patient = await repository.findByUserId(userId);

    if (!patient) {
        throw new Error("Profil patient introuvable");
    }

    return patient;
}

// Créer le profil
export async function createMyProfile(userId, data) {

    if (!data || typeof data !== "object") {
        throw new Error("Données du profil invalides");
    }

    const existingPatient = await repository.findByUserId(userId);

    if (existingPatient) {
        throw new Error("Le profil patient existe déjà");
    }

    return await repository.create({
        user_id: userId,
        date_naissance: data.date_naissance || null,
        sexe: data.sexe || null,
        adresse: data.adresse?.trim() || null
    });
}

// Modifier le profil
export async function updateMyProfile(userId, data) {

    if (!data || typeof data !== "object") {
        throw new Error("Données du profil invalides");
    }

    const patient = await repository.findByUserId(userId);

    if (!patient) {
        throw new Error("Profil patient introuvable");
    }

    return await repository.update(userId, {
        date_naissance: data.date_naissance ?? patient.date_naissance,
        sexe: data.sexe ?? patient.sexe,
        adresse: data.adresse !== undefined
            ? data.adresse.trim()
            : patient.adresse
    });
}