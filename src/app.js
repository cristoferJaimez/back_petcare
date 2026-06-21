const express = require('express');
const cors    = require('cors');
const db      = require('./config/db');
require('dotenv').config();

const usuariosRoutes             = require('./routes/usuarios.routes');
const mascotasRoutes             = require('./routes/mascotas.routes');
const cuidadoresRoutes           = require('./routes/cuidadores.routes');
const citasRoutes                = require('./routes/citas.routes');
const razasRoutes                = require('./routes/razas.routes');
const tutorialesRoutes           = require('./routes/tutoriales.routes');
const recursosVeterinariosRoutes = require('./routes/recursos-veterinarios.routes');
const adminRoutes                = require('./routes/admin.routes');

const app  = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = new Set(
  (process.env.CORS_ORIGIN || 'http://localhost:4200,http://localhost:8100')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  }
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    proyecto: 'PetCare API',
    version: 'v1',
    estado: 'corriendo',
    db: db.getStatus() ? 'MySQL' : 'datos locales'
  });
});

app.use('/api/v1/usuarios',              usuariosRoutes);
app.use('/api/v1/mascotas',              mascotasRoutes);
app.use('/api/v1/cuidadores',            cuidadoresRoutes);
app.use('/api/v1/citas',                 citasRoutes);
app.use('/api/v1/razas',                 razasRoutes);
app.use('/api/v1/tutoriales',            tutorialesRoutes);
app.use('/api/v1/recursos-veterinarios', recursosVeterinariosRoutes);
app.use('/api/v1/admin',                adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` });
});

if (require.main === module) {
  db.init().then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  });
}

module.exports = app;
