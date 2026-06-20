const db = require('../config/db');

const getAll = async (nivel) => {
  const [rows] = await db.query('CALL sp_tutoriales_listar(?)', [nivel ?? null]);
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_tutorial_obtener(?)', [id]);
  return rows[0][0];
};

const create = async ({ titulo, descripcion, duracion_min, nivel_dificultad, url_externo, thumbnail_url }) => {
  const [rows] = await db.query('CALL sp_tutorial_crear(?, ?, ?, ?, ?, ?)', [titulo, descripcion, duracion_min, nivel_dificultad, url_externo, thumbnail_url]);
  return rows[0][0];
};

const update = async (id, { titulo, descripcion, duracion_min }) => {
  const [rows] = await db.query('CALL sp_tutorial_actualizar(?, ?, ?, ?)', [id, titulo, descripcion, duracion_min]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_tutorial_eliminar(?)', [id]);
};

module.exports = { getAll, getById, create, update, remove };
