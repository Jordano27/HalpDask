const express = require('express');
const TecnicoController = require('../controllers/tecnicoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireTipo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', TecnicoController.getAll);
router.get('/:id', TecnicoController.getById);
router.post('/', requireTipo('ADMIN'), TecnicoController.create);
router.put('/:id', requireTipo('ADMIN'), TecnicoController.update);
router.delete('/:id', requireTipo('ADMIN'), TecnicoController.delete);

module.exports = router;
