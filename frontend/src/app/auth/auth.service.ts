import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

// Modèle pour le login et signup
interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
}

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // URL de l'API Spring Boot pour l'authentification
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken()); // BehaviorSubject pour suivre l'état de la connexion

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // Retourne un observable pour l'état de la connexion
  }

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Fonction de login
   * Envoie les informations de connexion à l'API et retourne un observable.
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Observable<any>} - Observable pour la réponse de l'API
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  /**
   * Fonction de signup
   * Envoie les informations de l'utilisateur pour l'inscription à l'API.
   * @param {User} user - Objet contenant les informations de l'utilisateur
   * @returns {Observable<any>} - Observable pour la réponse de l'API
   */
  signup(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  /**
   * Récupérer le token JWT stocké dans le localStorage
   * @returns {string | null} - Le token JWT si présent, sinon null
   */
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token'); // Retourne le token stocké
    }
    return null;
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {boolean} - Retourne true si un token est présent, sinon false
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null; // L'utilisateur est authentifié si un token est présent
  }

  /**
   * Vérifier si le token est présent dans le localStorage
   * @returns {boolean} - true si le token est présent, sinon false
   */
  private hasToken(): boolean {
    return this.getToken() !== null; // Utilisé pour initialiser l'état de connexion
  }

  /**
   * Mettre à jour l'état de connexion
   * Enregistre le token dans le localStorage et met à jour le BehaviorSubject
   * @param {string} token - Le token JWT à stocker
   */
  setLoginStatus(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token); // Sauvegarde du token dans le localStorage
    }
    this.loggedIn.next(true); // Mise à jour de l'état de la connexion
  }

  /**
   * Fonction de déconnexion
   * Supprime le token du localStorage et met à jour l'état de la connexion
   */
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token'); // Supprime le token du localStorage
    }
    this.loggedIn.next(false); // Mise à jour de l'état de la connexion
    this.router.navigate(['/login']); // Redirige l'utilisateur vers la page de login
  }
}
