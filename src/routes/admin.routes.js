const { Router } = require('express');
const { listarMascotasConCuidadores, listarCuidadores, asignarCuidador, desasignarCuidador } = require('../controllers/admin.controller');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const router = Router();

router.use(verificarToken, verificarAdmin);

router.get('/mascotas',                          listarMascotasConCuidadores);
router.get('/cuidadores',                        listarCuidadores);
router.post('/mascotas/:id/cuidadores',          asignarCuidador);
router.delete('/mascotas/:id/cuidadores/:cuidadorId', desasignarCuidador);

module.exports = router;
