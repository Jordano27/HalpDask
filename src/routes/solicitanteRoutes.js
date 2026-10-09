const express = require('express');
const SolicitanteController = require('../controllers/solicitanteController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireTipo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', SolicitanteController.create);
router.use(authMiddleware, requireTipo('ADMIN'));
router.get('/', SolicitanteController.getAll);
router.get('/:id', SolicitanteController.getById);
router.put('/:id', SolicitanteController.update);
router.delete('/:id', SolicitanteController.delete);

module.exports = router;
