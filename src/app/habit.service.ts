import { Injectable } from '@angular/core';
import { Habit } from './habit.model';

const STORAGE_KEY = 'habits';

@Injectable({ providedIn: 'root' })
export class HabitService {

  getAll(): Habit[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  save(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }

  toggleDay(habitId: string, date: string): void {
    const habits = this.getAll();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const index = habit.completedDates.indexOf(date);
    if (index >= 0) {
      habit.completedDates.splice(index, 1);
    } else {
      habit.completedDates.push(date);
    }

    this.save(habits);
  }
}
