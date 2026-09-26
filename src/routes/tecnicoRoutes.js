const express = require('express');
const TecnicoController = require('../controllers/tecnicoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', TecnicoController.create);
router.use(authMiddleware);
router.get('/', TecnicoController.getAll);
router.get('/:id', TecnicoController.getById);
router.put('/:id', TecnicoController.update);
router.delete('/:id', TecnicoController.delete);

module.exports = router;
