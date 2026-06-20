const db         = require('../config/db');
const Model      = require('../models/cuidador.model');
const cuidadores = require('../data/cuidadores.data');

const getAll = async (req, res) => {
  try {
    const data = db.getStatus() ? await Model.getAll() : cuidadores;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : cuidadores.find(c => c.id === id);
    if (!item) return res.status(404).json({ error: 'Cuidador no encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const item = db.getStatus()
      ? await Model.create(req.body)
      : (() => { const n = { id: cuidadores.length + 1, ...req.body }; cuidadores.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Cuidador no encontrado' });
      return res.json(item);
    }
    const index = cuidadores.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cuidador no encontrado' });
    cuidadores[index] = { ...cuidadores[index], ...req.body };
    res.json(cuidadores[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Cuidador eliminado' });
    }
    const index = cuidadores.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cuidador no encontrado' });
    cuidadores.splice(index, 1);
    res.json({ mensaje: 'Cuidador eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };
