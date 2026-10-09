const bcrypt = require('bcryptjs');

const TecnicoModel = require('../models/tecnicoModel');
const SolicitanteModel = require('../models/solicitanteModel');
const AdminModel = require('../models/adminModel');
const { ValidationError, NotFoundError } = require('../utils/customErrors');
const { parseId, requiredText, normalizeEmail, validatePassword } = require('../utils/validation');

class TecnicoService {
    static async getAll() {
        return TecnicoModel.findAll();
    }

    static async getById(id) {
        const tecnicoId = parseId(id, 'tecnico_id');
        const tecnico = await TecnicoModel.findById(tecnicoId);
        if (!tecnico) {
            throw new NotFoundError('Técnico não encontrado.');
        }
        return tecnico;
    }

    static async create(data = {}) {
        data = data || {};
        const nome = requiredText(data.nome, 'nome');
        const email = normalizeEmail(data.email);
        const senha = validatePassword(data.senha);
        const existing = await TecnicoModel.findByEmail(email);
        if (existing) {
            throw new ValidationError('Este e-mail já está cadastrado para outro técnico.');
        }
        const requester = await SolicitanteModel.findByEmail(email);
        if (requester) {
            throw new ValidationError('Este e-mail já está cadastrado para um solicitante.');
        }
        const admin = await AdminModel.findByEmail(email);
        if (admin) {
            throw new ValidationError('Este e-mail já está cadastrado para um administrador.');
        }
        const senhaHash = await bcrypt.hash(senha, 12);
        return TecnicoModel.create({ nome, email, senhaHash });
    }

    static async update(id, data = {}) {
        data = data || {};
        const tecnicoId = parseId(id, 'id');
        await this.getById(tecnicoId);
        const nome = requiredText(data.nome, 'nome');
        const email = normalizeEmail(data.email);
        const existing = await TecnicoModel.findByEmail(email);
        if (existing && existing.id !== tecnicoId) {
            throw new ValidationError('Este e-mail já está em uso por outro técnico.');
        }
        const requester = await SolicitanteModel.findByEmail(email);
        if (requester) {
            throw new ValidationError('Este e-mail já está em uso por um solicitante.');
        }
        const admin = await AdminModel.findByEmail(email);
        if (admin) {
            throw new ValidationError('Este e-mail já está em uso por um administrador.');
        }
        await TecnicoModel.update(tecnicoId, { nome, email });
    }

    static async delete(id) {
        const tecnicoId = parseId(id, 'id');
        await this.getById(tecnicoId);
        await TecnicoModel.delete(tecnicoId);
    }
}

module.exports = TecnicoService;
