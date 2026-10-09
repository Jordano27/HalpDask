const express = require('express');
const RelatorioController = require('../controllers/relatorioController');
const { requireTipo } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/chamados-por-status', requireTipo('TECNICO'), RelatorioController.getChamadosPorStatus);

module.exports = router;
