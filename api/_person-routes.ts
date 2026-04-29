import { Router } from 'express';
import type { Person } from '../src/app/core/models/person.model.js';

const persons: Person[] = [];

export const personRouter = Router();

personRouter.get('/', (_req, res) => {
  res.json(persons);
});

personRouter.post('/', (req, res) => {
  const body = req.body as Partial<Person>;
  if (!body.name || !body.color) {
    res.status(400).json({ error: 'name and color are required' });
    return;
  }
  const person: Person = {
    id: crypto.randomUUID(),
    name: (body.name as string).trim(),
    color: body.color as string,
  };
  persons.push(person);
  res.status(201).json(person);
});

personRouter.delete('/:id', (req, res) => {
  const id = String(req.params['id']);
  const idx = persons.findIndex((p) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  persons.splice(idx, 1);
  res.status(204).send();
});
