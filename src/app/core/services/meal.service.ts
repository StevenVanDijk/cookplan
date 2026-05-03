import { Injectable, signal, computed } from '@angular/core';
import { Meal } from '../models/meal.model';

const STORAGE_KEY = 'cookplan_meals';

@Injectable({ providedIn: 'root' })
export class MealService {
  private readonly _meals = signal<Meal[]>(this.load());

  readonly meals = this._meals.asReadonly();
  readonly count = computed(() => this._meals().length);

  add(name: string, description?: string, tags: string[] = []): void {
    const meal: Meal = { id: crypto.randomUUID(), name: name.trim(), description, tags };
    this._meals.update((list) => [...list, meal]);
    this.save();
  }

  remove(id: string): void {
    this._meals.update((list) => list.filter((m) => m.id !== id));
    this.save();
  }

  getById(id: string): Meal | undefined {
    return this._meals().find((m) => m.id === id);
  }

  private load(): Meal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Meal[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._meals()));
  }
}
