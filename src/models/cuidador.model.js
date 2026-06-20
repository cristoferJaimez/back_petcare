const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('CALL sp_cuidadores_listar()');
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_cuidador_obtener(?)', [id]);
  return rows[0][0];
};

const create = async ({ nombre, rol, ciudad, calificacion, experiencia_anios, descripcion, telefono, whatsapp, foto_url }) => {
  const [rows] = await db.query('CALL sp_cuidador_crear(?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, rol, ciudad, calificacion, experiencia_anios, descripcion, telefono, whatsapp, foto_url]);
  return rows[0][0];
};

const update = async (id, { nombre, rol, ciudad, calificacion }) => {
  const [rows] = await db.query('CALL sp_cuidador_actualizar(?, ?, ?, ?, ?)', [id, nombre, rol, ciudad, calificacion]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_cuidador_eliminar(?)', [id]);
};

module.exports = { getAll, getById, create, update, remove };
