import 'jest';
import * as request from 'supertest';

const adress: string = (<any>global).address;
const auth: string = (<any>global).auth;

test('get /users', () => {
  return request(adress)
    .get('/users')
    .set('Authorization', auth)
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    }).catch(fail)
});

test('get /users - permission denied', () => {
  return request(adress)
  .post('/users')
  .then(response => {
    expect(response.status).toBe(403);
  }).catch(fail)
})

test('post /users', () => {
  return request(adress)
    .post('/users')
    .set('Authorization', auth)
    .send({
      name: 'usuario1',
      email: 'usuario1@email.com',
      password: '123456',
      cpf: '051.701.690-78'
    })
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe('usuario1');
      expect(response.body.email).toBe('usuario1@email.com');
      expect(response.body.cpf).toBe('051.701.690-78');
      expect(response.body.password).toBeUndefined();
    }).catch(fail);
});

test('get /users/teste123 - not found', () => {
  return request(adress)
    .get('/users/teste123')
    .set('Authorization', auth)
    .then(response => {
      expect(response.status).toBe(404);
    }).catch(fail);
});

test('patch /users/:id', () => {
  return request(adress)
    .post('/users')
    .set('Authorization', auth)
    .send({
      name: 'usuario2',
      email: 'usuario2@email.com',
      password: '123456'
    })
    .then(response => request(adress)
      .patch(`/users/${response.body._id}`)
      .set('Authorization', auth)
      .send({
        name: 'usuario2 - patch'
      }))
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe('usuario2 - patch');
      expect(response.body.email).toBe('usuario2@email.com');
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});
