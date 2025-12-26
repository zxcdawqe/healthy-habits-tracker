import { Injectable } from '@angular/core';

export interface User {
  login: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USERS_KEY = 'users';
  private readonly CURRENT_KEY = 'current_user';

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  login(login: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      u => u.login === login && u.password === password
    );

    if (!user) return false;

    localStorage.setItem(this.CURRENT_KEY, JSON.stringify(user));
    return true;
  }

  register(login: string, password: string): boolean {
    const users = this.getUsers();

    if (users.some(u => u.login === login)) {
      return false; // логин занят
    }

    const newUser: User = { login, password };
    users.push(newUser);
    this.saveUsers(users);

    localStorage.setItem(this.CURRENT_KEY, JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.CURRENT_KEY);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
