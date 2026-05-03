import { Router } from 'express';
import type { Person } from '../src/app/core/models/person.model.js';
import { supabase } from './_supabase.js';

export const personRouter = Router();

personRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('persons').select('*');
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
});

personRouter.post('/', async (req, res) => {
  const body = req.body as Partial<Person>;
  if (!body.name || !body.color) {
    res.status(400).json({ error: 'name and color are required' });
    return;
  }
  const { data, error } = await supabase
    .from('persons')
    .insert({ name: (body.name as string).trim(), color: body.color })
    .select()
    .single();
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
});

personRouter.delete('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const { error } = await supabase.from('persons').delete().eq('id', id);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
});
