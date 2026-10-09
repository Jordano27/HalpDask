class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Recurso não encontrado.') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

class ValidationError extends AppError {
    constructor(message = 'Erro de validação dos dados.') {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class ConflictError extends AppError {
    constructor(message = 'Não foi possível concluir a operação por conflito de dados.') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Autenticação necessária.') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Você não tem permissão para executar esta operação.') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError
};
