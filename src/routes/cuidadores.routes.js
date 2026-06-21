const { Router }                    = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/cuidadores.controller');
const { verificarToken }            = require('../middleware/auth');
const router = Router();

router.get('/',     verificarToken, getAll);
router.get('/:id',  verificarToken, getById);
router.post('/',    verificarToken, create);
router.put('/:id',  verificarToken, update);
router.delete('/:id', verificarToken, remove);

module.exports = router;
