import { ModelRouter } from '../common/model-router'
import * as restify from 'restify';
import { Monitoring } from './monitoring.model';

class MonitoringRouter extends ModelRouter<Monitoring> {

  constructor() {
    super(Monitoring);
  }

  findByEmpresa = (req, res, next) => {
    if (req.query.empresa) {
      console.log(req.query.empresa)
      Monitoring.findByEmpresa(req.query.empresa)
        .then(empresa => empresa ? [empresa] : [])
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
    application.get(`${this.basePath}`, [this.findByEmpresa, this.findAll]);
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    application.post(`${this.basePath}`, [this.save]);    
    application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);    
  }
}

export const monitoringRouter = new MonitoringRouter();