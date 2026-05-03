import { TestBed } from '@angular/core/testing';
import { MealService } from './meal.service';

describe('MealService', () => {
  let service: MealService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealService);
  });

  // US-007: Add a meal idea to the meal list
  it('adds a meal and reflects it in the signal', () => {
    service.add('Pasta', 'Classic spaghetti', ['italian', 'quick']);
    expect(service.meals().length).toBe(1);
    expect(service.meals()[0].name).toBe('Pasta');
    expect(service.meals()[0].tags).toContain('italian');
  });

  // US-008: Remove a meal idea
  it('removes a meal by id', () => {
    service.add('Salad');
    const id = service.meals()[0].id;
    service.remove(id);
    expect(service.meals().length).toBe(0);
  });

  it('returns a meal by id', () => {
    service.add('Soup');
    const id = service.meals()[0].id;
    expect(service.getById(id)?.name).toBe('Soup');
  });

  it('persists meals to localStorage', () => {
    service.add('Pizza');
    const stored = JSON.parse(localStorage.getItem('cookplan_meals') ?? '[]') as unknown[];
    expect(stored.length).toBe(1);
  });
});
