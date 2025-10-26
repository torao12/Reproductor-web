// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  setToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('spotify_token', token);
  }

  getToken(): string | null {
    return this.accessToken || localStorage.getItem('spotify_token');
  }

  clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem('spotify_token');
  }
}