import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /health', () => {
  it('returns ok status without touching the database', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, status: 'ok' });
  });
});

describe('unknown route', () => {
  it('returns a 404 envelope from the notFoundHandler', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
