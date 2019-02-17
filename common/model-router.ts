import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

  basePath: string;
  pageSize: number = 10;

  constructor(protected model: mongoose.Model<D>) {
    super();
    this.basePath = `/${model.collection.name}`
  }

  protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
    return query;
  }

  envelope(document: any): any {
    let resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `${this.basePath}/${resource._id}`;
    return resource;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    return documents;
  }

  validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Registro não encontrado'));
    } else {
      next();
    }
  }

  findAll = (req, res, next) => {
    this.model
      .count({}).exec()
      .then(count => this.model.find()
        .then(this.renderAll(res, next,)))
      .catch(next);
  }

  findById = (req, res, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(res, next))
      .catch(next);
  }

  save = (req, res, next) => {
    let document = new this.model(req.body);
    document.save()
      .then(this.render(res, next))
      .catch(next);
  }

  replace = (req, res, next) => {
    const options = { runValidators: true, overwrite: true };
    this.model.update({ _id: req.params.id }, req.body, options).exec().then(result => {
      throw new Error('Metodo não implementado!')
      // if (result.n) {
      //   return this.model.findById(req.params.id)
      // } else {
      //   throw new NotFoundError('Documento não encontrado');
      // }
    }).then(this.render(res, next))
      .catch(next);
  }

  update = (req, res, next) => {
    const options = { runValidators: true, new: true };
    this.model.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(res, next))
      .catch(next);
  }

  delete = (req, res, next) => {
    this.model.deleteOne({ _id: req.params.id }).exec().then(cmdResult => {
      if (cmdResult) {
        res.send(204);
      } else {
        throw new NotFoundError('Registro não encontrado');
      }
      return next();
    }).catch(next);
  }

}
