import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../core/services/assignment.service';
import { PersonService } from '../../core/services/person.service';
import { MealService } from '../../core/services/meal.service';
import { AssignmentCardComponent } from '../../shared/components/assignment-card/assignment-card.component';

interface WeekDay {
  date: string;
  label: string;
  isToday: boolean;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    AssignmentCardComponent,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  private readonly assignmentService = inject(AssignmentService);
  private readonly personService = inject(PersonService);
  private readonly mealService = inject(MealService);

  readonly weekDays = computed<WeekDay[]>(() => buildWeek());
  readonly assignments = this.assignmentService.assignments;
  readonly persons = this.personService.persons;
  readonly meals = this.mealService.meals;

  selectedDay = signal<string | null>(null);
  selectedPersonId = signal<string>('');
  selectedMealId = signal<string>('');
  mealNameOverride = signal<string>('');
  note = signal<string>('');

  assignmentsForDay(date: string) {
    return this.assignments().filter((a) => a.date === date);
  }

  personFor(personId: string) {
    return this.personService.getById(personId);
  }

  openAdd(date: string): void {
    this.selectedDay.set(date);
    this.selectedPersonId.set('');
    this.selectedMealId.set('');
    this.mealNameOverride.set('');
    this.note.set('');
  }

  cancelAdd(): void {
    this.selectedDay.set(null);
  }

  confirmAdd(): void {
    const date = this.selectedDay();
    const personId = this.selectedPersonId();
    if (!date || !personId) return;

    const meal = this.mealService.getById(this.selectedMealId());
    const mealName = meal?.name ?? this.mealNameOverride() ?? undefined;

    this.assignmentService.add(
      date,
      personId,
      meal?.id,
      mealName || undefined,
      this.note() || undefined
    );
    this.selectedDay.set(null);
  }

  onToggleComplete(event: { id: string; completed: boolean }): void {
    this.assignmentService.markCompleted(event.id, event.completed);
  }

  onDelete(id: string): void {
    this.assignmentService.remove(id);
  }
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildWeek(): WeekDay[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  return DAY_NAMES.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    return { date, label: `${label} ${d.getDate()}`, isToday: date === todayStr };
  });
}
