const db          = require('../config/db');
const Model       = require('../models/mascota.model');
const mascotas    = require('../data/mascotas.data');

const getAll = async (req, res) => {
  try {
    const data = db.getStatus() ? await Model.getAll() : mascotas;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : mascotas.find(m => m.id === id);
    if (!item) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const item = db.getStatus()
      ? await Model.create(req.body)
      : (() => { const n = { id: mascotas.length + 1, ...req.body }; mascotas.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
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
    const id = Number.parseInt(req.params.id);
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
