import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string; // supposons que ton backend renvoie un JWT
  username: string;
}

interface RegisterResponse {
  message: string;
  token?: string; // Token optionnel pour la connexion automatique
  username?: string; // Username optionnel pour la connexion automatique
  user?: {
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth'; // endpoint Flask

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(res => {
        // stocker le token dans localStorage pour les futures requêtes
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      { username, email, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
