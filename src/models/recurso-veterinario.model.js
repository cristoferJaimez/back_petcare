const db = require('../config/db');

const getAll = async (tipo) => {
  const [rows] = await db.query('CALL sp_recursos_listar(?)', [tipo ?? null]);
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_recurso_obtener(?)', [id]);
  return rows[0][0];
};

const create = async ({ nombre, descripcion, tipo, url_externo }) => {
  const [rows] = await db.query('CALL sp_recurso_crear(?, ?, ?, ?)', [nombre, descripcion, tipo, url_externo]);
  return rows[0][0];
};

const update = async (id, { nombre, descripcion }) => {
  const [rows] = await db.query('CALL sp_recurso_actualizar(?, ?, ?)', [id, nombre, descripcion]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_recurso_eliminar(?)', [id]);
};

module.exports = { getAll, getById, create, update, remove };
