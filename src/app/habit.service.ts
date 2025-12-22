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

  initIfEmpty(): Habit[] {
    const habits = this.getAll();
    if (habits.length > 0) return habits;

    const initial: Habit[] = [
      { id: crypto.randomUUID(), title: 'Зарядка утром', completedDates: [], isMain: true },
      { id: crypto.randomUUID(), title: 'Чтение', completedDates: [], isMain: true },
      { id: crypto.randomUUID(), title: '5k шагов', completedDates: [], isMain: true }
    ];

    this.save(initial);
    return initial;
  }

  toggleDay(habitId: string, date: string): Habit[] {
    const habits = this.getAll();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return habits;

    habit.completedDates ??= [];
    const i = habit.completedDates.indexOf(date);
    i >= 0 ? habit.completedDates.splice(i, 1) : habit.completedDates.push(date);

    this.save(habits);
    return habits;
  }

  addHabit(title: string): Habit[] {
    const habits = this.getAll();
    habits.push({
      id: crypto.randomUUID(),
      title,
      completedDates: [],
      isMain: false
    });
    this.save(habits);
    return habits;
  }

  updateTitle(id: string, title: string): Habit[] {
    const habits = this.getAll();
    const habit = habits.find(h => h.id === id);
    if (habit) habit.title = title;
    this.save(habits);
    return habits;
  }
}
