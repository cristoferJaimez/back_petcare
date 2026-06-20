const db = require('../config/db');

const getAll = async (tipo) => {
  const [rows] = await db.query('CALL sp_razas_listar(?)', [tipo ?? null]);
  return rows[0];
};

const getById = async (id) => {
  const [rows] = await db.query('CALL sp_raza_obtener(?)', [id]);
  return rows[0][0];
};

const getRecomendaciones = async (raza_id) => {
  const [rows] = await db.query('CALL sp_raza_recomendaciones(?)', [raza_id]);
  return rows[0];
};

const create = async ({ nombre, tipo_animal, tamanio, esperanza_vida, nivel_ejercicio, descripcion, imagen_url }) => {
  const [rows] = await db.query('CALL sp_raza_crear(?, ?, ?, ?, ?, ?, ?)', [nombre, tipo_animal, tamanio, esperanza_vida, nivel_ejercicio, descripcion, imagen_url]);
  return rows[0][0];
};

const update = async (id, { nombre, descripcion }) => {
  const [rows] = await db.query('CALL sp_raza_actualizar(?, ?, ?)', [id, nombre, descripcion]);
  return rows[0][0];
};

const remove = async (id) => {
  await db.query('CALL sp_raza_eliminar(?)', [id]);
};

module.exports = { getAll, getById, getRecomendaciones, create, update, remove };
