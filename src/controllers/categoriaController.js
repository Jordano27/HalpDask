const CategoriaService = require('../services/categoriaService');

class CategoriaController {
    static async getAll(req, res, next) {
        try {
            res.json(await CategoriaService.getAll());
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            res.json(await CategoriaService.getById(req.params.id));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoriaController;
