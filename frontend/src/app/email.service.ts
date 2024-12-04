import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8080/send-email'; // URL de votre API Spring Boot

  constructor(private http: HttpClient) { }

  sendEmail(emailData: any): Observable<any> {
    // Vérification de l'emailData
    console.log("sendEmail called with:", emailData);
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); // Content-Type doit être 'application/json'

    return this.http.post<any>(this.apiUrl, emailData, { headers });
  }
}
