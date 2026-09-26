const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET precisa ser configurado em produção.');
}

const JWT_SECRET = secret || 'chave-apenas-para-desenvolvimento-local';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function createToken(user) {
    return jwt.sign(
        {
            sub: String(user.id),
            nome: user.nome,
            email: user.email,
            tipo: user.tipo
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { createToken, verifyToken };
