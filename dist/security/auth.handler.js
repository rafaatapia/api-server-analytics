"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const users_model_1 = require("../users/users.model");
const restify_errors_1 = require("restify-errors");
const environment_1 = require("../common/environment");
exports.authenticate = (req, res, next) => {
    const { login, senha } = req.body;
    users_model_1.User.findByLogin(login, '+senha')
        .then(user => {
        if (user && user.matches(senha)) {
            //gerar o token
            const token = jwt.sign({ sub: user.login, iss: 'bmake-api' }, environment_1.environment.security.apiSecret);
            // retorna os dados do usuario junto com o token
            res.json({ nome: user.nome, login: user.login, acessToken: token });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
//# sourceMappingURL=auth.handler.js.map