const { Router } = require('express');
const { getAll, getById, getRecomendaciones, create, update, remove } = require('../controllers/razas.controller');
const router = Router();

router.get('/', getAll);
router.get('/:id/recomendaciones', getRecomendaciones);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
