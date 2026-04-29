export interface Assignment {
  id: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  personId: string;
  mealId?: string;
  mealName?: string;
  note?: string;
  completed: boolean;
}
