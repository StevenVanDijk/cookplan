import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { PersonService } from '../../core/services/person.service';

const PALETTE = ['#e53935', '#8e24aa', '#1e88e5', '#00897b', '#f4511e', '#6d4c41', '#546e7a'];

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
})
export class PeopleComponent {
  private readonly personService = inject(PersonService);

  readonly persons = this.personService.persons;

  newName = signal<string>('');
  newColor = signal<string>(PALETTE[0]);

  readonly palette = PALETTE;

  add(): void {
    const name = this.newName().trim();
    if (!name) return;
    this.personService.add(name, this.newColor());
    this.newName.set('');
    this.newColor.set(PALETTE[this.persons().length % PALETTE.length]);
  }

  remove(id: string): void {
    this.personService.remove(id);
  }
}
