import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        // If the token is expired, remove it and redirect to login
        this.authService.logout();
        return next.handle(request);
      } else {
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
    } else {
      // If there is no token, redirect to login
        this.authService.logout();
        return next.handle(request);
    }
    return next.handle(request);
  }
} 