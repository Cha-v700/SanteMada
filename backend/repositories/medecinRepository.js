
import pool from "../config/database.js";

// 1. Liste avec recherche, filtres et pagination
export async function findAll({
    ville,
    specialite,
    statut,
    q,
    limit,
    offset
}) {
    let sql = `
        SELECT 
            m.*,
            e.nom AS nom_etablissement
        FROM medecins m
        LEFT JOIN etablissements e
            ON m.etablissement_id = e.id
        WHERE 1=1
    `;

    const params = [];

    if (ville) {
        sql += " AND m.ville LIKE ?";
        params.push(`%${ville}%`);
    }

    if (specialite) {
        sql += " AND m.specialite LIKE ?";
        params.push(`%${specialite}%`);
    }

    if (statut) {
        sql += " AND m.statut = ?";
        params.push(statut);
    }

    if (q) {
        sql += ` AND (
            m.nom LIKE ?
            OR m.prenom LIKE ?
            OR m.telephone LIKE ?
            OR m.email LIKE ?
            OR m.numero_ordre LIKE ?
        )`;

        const recherche = `%${q}%`;

        params.push(
            recherche,
            recherche,
            recherche,
            recherche,
            recherche
        );
    }

    sql += " ORDER BY m.id DESC LIMIT ? OFFSET ?";

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    return rows;
}

// 2. Compter les médecins avec les mêmes filtres
export async function countAll({
    ville,
    specialite,
    statut,
    q
}) {
    let sql = `
        SELECT COUNT(*) AS total
        FROM medecins m
        WHERE 1=1
    `;

    const params = [];

    if (ville) {
        sql += " AND m.ville LIKE ?";
        params.push(`%${ville}%`);
    }

    if (specialite) {
        sql += " AND m.specialite LIKE ?";
        params.push(`%${specialite}%`);
    }

    if (statut) {
        sql += " AND m.statut = ?";
        params.push(statut);
    }

    if (q) {
        sql += ` AND (
            m.nom LIKE ?
            OR m.prenom LIKE ?
            OR m.telephone LIKE ?
            OR m.email LIKE ?
            OR m.numero_ordre LIKE ?
        )`;

        const recherche = `%${q}%`;

        params.push(
            recherche,
            recherche,
            recherche,
            recherche,
            recherche
        );
    }

    const [rows] = await pool.query(sql, params);

    return Number(rows[0].total);
}

// 3. Recherche par ID
export async function findById(id) {
    const sql = `
        SELECT 
            m.*,
            e.nom AS nom_etablissement
        FROM medecins m
        LEFT JOIN etablissements e
            ON m.etablissement_id = e.id
        WHERE m.id = ?
    `;

    const [rows] = await pool.query(sql, [id]);

    return rows[0] || null;
}

// 4. Création
export async function create(data) {
    const sql = `
        INSERT INTO medecins (
            nom,
            prenom,
            sexe,
            specialite,
            telephone,
            email,
            ville,
            numero_ordre,
            etablissement_id,
            statut
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        data.nom,
        data.prenom,
        data.sexe ?? null,
        data.specialite,
        data.telephone ?? null,
        data.email ?? null,
        data.ville ?? null,
        data.numero_ordre ?? null,
        data.etablissement_id ?? null,
        data.statut ?? "actif"
    ];

    const [result] = await pool.query(sql, params);

    return findById(result.insertId);
}

// 5. Modification
export async function update(id, data) {
    const sql = `
        UPDATE medecins SET
            nom = ?,
            prenom = ?,
            sexe = ?,
            specialite = ?,
            telephone = ?,
            email = ?,
            ville = ?,
            numero_ordre = ?,
            etablissement_id = ?,
            statut = ?
        WHERE id = ?
    `;

    const params = [
        data.nom,
        data.prenom,
        data.sexe ?? null,
        data.specialite,
        data.telephone ?? null,
        data.email ?? null,
        data.ville ?? null,
        data.numero_ordre ?? null,
        data.etablissement_id ?? null,
        data.statut ?? "actif",
        id
    ];

    await pool.query(sql, params);

    return findById(id);
}

// 6. Suppression
export async function remove(id) {
    const sql = "DELETE FROM medecins WHERE id = ?";

    const [result] = await pool.query(sql, [id]);

    return result.affectedRows > 0;
}
