import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './_create-app.js';

// Mutable store accessible inside vi.mock factory via vi.hoisted
const store = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[] }));

vi.mock('./_supabase.js', () => ({
  supabase: {
    from: (_table: string) => ({
      select: () =>
        Promise.resolve({ data: store.rows.slice(), error: null }),
      insert: (data: Record<string, unknown>) => ({
        select: () => ({
          single: () => {
            const row = { id: crypto.randomUUID(), completed: false, ...data };
            store.rows.push(row);
            return Promise.resolve({ data: row, error: null });
          },
        }),
      }),
      update: (patch: Record<string, unknown>) => ({
        eq: (_col: string, id: string) => ({
          select: () => ({
            single: () => {
              const idx = store.rows.findIndex((r) => r['id'] === id);
              if (idx === -1) {
                return Promise.resolve({
                  data: null,
                  error: { code: 'PGRST116', message: 'Not found' },
                });
              }
              store.rows[idx] = { ...store.rows[idx], ...patch };
              return Promise.resolve({ data: store.rows[idx], error: null });
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (_col: string, id: string) => {
          const idx = store.rows.findIndex((r) => r['id'] === id);
          if (idx !== -1) store.rows.splice(idx, 1);
          return Promise.resolve({ error: null });
        },
      }),
    }),
  },
}));

async function buildApp() {
  const { assignmentRouter } = await import('./_assignment-routes.js');
  return createApp('/api/assignments', assignmentRouter);
}

describe('Assignments API', () => {
  beforeEach(() => {
    store.rows.length = 0;
  });

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
