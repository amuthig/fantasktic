import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://localhost:8080/api/tasks'; // URL de l'API Spring Boot

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode pour récupérer toutes les tâches
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

    // Méthode pour ajouter une nouvelle tâche
  addTask(task: any): Observable<any> {
    const token = this.authService.getToken(); // Supposons que vous avez une méthode pour obtenir le token
    if (!token) {
      throw new Error('Token is null');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, task, { headers });
  }

  

  // Méthode pour supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Méthode pour mettre à jour une tâche
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }

}