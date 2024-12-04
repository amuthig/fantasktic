import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private emailUrl = 'http://localhost:8080/send-email';
  private taskUpdates = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  addTask(task: any): Observable<any> {
    const token = this.authService.getToken(); 
    if (!token) {
      throw new Error('Token is null');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.apiUrl, task, { headers }).pipe(
      tap(() => {
        this.notifyTaskUpdates();
        

        const emailData = {
          to: 'test@example.com', 
          subject: 'Nouvelle tâche ajoutée',
          text: `Une nouvelle tâche a été ajoutée :\n\nTitre : ${task.title}\nDescription : ${task.description}`
        };
        console.log(emailData);

        // Appeler l'API pour envoyer l'email
        this.sendEmail(emailData).subscribe(
          response => {
            console.log('Email envoyé avec succès', response);
          },
          error => {
            console.error('Erreur lors de l\'envoi de l\'email', error);
          }
        );
      })
    );
  }

  // Méthode pour envoyer un email via l'API backend
  private sendEmail(emailData: any): Observable<any> {
    return this.http.post<any>(this.emailUrl, emailData);
  }

 
  notifyTaskUpdates(): void {
    this.taskUpdates.next();
  }

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