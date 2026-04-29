import { Router } from 'express';
import type { Assignment } from '../src/app/core/models/assignment.model.js';

// In-memory store – replace with a database in production.
const assignments: Assignment[] = [];

export const assignmentRouter = Router();

assignmentRouter.get('/', (_req, res) => {
  res.json(assignments);
});

assignmentRouter.post('/', (req, res) => {
  const body = req.body as Partial<Assignment>;
  if (!body.date || !body.personId) {
    res.status(400).json({ error: 'date and personId are required' });
    return;
  }
  const assignment: Assignment = {
    id: crypto.randomUUID(),
    date: body.date as string,
    personId: body.personId as string,
    mealId: body.mealId,
    mealName: body.mealName,
    note: body.note,
    completed: false,
  };
  assignments.push(assignment);
  res.status(201).json(assignment);
});

assignmentRouter.patch('/:id', (req, res) => {
  const id = String(req.params['id']);
  const idx = assignments.findIndex((a) => a.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const patch = req.body as Partial<Assignment>;
  assignments[idx] = { ...assignments[idx], ...patch, id };
  res.json(assignments[idx]);
});

assignmentRouter.delete('/:id', (req, res) => {
  const id = String(req.params['id']);
  const idx = assignments.findIndex((a) => a.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  assignments.splice(idx, 1);
  res.status(204).send();
});
