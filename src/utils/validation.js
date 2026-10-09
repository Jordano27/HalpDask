const { ValidationError } = require('./customErrors');

function parseId(value, field = 'id') {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError(`${field} deve ser um número inteiro positivo.`);
    }
    return id;
}

function requiredText(value, field) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new ValidationError(`O campo ${field} é obrigatório.`);
    }
    return value.trim();
}

function normalizeEmail(value) {
    const email = requiredText(value, 'email').toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ValidationError('O campo email deve conter um endereço válido.');
    }
    return email;
}

function validatePassword(value) {
    const password = requiredText(value, 'senha');
    if (password.length < 8) {
        throw new ValidationError('A senha deve possuir pelo menos 8 caracteres.');
    }
    return password;
}

module.exports = { parseId, requiredText, normalizeEmail, validatePassword };
