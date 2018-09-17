import * as jestCli from 'jest-cli';
import { Server } from './server/server';
import { environment } from './common/environment';
import { usersRouter } from './users/users.router';
import { User } from './users/users.model';


let server: Server;

const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server.bootstrap([
    usersRouter,
  ])
    .then(() => User.remove({}).exec())
    .then(() => {
      let admin = new User()
      admin.isAtivo = true,
      admin.nome = 'Administrator';
      admin.login = 'admin';
      admin.senha = 'admin';
      admin.perfilAcesso = ['admin', 'user'];
      admin.sexo = 'Masculino';
      admin.dataCadastro = new Date;
      admin.dataNascimento = new Date;
      return admin.save();
    });
}

const afterAllTests = () => {
  return server.shutdown();
}

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
