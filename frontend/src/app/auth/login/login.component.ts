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
  loginForm: FormGroup; // Form group to handle form controls
  errorMessage: string = ''; // Error message to display in case of invalid credentials

  // Constructor to initialize form and inject dependencies
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialize the login form with validations for username and password
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Username is required
      password: ['', [Validators.required]], // Password is required
    });
  }

  /**
   * Handles form submission for user login.
   * Validates the form and makes a call to the login service.
   */
  onLogin(): void {
    // Check if the form is valid before submitting
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      // Call login method in the authentication service
      this.authService.login(username, password).subscribe(
        (response) => {
          // Store the JWT token and update the login status
          this.authService.setLoginStatus(response.token);
          
          // Redirect to the homepage or another page upon successful login
          this.router.navigate(['/']);
        },
        (error) => {
          // Display error message if login fails
          this.errorMessage = 'Invalid credentials'; 
        }
      );
    }
  }

  /**
   * Checks if the user is authenticated (logged in).
   * @returns true if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); // Call the service to check if user is authenticated
  }

  /**
   * Handles user logout and redirects to the login page.
   */
  onLogout(): void {
    this.authService.logout(); // Call the logout method from the auth service
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }

  /**
   * Navigates the user to the signup page.
   */
  navigateToSignup(): void {
    this.router.navigate(['/signup']); // Redirect to the signup page
  }
}
