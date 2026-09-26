const db = require('../config/database');

class TecnicoModel {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT id, nome, email FROM TECNICOS ORDER BY nome'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email FROM TECNICOS WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email FROM TECNICOS WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByEmailWithPassword(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email, senha_hash FROM TECNICOS WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByIdWithPassword(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email, senha_hash FROM TECNICOS WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create({ nome, email, senhaHash }) {
        const [result] = await db.query(
            'INSERT INTO TECNICOS (nome, email, senha_hash) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );
        return result.insertId;
    }

    static async update(id, { nome, email }) {
        const [result] = await db.query(
            'UPDATE TECNICOS SET nome = ?, email = ? WHERE id = ?',
            [nome, email, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM TECNICOS WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async updatePassword(id, senhaHash) {
        const [result] = await db.query(
            'UPDATE TECNICOS SET senha_hash = ? WHERE id = ?',
            [senhaHash, id]
        );
        return result.affectedRows;
    }
}

module.exports = TecnicoModel;
