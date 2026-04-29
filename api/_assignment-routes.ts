import { Router } from 'express';
import type { Assignment } from '../src/app/core/models/assignment.model.js';
import { supabase } from './_supabase.js';

export const assignmentRouter = Router();

interface DbRow {
  id: string;
  date: string;
  person_id: string;
  meal_id: string | null;
  meal_name: string | null;
  note: string | null;
  completed: boolean;
}

function toModel(row: DbRow): Assignment {
  return {
    id: row.id,
    date: row.date,
    personId: row.person_id,
    mealId: row.meal_id ?? undefined,
    mealName: row.meal_name ?? undefined,
    note: row.note ?? undefined,
    completed: row.completed,
  };
}

assignmentRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('assignments').select('*');
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json((data as DbRow[]).map(toModel));
});

assignmentRouter.post('/', async (req, res) => {
  const body = req.body as Partial<Assignment>;
  if (!body.date || !body.personId) {
    res.status(400).json({ error: 'date and personId are required' });
    return;
  }
  const { data, error } = await supabase
    .from('assignments')
    .insert({
      date: body.date,
      person_id: body.personId,
      meal_id: body.mealId ?? null,
      meal_name: body.mealName ?? null,
      note: body.note ?? null,
      completed: false,
    })
    .select()
    .single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(toModel(data as DbRow));
});

assignmentRouter.patch('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const body = req.body as Partial<Assignment>;
  const patch: Partial<DbRow> = {};
  if (body.completed !== undefined) patch.completed = body.completed;
  if (body.mealName !== undefined) patch.meal_name = body.mealName;
  if (body.note !== undefined) patch.note = body.note;

  const { data, error } = await supabase
    .from('assignments')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    const status = (error as { code?: string }).code === 'PGRST116' ? 404 : 500;
    res.status(status).json({ error: error.message });
    return;
  }
  res.json(toModel(data as DbRow));
});

assignmentRouter.delete('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const { error } = await supabase.from('assignments').delete().eq('id', id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
});
