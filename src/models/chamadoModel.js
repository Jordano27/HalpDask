const db = require('../config/database');

const selectFields = `
    c.id,
    c.titulo,
    c.descricao,
    c.prioridade,
    c.status,
    c.solucao,
    c.criado_em,
    c.atualizado_em,
    c.solicitante_id,
    s.nome AS solicitante_nome,
    s.setor AS solicitante_setor,
    c.categoria_id,
    cat.nome AS categoria_nome,
    c.tecnico_id,
    t.nome AS tecnico_nome
`;

class ChamadoModel {
    static async findAll(filters = {}) {
        let sql = `
            SELECT ${selectFields}
            FROM CHAMADOS c
            INNER JOIN SOLICITANTES s ON c.solicitante_id = s.id
            INNER JOIN CATEGORIAS cat ON c.categoria_id = cat.id
            LEFT JOIN TECNICOS t ON c.tecnico_id = t.id
            WHERE 1 = 1
        `;
        const params = [];

        if (filters.status) {
            sql += ' AND c.status = ?';
            params.push(filters.status);
        }

        if (filters.prioridade) {
            sql += ' AND c.prioridade = ?';
            params.push(filters.prioridade);
        }

        if (filters.solicitante_id) {
            sql += ' AND c.solicitante_id = ?';
            params.push(filters.solicitante_id);
        }

        sql += ' ORDER BY c.criado_em DESC, c.id DESC';

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT ${selectFields}
             FROM CHAMADOS c
             INNER JOIN SOLICITANTES s ON c.solicitante_id = s.id
             INNER JOIN CATEGORIAS cat ON c.categoria_id = cat.id
             LEFT JOIN TECNICOS t ON c.tecnico_id = t.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async create({ titulo, descricao, prioridade, solicitante_id, categoria_id }) {
        const [result] = await db.query(
            `INSERT INTO CHAMADOS
                (titulo, descricao, prioridade, status, solicitante_id, categoria_id)
             VALUES (?, ?, ?, 'ABERTO', ?, ?)`,
            [titulo, descricao, prioridade, solicitante_id, categoria_id]
        );
        return result.insertId;
    }

    static async update(id, {
        titulo,
        descricao,
        prioridade,
        status,
        solucao,
        tecnico_id
    }) {
        const [result] = await db.query(
            `UPDATE CHAMADOS
             SET titulo = ?, descricao = ?, prioridade = ?, status = ?,
                 solucao = ?, tecnico_id = ?
             WHERE id = ?`,
            [titulo, descricao, prioridade, status, solucao || null, tecnico_id || null, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM CHAMADOS WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = ChamadoModel;
