const RelatorioService = require('../services/relatorioService');

class RelatorioController {
    static async getChamadosPorStatus(req, res, next) {
        try {
            res.json(await RelatorioService.getChamadosPorStatus());
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RelatorioController;
