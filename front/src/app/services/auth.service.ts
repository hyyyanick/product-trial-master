import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { RegisterPostData, User } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.baseApiUrl + '/users';
  private readonly http = inject(HttpClient);
  private router = inject(Router);

  private readonly token = signal<string | null>(localStorage.getItem('token'));
  public readonly isLoggedIn = computed(() => !!this.token());

  registerUser(postData: RegisterPostData) {
    return this.http.post(`${this.baseUrl}/account`, postData);
  }

  login(email: string, password: string): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.baseUrl}/token`, { email, password }).pipe(
      tap(response => {
        this.token.set(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.router.navigate(['/login']);
  }
}