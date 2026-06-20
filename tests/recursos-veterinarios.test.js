const request = require('supertest');
const app     = require('../src/app');

describe('Recursos Veterinarios', () => {
  it('GET / retorna minimo 4 recursos', async () => {
    const res = await request(app).get('/api/v1/recursos-veterinarios');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
  });

  it('GET / filtra por tipo', async () => {
    const res = await request(app).get('/api/v1/recursos-veterinarios?tipo=clinica');
    expect(res.status).toBe(200);
    res.body.forEach(r => expect(r.tipo).toBe('clinica'));
  });

  it('GET /:id retorna recurso existente', async () => {
    const res = await request(app).get('/api/v1/recursos-veterinarios/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /:id retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/v1/recursos-veterinarios/999');
    expect(res.status).toBe(404);
  });
});
