import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les utilisateurs
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Méthode pour récupérer un utilisateur par ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour créer un nouvel utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Méthode pour mettre à jour un utilisateur
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/current`, { headers });
  }

}