import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {RouterModule} from '@angular/router';
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
  isLoggedIn: boolean = false; // Remplacez par la logique réelle pour vérifier l'authentification

  constructor(private router: Router) {}

  onLoginLogout(): void {
    if (this.isLoggedIn) {
      // Logique de déconnexion
      this.isLoggedIn = false;
      console.log('Utilisateur déconnecté.');
      this.router.navigate(['/login']);
    } else {
      // Redirige vers /login
      this.router.navigate(['/login']);
    }
  }
}
