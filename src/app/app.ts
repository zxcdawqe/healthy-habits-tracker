import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatCardModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  habit: Habit = {
    id: '',
    title: 'Моя привычка',
    completedDates: []
  };

  weekDays: string[] = [];

  constructor(private habitService: HabitService) {
    const habits = this.habitService.getAll();

    if (habits.length === 0) {
      this.habit = {
        id: crypto.randomUUID(),
        title: 'Моя привычка',
        completedDates: []
      };
      this.habitService.save([this.habit]);
    } else {
      this.habit = habits[0];

      if (!this.habit.completedDates) {
        this.habit.completedDates = [];
      }
    }

    this.weekDays = this.generateWeek();
  }

  generateWeek(): string[] {
    const days: string[] = [];
    const today = new Date();
    const day = today.getDay() || 7;
    today.setDate(today.getDate() - day + 2 );

    for (let i = 0; i < 7; i++) {
      days.push(today.toISOString().slice(0, 10));
      today.setDate(today.getDate() + 1);
    }
    return days;
  }

  toggle(date: string): void {
    this.habitService.toggleDay(this.habit.id, date);
    this.habit = this.habitService.getAll()[0];
  }

  isDone(date: string): boolean {
    return this.habit.completedDates.includes(date);
  }
}
