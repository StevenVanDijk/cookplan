import { Router } from 'express';
import type { Meal } from '../src/app/core/models/meal.model.js';
import { supabase } from './_supabase.js';

export const mealRouter = Router();

mealRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('meals').select('*');
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

mealRouter.post('/', async (req, res) => {
  const body = req.body as Partial<Meal>;
  if (!body.name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const { data, error } = await supabase
    .from('meals')
    .insert({
      name: (body.name as string).trim(),
      description: body.description ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
    })
    .select()
    .single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
});

mealRouter.delete('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
});
