const express = require('express');
const CategoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.get('/', CategoriaController.getAll);
router.get('/:id', CategoriaController.getById);

module.exports = router;
