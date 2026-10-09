const db = require('../config/database');

class RelatorioModel {
    static async countChamadosByStatus() {
        const [rows] = await db.query(
            `SELECT status, COUNT(*) AS total
             FROM CHAMADOS
             GROUP BY status
             ORDER BY status`
        );

        const totalsByStatus = new Map(
            rows.map((row) => [row.status, Number(row.total)])
        );
        const statuses = ['ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO'];

        return statuses.map((status) => ({
            status,
            total: totalsByStatus.get(status) || 0
        }));
    }
}

module.exports = RelatorioModel;
