const db        = require('../config/db');
const Model     = require('../models/tutorial.model');
const tutoriales = require('../data/tutoriales.data');

const getAll = async (req, res) => {
  try {
    const { nivel } = req.query;
    let data;
    if (db.getStatus()) {
      data = await Model.getAll(nivel);
    } else {
      data = nivel ? tutoriales.filter(t => t.nivel_dificultad === nivel) : tutoriales;
    }
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : tutoriales.find(t => t.id === id);
    if (!item) return res.status(404).json({ error: 'Tutorial no encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const item = db.getStatus()
      ? await Model.create(req.body)
      : (() => { const n = { id: tutoriales.length + 1, ...req.body }; tutoriales.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Tutorial no encontrado' });
      return res.json(item);
    }
    const index = tutoriales.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Tutorial no encontrado' });
    tutoriales[index] = { ...tutoriales[index], ...req.body };
    res.json(tutoriales[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Tutorial eliminado' });
    }
    const index = tutoriales.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Tutorial no encontrado' });
    tutoriales.splice(index, 1);
    res.json({ mensaje: 'Tutorial eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };
