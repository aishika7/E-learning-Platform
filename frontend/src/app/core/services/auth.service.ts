import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly USER_KEY = 'elearn_user';
  private readonly TOKEN_KEY = 'elearn_token';

  // BehaviorSubject = Zustand store equivalent
  private state$ = new BehaviorSubject<AuthState>({
    user: this.getStoredUser(),
    token: this.getStoredToken(),
    isAuthenticated: !!this.getStoredToken(),
    isLoading: false
  });

  // Signals for template reads
  user = toSignal(this.state$.pipe(map(s => s.user)));
  isAuthenticated = toSignal(this.state$.pipe(map(s => s.isAuthenticated)), { initialValue: !!this.getStoredToken() });
  isLoading = toSignal(this.state$.pipe(map(s => s.isLoading)), { initialValue: false });

  // ─── Local Storage Helpers ──────────────────────────────────────────────────

  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ─── API Methods ────────────────────────────────────────────────────────────

  login(credentials: any): Observable<AuthResponse> {
    this.state$.next({ ...this.state$.value, isLoading: true });
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data.token, res.data.user);
          this.state$.next({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false
          });
        }
      }),
      catchError(err => {
        this.state$.next({ ...this.state$.value, isLoading: false });
        return throwError(() => err);
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    this.state$.next({ ...this.state$.value, isLoading: true });
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data.token, res.data.user);
          this.state$.next({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false
          });
        }
      }),
      catchError(err => {
        this.state$.next({ ...this.state$.value, isLoading: false });
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.state$.next({ user: null, token: null, isAuthenticated: false, isLoading: false });
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password/${token}`, { password });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<AuthResponse>(`${environment.apiUrl}/auth/profile`, data).pipe(
      tap(res => {
        if (res.success && res.data) {
          const newToken = res.data.token || this.getToken()!;
          this.setSession(newToken, res.data.user);
          this.state$.next({
            ...this.state$.value,
            user: res.data.user,
            token: newToken
          });
        }
      })
    );
  }

  // ─── Accessors ──────────────────────────────────────────────────────────────

  getRole(): 'admin' | 'instructor' | 'student' | null {
    return this.state$.value.user?.role ?? null;
  }

  getToken(): string | null {
    return this.state$.value.token;
  }

  isLoggedInSync(): boolean {
    return this.state$.value.isAuthenticated;
  }

  redirectToDashboard(): void {
    const role = this.getRole();
    if (role === 'admin') this.router.navigate(['/app/admin/dashboard']);
    else if (role === 'instructor') this.router.navigate(['/app/instructor/dashboard']);
    else if (role === 'student') this.router.navigate(['/app/student/dashboard']);
    else this.router.navigate(['/auth/login']);
  }
}
