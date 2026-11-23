import * as service from "../services/medecinService.js";

// GET : récupérer tous les médecins
export async function getAll(req, res) {
    try {
        const ville = req.query.ville;
        const specialite = req.query.specialite;

        const page = Math.max(1, parseInt(req.query.page) || 1);

        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit) || 10)
        );

        const result = await service.getAllMedecins({
            ville,
            specialite,
            page,
            limit
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// GET : récupérer un médecin par ID
export async function getById(req, res) {
    try {
        const medecin = await service.getMedecinById(req.params.id);

        res.status(200).json(medecin);
    } catch (error) {
        const status = error.message === "Médecin introuvable"
            ? 404
            : 500;

        res.status(status).json({
            message: error.message
        });
    }
}

// POST : créer un médecin
export async function create(req, res) {
    try {
        const medecin = await service.createMedecin(req.body);

        res.status(201).json(medecin);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// PUT : modifier un médecin
export async function update(req, res) {
    try {
        const medecin = await service.updateMedecin(
            req.params.id,
            req.body
        );

        res.status(200).json(medecin);
    } catch (error) {
        const status = error.message === "Médecin introuvable"
            ? 404
            : 400;

        res.status(status).json({
            message: error.message
        });
    }
}

// PATCH : modification partielle
export async function patch(req, res) {
    return update(req, res);
}

// DELETE : supprimer un médecin
export async function remove(req, res) {
    try {
        await service.deleteMedecin(req.params.id);

        res.status(200).json({
            message: "Médecin supprimé avec succès"
        });
    } catch (error) {
        const status = error.message === "Médecin introuvable"
            ? 404
            : 500;

        res.status(status).json({
            message: error.message
        });
    }
}