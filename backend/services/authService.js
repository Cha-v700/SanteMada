import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repository from "../repositories/userRepository.js";

// Inscription
export async function register(data) {
    const nom = data.nom?.trim();
    const prenom = data.prenom?.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!nom || !prenom || !email || !password) {
        throw new Error("Tous les champs obligatoires doivent être remplis");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Format d'email invalide");
    }

    if (password.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }

    const existingUser = await repository.findByEmail(email);
    if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Inscription publique : rôle patient uniquement
    const userId = await repository.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: "patient"
    });

    return await repository.findById(userId);
}

// Connexion
export async function login(data) {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
        throw new Error("Email et mot de passe obligatoires");
    }

    const user = await repository.findByEmail(email);
    if (!user) {
        throw new Error("Identifiants incorrects");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        throw new Error("Identifiants incorrects");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("Configuration serveur invalide : JWT_SECRET manquant");
    }

    const token = jwt.sign(
        {
            sub: String(user.id),
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );

    return {
        user: {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
        },
        token
    };
}
