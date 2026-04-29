import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MealService } from '../../core/services/meal.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent {
  private readonly mealService = inject(MealService);

  readonly meals = this.mealService.meals;

  newName = signal<string>('');
  newDescription = signal<string>('');
  newTagsRaw = signal<string>('');

  add(): void {
    const name = this.newName().trim();
    if (!name) return;
    const tags = this.newTagsRaw()
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    this.mealService.add(name, this.newDescription().trim() || undefined, tags);
    this.newName.set('');
    this.newDescription.set('');
    this.newTagsRaw.set('');
  }

  remove(id: string): void {
    this.mealService.remove(id);
  }
}
