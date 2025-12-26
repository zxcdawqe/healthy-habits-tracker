import { Injectable } from '@angular/core';
import { Habit } from './habit.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HabitService {

  constructor(private auth: AuthService) {}

  private storageKey(): string {
    const user = this.auth.getUser();
    return user ? `habits_${user.login}` : 'habits_guest';
  }

  getAll(): Habit[] {
    const raw = localStorage.getItem(this.storageKey());
    return raw ? JSON.parse(raw) : [];
  }

  save(habits: Habit[]): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(habits));
  }

  initIfEmpty(): Habit[] {
    const habits = this.getAll();
    if (habits.length > 0) return habits;

    const initial: Habit[] = [
      {
        id: crypto.randomUUID(),
        title: 'Зарядка утром',
        completedDates: [],
        isMain: true
      },
      {
        id: crypto.randomUUID(),
        title: 'Чтение',
        completedDates: [],
        isMain: true
      },
      {
        id: crypto.randomUUID(),
        title: '5k шагов',
        completedDates: [],
        isMain: true
      }
    ];

    this.save(initial);
    return initial;
  }

  toggleDay(habitId: string, date: string): Habit[] {
    const habits = this.getAll();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return habits;

    habit.completedDates ??= [];
    const index = habit.completedDates.indexOf(date);

    if (index >= 0) {
      habit.completedDates.splice(index, 1);
    } else {
      habit.completedDates.push(date);
    }

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

    if (habit) {
      habit.title = title;
    }

    this.save(habits);
    return habits;
  }

  removeHabit(id: string): Habit[] {
    const habits = this.getAll().filter(h => h.id !== id);
    this.save(habits);
    return habits;
  }
}
