// Configurar los módulos que necesito para hacer test

const supertest = require('supertest');
const assert = require('assert');
const app = require('../src/index');

const api = supertest(app);

//TEST

describe('API TEST movies', () => {
  test('Comprobar que retorna un formato json', async () => {
    await api.get('/movies')
    .expect('Content-type', /json/);
  })
  // test('Comprobar ', async () => {
  //   await api.get('/movies')
  //   .expect('Content-type', /json/);
  // });
});
