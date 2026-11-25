import * as service from "../services/etablissementService.js";

// 1. Lister les établissements
export async function getAll(req, res) {
    try {
        const etablissements = await service.getAll();

        return res.status(200).json(etablissements);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// 2. Récupérer un établissement
export async function getById(req, res) {
    try {
        const etablissement = await service.getById(req.params.id);

        return res.status(200).json(etablissement);
    } catch (error) {
        const status = error.message === "Établissement introuvable"
            ? 404
            : 500;

        return res.status(status).json({
            message: error.message
        });
    }
}

// 3. Créer
export async function create(req, res) {
    try {
        const etablissement = await service.create(req.body);

        return res.status(201).json({
            message: "Établissement créé avec succès",
            etablissement
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// 4. Modifier
export async function update(req, res) {
    try {
        const etablissement = await service.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Établissement modifié avec succès",
            etablissement
        });
    } catch (error) {
        const status = error.message === "Établissement introuvable"
            ? 404
            : 400;

        return res.status(status).json({
            message: error.message
        });
    }
}

// 5. Supprimer
export async function remove(req, res) {
    try {
        await service.remove(req.params.id);

        return res.status(200).json({
            message: "Établissement supprimé avec succès"
        });
    } catch (error) {
        const status = error.message === "Établissement introuvable"
            ? 404
            : 500;

        return res.status(status).json({
            message: error.message
        });
    }
}