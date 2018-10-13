import { ModelRouter } from '../common/model-router'
import * as restify from 'restify';
import { Customer } from './customers.model';

class CustomersRouter extends ModelRouter<Customer> {

  constructor() {
    super(Customer);
  }

  findByNome = (req, res, next) => {
    if (req.query.codigo) {
      Customer.findByNome(req.query.nome)
        .then(customer => customer ? [customer] : [])
        .then(this.renderAll(res, next, {
          pageSize: this.pageSize,
          url: req.url
        }))
        .catch(next);
    } else {
      next();
    }
  }

  findByCodigo = (req, res, next) => {
    if (req.query.codigo) {
      Customer.findByCodigo(req.query.codigo)
        .then(customer => customer ? [customer] : [])
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

    application.get(`${this.basePath}`, [this.findByNome, this.findByCodigo, this.findAll]);
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    application.post(`${this.basePath}`, [this.save]);
    application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

  }
}

export const customersRouter = new CustomersRouter();
