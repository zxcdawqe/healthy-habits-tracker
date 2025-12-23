import { HabitService } from './habit.service';
import { Habit } from './habit.model';

describe('HabitService', () => {
  let service: HabitService;

  beforeEach(() => {
    localStorage.clear();
    service = new HabitService();
  });

  it('should add a new habit', () => {
    const habit: Habit = {
      id: '1',
      title: 'Тестовая привычка',
      completedDates: [],
      isMain: false
    };

    service.save([habit]);
    const habits = service.getAll();

    expect(habits.length).toBe(1);
    expect(habits[0].title).toBe('Тестовая привычка');
  });

  it('should toggle day completion', () => {
    const habit: Habit = {
      id: '1',
      title: 'Привычка',
      completedDates: [],
      isMain: false
    };

    service.save([habit]);

    service.toggleDay('1', '2025-01-01');
    let habits = service.getAll();

    expect(habits[0].completedDates.includes('2025-01-01')).toBeTrue();

    service.toggleDay('1', '2025-01-01');
    habits = service.getAll();

    expect(habits[0].completedDates.includes('2025-01-01')).toBeFalse();
  });

  it('should remove habit', () => {
    const habits: Habit[] = [
      { id: '1', title: 'A', completedDates: [], isMain: false },
      { id: '2', title: 'B', completedDates: [], isMain: false }
    ];

    service.save(habits);
    service.removeHabit('1');

    const result = service.getAll();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });
});
