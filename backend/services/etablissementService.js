
import * as repository from "../repositories/etablissementRepository.js";

// 1. Récupérer tous les établissements avec filtres
export async function getAll(filters = {}) {
    return await repository.findAll(filters);
}

// 2. Récupérer un établissement par ID
export async function getById(id) {
    const etablissement = await repository.findById(id);

    if (!etablissement) {
        throw new Error("Établissement introuvable");
    }

    return etablissement;
}

// 3. Créer un établissement
export async function create(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Données invalides");
    }

    if (
        !data.nom?.trim() ||
        !data.type?.trim() ||
        !data.adresse?.trim() ||
        !data.ville?.trim()
    ) {
        throw new Error(
            "Le nom, le type, l'adresse et la ville sont obligatoires"
        );
    }

    return await repository.create({
        nom: data.nom.trim(),
        type: data.type.trim(),
        adresse: data.adresse.trim(),
        ville: data.ville.trim(),
        region: data.region?.trim() || null,
        telephone: data.telephone?.trim() || null,
        email: data.email?.trim() || null,
        description: data.description?.trim() || null
    });
}

// 4. Modifier un établissement
export async function update(id, data) {
    const etablissement = await repository.findById(id);

    if (!etablissement) {
        throw new Error("Établissement introuvable");
    }

    if (!data || typeof data !== "object") {
        throw new Error("Données invalides");
    }

    const nom = data.nom ?? etablissement.nom;
    const type = data.type ?? etablissement.type;
    const adresse = data.adresse ?? etablissement.adresse;
    const ville = data.ville ?? etablissement.ville;

    if (
        !nom.trim() ||
        !type.trim() ||
        !adresse.trim() ||
        !ville.trim()
    ) {
        throw new Error("Les champs obligatoires sont manquants");
    }

    return await repository.update(id, {
        nom: nom.trim(),
        type: type.trim(),
        adresse: adresse.trim(),
        ville: ville.trim(),
        region: data.region ?? etablissement.region,
        telephone: data.telephone ?? etablissement.telephone,
        email: data.email ?? etablissement.email,
        description: data.description ?? etablissement.description
    });
}

// 5. Supprimer un établissement
export async function remove(id) {
    const etablissement = await repository.findById(id);

    if (!etablissement) {
        throw new Error("Établissement introuvable");
    }

    return await repository.remove(id);
}
