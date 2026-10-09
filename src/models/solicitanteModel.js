const db = require('../config/database');

class SolicitanteModel {
    static async findAll() {
        const [rows] = await db.query(
            `SELECT id, nome, email, setor, criado_em, atualizado_em
             FROM SOLICITANTES
             ORDER BY nome`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT id, nome, email, setor, criado_em, atualizado_em
             FROM SOLICITANTES WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email, setor FROM SOLICITANTES WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByEmailWithPassword(email) {
        const [rows] = await db.query(
            `SELECT id, nome, email, senha_hash, setor
             FROM SOLICITANTES WHERE email = ?`,
            [email]
        );
        return rows[0];
    }

    static async findByIdWithPassword(id) {
        const [rows] = await db.query(
            `SELECT id, nome, email, senha_hash, setor
             FROM SOLICITANTES WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    static async create({ nome, email, setor, senhaHash }) {
        const [result] = await db.query(
            'INSERT INTO SOLICITANTES (nome, email, senha_hash, setor) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, setor]
        );
        return result.insertId;
    }

    static async update(id, { nome, email, setor }) {
        const [result] = await db.query(
            `UPDATE SOLICITANTES
             SET nome = ?, email = ?, setor = ?
             WHERE id = ?`,
            [nome, email, setor, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM SOLICITANTES WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, senhaHash) {
        const [result] = await db.query(
            'UPDATE SOLICITANTES SET senha_hash = ? WHERE id = ?',
            [senhaHash, id]
        );
        return result.affectedRows;
    }
}

module.exports = SolicitanteModel;
