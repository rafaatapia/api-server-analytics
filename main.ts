import { Server } from './server/server';
import { usersRouter } from './users/users.router';
import { customersRouter } from './customers/customers.router';
import { mainRouter } from './main.router';

const server = new Server();
server.bootstrap([
  usersRouter,
  customersRouter,
  mainRouter
]).then(server => {
  console.log('\n#################### Server is alive! ####################\n');
  console.log('==========================================================');
  console.log('                Server is listening on:\n    ', server.application.address());
  console.log('==========================================================');
}).catch(error => {
  console.log('Server failed to start');
  console.log(error);
  process.exit(1);
})
