import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './_create-app.js';

// Re-import the router fresh for each test suite to get a clean in-memory store.
async function buildApp() {
  const { assignmentRouter } = await import('./_assignment-routes.js?t=' + Date.now());
  return createApp('/api/assignments', assignmentRouter);
}

describe('Assignments API', () => {
  // US-004: Assign a person to cook on a specific day
  it('POST /api/assignments creates an assignment', async () => {
    const app = await buildApp();
    const res = await request(app)
      .post('/api/assignments')
      .send({ date: '2026-04-28', personId: 'person-1', mealName: 'Pasta' });
    expect(res.status).toBe(201);
    expect(res.body.personId).toBe('person-1');
    expect(res.body.mealName).toBe('Pasta');
    expect(res.body.completed).toBe(false);
  });

  it('POST /api/assignments returns 400 when date is missing', async () => {
    const app = await buildApp();
    const res = await request(app).post('/api/assignments').send({ personId: 'person-1' });
    expect(res.status).toBe(400);
  });

  it('GET /api/assignments returns list', async () => {
    const app = await buildApp();
    await request(app)
      .post('/api/assignments')
      .send({ date: '2026-04-28', personId: 'person-1' });
    const res = await request(app).get('/api/assignments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect((res.body as unknown[]).length).toBeGreaterThanOrEqual(1);
  });

  // US-006: Mark assignment as completed
  it('PATCH /api/assignments/:id marks completed', async () => {
    const app = await buildApp();
    const post = await request(app)
      .post('/api/assignments')
      .send({ date: '2026-04-28', personId: 'person-1' });
    const id = (post.body as { id: string }).id;
    const patch = await request(app)
      .patch(`/api/assignments/${id}`)
      .send({ completed: true });
    expect(patch.status).toBe(200);
    expect((patch.body as { completed: boolean }).completed).toBe(true);
  });

  it('DELETE /api/assignments/:id removes the assignment', async () => {
    const app = await buildApp();
    const post = await request(app)
      .post('/api/assignments')
      .send({ date: '2026-04-28', personId: 'person-1' });
    const id = (post.body as { id: string }).id;
    const del = await request(app).delete(`/api/assignments/${id}`);
    expect(del.status).toBe(204);
  });
});
