const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM cuidadores ORDER BY id');
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM cuidadores WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ nombre, rol, ciudad, calificacion, experiencia_anios, descripcion, telefono, whatsapp, foto_url }) => {
  const [result] = await db.query(
    `INSERT INTO cuidadores (nombre, rol, ciudad, calificacion, experiencia_anios, descripcion, telefono, whatsapp, foto_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, rol ?? null, ciudad ?? null, calificacion ?? null, experiencia_anios ?? null, descripcion ?? null, telefono ?? null, whatsapp ?? null, foto_url ?? null]
  );
  return getById(result.insertId);
};

const update = async (id, { nombre, rol, ciudad, calificacion }) => {
  await db.query(
    'UPDATE cuidadores SET nombre = ?, rol = ?, ciudad = ?, calificacion = ? WHERE id = ?',
    [nombre, rol ?? null, ciudad ?? null, calificacion ?? null, id]
  );
  return getById(id);
};

const remove = async (id) => {
  await db.query('DELETE FROM cuidadores WHERE id = ?', [id]);
};

module.exports = { getAll, getById, create, update, remove };
