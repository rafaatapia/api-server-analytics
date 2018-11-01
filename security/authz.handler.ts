import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
  return (req, res, next) => {
    if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
      req.log.debug('Usuario %s foi autorizado utilizando o perfil %s para a rota %s',
                    req.authenticated._id, req.authenticated.perfilAcesso, req.path());
      next();
    } else {
      if(req.authenticated){
        req.log.debug('Permissão negada para %s. Perfis obrigatórios: %j. Perfil do usuario: %s',
                    req.authenticated._id, profiles, req.authenticated.perfilAcesso);
      }
      next(new ForbiddenError('Acesso negado!'));
    }
  }
}
