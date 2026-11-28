
import * as repository from "../repositories/medecinRepository.js";

// 1. Liste des médecins
export async function getAllMedecins({
    ville,
    specialite,
    statut,
    q,
    page = 1,
    limit = 10
}) {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("La page doit être un entier positif");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new Error("La limite doit être comprise entre 1 et 100");
    }

    if (statut && !["actif", "inactif"].includes(statut)) {
        throw new Error("Statut invalide");
    }

    const offset = (page - 1) * limit;

    const filtres = {
        ville,
        specialite,
        statut,
        q
    };

    const medecins = await repository.findAll({
        ...filtres,
        limit,
        offset
    });

    const total = await repository.countAll(filtres);

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

// 2. Médecin par ID
export async function getMedecinById(id) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    return medecin;
}

// 3. Création
export async function createMedecin(data) {
    if (!data.nom || !data.prenom || !data.specialite) {
        throw new Error(
            "Nom, prénom et spécialité sont obligatoires"
        );
    }

    if (data.sexe && !["Masculin", "Feminin", "Autre"].includes(data.sexe)) {
        throw new Error("Sexe invalide");
    }

    if (data.statut && !["actif", "inactif"].includes(data.statut)) {
        throw new Error("Statut invalide");
    }

    if (
        data.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        throw new Error("Adresse email invalide");
    }

    return repository.create({
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        sexe: data.sexe ?? null,
        specialite: data.specialite.trim(),
        telephone: data.telephone ?? null,
        email: data.email ?? null,
        ville: data.ville ?? null,
        numero_ordre: data.numero_ordre ?? null,
        etablissement_id: data.etablissement_id ?? null,
        statut: data.statut ?? "actif"
    });
}

// 4. Modification
export async function updateMedecin(id, data) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    const updatedData = {
        nom: data.nom ?? medecin.nom,
        prenom: data.prenom ?? medecin.prenom,
        sexe: data.sexe ?? medecin.sexe,
        specialite: data.specialite ?? medecin.specialite,
        telephone: data.telephone ?? medecin.telephone,
        email: data.email ?? medecin.email,
        ville: data.ville ?? medecin.ville,
        numero_ordre: data.numero_ordre ?? medecin.numero_ordre,
        etablissement_id: data.etablissement_id ?? medecin.etablissement_id,
        statut: data.statut ?? medecin.statut
    };

    if (!updatedData.nom || !updatedData.prenom || !updatedData.specialite) {
        throw new Error("Nom, prénom et spécialité obligatoires");
    }

    if (
        updatedData.sexe &&
        !["Masculin", "Feminin", "Autre"].includes(updatedData.sexe)
    ) {
        throw new Error("Sexe invalide");
    }

    if (!["actif", "inactif"].includes(updatedData.statut)) {
        throw new Error("Statut invalide");
    }

    if (
        updatedData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedData.email)
    ) {
        throw new Error("Adresse email invalide");
    }

    return repository.update(id, updatedData);
}

// 5. Suppression
export async function deleteMedecin(id) {
    const medecin = await repository.findById(id);

    if (!medecin) {
        throw new Error("Médecin introuvable");
    }

    return repository.remove(id);
}
