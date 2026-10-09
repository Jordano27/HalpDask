const express = require('express');
const ChamadoController = require('../controllers/chamadoController');
const { requireTipo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', ChamadoController.getAll);
router.get('/:id', ChamadoController.getById);
router.post('/', requireTipo('SOLICITANTE'), ChamadoController.create);
router.put('/:id', requireTipo('TECNICO'), ChamadoController.update);
router.delete('/:id', requireTipo('TECNICO'), ChamadoController.delete);

module.exports = router;
