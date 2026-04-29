import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Assignment } from '../../../core/models/assignment.model';
import { Person } from '../../../core/models/person.model';

@Component({
  selector: 'app-assignment-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './assignment-card.component.html',
  styleUrl: './assignment-card.component.scss',
})
export class AssignmentCardComponent {
  readonly assignment = input.required<Assignment>();
  readonly person = input<Person | undefined>(undefined);
  readonly toggleComplete = output<{ id: string; completed: boolean }>();
  readonly delete = output<string>();

  onToggle(checked: boolean): void {
    this.toggleComplete.emit({ id: this.assignment().id, completed: checked });
  }

  onDelete(): void {
    this.delete.emit(this.assignment().id);
  }
}
