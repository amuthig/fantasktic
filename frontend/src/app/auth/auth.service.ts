import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modèle pour le login et signup
interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) {}

  // Fonction de login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  // Fonction de signup
  signup(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  // Récupérer le token JWT stocké
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
