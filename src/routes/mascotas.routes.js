const { Router }                                          = require('express');
const { getAll, getById, create, update, remove, uploadFoto } = require('../controllers/mascotas.controller');
const { verificarToken }                                  = require('../middleware/auth');
const upload                                              = require('../middleware/upload');

const router = Router();

router.get('/',        verificarToken, getAll);
router.get('/:id',     verificarToken, getById);
router.post('/',       verificarToken, create);
router.put('/:id',     verificarToken, update);
router.delete('/:id',  verificarToken, remove);
router.post('/:id/foto', verificarToken, upload.single('foto'), uploadFoto);

module.exports = router;
