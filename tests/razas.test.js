const request = require('supertest');
const app     = require('../src/app');

describe('Razas', () => {
  it('GET / retorna minimo 6 razas', async () => {
    const res = await request(app).get('/api/v1/razas');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
  });

  it('GET / filtra por tipo_animal', async () => {
    const res = await request(app).get('/api/v1/razas?tipo=perro');
    expect(res.status).toBe(200);
    res.body.forEach(r => expect(r.tipo_animal).toBe('perro'));
  });

  it('GET /:id retorna raza existente', async () => {
    const res = await request(app).get('/api/v1/razas/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /:id/recomendaciones retorna recomendaciones', async () => {
    const res = await request(app).get('/api/v1/razas/1/recomendaciones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /:id retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/razas/999');
    expect(res.status).toBe(404);
  });
});
