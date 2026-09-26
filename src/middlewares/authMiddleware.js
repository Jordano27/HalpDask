const { verifyToken } = require('../config/auth');
const { UnauthorizedError } = require('../utils/customErrors');

function authMiddleware(req, res, next) {
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization ? authorization.split(' ') : [];

    if (scheme !== 'Bearer' || !token) {
        return next(new UnauthorizedError(
            'Informe um token JWT no header Authorization: Bearer <token>.'
        ));
    }

    try {
        req.user = verifyToken(token);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('O token JWT expirou. Faça login novamente.'));
        }
        return next(new UnauthorizedError('Token JWT inválido.'));
    }
}

module.exports = authMiddleware;
