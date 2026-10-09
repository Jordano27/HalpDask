const SolicitanteService = require('../services/solicitanteService');

class SolicitanteController {
    static async getAll(req, res, next) {
        try {
            res.json(await SolicitanteService.getAll());
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            res.json(await SolicitanteService.getById(req.params.id));
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const id = await SolicitanteService.create(req.body);
            res.status(201).json({
                message: 'Solicitante cadastrado com sucesso.',
                id
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            await SolicitanteService.update(req.params.id, req.body);
            res.json({ message: 'Solicitante atualizado com sucesso.' });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await SolicitanteService.delete(req.params.id);
            res.json({ message: 'Solicitante removido com sucesso.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SolicitanteController;
