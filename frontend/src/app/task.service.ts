import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://localhost:8080/api/tasks'; // URL de l'API Spring Boot
  private taskUpdates = new Subject<void>(); // Subject pour les mises à jour des tâches

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
    return this.http.post<any>(this.apiUrl, task, { headers }).pipe(
      tap(() => this.notifyTaskUpdates()) // Notifier les mises à jour des tâches après l'ajout
    );
  }

  // Méthode pour notifier les mises à jour des tâches
  notifyTaskUpdates(): void {
    this.taskUpdates.next();
  }

  // Observable pour les mises à jour des tâches
  getTaskUpdates(): Observable<void> {
    return this.taskUpdates.asObservable();
  }

  // Méthode pour supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.notifyTaskUpdates()) // Notifier les mises à jour des tâches après la suppression
    );
  }

  // Méthode pour mettre à jour une tâche
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.notifyTaskUpdates()) // Notifier les mises à jour des tâches après la mise à jour
    );
  }
}