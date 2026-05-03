import { Injectable, signal, computed } from '@angular/core';
import { Assignment } from '../models/assignment.model';

const STORAGE_KEY = 'cookplan_assignments';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly _assignments = signal<Assignment[]>(this.load());

  readonly assignments = this._assignments.asReadonly();

  readonly weekAssignments = computed(() => {
    const { start, end } = currentWeekRange();
    return this._assignments().filter((a) => a.date >= start && a.date <= end);
  });

  add(date: string, personId: string, mealId?: string, mealName?: string, note?: string): void {
    const assignment: Assignment = {
      id: crypto.randomUUID(),
      date,
      personId,
      mealId,
      mealName,
      note,
      completed: false,
    };
    this._assignments.update((list) => [...list, assignment]);
    this.save();
  }

  remove(id: string): void {
    this._assignments.update((list) => list.filter((a) => a.id !== id));
    this.save();
  }

  markCompleted(id: string, completed: boolean): void {
    this._assignments.update((list) =>
      list.map((a) => (a.id === id ? { ...a, completed } : a))
    );
    this.save();
  }

  forDate(date: string): Assignment[] {
    return this._assignments().filter((a) => a.date === date);
  }

  private load(): Assignment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Assignment[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._assignments()));
  }
}

function currentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toIsoDate(monday), end: toIsoDate(sunday) };
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
