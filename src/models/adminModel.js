const db = require('../config/database');

class AdminModel {
    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email FROM ADMINISTRADORES WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByEmailWithPassword(email) {
        const [rows] = await db.query(
            'SELECT id, nome, email, senha_hash FROM ADMINISTRADORES WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByIdWithPassword(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email, senha_hash FROM ADMINISTRADORES WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updatePassword(id, senhaHash) {
        const [result] = await db.query(
            'UPDATE ADMINISTRADORES SET senha_hash = ? WHERE id = ?',
            [senhaHash, id]
        );
        return result.affectedRows;
    }
}

module.exports = AdminModel;
