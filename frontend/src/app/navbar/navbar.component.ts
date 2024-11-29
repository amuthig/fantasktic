import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatMenuModule, MatToolbarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.isLoggedIn = this.checkLoginStatus();
  }

  // Vérifie si l'utilisateur est connecté
  checkLoginStatus(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
    return false;
  }

  // Gère la connexion/déconnexion
  onLoginLogout(): void {
    if (this.isLoggedIn) {
      // Logique de déconnexion
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
      }
      this.isLoggedIn = false;
      console.log('Utilisateur déconnecté.');
      this.router.navigate(['/login']);
    } else {
      // Redirige vers /login
      this.router.navigate(['/login']);
    }
  }
}