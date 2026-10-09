const RelatorioModel = require('../models/relatorioModel');

class RelatorioService {
    static async getChamadosPorStatus() {
        return RelatorioModel.countChamadosByStatus();
    }
}

module.exports = RelatorioService;
