const ChamadoService = require('../services/chamadoService');
const { ForbiddenError } = require('../utils/customErrors');

function isRequester(req) {
    return req.user && req.user.tipo === 'SOLICITANTE';
}

function assertOwnership(req, chamado) {
    if (isRequester(req) && Number(req.user.sub) !== Number(chamado.solicitante_id)) {
        throw new ForbiddenError('Você só pode acompanhar os seus próprios chamados.');
    }
}

class ChamadoController {
    static async getAll(req, res, next) {
        try {
            const filters = {
                status: req.query.status,
                prioridade: req.query.prioridade
            };
            if (isRequester(req)) filters.solicitante_id = req.user.sub;
            const chamados = await ChamadoService.getAll(filters);
            res.json(chamados);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const chamado = await ChamadoService.getById(req.params.id);
            assertOwnership(req, chamado);
            res.json(chamado);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const data = { ...req.body };
            if (isRequester(req)) data.solicitante_id = req.user.sub;
            const id = await ChamadoService.create(data);
            res.status(201).json({ message: 'Chamado aberto com sucesso.', id });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            if (isRequester(req)) {
                throw new ForbiddenError('Somente técnicos podem atualizar o fluxo de atendimento.');
            }
            await ChamadoService.update(req.params.id, req.body);
            res.json({ message: 'Chamado atualizado com sucesso.' });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            if (isRequester(req)) {
                throw new ForbiddenError('Somente técnicos podem remover chamados.');
            }
            await ChamadoService.delete(req.params.id);
            res.json({ message: 'Chamado removido com sucesso.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ChamadoController;
