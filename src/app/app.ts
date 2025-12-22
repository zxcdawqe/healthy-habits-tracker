import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  habits: Habit[] = [];
  weekDays: string[] = [];
  newHabitTitle = '';

  constructor(private habitService: HabitService) {
    this.habits = this.habitService.initIfEmpty();
    this.weekDays = this.generateWeek();
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
  }

  isDone(habit: Habit, date: string): boolean {
    return habit.completedDates.includes(date);
  }

  addHabit(): void {
    if (!this.newHabitTitle.trim()) return;
    this.habits = this.habitService.addHabit(this.newHabitTitle.trim());
    this.newHabitTitle = '';
  }

  updateTitle(habit: Habit, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.habits = this.habitService.updateTitle(habit.id, value);
  }
}
