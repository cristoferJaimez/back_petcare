const db = require('../config/db');

const SELECT_MASCOTA = `
  SELECT m.id, m.nombre, m.especie, m.edad, m.peso, m.sexo, m.dieta,
         m.vacunacion_al_dia, m.foto_url, m.notas,
         u.nombre AS propietario,
         r.nombre AS raza_nombre
  FROM mascotas m
  LEFT JOIN usuarios u ON m.usuario_id = u.id
  LEFT JOIN razas    r ON m.raza_id    = r.id`;

const getAll = async (usuario_id) => {
  const [rows] = await db.query(`${SELECT_MASCOTA} WHERE m.usuario_id = ? ORDER BY m.id`, [usuario_id]);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(`${SELECT_MASCOTA} WHERE m.id = ?`, [id]);
  return rows[0];
};

const create = async ({ usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia, foto_url, notas }) => {
  const [result] = await db.query(
    `INSERT INTO mascotas (usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia, foto_url, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuario_id, raza_id ?? null, nombre, especie, edad ?? 0, peso ?? null, sexo ?? null, dieta ?? null, vacunacion_al_dia ? 1 : 0, foto_url ?? null, notas ?? null]
  );
  return getById(result.insertId);
};

const update = async (id, { nombre, especie, edad, peso, dieta, vacunacion_al_dia }) => {
  await db.query(
    `UPDATE mascotas
     SET nombre = ?, especie = ?, edad = ?, peso = ?, dieta = ?, vacunacion_al_dia = ?
     WHERE id = ?`,
    [nombre, especie, edad ?? 0, peso ?? null, dieta ?? null, vacunacion_al_dia ? 1 : 0, id]
  );
  return getById(id);
};

const remove = async (id) => {
  await db.query('DELETE FROM mascotas WHERE id = ?', [id]);
};

module.exports = { getAll, getById, create, update, remove };
