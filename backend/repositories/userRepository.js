import pool from "../config/database.js";

// Trouver un utilisateur par email
export async function findByEmail(email) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
}

// Créer un utilisateur
export async function create(data) {
    const [result] = await pool.query(
        `INSERT INTO users
        (nom, prenom, email, password, role)
        VALUES (?, ?, ?, ?, ?)`,
        [
            data.nom,
            data.prenom,
            data.email,
            data.password,
            data.role
        ]
    );

    return result.insertId;
}

// Trouver un utilisateur par ID
export async function findById(id) {
    const [rows] = await pool.query(
        `SELECT id, nom, prenom, email, role, created_at
         FROM users WHERE id = ?`,
        [id]
    );

    return rows[0];
}