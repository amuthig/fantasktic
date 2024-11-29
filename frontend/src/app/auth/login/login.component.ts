import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation du formulaire avec les validations
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Fonction pour soumettre le formulaire
  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          // Le jeton JWT est stocké dans le localStorage
          localStorage.setItem('token', response.token);
          // Redirection vers la page d'accueil ou une autre page
          this.router.navigate(['/']);
        },
        (error) => {
          this.errorMessage = 'Invalid credentials';
        }
      );
    }
  }

  
  // Fonction pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Fonction pour gérer la déconnexion
  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Fonction pour naviguer vers la page de signup
  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}