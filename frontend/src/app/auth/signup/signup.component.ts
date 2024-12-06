import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatInputModule,
    MatSnackBarModule
  ]
})
export class SignupComponent {
  signupForm: FormGroup; // Define form group to hold form controls

  // Constructor to initialize form and services
  constructor(
    private fb: FormBuilder, // To create reactive forms
    private authService: AuthService, // To interact with authentication service
    private router: Router, // For navigating to different routes
    private snackBar: MatSnackBar // For displaying snack bar messages
  ) {
    // Initialize the signup form with required validations
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]], // Username is required
      firstName: ['', [Validators.required]], // First name is required
      lastName: ['', [Validators.required]], // Last name is required
      email: ['', [Validators.required, Validators.email]], // Email is required and should be a valid email
      password: ['', [Validators.required]], // Password is required
    });
  }

  /**
   * Handles form submission for user signup.
   * Validates the form and makes a call to the signup service.
   */
  onSignup(): void {
    // Check if the form is valid before submitting
    if (this.signupForm.valid) {
      const { username, firstName, lastName, email, password } = this.signupForm.value;
      
      // Call signup method in the authentication service
      this.authService.signup({ username, firstName, lastName, email, password }).subscribe(
        (response: any) => {
          // Handle successful signup response
          console.log('User signed up successfully', response);
          this.snackBar.open('Inscription réussie !', 'Fermer', {
            duration: 3000, // Display message for 3 seconds
          });
          
          // Store the JWT token and update the login status
          this.authService.setLoginStatus(response.token);
          
          // Redirect to the homepage after successful signup
          this.router.navigate(['/']);
        },
        (error) => {
          // Handle error response if signup fails
          console.error('Error during signup', error);
          
          // Check if the error is due to a conflict (user or email already exists)
          if (error.status === 409) {
            this.snackBar.open('Nom d\'utilisateur ou email existe déjà.', 'Fermer', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Erreur lors de l\'inscription. Veuillez réessayer.', 'Fermer', {
              duration: 3000,
            });
          }
        }
      );
    }
  }

  /**
   * Navigates the user to the login page.
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to login page
  }
}
