import pool from "../config/database.js";

// 1. Recherche d'un utilisateur par email (authentification)
export async function findByEmail(email) {
    const [rows] = await pool.query(
        `SELECT id, nom, prenom, email, password, role, statut, created_at
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    return rows[0] || null;
}

// 2. Recherche d'un utilisateur par ID (sans mot de passe)
export async function findById(id) {
    const [rows] = await pool.query(
        `SELECT id, nom, prenom, email, role, statut, created_at
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [id]
    );

    return rows[0] || null;
}

// 3. Liste et recherche des utilisateurs
export async function findAll({
    q,
    role,
    statut,
    limit,
    offset
}) {
    let sql = `
        SELECT id, nom, prenom, email, role, statut, created_at
        FROM users
        WHERE 1=1
    `;

    const params = [];

    if (q) {
        sql += ` AND (
            nom LIKE ?
            OR prenom LIKE ?
            OR email LIKE ?
        )`;

        const recherche = `%${q}%`;

        params.push(recherche, recherche, recherche);
    }

    if (role) {
        sql += " AND role = ?";
        params.push(role);
    }

    if (statut) {
        sql += " AND statut = ?";
        params.push(statut);
    }

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    return rows;
}

// 4. Compter les utilisateurs
export async function countAll({ q, role, statut }) {
    let sql = `
        SELECT COUNT(*) AS total
        FROM users
        WHERE 1=1
    `;

    const params = [];

    if (q) {
        sql += ` AND (
            nom LIKE ?
            OR prenom LIKE ?
            OR email LIKE ?
        )`;

        const recherche = `%${q}%`;

        params.push(recherche, recherche, recherche);
    }

    if (role) {
        sql += " AND role = ?";
        params.push(role);
    }

    if (statut) {
        sql += " AND statut = ?";
        params.push(statut);
    }

    const [rows] = await pool.query(sql, params);

    return Number(rows[0].total);
}

// 5. Création d'un utilisateur
export async function create(data) {
    const [result] = await pool.query(
        `INSERT INTO users
        (nom, prenom, email, password, role, statut)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.nom,
            data.prenom ?? null,
            data.email,
            data.password,
            data.role,
            data.statut ?? "actif"
        ]
    );

    return findById(result.insertId);
}

// 6. Modification d'un utilisateur
export async function update(id, data) {
    await pool.query(
        `UPDATE users
         SET nom = ?,
             prenom = ?,
             email = ?,
             role = ?
         WHERE id = ?`,
        [
            data.nom,
            data.prenom ?? null,
            data.email,
            data.role,
            id
        ]
    );

    return findById(id);
}

// 7. Modification du statut
export async function updateStatus(id, statut) {
    await pool.query(
        `UPDATE users
         SET statut = ?
         WHERE id = ?`,
        [statut, id]
    );

    return findById(id);
}

// 8. Suppression
export async function remove(id) {
    const [result] = await pool.query(
        `DELETE FROM users
         WHERE id = ?`,
        [id]
    );

    return result.affectedRows > 0;
}