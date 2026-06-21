const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      const status = err.name === 'TokenExpiredError' ? 401 : 403;
      return res.status(status).json({ error: 'Token inválido o expirado' });
    }
    req.usuario = usuario;
    next();
  });
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido: se requiere rol admin' });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin };
