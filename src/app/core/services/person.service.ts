import { Injectable, signal, computed } from '@angular/core';
import { Person } from '../models/person.model';

const STORAGE_KEY = 'cookplan_persons';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly _persons = signal<Person[]>(this.load());

  readonly persons = this._persons.asReadonly();
  readonly count = computed(() => this._persons().length);

  add(name: string, color: string): void {
    const person: Person = { id: crypto.randomUUID(), name: name.trim(), color };
    this._persons.update((list) => [...list, person]);
    this.save();
  }

  remove(id: string): void {
    this._persons.update((list) => list.filter((p) => p.id !== id));
    this.save();
  }

  getById(id: string): Person | undefined {
    return this._persons().find((p) => p.id === id);
  }

  private load(): Person[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Person[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._persons()));
  }
}
