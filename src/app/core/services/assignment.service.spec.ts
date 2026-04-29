import { TestBed } from '@angular/core/testing';
import { AssignmentService } from './assignment.service';

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentService);
  });

  // US-004: Assign a person to cook on a specific day
  it('adds an assignment and reflects it in the signal', () => {
    service.add('2026-04-28', 'person-1', undefined, 'Pasta');
    expect(service.assignments().length).toBe(1);
    expect(service.assignments()[0].personId).toBe('person-1');
    expect(service.assignments()[0].mealName).toBe('Pasta');
    expect(service.assignments()[0].completed).toBeFalse();
  });

  // US-005: Attach a meal idea to an assignment
  it('stores mealId and mealName when provided', () => {
    service.add('2026-04-28', 'person-1', 'meal-42', 'Risotto');
    const a = service.assignments()[0];
    expect(a.mealId).toBe('meal-42');
    expect(a.mealName).toBe('Risotto');
  });

  // US-006: Mark an assignment as completed
  it('marks an assignment as completed', () => {
    service.add('2026-04-28', 'person-1');
    const id = service.assignments()[0].id;
    service.markCompleted(id, true);
    expect(service.assignments()[0].completed).toBeTrue();
  });

  it('removes an assignment by id', () => {
    service.add('2026-04-28', 'person-1');
    const id = service.assignments()[0].id;
    service.remove(id);
    expect(service.assignments().length).toBe(0);
  });

  it('filters assignments by date', () => {
    service.add('2026-04-28', 'person-1');
    service.add('2026-04-29', 'person-2');
    expect(service.forDate('2026-04-28').length).toBe(1);
    expect(service.forDate('2026-04-29').length).toBe(1);
    expect(service.forDate('2026-04-30').length).toBe(0);
  });

  it('persists assignments to localStorage', () => {
    service.add('2026-04-28', 'person-1');
    const stored = JSON.parse(
      localStorage.getItem('cookplan_assignments') ?? '[]'
    ) as unknown[];
    expect(stored.length).toBe(1);
  });
});
