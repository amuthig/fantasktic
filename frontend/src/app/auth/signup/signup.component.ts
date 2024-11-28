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
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation du formulaire avec les validations
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Fonction pour soumettre le formulaire
  onSignup(): void {
    if (this.signupForm.valid) {
      const { username, firstName, lastName, email, password } = this.signupForm.value;
      this.authService.signup({ username, firstName, lastName, email, password }).subscribe(
        (response) => {
          // Gestion de la réponse si nécessaire
          console.log('User signed up successfully', response);
        },
        (error) => {
          // Gestion des erreurs si nécessaire
          console.error('Error during signup', error);
        }
      );
    }
  }

   // Fonction pour naviguer vers la page de login
   navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

}