const { ForbiddenError } = require('../utils/customErrors');

function requireTipo(...tiposPermitidos) {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
            return next(new ForbiddenError(
                `Esta operação está disponível apenas para: ${tiposPermitidos.join(', ')}.`
            ));
        }
        return next();
    };
}

module.exports = { requireTipo };
