const ChamadoModel = require('../models/chamadoModel');
const SolicitanteModel = require('../models/solicitanteModel');
const CategoriaModel = require('../models/categoriaModel');
const TecnicoModel = require('../models/tecnicoModel');
const { ValidationError, NotFoundError } = require('../utils/customErrors');
const { parseId, requiredText } = require('../utils/validation');

const PRIORIDADES_VALIDAS = ['BAIXA', 'MEDIA', 'ALTA'];
const STATUS_VALIDOS = ['ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO'];

function normalizeEnum(value, field, validValues) {
    const normalized = String(value).trim().toUpperCase();
    if (!validValues.includes(normalized)) {
        throw new ValidationError(
            `${field} inválido. Use: ${validValues.join(', ')}.`
        );
    }
    return normalized;
}

function optionalForeignKey(value, field) {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    return parseId(value, field);
}

class ChamadoService {
    static async getAll(filters = {}) {
        const normalizedFilters = {};

        if (filters.status) {
            normalizedFilters.status = normalizeEnum(filters.status, 'Status', STATUS_VALIDOS);
        }

        if (filters.prioridade) {
            normalizedFilters.prioridade = normalizeEnum(
                filters.prioridade,
                'Prioridade',
                PRIORIDADES_VALIDAS
            );
        }

        if (filters.solicitante_id !== undefined) {
            normalizedFilters.solicitante_id = parseId(filters.solicitante_id, 'solicitante_id');
        }

        return ChamadoModel.findAll(normalizedFilters);
    }

    static async getById(id) {
        const chamadoId = parseId(id, 'id');
        const chamado = await ChamadoModel.findById(chamadoId);
        if (!chamado) {
            throw new NotFoundError('Chamado não encontrado.');
        }
        return chamado;
    }

    static async create(data = {}) {
        data = data || {};
        const titulo = requiredText(data.titulo, 'titulo');
        const descricao = requiredText(data.descricao, 'descricao');
        const solicitanteId = parseId(data.solicitante_id, 'solicitante_id');
        const categoriaId = parseId(data.categoria_id, 'categoria_id');
        const prioridade = data.prioridade
            ? normalizeEnum(data.prioridade, 'Prioridade', PRIORIDADES_VALIDAS)
            : 'MEDIA';

        const [solicitante, categoria] = await Promise.all([
            SolicitanteModel.findById(solicitanteId),
            CategoriaModel.findById(categoriaId)
        ]);

        if (!solicitante) {
            throw new ValidationError('Solicitante informado não existe no sistema.');
        }
        if (!categoria) {
            throw new ValidationError('Categoria informada não existe no sistema.');
        }

        return ChamadoModel.create({
            titulo,
            descricao,
            prioridade,
            solicitante_id: solicitanteId,
            categoria_id: categoriaId
        });
    }

    static async update(id, data = {}) {
        data = data || {};
        const chamadoId = parseId(id, 'id');
        const chamadoAtual = await this.getById(chamadoId);

        const titulo = data.titulo === undefined
            ? chamadoAtual.titulo
            : requiredText(data.titulo, 'titulo');
        const descricao = data.descricao === undefined
            ? chamadoAtual.descricao
            : requiredText(data.descricao, 'descricao');
        const prioridade = data.prioridade === undefined
            ? chamadoAtual.prioridade
            : normalizeEnum(data.prioridade, 'Prioridade', PRIORIDADES_VALIDAS);
        const status = data.status === undefined
            ? chamadoAtual.status
            : normalizeEnum(data.status, 'Status', STATUS_VALIDOS);
        const solucao = data.solucao === undefined
            ? chamadoAtual.solucao
            : (data.solucao === null ? null : String(data.solucao).trim());
        const tecnicoId = data.tecnico_id === undefined
            ? chamadoAtual.tecnico_id
            : optionalForeignKey(data.tecnico_id, 'tecnico_id');

        if (tecnicoId !== null) {
            const tecnico = await TecnicoModel.findById(tecnicoId);
            if (!tecnico) {
                throw new ValidationError('Técnico informado não existe no sistema.');
            }
        }

        if (status === 'EM_ATENDIMENTO' && !tecnicoId) {
            throw new ValidationError(
                'Para alterar o status para EM_ATENDIMENTO, é necessário atribuir um técnico responsável.'
            );
        }

        if (status === 'CONCLUIDO' && (!solucao || solucao.trim() === '')) {
            throw new ValidationError(
                'Para alterar o status para CONCLUIDO, é necessário descrever a solução realizada.'
            );
        }

        await ChamadoModel.update(chamadoId, {
            titulo,
            descricao,
            prioridade,
            status,
            solucao,
            tecnico_id: tecnicoId
        });
    }

    static async delete(id) {
        const chamadoId = parseId(id, 'id');
        await this.getById(chamadoId);
        await ChamadoModel.delete(chamadoId);
    }
}

module.exports = ChamadoService;
