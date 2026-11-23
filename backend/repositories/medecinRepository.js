export async function findAll({ ville, specialite, limit, offset }) {
    let sql = "SELECT * FROM medecins WHERE 1=1";
    const params = [];

    if (ville) {
        sql += " AND ville LIKE ?";
        params.push(`%${ville}%`);
    }

    if (specialite) {
        sql += " AND specialite LIKE ?";
        params.push(`%${specialite}%`);
    }

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";

    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);

    return rows;
}

export async function countAll({ ville, specialite }) {
    let sql = "SELECT COUNT(*) AS total FROM medecins WHERE 1=1";
    const params = [];

    if (ville) {
        sql += " AND ville LIKE ?";
        params.push(`%${ville}%`);
    }

    if (specialite) {
        sql += " AND specialite LIKE ?";
        params.push(`%${specialite}%`);
    }

    const [rows] = await pool.query(sql, params);

    return rows[0].total;
}