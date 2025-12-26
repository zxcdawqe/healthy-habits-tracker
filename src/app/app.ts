import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { HabitService } from './habit.service';
import { Habit } from './habit.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  isRegisterMode = false;
  authError = '';

  loginForm = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required })
  });

  habits: Habit[] = [];
  weekDays: string[] = [];
  newHabitTitle = '';

  mainStreak = 0;

  constructor(
    public auth: AuthService,
    private habitService: HabitService
  ) {
    if (this.auth.isLoggedIn()) {
      this.initUserData();
    }
  }

  login(): void {
    const login = this.loginForm.value.login;
    const password = this.loginForm.value.password;

    if (!login || !password) {
      this.authError = 'Введите логин и пароль';
      return;
    }

    const ok = this.isRegisterMode
      ? this.auth.register(login, password)
      : this.auth.login(login, password);

    if (!ok) {
      this.authError = this.isRegisterMode
        ? 'Логин уже существует'
        : 'Неверный логин или пароль';
      return;
    }

    this.authError = '';
    this.initUserData();
  }

  logout(): void {
    this.auth.logout();
    this.isRegisterMode = false;
    this.authError = '';
    this.habits = [];
    this.weekDays = [];
    this.mainStreak = 0;
    this.loginForm.reset();
  }

  private initUserData(): void {
    this.habits = this.habitService.initIfEmpty();
    this.weekDays = this.generateWeek();
    this.recomputeMainStreak();
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
    this.recomputeMainStreak();
  }

  isDone(habit: Habit, date: string): boolean {
    return (habit.completedDates ?? []).includes(date);
  }

  addHabit(): void {
    if (!this.newHabitTitle.trim()) return;
    this.habits = this.habitService.addHabit(this.newHabitTitle.trim());
    this.newHabitTitle = '';
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

  getWeekDoneCount(habit: Habit): number {
    return this.weekDays.filter(d =>
      (habit.completedDates ?? []).includes(d)
    ).length;
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
    return 'Начни сегодня — и завтра будет легче';
  }
}
