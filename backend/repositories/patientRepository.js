import pool from "../config/database.js";

// Trouver un patient par user_id
export async function findByUserId(userId) {
    const [rows] = await pool.query(
        "SELECT * FROM patients WHERE user_id = ?",
        [userId]
    );

    return rows[0];
}

// Créer un profil patient
export async function create(data) {
    const [result] = await pool.query(
        `INSERT INTO patients
        (user_id, date_naissance, sexe, adresse)
        VALUES (?, ?, ?, ?)`,
        [
            data.user_id,
            data.date_naissance,
            data.sexe,
            data.adresse
        ]
    );

    return findByUserId(data.user_id);
}

// Modifier un profil patient
export async function update(userId, data) {
    await pool.query(
        `UPDATE patients
         SET date_naissance = ?,
             sexe = ?,
             adresse = ?
         WHERE user_id = ?`,
        [
            data.date_naissance,
            data.sexe,
            data.adresse,
            userId
        ]
    );

    return findByUserId(userId);
}