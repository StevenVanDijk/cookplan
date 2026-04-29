import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './_create-app.js';

async function buildApp() {
  const { mealRouter } = await import('./_meal-routes.js?t=' + Date.now());
  return createApp('/api/meals', mealRouter);
}

describe('Meals API', () => {
  // US-007: Add a meal idea
  it('POST /api/meals creates a meal', async () => {
    const app = await buildApp();
    const res = await request(app)
      .post('/api/meals')
      .send({ name: 'Risotto', tags: ['italian'] });
    expect(res.status).toBe(201);
    expect((res.body as { name: string }).name).toBe('Risotto');
    expect((res.body as { tags: string[] }).tags).toContain('italian');
  });

  it('POST /api/meals returns 400 when name is missing', async () => {
    const app = await buildApp();
    const res = await request(app).post('/api/meals').send({});
    expect(res.status).toBe(400);
  });

  // US-008: Remove a meal idea
  it('DELETE /api/meals/:id removes the meal', async () => {
    const app = await buildApp();
    const post = await request(app).post('/api/meals').send({ name: 'Soup', tags: [] });
    const id = (post.body as { id: string }).id;
    const del = await request(app).delete(`/api/meals/${id}`);
    expect(del.status).toBe(204);
  });
});
