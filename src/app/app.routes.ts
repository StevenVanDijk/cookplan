import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'schedule', pathMatch: 'full' },
  {
    path: 'schedule',
    loadComponent: () => import('./features/schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: 'people',
    loadComponent: () => import('./features/people/people.component').then((m) => m.PeopleComponent),
  },
  {
    path: 'meals',
    loadComponent: () => import('./features/meals/meals.component').then((m) => m.MealsComponent),
  },
  { path: '**', redirectTo: 'schedule' },
];
