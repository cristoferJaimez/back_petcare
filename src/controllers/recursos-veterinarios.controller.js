const db      = require('../config/db');
const Model   = require('../models/recurso-veterinario.model');
const recursos = require('../data/recursos-veterinarios.data');

const getAll = async (req, res) => {
  try {
    const { tipo } = req.query;
    let data;
    if (db.getStatus()) {
      data = await Model.getAll(tipo);
    } else {
      data = tipo ? recursos.filter(r => r.tipo === tipo) : recursos;
    }
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const item = db.getStatus()
      ? await Model.getById(id)
      : recursos.find(r => r.id === id);
    if (!item) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const item = db.getStatus()
      ? await Model.create(req.body)
      : (() => { const n = { id: recursos.length + 1, ...req.body }; recursos.push(n); return n; })();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const item = await Model.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Recurso no encontrado' });
      return res.json(item);
    }
    const index = recursos.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Recurso no encontrado' });
    recursos[index] = { ...recursos[index], ...req.body };
    res.json(recursos[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Recurso eliminado' });
    }
    const index = recursos.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Recurso no encontrado' });
    recursos.splice(index, 1);
    res.json({ mensaje: 'Recurso eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };
