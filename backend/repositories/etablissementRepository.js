
import pool from "../config/database.js";

// 1. Récupérer tous les établissements avec filtres
export async function findAll(filters = {}) {
    let sql = "SELECT * FROM etablissements WHERE 1=1";
    const params = [];

    // Recherche par nom
    if (filters.nom) {
        sql += " AND nom LIKE ?";
        params.push(`%${filters.nom}%`);
    }

    // Recherche par ville
    if (filters.ville) {
        sql += " AND ville LIKE ?";
        params.push(`%${filters.ville}%`);
    }

    // Recherche par type
    if (filters.type) {
        sql += " AND type LIKE ?";
        params.push(`%${filters.type}%`);
    }

    // Recherche par région
    if (filters.region) {
        sql += " AND region LIKE ?";
        params.push(`%${filters.region}%`);
    }

    // Recherche par statut
    if (filters.statut) {
        sql += " AND statut = ?";
        params.push(filters.statut);
    }

    // Trier du plus récent au plus ancien
    sql += " ORDER BY id DESC";

    const [rows] = await pool.query(sql, params);

    return rows;
}

// 2. Récupérer un établissement par ID
export async function findById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM etablissements WHERE id = ?",
        [id]
    );

    return rows[0] || null;
}

// 3. Créer un établissement
export async function create(data) {
    const [result] = await pool.query(
        `INSERT INTO etablissements
        (nom, type, adresse, ville, region, telephone, email, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.nom,
            data.type,
            data.adresse,
            data.ville,
            data.region || null,
            data.telephone || null,
            data.email || null,
            data.description || null
        ]
    );

    return findById(result.insertId);
}

// 4. Modifier un établissement
export async function update(id, data) {
    await pool.query(
        `UPDATE etablissements SET
            nom = ?,
            type = ?,
            adresse = ?,
            ville = ?,
            region = ?,
            telephone = ?,
            email = ?,
            description = ?
        WHERE id = ?`,
        [
            data.nom,
            data.type,
            data.adresse,
            data.ville,
            data.region || null,
            data.telephone || null,
            data.email || null,
            data.description || null,
            id
        ]
    );

    return findById(id);
}

// 5. Supprimer un établissement
export async function remove(id) {
    const [result] = await pool.query(
        "DELETE FROM etablissements WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
}
