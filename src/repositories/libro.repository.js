const pool = require('../config/db');
const Libro = require('../entities/libro.entity');

// Filtros opcionales: q busca en título, autor o género; disponible filtra por estado
const findAll = async ({ q, disponible } = {}) => {
    const condiciones = [];
    const valores = [];

    if (q) {
        valores.push(`%${q}%`);
        condiciones.push(
            `(titulo ILIKE $${valores.length} OR autor ILIKE $${valores.length} OR genero ILIKE $${valores.length})`
        );
    }
    if (disponible !== undefined) {
        valores.push(disponible);
        condiciones.push(`disponible = $${valores.length}`);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
    const { rows } = await pool.query(`SELECT * FROM libros ${where} ORDER BY id`, valores);
    return rows.map(Libro.fromRow);
};

const findById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM libros WHERE id = $1', [id]);
    return Libro.fromRow(rows[0]);
};

const create = async ({ titulo, autor, genero, anio }) => {
    const { rows } = await pool.query(
        `INSERT INTO libros (titulo, autor, genero, anio)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [titulo, autor, genero, anio]
    );
    return Libro.fromRow(rows[0]);
};

const update = async (id, { titulo, autor, genero, anio }) => {
    const { rows } = await pool.query(
        `UPDATE libros
         SET titulo = $1, autor = $2, genero = $3, anio = $4
         WHERE id = $5
         RETURNING *`,
        [titulo, autor, genero, anio, id]
    );
    return Libro.fromRow(rows[0]);
};

const updatePrestamo = async (id, { disponible, prestadoA }) => {
    const { rows } = await pool.query(
        `UPDATE libros
         SET disponible = $1, prestado_a = $2
         WHERE id = $3
         RETURNING *`,
        [disponible, prestadoA, id]
    );
    return Libro.fromRow(rows[0]);
};

const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM libros WHERE id = $1', [id]);
    return rowCount > 0;
};

const stats = async () => {
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE disponible)::int AS disponibles,
                COUNT(*) FILTER (WHERE NOT disponible)::int AS prestados,
                COUNT(DISTINCT genero)::int AS generos
         FROM libros`
    );
    return rows[0];
};

module.exports = { findAll, findById, create, update, updatePrestamo, remove, stats };
