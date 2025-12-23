import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  habits: Habit[] = [];
  weekDays: string[] = [];
  newHabitTitle = '';

  mainStreak = 0; // серия по 3/3 основным

  constructor(private habitService: HabitService) {
    this.habits = this.habitService.initIfEmpty();
    this.weekDays = this.generateWeek();
    this.recomputeMainStreak();
  }

  private todayISO(): string {
    // тот же формат, что и в completedDates: YYYY-MM-DD
    return new Date().toISOString().slice(0, 10);
  }

  private addDaysISO(iso: string, deltaDays: number): string {
    const d = new Date(iso + 'T00:00:00.000Z');
    d.setUTCDate(d.getUTCDate() + deltaDays);
    return d.toISOString().slice(0, 10);
  }

  // дни, когда выполнены все основные привычки
  private getAllMainDoneDates(): Set<string> {
    const mains = this.habits.filter(h => h.isMain);

    // если вдруг основных меньше 3 — считаем streak = 0
    if (mains.length < 3) return new Set();

    // пересечение множеств completedDates всех main
    let intersection = new Set<string>(mains[0].completedDates ?? []);

    for (let i = 1; i < mains.length; i++) {
      const s = new Set<string>(mains[i].completedDates ?? []);
      intersection = new Set([...intersection].filter(x => s.has(x)));
    }

    return intersection;
  }

private recomputeMainStreak(): void {
  const mainHabits = this.habits.filter(h => h.isMain);

  if (mainHabits.length < 3) {
    this.mainStreak = 0;
    return;
  }

  let count = 0;

  for (const day of this.weekDays) {
    const allDone = mainHabits.every(h =>
      (h.completedDates ?? []).includes(day)
    );

    if (allDone) count++;
  }

  this.mainStreak = count;
}
  generateWeek(): string[] {
    const days: string[] = [];
    const today = new Date();
    const day = today.getDay() || 7;
    today.setDate(today.getDate() - day + 1);

    for (let i = 0; i < 7; i++) {
      days.push(today.toISOString().slice(0, 10));
      today.setDate(today.getDate() + 1);
    }
    return days;
  }

  toggle(habitId: string, date: string): void {
    this.habits = this.habitService.toggleDay(habitId, date);
    this.recomputeMainStreak(); // обновляем streak после клика
  }

  isDone(habit: Habit, date: string): boolean {
    return (habit.completedDates ?? []).includes(date);
  }

  addHabit(): void {
    if (!this.newHabitTitle.trim()) return;
    this.habits = this.habitService.addHabit(this.newHabitTitle.trim());
    this.newHabitTitle = '';
    // streak не зависит от дополнительных, но пусть будет актуален
    this.recomputeMainStreak();
  }

  updateTitle(habit: Habit, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.habits = this.habitService.updateTitle(habit.id, value);
  }

  removeHabit(habit: Habit): void {
    if (habit.isMain) return;
    this.habits = this.habitService.removeHabit(habit.id);
    this.recomputeMainStreak();
  }

  getWeekDoneCount(habit: any): number {
  return this.weekDays.filter(d =>
    habit.completedDates.includes(d)
  ).length;
  }

  getStreakMessage(): string {
  if (this.mainStreak === 7) {
    return 'Ты ваще легенда!!! 🔥🔥🔥';
  }
  if (this.mainStreak >= 5) {
    return 'Отличный темп, не сбавляй 💪💪💪';
  }
  if (this.mainStreak >= 3) {
    return 'Хорошее начало 👍👍👍';
  }
  return 'Начни сегодня - и завтра будет легче';
}

}
