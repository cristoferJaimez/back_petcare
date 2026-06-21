const jwt           = require('jsonwebtoken');
const db            = require('../config/db');
const Model         = require('../models/usuario.model');
const usuarios      = require('../data/usuarios.data');
const refreshTokens = require('../data/refresh-tokens.data');

const generarTokens = (payload) => {
  const access_token  = jwt.sign(payload, process.env.JWT_SECRET,        { expiresIn: process.env.JWT_EXPIRES_IN });
  const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
  return { access_token, refresh_token };
};

const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (db.getStatus()) {
      const existe = await Model.getByEmail(email);
      if (existe) return res.status(400).json({ error: 'El email ya está registrado' });
      const nuevo = await Model.create({ nombre, email, password_hash: password });
      return res.status(201).json(nuevo);
    }
    if (usuarios.some(u => u.email === email))
      return res.status(400).json({ error: 'El email ya está registrado' });
    const nuevo = { id: usuarios.length + 1, nombre, email, password_hash: password, es_invitado: false };
    usuarios.push(nuevo);
    const { password_hash, ...datos } = nuevo;
    res.status(201).json(datos);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let usuario;
    if (db.getStatus()) {
      usuario = await Model.getByEmail(email);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado', code: 'USER_NOT_FOUND' });
      }

      if (usuario.password_hash !== password) {
        return res.status(401).json({ error: 'Contraseña incorrecta', code: 'INVALID_PASSWORD' });
      }
    } else {
      usuario = usuarios.find(u => u.email === email);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado', code: 'USER_NOT_FOUND' });
      }

      if (usuario.password_hash !== password) {
        return res.status(401).json({ error: 'Contraseña incorrecta', code: 'INVALID_PASSWORD' });
      }
    }
    const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol ?? 'usuario' };
    const { access_token, refresh_token } = generarTokens(payload);
    refreshTokens.add(refresh_token);
    const { password_hash, ...datos } = usuario;
    res.json({ ...datos, access_token, refresh_token });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const refresh = (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token)           return res.status(401).json({ error: 'Refresh token requerido' });
  if (!refreshTokens.has(refresh_token)) return res.status(403).json({ error: 'Refresh token inválido' });
  jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, usuario) => {
    if (err) {
      refreshTokens.delete(refresh_token);
      return res.status(403).json({ error: 'Refresh token expirado' });
    }
    const access_token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ access_token });
  });
};

const logout = (req, res) => {
  const { refresh_token } = req.body;
  if (refresh_token) refreshTokens.delete(refresh_token);
  res.json({ mensaje: 'Sesión cerrada' });
};

const getById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = db.getStatus()
      ? await Model.getById(id)
      : usuarios.find(u => u.id === id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { password_hash, ...datos } = usuario;
    res.json(datos);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      const usuario = await Model.update(id, req.body);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.json(usuario);
    }
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuarios[index] = { ...usuarios[index], ...req.body };
    const { password_hash, ...datos } = usuarios[index];
    res.json(datos);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);
    if (db.getStatus()) {
      await Model.remove(id);
      return res.json({ mensaje: 'Usuario eliminado' });
    }
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
    usuarios.splice(index, 1);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { registro, login, refresh, logout, getById, update, remove };
