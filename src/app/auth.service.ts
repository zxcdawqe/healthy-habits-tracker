import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USER_KEY = 'current_user';

  login(login: string, password: string): boolean {
    const user = { login, password };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  getUser(): { login: string } | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
