export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // YYYY-MM-DD
  isMain: boolean;
}
