const request = require('supertest');
const app     = require('../src/app');

let token;
let idCreado;

beforeAll(async () => {
  await request(app).post('/api/v1/usuarios/registro').send({ nombre: 'Test', email: 'test_m@test.com', password: '1234' });
  const res = await request(app).post('/api/v1/usuarios/login').send({ email: 'test_m@test.com', password: '1234' });
  token = res.body.access_token;
});

describe('Mascotas', () => {
  it('GET / retorna minimo 5 mascotas', async () => {
    const res = await request(app).get('/api/v1/mascotas').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });

  it('GET /:id retorna mascota existente', async () => {
    const res = await request(app).get('/api/v1/mascotas/1').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /:id retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/mascotas/999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('GET / retorna 401 sin token', async () => {
    const res = await request(app).get('/api/v1/mascotas');
    expect(res.status).toBe(401);
  });

  it('POST / crea nueva mascota', async () => {
    const res = await request(app).post('/api/v1/mascotas').set('Authorization', `Bearer ${token}`).send({ nombre: 'Rocky', especie: 'Perro', edad: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('nombre', 'Rocky');
    idCreado = res.body.id;
  });

  it('PUT /:id actualiza mascota creada', async () => {
    const res = await request(app).put(`/api/v1/mascotas/${idCreado}`).set('Authorization', `Bearer ${token}`).send({ nombre: 'Rocky Actualizado' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nombre', 'Rocky Actualizado');
  });

  it('PUT /:id retorna 404 si no existe', async () => {
    const res = await request(app).put('/api/v1/mascotas/999').set('Authorization', `Bearer ${token}`).send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });

  it('DELETE /:id elimina mascota creada', async () => {
    const res = await request(app).delete(`/api/v1/mascotas/${idCreado}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('DELETE /:id retorna 404 si no existe', async () => {
    const res = await request(app).delete('/api/v1/mascotas/999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
