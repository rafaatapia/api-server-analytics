import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from '../common/environment';

export const authenticate: restify.RequestHandler = (req, res, next) => {
  const { login, senha } = req.body;
  User.findByLogin(login, '+senha')
    .then(user => {
      if(user.isAtivo){
        if (user && user.matches(senha)) {
          //gerar o token
          const token = jwt.sign({ sub: user.login, iss: 'bmake-api' },
            environment.security.apiSecret);
            // retorna os dados do usuario junto com o token
          res.json({ _id: user._id ,nome: user.nome, login: user.login, acessToken: token });
          return next(false);
        } else {
          return next(new NotAuthorizedError('Credenciais inválidas'));
        }
      } else {
        return next(new NotAuthorizedError('Usuário inativo!'));
      }
    }).catch(next)


}
