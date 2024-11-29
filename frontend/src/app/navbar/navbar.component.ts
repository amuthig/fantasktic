import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatMenuModule, MatToolbarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  // Gère la connexion/déconnexion
  onLoginLogout(): void {
    if (this.isLoggedIn) {
      // Logique de déconnexion
      this.authService.logout();
      console.log('Utilisateur déconnecté.');
      this.router.navigate(['/login']);
    } else {
      // Redirige vers /login
      this.router.navigate(['/login']);
    }
  }
}