const db = require('../config/db');

const getAll = async (usuario_id) => {
  const [rows] = await db.query('CALL sp_mascotas_listar(?)', [usuario_id]);
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_mascota_obtener(?)', [id]);
  return rows[0][0];
};

const create = async ({ usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia, foto_url }) => {
  const [rows] = await db.query('CALL sp_mascota_crear(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia ?? 0, foto_url]);
  return rows[0][0];
};

const update = async (id, { nombre, especie, edad, peso, dieta, vacunacion_al_dia }) => {
  const [rows] = await db.query('CALL sp_mascota_actualizar(?, ?, ?, ?, ?, ?, ?)', [id, nombre, especie, edad, peso, dieta, vacunacion_al_dia]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_mascota_eliminar(?)', [id]);
};

module.exports = { getAll, getById, create, update, remove };
