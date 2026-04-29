import { Router } from 'express';
import type { Meal } from '../src/app/core/models/meal.model.js';

const meals: Meal[] = [];

export const mealRouter = Router();

mealRouter.get('/', (_req, res) => {
  res.json(meals);
});

mealRouter.post('/', (req, res) => {
  const body = req.body as Partial<Meal>;
  if (!body.name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const meal: Meal = {
    id: crypto.randomUUID(),
    name: (body.name as string).trim(),
    description: body.description,
    tags: Array.isArray(body.tags) ? body.tags : [],
  };
  meals.push(meal);
  res.status(201).json(meal);
});

mealRouter.delete('/:id', (req, res) => {
  const id = String(req.params['id']);
  const idx = meals.findIndex((m) => m.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  meals.splice(idx, 1);
  res.status(204).send();
});
