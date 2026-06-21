const db = require('../config/db');

const SELECT_CITA = `
  SELECT c.id, c.mascota_id, c.fecha, c.motivo, c.profesional, c.estado,
         m.nombre AS mascota_nombre
  FROM citas c
  LEFT JOIN mascotas m ON c.mascota_id = m.id`;

const getAllByUsuario = async (usuario_id) => {
  const [rows] = await db.query(
    `${SELECT_CITA}
     WHERE m.usuario_id = ?
     ORDER BY c.fecha DESC`,
    [usuario_id]
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(`${SELECT_CITA} WHERE c.id = ?`, [id]);
  return rows[0];
};

const create = async ({ mascota_id, fecha, motivo, profesional, estado }) => {
  const [result] = await db.query(
    `INSERT INTO citas (mascota_id, fecha, motivo, profesional, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [mascota_id, fecha, motivo, profesional, estado ?? 'Programada']
  );
  return getById(result.insertId);
};

const update = async (id, { fecha, motivo, profesional, estado }) => {
  await db.query(
    `UPDATE citas SET fecha = ?, motivo = ?, profesional = ?, estado = ? WHERE id = ?`,
    [fecha, motivo, profesional, estado, id]
  );
  return getById(id);
};

const updateEstado = async (id, estado) => {
  await db.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id]);
  return getById(id);
};

const remove = async (id) => {
  await db.query('DELETE FROM citas WHERE id = ?', [id]);
};

module.exports = { getAllByUsuario, getById, create, update, updateEstado, remove };
