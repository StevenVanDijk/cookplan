import { TestBed } from '@angular/core/testing';
import { PersonService } from './person.service';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonService);
  });

  // US-002: Add a person to the roster
  it('adds a person and reflects it in the signal', () => {
    service.add('Alice', '#ff0000');
    expect(service.persons().length).toBe(1);
    expect(service.persons()[0].name).toBe('Alice');
    expect(service.persons()[0].color).toBe('#ff0000');
  });

  // US-003: Remove a person from the roster
  it('removes a person by id', () => {
    service.add('Bob', '#00ff00');
    const id = service.persons()[0].id;
    service.remove(id);
    expect(service.persons().length).toBe(0);
  });

  it('returns a person by id', () => {
    service.add('Carol', '#0000ff');
    const id = service.persons()[0].id;
    expect(service.getById(id)?.name).toBe('Carol');
  });

  it('returns undefined for unknown id', () => {
    expect(service.getById('unknown')).toBeUndefined();
  });

  it('persists persons to localStorage', () => {
    service.add('Dave', '#aabbcc');
    const stored = JSON.parse(localStorage.getItem('cookplan_persons') ?? '[]') as unknown[];
    expect(stored.length).toBe(1);
  });
});
