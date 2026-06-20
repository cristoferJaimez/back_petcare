const db                       = require('../config/db');
const Model                    = require('../models/raza.model');
const { razas, recomendaciones } = require('../data/razas.data');

const getAll = async (req, res) => {
  try {
    const { tipo } = req.query;
    let data;
    if (db.getStatus()) {
      data = await Model.getAll(tipo);
    } else {
      data = tipo ? razas.filter(r => r.tipo_animal === tipo) : razas;
    }
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : razas.find(r => r.id === id);
    if (!item) return res.status(404).json({ error: 'Raza no encontrada' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getRecomendaciones = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const raza = db.getStatus() ? await Model.getById(id) : razas.find(r => r.id === id);
    if (!raza) return res.status(404).json({ error: 'Raza no encontrada' });
    const data = db.getStatus()
      ? await Model.getRecomendaciones(id)
      : recomendaciones.filter(r => r.raza_id === id);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const item = db.getStatus()
      ? await Model.create(req.body)
      : (() => { const n = { id: razas.length + 1, ...req.body }; razas.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Raza no encontrada' });
      return res.json(item);
    }
    const index = razas.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Raza no encontrada' });
    razas[index] = { ...razas[index], ...req.body };
    res.json(razas[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Raza eliminada' });
    }
    const index = razas.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Raza no encontrada' });
    razas.splice(index, 1);
    res.json({ mensaje: 'Raza eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, getRecomendaciones, create, update, remove };
