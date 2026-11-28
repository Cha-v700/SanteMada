import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "../config/database.js";

dotenv.config();

async function createAdmin() {
    const nom = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!nom || !email || !password) {
        throw new Error(
            "ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD sont requis"
        );
    }

    if (password.length < 12) {
        throw new Error(
            "Le mot de passe administrateur doit contenir au moins 12 caractères"
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [normalizedEmail]
    );

    if (existingUsers.length > 0) {
        throw new Error("Cet email existe déjà.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
        `INSERT INTO users (nom, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [nom.trim(), normalizedEmail, hashedPassword, "admin"]
    );

    console.log("Administrateur créé avec succès.");
}

try {
    await createAdmin();
} catch (error) {
    console.error("Erreur :", error.message);
} finally {
    await pool.end();
}