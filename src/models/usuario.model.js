const db = require('../config/db');

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_usuario_obtener(?)', [id]);
  return rows[0][0];
};

const getByEmail = async (email) => {
  const [rows] = await db.query('CALL sp_usuario_obtener_por_email(?)', [email]);
  return rows[0][0];
};

const create = async ({ nombre, email, password_hash, es_invitado = 0 }) => {
  const [rows] = await db.query('CALL sp_usuario_crear(?, ?, ?, ?)', [nombre, email, password_hash, es_invitado]);
  return rows[0][0];
};

const update = async (id, { nombre, email }) => {
  const [rows] = await db.query('CALL sp_usuario_actualizar(?, ?, ?)', [id, nombre, email]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_usuario_eliminar(?)', [id]);
};

module.exports = { getById, getByEmail, create, update, remove };
