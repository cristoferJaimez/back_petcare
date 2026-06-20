const request = require('supertest');
const app     = require('../src/app');

let accessToken;
let refreshToken;

describe('Usuarios', () => {
  it('POST /registro crea usuario nuevo', async () => {
    const res = await request(app).post('/api/v1/usuarios/registro').send({ nombre: 'Test User', email: 'test@test.com', password: '1234' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'test@test.com');
  });

  it('POST /registro retorna 400 si email ya existe', async () => {
    const res = await request(app).post('/api/v1/usuarios/registro').send({ nombre: 'Otro', email: 'test@test.com', password: '1234' });
    expect(res.status).toBe(400);
  });

  it('POST /login retorna access_token y refresh_token', async () => {
    const res = await request(app).post('/api/v1/usuarios/login').send({ email: 'test@test.com', password: '1234' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
    accessToken  = res.body.access_token;
    refreshToken = res.body.refresh_token;
  });

  it('POST /login retorna 401 con credenciales incorrectas', async () => {
    const res = await request(app).post('/api/v1/usuarios/login').send({ email: 'test@test.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('POST /refresh retorna nuevo access_token', async () => {
    const res = await request(app).post('/api/v1/usuarios/refresh').send({ refresh_token: refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    accessToken = res.body.access_token;
  });

  it('POST /refresh retorna 401 sin refresh_token', async () => {
    const res = await request(app).post('/api/v1/usuarios/refresh').send({});
    expect(res.status).toBe(401);
  });

  it('POST /refresh retorna 403 con token invalido', async () => {
    const res = await request(app).post('/api/v1/usuarios/refresh').send({ refresh_token: 'token_invalido' });
    expect(res.status).toBe(403);
  });

  it('GET /:id retorna usuario con access_token valido', async () => {
    const res = await request(app).get('/api/v1/usuarios/1').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /:id retorna 401 sin token', async () => {
    const res = await request(app).get('/api/v1/usuarios/1');
    expect(res.status).toBe(401);
  });

  it('GET /:id retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/usuarios/999').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(404);
  });

  it('POST /logout invalida el refresh_token', async () => {
    const res = await request(app).post('/api/v1/usuarios/logout').send({ refresh_token: refreshToken });
    expect(res.status).toBe(200);
  });

  it('POST /refresh retorna 403 despues del logout', async () => {
    const res = await request(app).post('/api/v1/usuarios/refresh').send({ refresh_token: refreshToken });
    expect(res.status).toBe(403);
  });
});
