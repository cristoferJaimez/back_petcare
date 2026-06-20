const { Router }                                          = require('express');
const { registro, login, refresh, logout, getById, update, remove } = require('../controllers/usuarios.controller');
const verificarToken                                      = require('../middleware/auth');
const router = Router();

router.post('/registro', registro);
router.post('/login',    login);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/:id',       verificarToken, getById);
router.put('/:id',       verificarToken, update);
router.delete('/:id',    verificarToken, remove);

module.exports = router;
