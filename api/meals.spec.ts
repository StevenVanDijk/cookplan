import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './_create-app.js';

const store = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[] }));

vi.mock('./_supabase.js', () => ({
  supabase: {
    from: (_table: string) => ({
      select: () => Promise.resolve({ data: store.rows.slice(), error: null }),
      insert: (data: Record<string, unknown>) => ({
        select: () => ({
          single: () => {
            const row = { id: crypto.randomUUID(), ...data };
            store.rows.push(row);
            return Promise.resolve({ data: row, error: null });
          },
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
  const { mealRouter } = await import('./_meal-routes.js');
  return createApp('/api/meals', mealRouter);
}

describe('Meals API', () => {
  beforeEach(() => {
    store.rows.length = 0;
  });

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
