import * as service from "../services/medecinService.js";

// 1. Afficher la liste des médecins
export async function getAll(req, res) {
    try {
        const result = await service.getAllMedecins({
            ville: req.query.ville,
            specialite: req.query.specialite,
            statut: req.query.statut,
            q: req.query.q,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// 2. Afficher un médecin par ID
export async function getById(req, res) {
    try {
        const medecin = await service.getMedecinById(req.params.id);

        if (!medecin) {
            return res.status(404).json({
                message: "Médecin introuvable"
            });
        }

        return res.status(200).json(medecin);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// 3. Ajouter un médecin
export async function create(req, res) {
    try {
        const medecin = await service.createMedecin(req.body);

        return res.status(201).json({
            message: "Médecin créé avec succès",
            medecin
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Cette information existe déjà"
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                message: "Établissement invalide"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
}

// 4. Modifier un médecin
export async function update(req, res) {
    try {
        const medecin = await service.updateMedecin(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Médecin modifié avec succès",
            medecin
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Cette information existe déjà"
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                message: "Établissement invalide"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
}

// 5. Supprimer un médecin
export async function remove(req, res) {
    try {
        const deleted = await service.deleteMedecin(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Médecin introuvable"
            });
        }

        return res.status(200).json({
            message: "Médecin supprimé avec succès"
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}