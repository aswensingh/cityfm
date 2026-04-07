import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(this.loadFromSession());

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  // Ideally login should be handled by BE API
  login(username: string, password: string) {
    return this.http.get<{ auth: { users: User[] } }>('/assets/data/mock-data.json').pipe(
      map(data => data.auth.users.find(u => u.username === username && u.password === password) ?? null),
      tap(user => {
        if (user) {
          const safeUser = { ...user, password: '' }; // Clear the password, don't store password in session
          this.userSignal.set(safeUser);
          sessionStorage.setItem('user', JSON.stringify(safeUser));
        }
      }),
      map(user => !!user)
    );
  }

  logout() {
    this.userSignal.set(null);
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private loadFromSession(): User | null {
    try {
      const raw = sessionStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
