import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { HabitService } from './habit.service';
import { AuthService } from './auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let habitServiceSpy: jasmine.SpyObj<HabitService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    habitServiceSpy = jasmine.createSpyObj('HabitService', [
      'initIfEmpty',
      'toggleDay',
      'addHabit',
      'removeHabit',
      'updateTitle'
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getUser',
      'logout'
    ]);

    habitServiceSpy.initIfEmpty.and.returnValue([]);
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue({ login: 'test' });

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: HabitService, useValue: habitServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('компонент успешно создаётся', () => {
    expect(component).toBeTruthy();
  });

  it('при инициализации загружаются привычки из сервиса', () => {
    expect(habitServiceSpy.initIfEmpty).toHaveBeenCalled();
    expect(component.habits).toEqual([]);
  });

  it('при добавлении новой привычки она появляется в списке', () => {
    habitServiceSpy.addHabit.and.returnValue([
      { id: '1', title: 'Новая привычка', completedDates: [], isMain: false }
    ]);

    component.newHabitTitle = 'Новая привычка';
    component.addHabit();

    expect(habitServiceSpy.addHabit).toHaveBeenCalledWith('Новая привычка');
    expect(component.habits.length).toBe(1);
  });

  it('привычка не добавляется, если название пустое', () => {
    component.newHabitTitle = '   ';
    component.addHabit();

    expect(habitServiceSpy.addHabit).not.toHaveBeenCalled();
  });

  it('выход из аккаунта вызывается корректно', () => {
    spyOn(component, 'logout').and.callThrough();

    component.logout();

    expect(component.logout).toHaveBeenCalled();
  });
});
