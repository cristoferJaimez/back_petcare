const db    = require('../config/db');
const Model = require('../models/cita.model');
const citas = require('../data/citas.data');

const ESTADOS_VALIDOS = ['Programada', 'Confirmada', 'Completada', 'Cancelada'];

const getAll = async (req, res) => {
  try {
    const usuario_id = req.usuario?.id ?? 1;
    const data = db.getStatus()
      ? await Model.getAllByUsuario(usuario_id)
      : citas;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : citas.find(c => c.id === id);
    if (!item) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const b = req.body;
    // Accept both camelCase (frontend) and snake_case; extract integer from 'mas-5' → 5
    const rawId = b.mascota_id ?? b.mascotaId ?? null;
    const mascota_id = rawId ? (Number.parseInt(String(rawId).replace(/\D+/g, ''), 10) || null) : null;
    const { fecha, motivo, profesional } = b;
    const estado = b.estado ?? 'Programada';
    if (!mascota_id || !fecha || !motivo || !profesional) {
      return res.status(400).json({ error: 'mascota_id, fecha, motivo y profesional son requeridos' });
    }
    const item = db.getStatus()
      ? await Model.create({ mascota_id, fecha, motivo, profesional, estado })
      : (() => {
          const nueva = { id: citas.length + 1, mascota_id, mascota_nombre: '', fecha, motivo, profesional, estado };
          citas.push(nueva);
          return nueva;
        })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Cita no encontrada' });
      return res.json(item);
    }
    const index = citas.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cita no encontrada' });
    citas[index] = { ...citas[index], ...req.body };
    res.json(citas[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateEstado = async (req, res) => {
  try {
    const id     = Number.parseInt(req.params.id);
    const { estado } = req.body;
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }
    if (db.getStatus()) {
      const item = await Model.updateEstado(id, estado);
      if (!item) return res.status(404).json({ error: 'Cita no encontrada' });
      return res.json(item);
    }
    const index = citas.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cita no encontrada' });
    citas[index].estado = estado;
    res.json(citas[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Cita eliminada' });
    }
    const index = citas.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cita no encontrada' });
    citas.splice(index, 1);
    res.json({ mensaje: 'Cita eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, updateEstado, remove };
