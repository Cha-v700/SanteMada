import * as repository from "../repositories/medecinRepository.js";

// Récupérer tous les médecins

export async function getAllMedecins({ ville, specialite, page, limit }) {
    const offset = (page - 1) * limit;

    const medecins = await repository.findAll({
        ville,
        specialite,
        limit,
        offset
    });

    const total = await repository.countAll({
        ville,
        specialite
    });

    return {
        data: medecins,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

// Récupérer un médecin par ID
export async function getMedecinById(id) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    return medecin;
}

// Créer un médecin
export async function createMedecin(data) {
    if (!data.nom || !data.prenom || !data.specialite) {
        throw new Error("Nom, prénom et spécialité obligatoires");
    }

    return await repository.create({
        nom: data.nom,
        prenom: data.prenom,
        specialite: data.specialite,
        telephone: data.telephone ?? null,
        email: data.email ?? null,
        ville: data.ville ?? null
    });
}

// Modifier un médecin
export async function updateMedecin(id, data) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    const updatedData = {
        nom: data.nom ?? medecin.nom,
        prenom: data.prenom ?? medecin.prenom,
        specialite: data.specialite ?? medecin.specialite,
        telephone: data.telephone ?? medecin.telephone,
        email: data.email ?? medecin.email,
        ville: data.ville ?? medecin.ville
    };

    return await repository.update(id, updatedData);
}

// Supprimer un médecin
export async function deleteMedecin(id) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    return await repository.remove(id);
}