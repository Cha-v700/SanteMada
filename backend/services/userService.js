import * as repository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

// Rôles autorisés
const ROLES = ["admin", "medecin", "patient"];

// Statuts autorisés
const STATUTS = ["actif", "inactif"];

// Vérifier un ID
function validateId(id) {
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        throw new Error("Identifiant invalide");
    }

    return parsedId;
}

// Vérifier un email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !regex.test(email)) {
        throw new Error("Email invalide");
    }
}

// 1. Lister les utilisateurs
export async function getAllUsers({
    q,
    role,
    statut,
    page = 1,
    limit = 10
}) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        throw new Error("Page invalide");
    }

    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
    ) {
        throw new Error("La limite doit être comprise entre 1 et 100");
    }

    if (role && !ROLES.includes(role)) {
        throw new Error("Rôle invalide");
    }

    if (statut && !STATUTS.includes(statut)) {
        throw new Error("Statut invalide");
    }

    const filters = {
        q: q?.trim() || "",
        role,
        statut
    };

    const offset = (parsedPage - 1) * parsedLimit;

    const users = await repository.findAll({
        ...filters,
        limit: parsedLimit,
        offset
    });

    const total = await repository.countAll(filters);

    return {
        data: users,
        pagination: {
            total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(total / parsedLimit)
        }
    };
}

// 2. Obtenir un utilisateur par ID
export async function getUserById(id) {
    const parsedId = validateId(id);

    const user = await repository.findById(parsedId);

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    return user;
}

// 3. Créer un utilisateur
export async function createUser(data) {
    const nom = data.nom?.trim();
    const prenom = data.prenom?.trim() || null;
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const role = data.role || "patient";
    const statut = data.statut || "actif";

    if (!nom) {
        throw new Error("Le nom est obligatoire");
    }

    validateEmail(email);

    if (!password || password.length < 12) {
        throw new Error(
            "Le mot de passe doit contenir au moins 12 caractères"
        );
    }

    if (!ROLES.includes(role)) {
        throw new Error("Rôle invalide");
    }

    if (!STATUTS.includes(statut)) {
        throw new Error("Statut invalide");
    }

    const existingUser = await repository.findByEmail(email);

    if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return repository.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        statut
    });
}

// 4. Modifier un utilisateur
export async function updateUser(id, data) {
    const parsedId = validateId(id);

    const existingUser = await repository.findById(parsedId);

    if (!existingUser) {
        throw new Error("Utilisateur introuvable");
    }

    const nom = data.nom?.trim();
    const prenom = data.prenom?.trim() || null;
    const email = data.email?.trim().toLowerCase();
    const role = data.role;

    if (!nom) {
        throw new Error("Le nom est obligatoire");
    }

    validateEmail(email);

    if (!ROLES.includes(role)) {
        throw new Error("Rôle invalide");
    }

    const userWithEmail = await repository.findByEmail(email);

    if (userWithEmail && Number(userWithEmail.id) !== parsedId) {
        throw new Error("Cet email est déjà utilisé");
    }

    return repository.update(parsedId, {
        nom,
        prenom,
        email,
        role
    });
}

// 5. Modifier le statut d'un utilisateur
export async function changeUserStatus(id, statut, actorId) {
    const parsedId = validateId(id);

    if (!STATUTS.includes(statut)) {
        throw new Error("Statut invalide");
    }

    if (Number(actorId) === parsedId && statut === "inactif") {
        throw new Error("Vous ne pouvez pas désactiver votre propre compte");
    }

    const user = await repository.findById(parsedId);

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    return repository.updateStatus(parsedId, statut);
}

// 6. Supprimer un utilisateur
export async function deleteUser(id, actorId) {
    const parsedId = validateId(id);

    if (Number(actorId) === parsedId) {
        throw new Error("Vous ne pouvez pas supprimer votre propre compte");
    }

    const user = await repository.findById(parsedId);

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    return repository.remove(parsedId);
}