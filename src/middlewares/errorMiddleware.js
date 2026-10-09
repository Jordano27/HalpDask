function errorMiddleware(err, req, res, next) {
    void next;

    if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: 'Já existe um registro com um valor único informado.',
            status: 409
        });
    }

    if (err && (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED')) {
        return res.status(409).json({
            error: 'O registro não pode ser removido porque está vinculado a chamados.',
            status: 409
        });
    }

    const statusCode = err && err.statusCode ? err.statusCode : 500;
    const message = err && err.message ? err.message : 'Erro interno no servidor.';

    if (statusCode >= 500) {
        console.error('[ERRO]:', err && err.stack ? err.stack : err);
    }

    return res.status(statusCode).json({ error: message, status: statusCode });
}

module.exports = errorMiddleware;
