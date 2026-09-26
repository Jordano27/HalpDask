const TecnicoService = require('../services/tecnicoService');

class TecnicoController {
    static async getAll(req, res, next) {
        try {
            res.json(await TecnicoService.getAll());
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            res.json(await TecnicoService.getById(req.params.id));
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const id = await TecnicoService.create(req.body);
            res.status(201).json({ message: 'Técnico cadastrado com sucesso.', id });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            await TecnicoService.update(req.params.id, req.body);
            res.json({ message: 'Técnico atualizado com sucesso.' });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await TecnicoService.delete(req.params.id);
            res.json({ message: 'Técnico removido com sucesso.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TecnicoController;
