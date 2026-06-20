const request = require('supertest');
const app     = require('../src/app');

describe('Tutoriales', () => {
  it('GET / retorna minimo 5 tutoriales', async () => {
    const res = await request(app).get('/api/v1/tutoriales');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });

  it('GET / filtra por nivel_dificultad', async () => {
    const res = await request(app).get('/api/v1/tutoriales?nivel=facil');
    expect(res.status).toBe(200);
    res.body.forEach(t => expect(t.nivel_dificultad).toBe('facil'));
  });

  it('GET /:id retorna tutorial existente', async () => {
    const res = await request(app).get('/api/v1/tutoriales/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /:id retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/tutoriales/999');
    expect(res.status).toBe(404);
  });
});
