import { TestBed } from '@angular/core/testing';
import { HabitService } from './habit.service';
import { AuthService } from './auth.service';
import { Habit } from './habit.model';

describe('HabitService', () => {
  let service: HabitService;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    TestBed.configureTestingModule({
      providers: [
        HabitService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(HabitService);
  });

  it('сервис успешно создаётся', () => {
    expect(service).toBeTruthy();
  });

  it('возвращает пустой список привычек, если хранилище пустое', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const habits = service.getAll();

    expect(habits.length).toBe(0);
  });

  it('инициализирует основные привычки, если данных нет в хранилище', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    const habits = service.initIfEmpty();

    expect(habits.length).toBe(3);
    expect(habits.every(h => h.isMain)).toBeTrue();
  });

  it('добавляет новую привычку', () => {
    spyOn(localStorage, 'getItem').and.returnValue('[]');
    spyOn(localStorage, 'setItem');

    const habits = service.addHabit('Test Habit');

    expect(habits.length).toBe(1);
    expect(habits[0].title).toBe('Test Habit');
    expect(habits[0].isMain).toBeFalse();
  });

  it('отмечает день как выполненный для привычки', () => {
    const habit: Habit = {
      id: '1',
      title: 'Test',
      completedDates: [],
      isMain: false
    };

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([habit]));
    spyOn(localStorage, 'setItem');

    const updated = service.toggleDay('1', '2025-12-26');

    expect(updated[0].completedDates.includes('2025-12-26')).toBeTrue();
  });

  it('удаляет привычку по идентификатору', () => {
    const habits: Habit[] = [
      { id: '1', title: 'A', completedDates: [], isMain: false },
      { id: '2', title: 'B', completedDates: [], isMain: false }
    ];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(habits));
    spyOn(localStorage, 'setItem');

    const updated = service.removeHabit('1');

    expect(updated.length).toBe(1);
    expect(updated[0].id).toBe('2');
  });

  it('изменяет название существующей привычки', () => {
    const habits: Habit[] = [
      { id: '1', title: 'Old title', completedDates: [], isMain: false }
    ];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(habits));
    spyOn(localStorage, 'setItem');

    const updated = service.updateTitle('1', 'New title');

    expect(updated[0].title).toBe('New title');
  });
});
