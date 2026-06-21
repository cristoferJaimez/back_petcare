const db = require('../config/db');

const listarMascotasConCuidadores = async (req, res) => {
  try {
    if (!db.getStatus()) {
      return res.json([]);
    }
    const [mascotas] = await db.query(
      'SELECT m.id, m.nombre, m.especie, u.nombre AS propietario FROM mascotas m JOIN usuarios u ON m.usuario_id = u.id ORDER BY m.id'
    );
    const [asignaciones] = await db.query(
      'SELECT mc.mascota_id, c.id AS cuidador_id, c.nombre, c.rol FROM mascotas_cuidadores mc JOIN cuidadores c ON mc.cuidador_id = c.id'
    );
    const resultado = mascotas.map(m => ({
      ...m,
      cuidadores: asignaciones.filter(a => a.mascota_id === m.id)
    }));
    res.json(resultado);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const listarCuidadores = async (req, res) => {
  try {
    if (!db.getStatus()) return res.json([]);
    const [rows] = await db.query('SELECT id, nombre, rol, ciudad, disponible FROM cuidadores ORDER BY nombre');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const asignarCuidador = async (req, res) => {
  try {
    const mascotaId  = Number.parseInt(req.params.id);
    const cuidadorId = Number.parseInt(req.body.cuidador_id);
    if (!mascotaId || !cuidadorId) return res.status(400).json({ error: 'mascota_id y cuidador_id son requeridos' });
    if (!db.getStatus()) return res.status(503).json({ error: 'Base de datos no disponible' });
    await db.query(
      'INSERT IGNORE INTO mascotas_cuidadores (mascota_id, cuidador_id, fecha_asignacion) VALUES (?, ?, CURDATE())',
      [mascotaId, cuidadorId]
    );
    res.status(201).json({ mensaje: 'Cuidador asignado correctamente' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const desasignarCuidador = async (req, res) => {
  try {
    const mascotaId  = Number.parseInt(req.params.id);
    const cuidadorId = Number.parseInt(req.params.cuidadorId);
    if (!db.getStatus()) return res.status(503).json({ error: 'Base de datos no disponible' });
    await db.query(
      'DELETE FROM mascotas_cuidadores WHERE mascota_id = ? AND cuidador_id = ?',
      [mascotaId, cuidadorId]
    );
    res.json({ mensaje: 'Cuidador desasignado correctamente' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { listarMascotasConCuidadores, listarCuidadores, asignarCuidador, desasignarCuidador };
