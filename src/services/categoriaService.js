const CategoriaModel = require('../models/categoriaModel');
const { NotFoundError } = require('../utils/customErrors');
const { parseId } = require('../utils/validation');

class CategoriaService {
    static async getAll() {
        return CategoriaModel.findAll();
    }

    static async getById(id) {
        const categoriaId = parseId(id, 'categoria_id');
        const categoria = await CategoriaModel.findById(categoriaId);
        if (!categoria) {
            throw new NotFoundError('Categoria não encontrada.');
        }
        return categoria;
    }
}

module.exports = CategoriaService;
