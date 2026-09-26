const AuthService = require('../services/authService');

class AuthController {
    static async login(req, res, next) {
        try {
            res.json(await AuthService.login(req.body));
        } catch (error) {
            next(error);
        }
    }

    static async me(req, res, next) {
        try {
            res.json(await AuthService.getProfile(req.user));
        } catch (error) {
            next(error);
        }
    }

    static async changePassword(req, res, next) {
        try {
            await AuthService.changePassword(req.user, req.body);
            res.json({ message: 'Senha atualizada com sucesso.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
