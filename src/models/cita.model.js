const db = require('../config/db');

const getAllByUsuario = async (usuario_id) => {
  const [rows] = await db.query('CALL sp_citas_listar_por_usuario(?)', [usuario_id]);
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_cita_obtener(?)', [id]);
  return rows[0][0];
};

const create = async ({ mascota_id, fecha, motivo, profesional, estado }) => {
  const [rows] = await db.query('CALL sp_cita_crear(?, ?, ?, ?, ?)', [mascota_id, fecha, motivo, profesional, estado ?? 'Programada']);
  return rows[0][0];
};

const update = async (id, { fecha, motivo, profesional, estado }) => {
  const [rows] = await db.query('CALL sp_cita_actualizar(?, ?, ?, ?, ?)', [id, fecha, motivo, profesional, estado]);
  return rows[0][0];
};

const updateEstado = async (id, estado) => {
  const [rows] = await db.query('CALL sp_cita_actualizar_estado(?, ?)', [id, estado]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_cita_eliminar(?)', [id]);
};

module.exports = { getAllByUsuario, getById, create, update, updateEstado, remove };
