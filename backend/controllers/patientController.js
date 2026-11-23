import * as service from "../services/patientService.js";

// Consulter son profil
export async function getMyProfile(req, res) {
    try {
        const patient = await service.getMyProfile(req.user.id);

        return res.status(200).json(patient);
    } catch (error) {
        const status = error.message === "Profil patient introuvable" ? 404 : 500;

        return res.status(status).json({
            message: error.message
        });
    }
}

// Créer son profil
export async function createMyProfile(req, res) {
    try {
        const patient = await service.createMyProfile(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            message: "Profil patient créé avec succès",
            patient
        });
    } catch (error) {
        const status = error.message === "Le profil patient existe déjà" ? 409 : 400;

        return res.status(status).json({
            message: error.message
        });
    }
}

// Modifier son profil
export async function updateMyProfile(req, res) {
    try {
        const patient = await service.updateMyProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            message: "Profil patient modifié avec succès",
            patient
        });
    } catch (error) {
        const status = error.message === "Profil patient introuvable" ? 404 : 400;

        return res.status(status).json({
            message: error.message
        });
    }
}