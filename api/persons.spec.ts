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
  const { personRouter } = await import('./_person-routes.js');
  return createApp('/api/persons', personRouter);
}

describe('Persons API', () => {
  beforeEach(() => {
    store.rows.length = 0;
  });

  // US-002: Add a person to the roster
  it('POST /api/persons creates a person', async () => {
    const app = await buildApp();
    const res = await request(app).post('/api/persons').send({ name: 'Alice', color: '#ff0000' });
    expect(res.status).toBe(201);
    expect((res.body as { name: string }).name).toBe('Alice');
  });

  it('POST /api/persons returns 400 when name is missing', async () => {
    const app = await buildApp();
    const res = await request(app).post('/api/persons').send({ color: '#ff0000' });
    expect(res.status).toBe(400);
  });

  // US-003: Remove a person
  it('DELETE /api/persons/:id removes the person', async () => {
    const app = await buildApp();
    const post = await request(app)
      .post('/api/persons')
      .send({ name: 'Bob', color: '#00ff00' });
    const id = (post.body as { id: string }).id;
    const del = await request(app).delete(`/api/persons/${id}`);
    expect(del.status).toBe(204);
  });
});
