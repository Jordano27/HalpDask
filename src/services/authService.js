const bcrypt = require('bcryptjs');

const SolicitanteModel = require('../models/solicitanteModel');
const TecnicoModel = require('../models/tecnicoModel');
const AdminModel = require('../models/adminModel');
const { createToken } = require('../config/auth');
const { ValidationError, UnauthorizedError } = require('../utils/customErrors');
const { requiredText, normalizeEmail, validatePassword, parseId } = require('../utils/validation');

const TIPOS_USUARIO = ['SOLICITANTE', 'TECNICO', 'ADMIN'];

function normalizeTipo(value) {
    const tipo = requiredText(value, 'tipo').toUpperCase();
    if (!TIPOS_USUARIO.includes(tipo)) {
        throw new ValidationError('Tipo inválido. Use SOLICITANTE, TECNICO ou ADMIN.');
    }
    return tipo;
}

function getModel(tipo) {
    if (tipo === 'SOLICITANTE') return SolicitanteModel;
    if (tipo === 'TECNICO') return TecnicoModel;
    return AdminModel;
}

function publicUser(user) {
    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
    };
}

class AuthService {
    static async login(data = {}) {
        data = data || {};
        const email = normalizeEmail(data.email);
        const senha = validatePassword(data.senha);
        const [requester, technician, admin] = await Promise.all([
            SolicitanteModel.findByEmailWithPassword(email),
            TecnicoModel.findByEmailWithPassword(email),
            AdminModel.findByEmailWithPassword(email)
        ]);
        const candidates = [
            requester && { ...requester, tipo: 'SOLICITANTE' },
            technician && { ...technician, tipo: 'TECNICO' },
            admin && { ...admin, tipo: 'ADMIN' }
        ].filter(Boolean);
        const validUsers = [];
        for (const candidate of candidates) {
            if (candidate.senha_hash && await bcrypt.compare(senha, candidate.senha_hash)) {
                validUsers.push(candidate);
            }
        }

        if (validUsers.length !== 1) {
            throw new UnauthorizedError('E-mail ou senha inválidos.');
        }

        const identity = validUsers[0];

        return {
            user: publicUser(identity),
            token: createToken(identity)
        };
    }

    static async getProfile(claims) {
        if (!claims || !claims.email || !claims.tipo) {
            throw new UnauthorizedError('Token sem identidade válida.');
        }
        return publicUser({
            id: claims.sub,
            nome: claims.nome,
            email: claims.email,
            tipo: claims.tipo
        });
    }

    static async changePassword(claims, data = {}) {
        if (!claims || !claims.sub || !claims.tipo) {
            throw new UnauthorizedError('Token sem identidade válida.');
        }
        const senhaAtual = requiredText(data.senha_atual, 'senha_atual');
        const novaSenha = validatePassword(data.nova_senha);
        const tipo = normalizeTipo(claims.tipo);
        const user = await getModel(tipo).findByIdWithPassword(parseId(claims.sub, 'id'));
        if (!user || !user.senha_hash || !(await bcrypt.compare(senhaAtual, user.senha_hash))) {
            throw new UnauthorizedError('A senha atual está incorreta.');
        }
        const senhaHash = await bcrypt.hash(novaSenha, 12);
        await getModel(tipo).updatePassword(user.id, senhaHash);
    }
}

module.exports = AuthService;
