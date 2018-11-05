import { ModelRouter } from '../common/model-router'
import * as restify from 'restify';
import { User } from './users.model';
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';

class UsersRouter extends ModelRouter<User> {

  constructor() {
    super(User);
    this.on('beforeRender', document => {
      document.password = undefined
    });
  }

  findByLogin = (req, res, next) => {
    if (req.query.login) {
      User.findByLogin(req.query.login)
        .then(user => user ? [user] : [])
        .then(this.renderAll(res, next, {
          pageSize: this.pageSize,
          url: req.url
        }))
        .catch(next);
    } else {
      next();
    }
  }

  applyRoutes(application: restify.Server) {

    // usar .../users?nome=Rafael para usar o find by
    application.get(`${this.basePath}`, [authorize('admin', 'professor'), this.findByLogin, this.findAll]);
    application.get(`${this.basePath}/:id`, [authorize('admin', 'professor'), this.validateId, this.findById]);
    application.post(`${this.basePath}`, [authorize('admin', 'professor'), this.save]);
    // application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
    application.patch(`${this.basePath}/:id`, [authorize('admin', 'professor'), this.validateId, this.update]);
    application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete]);

    application.post(`${this.basePath}/authenticate`, authenticate);
  }
}

export const usersRouter = new UsersRouter();
