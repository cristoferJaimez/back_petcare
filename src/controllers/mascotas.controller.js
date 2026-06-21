const db          = require('../config/db');
const Model       = require('../models/mascota.model');
const mascotas    = require('../data/mascotas.data');

const getAll = async (req, res) => {
  try {
    if (!db.getStatus()) return res.json(mascotas);
    const data = await Model.getAll(req.usuario.id);
    if (!data.length) return res.json(data);
    const ids = data.map(m => m.id);
    const [asignaciones] = await db.query(
      `SELECT mc.mascota_id, c.nombre AS cuidador_nombre, c.ciudad AS cuidador_ciudad
       FROM mascotas_cuidadores mc
       JOIN cuidadores c ON mc.cuidador_id = c.id
       WHERE mc.mascota_id IN (${ids.map(() => '?').join(',')})`,
      ids
    );
    const asignMap = {};
    asignaciones.forEach(a => { asignMap[a.mascota_id] = a; });
    const enriched = data.map(m => ({
      ...m,
      cuidador_nombre: asignMap[m.id]?.cuidador_nombre ?? null,
      cuidador_ciudad: asignMap[m.id]?.cuidador_ciudad ?? null
    }));
    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id).replace(/\D+/g, ''), 10);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    if (!db.getStatus()) {
      const item = mascotas.find(m => m.id === id);
      if (!item) return res.status(404).json({ error: 'Mascota no encontrada' });
      return res.json(item);
    }
    const item = await Model.getById(id);
    if (!item) return res.status(404).json({ error: 'Mascota no encontrada' });
    const [[cuidadorRow]] = await db.query(
      `SELECT c.nombre AS cuidador_nombre, c.ciudad AS cuidador_ciudad
       FROM mascotas_cuidadores mc
       JOIN cuidadores c ON mc.cuidador_id = c.id
       WHERE mc.mascota_id = ? LIMIT 1`,
      [id]
    );
    res.json({
      ...item,
      cuidador_nombre: cuidadorRow?.cuidador_nombre ?? null,
      cuidador_ciudad: cuidadorRow?.cuidador_ciudad ?? null
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const b = req.body;
    const payload = {
      usuario_id:       req.usuario.id,
      raza_id:          b.raza_id ?? null,
      nombre:           b.nombre,
      especie:          (b.especie ?? '').toLowerCase(),
      edad:             b.edad ?? 0,
      peso:             b.peso ?? b.pesoKg ?? null,
      sexo:             b.sexo ? b.sexo.toLowerCase() : null,
      dieta:            b.dieta ?? null,
      vacunacion_al_dia: b.vacunacion_al_dia ?? b.vacunacionAlDia ?? false,
      foto_url:         b.foto_url ?? b.fotoUrl ?? null,
      notas:            b.notas ?? null
    };
    const item = db.getStatus()
      ? await Model.create(payload)
      : (() => { const n = { id: mascotas.length + 1, ...b }; mascotas.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id).replace(/\D+/g, ''), 10);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Mascota no encontrada' });
      return res.json(item);
    }
    const index = mascotas.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Mascota no encontrada' });
    mascotas[index] = { ...mascotas[index], ...req.body };
    res.json(mascotas[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id).replace(/\D+/g, ''), 10);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Mascota eliminada' });
    }
    const index = mascotas.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Mascota no encontrada' });
    mascotas.splice(index, 1);
    res.json({ mensaje: 'Mascota eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };
