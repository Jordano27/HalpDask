const bcrypt = require('bcryptjs');

const SolicitanteModel = require('../models/solicitanteModel');
const TecnicoModel = require('../models/tecnicoModel');
const AdminModel = require('../models/adminModel');
const { ValidationError, NotFoundError } = require('../utils/customErrors');
const { parseId, requiredText, normalizeEmail, validatePassword } = require('../utils/validation');

function validateData(data = {}) {
    data = data || {};
    return {
        nome: requiredText(data.nome, 'nome'),
        email: normalizeEmail(data.email),
        setor: requiredText(data.setor, 'setor')
    };
}

class SolicitanteService {
    static async getAll() {
        return SolicitanteModel.findAll();
    }

    static async getById(id) {
        const solicitanteId = parseId(id, 'id');
        const solicitante = await SolicitanteModel.findById(solicitanteId);
        if (!solicitante) {
            throw new NotFoundError('Solicitante não encontrado.');
        }
        return solicitante;
    }

    static async create(data) {
        const normalized = validateData(data);
        const senha = validatePassword(data && data.senha);
        const emailExistente = await SolicitanteModel.findByEmail(normalized.email);
        if (emailExistente) {
            throw new ValidationError('Este e-mail já está cadastrado para outro solicitante.');
        }
        const emailTecnico = await TecnicoModel.findByEmail(normalized.email);
        if (emailTecnico) {
            throw new ValidationError('Este e-mail já está cadastrado para um técnico.');
        }
        const emailAdmin = await AdminModel.findByEmail(normalized.email);
        if (emailAdmin) {
            throw new ValidationError('Este e-mail já está cadastrado para um administrador.');
        }
        const senhaHash = await bcrypt.hash(senha, 12);
        return SolicitanteModel.create({ ...normalized, senhaHash });
    }

    static async update(id, data) {
        const solicitanteId = parseId(id, 'id');
        await this.getById(solicitanteId);
        const normalized = validateData(data);
        const emailExistente = await SolicitanteModel.findByEmail(normalized.email);

        if (emailExistente && emailExistente.id !== solicitanteId) {
            throw new ValidationError('Este e-mail já está em uso por outro solicitante.');
        }

        const emailTecnico = await TecnicoModel.findByEmail(normalized.email);
        if (emailTecnico) {
            throw new ValidationError('Este e-mail já está em uso por um técnico.');
        }

        const emailAdmin = await AdminModel.findByEmail(normalized.email);
        if (emailAdmin) {
            throw new ValidationError('Este e-mail já está em uso por um administrador.');
        }

        await SolicitanteModel.update(solicitanteId, normalized);
    }

    static async delete(id) {
        const solicitanteId = parseId(id, 'id');
        await this.getById(solicitanteId);
        await SolicitanteModel.delete(solicitanteId);
    }
}

module.exports = SolicitanteService;
