"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const users_model_1 = require("./users/users.model");
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
    ])
        .then(() => users_model_1.User.remove({}).exec())
        .then(() => {
        let admin = new users_model_1.User();
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
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
//# sourceMappingURL=jest.startup.js.map